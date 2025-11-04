const express = require("express");
const router = express.Router();

// 新增一筆收藏垃圾桶資料
const trashCan = require("../models/trashcan");

const favList = require("../models/favorite_list");
router.post("/addFavList", async (req, res) => {
  const { tname, uid } = req.body;
  const hasFav = await favList.findOne({ tname: tname, uid: uid });
  if (hasFav) {
    const updatedUser = await favList.findOneAndDelete({
      uid: uid,
      tname: tname,
    });
    res.status(200).json({
      success: true,
      message: "資料更新成功。",
      data: updatedUser,
    });
  } else {
    try {
      const newFavList = new favList({
        uid: req.body.uid,
        tname: req.body.tname,
      });

      await newFavList.save();
      res.status(201).json({ message: "✅ FavList added!", data: newFavList });
    } catch (error) {
      console.error("❌ Error saving FavList:", error);
      res.status(500).json({ error: error.message });
    }
  }
});

//查詢收藏垃圾桶資料
router.post("/getFavList", async (req, res) => {
  const { uid } = req.query;

  if (!uid) {
    return res
      .status(400)
      .json({ message: "❌ Missing user ID (uid)", favList: [] });
  }

  try {
    // Step 1: 取得該用戶的所有收藏清單
    // 使用正確的 Model 名稱 (favList)
    const favRecords = await favList.find({ uid });

    // Step 2: 建立一個快速查詢的 Set，只包含所有被收藏的 tname
    const likedTrashcanNames = new Set(
      favRecords.map((record) => record.tname)
    );

    // Step 3: 取得所有垃圾桶清單
    // 使用正確的 Model 名稱 (TrashCan)
    const allTrashcans = await trashCan.find({}).lean(); // .lean() 讓結果是普通 JS 對象，方便修改

    // Step 4: 遍歷所有垃圾桶，並新增 isLiked 欄位
    const finalTrashcanList = allTrashcans.map((trashcan) => {
      // 檢查這個垃圾桶名稱是否存在於收藏 Set 中
      const isLiked = likedTrashcanNames.has(trashcan.tname);

      // 返回一個新的物件，包含所有原始資料和新增的 isLiked 欄位
      return {
        ...trashcan, // 展開所有原始欄位
        isLiked: isLiked, // 新增的假欄位
      };
    });
    const groupedData = groupAndFormatTrashcansByRegion(finalTrashcanList);

    // Step 5: 回傳結果
    res.status(200).json({
      message: "✅ Fetch success with like status",
      likeList: groupedData, // 回傳標記後的完整清單
    });
  } catch (err) {
    console.error("❌ Error fetching trashcan and favList:", err);
    res.status(500).json({ error: "Failed to fetch list" });
  }
});

// 假設這是上一個 API 步驟中產生的 finalTrashcanList 變數
// 包含所有帶有 isLiked 標記的垃圾桶資料

function groupAndFormatTrashcansByRegion(finalTrashcanList) {
  // 使用 Map 暫存分組結果，以 region 名稱作為 Key
  // 結構: Map<regionName, { region: regionName, streets: [] }>
  const groupedMap = new Map();
  let itemIdCounter = 1; // 用來生成您想要的 item.id 欄位

  finalTrashcanList.forEach((item) => {
    const regionName = item.region;

    // 1. 如果 Map 中還沒有這個地區，則創建一個新的地區物件
    if (!groupedMap.has(regionName)) {
      groupedMap.set(regionName, {
        region: regionName,
        streets: [],
      });
    }

    // 2. 取得該地區的 streets 陣列
    const regionGroup = groupedMap.get(regionName);

    // 3. 創建並格式化街道/垃圾桶物件
    const formattedStreetItem = {
      // 使用自動遞增 ID，但建議使用 MongoDB 的 _id 更可靠
      id: itemIdCounter++,

      tname: item.tname,
      // 欄位名稱轉換
      isLike: item.isLiked, // isLiked -> isLike
      maxtcapacity: String(item.maxTcapacity), // 確保是字串
      street: item.street,

      // 假設的通知欄位 (根據您的範例新增，如果資料庫中沒有，則需預設)
      notifyDontTrash: false,
      notifyTrashClear: true,

      // 嵌入 General 和 Recycle 物件
      General: item.General,
      Recycle: item.Recycle,
    };

    // 4. 將格式化後的物件推入 streets 陣列
    regionGroup.streets.push(formattedStreetItem);
  });

  // 5. 將 Map 的值轉換回最終的陣列格式
  return Array.from(groupedMap.values());
}

module.exports = router;
