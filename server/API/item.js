const multer = require("multer");
const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const db = require("../models/connectdb");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/get_all_items", async (req, res) => {
  try {
    const itemSQL = "SELECT * FROM item";
    const itemResult = await db.executeAllSQL(itemSQL, []);

    // Step 2: Retrieve pigeonhole data
    const pigeonholeSQL = "SELECT pigeonhole_id, item_code FROM pigeonhole";
    const pigeonholeResult = await db.executeAllSQL(pigeonholeSQL, []);

    // Step 3: Calculate quantities for each item_code in the pigeonhole table
    const itemQuantities = {};
    pigeonholeResult.forEach((row) => {
      if (row.item_code && row.item_code.trim() !== "") {
        const itemCodes = row.item_code.split(",").map((code) => code.trim());
        itemCodes.forEach((code) => {
          if (itemQuantities[code]) {
            itemQuantities[code] += 1;
          } else {
            itemQuantities[code] = 1;
          }
        });
      }
    });

    // Step 4: Combine item data with quantities
    const combinedData = itemResult.map((item) => ({
      item_code: item.item_code,
      item_desc: item.item_desc,
      item_img: item.item_img,
      quantity: itemQuantities[item.item_code] || 0,
    }));

    // Step 5: Send the combined data to the client
    res.send(combinedData);
  } catch (error) {
    console.log("Error in get_all_items: ", error.message);
  }
});

app.post("/add_item", async (req, res) => {
  const newItems = req.body;

  // remove all item in item table
  try {
    const removeSQL = "DELETE FROM item";
    await db.executeRunSQL(removeSQL, []);
  } catch (error) {
    console.log(error.message);
  }

  // add new item to item table
  for (let item of newItems) {
    const item_code = item[0];
    const item_desc = item[1];
    const item_img = item[2] || null;

    try {
      const sql =
        "INSERT INTO item (item_code, item_desc, item_img) VALUES (?, ?, ?)";
      await db.executeRunSQL(sql, [item_code, item_desc, item_img]);
    } catch (error) {
      console.log(error.message);
    }
  }
  res.send({ message: "Item added successfully" });
});

app.post("/create_item", async (req, res) => {
  const { item_code, item_desc, item_img } = req.body;

  try {
    const itemSQL = "SELECT item_code FROM item WHERE item_code = ?";
    const itemResult = await db.executeGetSQL(itemSQL, [item_code]);

    if (itemResult) {
      return res.send({ message: "Item already exists" });
    }

    const sql =
      "INSERT INTO item (item_code, item_desc, item_img) VALUES (?, ?, ?)";
    const response = await db.executeRunSQL(sql, [
      item_code,
      item_desc,
      item_img,
    ]);
    res.send({ message: `${response.changes} Item created successfully` });
  } catch (error) {
    console.log(error.message);
  }
});

app.delete("/delete_item/:item_code", async (req, res) => {
  const item_code = req.params.item_code;
  try {
    const sql = "DELETE FROM item WHERE item_code = ?";
    const response = await db.executeRunSQL(sql, [item_code]);
    res.json({ message: `${response.changes} item deleted from item table` });
  } catch (error) {
    console.log("Error deleting order:", error);
  }
});

app.post("/update_item", async (req, res) => {
  const { item_code, item_desc, item_img } = req.body;
  try {
    const sql =
      "UPDATE item SET item_desc = ?, item_img = ? WHERE item_code = ?";
    const response = await db.executeRunSQL(sql, [
      item_desc,
      item_img,
      item_code,
    ]);
    res.send({ message: `${response.changes} Item updated successfully` });
  } catch (error) {
    console.log(error.message);
  }
});

async function getItemInfo(item_code) {
  try {
    const sql = "SELECT * FROM item WHERE item_code = ?";
    const result = await db.executeAllSQL(sql, [item_code]);
    return result;
  } catch (error) {
    console.log(error);
  }
}

// Function to remove a specified item code a given number of times from a comma-separated string
function removeItemCodes(itemCodes, itemCode, quantity) {
  const array = itemCodes.split(",");
  let count = 0;

  const updatedArray = array.filter((code) => {
    if (code === itemCode && count < quantity) {
      count++;
      return false;
    }
    return true;
  });

  return updatedArray.join(",");
}

// Set up image upload //

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads";
    fs.exists(dir, (exist) => {
      if (!exist) {
        return fs.mkdir(dir, (error) => cb(error, dir));
      }
      return cb(null, dir);
    });
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage });

app.use(express.static(path.join(__dirname, "uploads")));

// Route to handle file uploads
app.post("/upload_images", upload.array("files"), (req, res) => {
  try {
    const filePaths = req.files.map((file) => file.path);
    console.log(filePaths);
    res
      .status(200)
      .json({ message: "Files uploaded successfully", files: filePaths });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while uploading files" });
  }
});

module.exports = { getItemInfo, removeItemCodes, app };
