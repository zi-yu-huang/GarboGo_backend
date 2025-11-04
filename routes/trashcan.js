const express = require("express");
const router = express.Router();


// 新增一筆垃圾桶資料
const trashCan = require("../models/trashcan");
router.post("/addTrashcan", async (req, res) => {
  try {
    const newTrashcan = new trashCan({
      tname: req.body.tname,
      region: req.body.region,
      street: req.body.street,
      lat: req.body.lat,
      lng: req.body.lng,
      maxTcapacity: req.body.maxTcapacity,
      General: {
        qrcode: req.body.General.qrcode,
        tcapacity: req.body.General.tcapacity,
        tid: req.body.General.tid,
      },
      Recycle: {
        qrcode: req.body.Recycle.qrcode,
        tcapacity: req.body.Recycle.tcapacity,
        tid: req.body.Recycle.tid,
      },
    });

    await newTrashcan.save();
    res.status(201).json({ message: "✅ Trashcan added!", data: newTrashcan });
  } catch (error) {
    console.error("❌ Error saving trashcan:", error);
    res.status(500).json({ error: error.message });
  }
});



//查詢垃圾桶資料
router.get("/getTrashcan", async (req, res) => {
  try {
    // 一次查詢即可得到所有數據，無需 JOIN 或 POPULATE
    const trashcan = await trashCan.find({});

    res.status(200).json({
      message: "✅ Fetch success",
      trashcan: trashcan, // 結構已經是您想要的單一清單
    });
  } catch (err) {
    console.error("❌ Error fetching trashcan:", err);
    res.status(500).json({ error: "Failed to fetch trashcan" });
  }
});

module.exports = router;