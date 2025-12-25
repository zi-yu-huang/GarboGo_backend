const express = require("express");
const router = express.Router();

// 新增一枚戳章
const addStamp = require("../models/addStamp");
const getStamp = require("../models/getStamp");
router.post("/addStamp", async (req, res) => {
  const { uid } = req.body;
  const dateType = new Date();
  const newDate = dateType.toLocaleDateString("en-CA");
  const titleDate = newDate.slice(0, 7).toString();
  const hasDate = await addStamp.findOne({ uid: uid, stampDate: newDate });
  const hasTitle = await getStamp.findOne({ uid: uid, title: titleDate });

  if (hasDate) {
    return res.status(200).json({
      success: true,
      message: "今日已蓋過戳章。",
      data: hasDate,
    });
  } else {
    try {
      const newStamp = new addStamp({
        uid: uid,
        stampDate: newDate,
      });
      await newStamp.save();
      if (!hasTitle) {
        const newGetStamp = new getStamp({
          uid: uid,
          isShowChange: false,
          title: titleDate,
        });
        await newGetStamp.save();
      }
      res.status(201).json({ message: "✅ Stamp added!", data: newStamp });
    } catch (error) {
      console.error("❌ Error saving Stamp:", error);
      res.status(500).json({ error: error.message });
    }
  }
});

//查詢戳章資料
router.post("/getStamp", async (req, res) => {
  const { uid } = req.body;
  try {
    if (!uid) {
      return res.status(400).json({ message: "❌ Missing user ID (uid)" });
    }
    const stampDate = await addStamp.find({ uid: uid });
    const getStampDate = await getStamp.find({ uid: uid });
    if (!getStampDate || getStampDate.length === 0) {
      return res.status(404).json({ message: "❌ No stamp records found" });
    }
    const newDateList = getStampDate.map((month) => {
      const matchMonth = stampDate
        .filter((item) => item.stampDate.slice(0, 7) == month.title)
        .map((m) => m.stampDate);
      return {
        title: month.title,
        isShowChange: month.isShowChange,
        list: matchMonth,
      };
    });
    res.status(200).json({
      message: "✅ Stamp records retrieved and updated!",
      data: newDateList,
    });
  } catch (error) {
    console.error("❌ Error retrieving or updating Stamp records:", error);
    res.status(500).json({ error: error.message });
  }
  // try {
  //     const [dateList, titleListRaw] = await Promise.all([
  //         // 查詢資料
  //         addStamp.find({ uid: uid }).lean(),
  //         getStamp.find({ uid: uid }).lean()
  //     ]);

  //     // 1. 建立日期分組 Map (同步操作，無需修改)
  //     const dateMap = new Map();
  //     dateList.forEach((record) => {
  //         const dateString = record.stampDate ? record.stampDate.toString() : '';
  //         const monthKey = dateString.slice(0, 7);
  //         if (monthKey.length === 7) {
  //             if (!dateMap.has(monthKey)) {
  //                 dateMap.set(monthKey, []);
  //             }
  //             dateMap.get(monthKey).push(dateString);
  //         }
  //     });

  //     // 2. 建立 Title Map for快速查找 (同步操作，無需修改)
  //     const titleMap = new Map();
  //     titleListRaw.forEach(titleRecord => {
  //         titleMap.set(titleRecord.title, titleRecord);
  //     });

  //     // 3. ⚡️ 核心修正：使用 for...of 迴圈來處理異步操作 (依序更新)

  //     // 取得 dateMap 的所有 entries，使其可以用 for...of 遍歷
  //     const dateMapEntries = Array.from(dateMap.entries());
  //     let updatedCount = 0;

  //     for (const [monthKey, dates] of dateMapEntries) {
  //         const count = dates.length; // 該月打卡筆數
  //         const correspondingTitle = titleMap.get(monthKey);

  //         if (correspondingTitle && count > 5) {

  //             // 檢查是否需要更新 (如果資料庫中的狀態是 false)
  //             if (correspondingTitle.isShowChange !== true) {

  //                 // 執行異步資料庫更新，並等待其完成
  //                 await getStamp.updateOne(
  //                     { _id: correspondingTitle._id },
  //                     { $set: { isShowChange: true } }
  //                 );

  //                 // 同步更新記憶體中的物件，確保回傳的數據是正確的
  //                 correspondingTitle.isShowChange = true;
  //                 updatedCount++;
  //             }
  //         }
  //     }
  //     // 4. 組合最終結果 (使用已經在記憶體中更新的 titleListRaw)
  //     const result = titleListRaw.map((titleRecord) => {
  //         const monthKey = titleRecord.title;
  //         return {
  //             title: monthKey,
  //             list: dateMap.get(monthKey) || [],
  //             isShowChange: titleRecord.isShowChange,
  //         };
  //     });

  //     // 5. 回傳
  //     res
  //         .status(200)
  //         .json({ message: "✅ Stamp records retrieved and updated!", data: result });

  // } catch (error) {
  // console.error("❌ Error retrieving or updating Stamp records:", error);
  // res.status(500).json({ error: error.message });
  // }
});
module.exports = router;
