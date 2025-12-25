//addTicket
const express = require("express");
const router = express.Router();

const getTicket = require("../models/getTicket");
const getStamp = require("../models/getStamp");

// 新增或更新使用者的票券資料
router.post("/addTicket", async (req, res) => {
  const { uid, value, title } = req.body;

  try {
    // 檢查是否已經有該使用者的票券資料
    let ticketRecord = await getTicket.findOne({ uid: uid });

    if (ticketRecord) {
      switch (value) {
        case 0:
          ticketRecord.t0 = String(Number(ticketRecord.t0) + 1);
          break;
        case 1:
          ticketRecord.t1 = String(Number(ticketRecord.t1) + 1);
          break;
        default:
          return res
            .status(400)
            .json({ message: "❌ Invalid ticket type.", data: null });
      }
      await ticketRecord.save();
       const isChangeTicket = await getStamp.findOneAndUpdate(
        { uid: uid, title: title },
        { $set: { isShowChange: false } },
        { new: true }
      );
      res
        .status(200)
        .json({ message: "✅ Ticket updated!", data: ticketRecord,isChangeTicket });
    } else {
      switch (value) {
        case 0:
          var t0 = 1;
          var t1 = 0;
          break;
        case 1:
          var t0 = 0;
          var t1 = 1;
          break;
        default:
          return res
            .status(400)
            .json({ message: "❌ Invalid ticket type.", data: null });
      }
      const newTicket = new getTicket({
        uid: uid,
        t0: t0,
        t1: t1,
      });
      await newTicket.save();
      const isChangeTicket = await getStamp.findOneAndUpdate(
        { uid: uid, title: title },
        { $set: { isShowChange: false } },
        { new: true }
      );

      res
        .status(201)
        .json({ message: "✅ Ticket added!", data: newTicket, isChangeTicket });
    }
  } catch (error) {
    console.error("❌ Error saving Ticket:", error);
    res.status(500).json({ error: error.message });
  }
});

// 查詢使用者的票券資料
router.post("/getTicket", async (req, res) => {
  const { uid } = req.body;

  try {
    const ticketRecord = await getTicket.findOne({ uid: uid });

    if (ticketRecord) {
      res.status(200).json({ message: "✅ Ticket found!", data: ticketRecord });
    } else {
      res
        .status(404)
        .json({ message: "❌ No ticket found for this user.", data: null });
    }
  } catch (error) {
    console.error("❌ Error retrieving Ticket:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
