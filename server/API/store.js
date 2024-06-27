const express = require("express");
const app = express();
const db = require("../models/connectdb");
const { fleet } = require("./fleet");
const { getItemInfo, removeItemCodes } = require("./item");
const { getRackLayout, getLeastItemsRackAndSide } = require("./warehouse");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// for store list page
app.get("/get_store_list", async (req, res) => {
  if (req.query.store_no) {
    try {
      const sql = "SELECT * FROM store WHERE no = ? AND status < item_quantity";
      const result = await db.executeAllSQL(sql, [req.query.store_no]);
      res.send(result);
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      const sql = "SELECT * FROM store";
      const result = await db.executeAllSQL(sql, []);
      res.send(result);
    } catch (error) {
      console.log(error);
    }
  }
});

app.post("/add_store", async (req, res) => {
  let message = "uploaded successfully";
  const orderlist = req.body.slice(4);

  // to get customer in csv
  const movementData = req.body.slice(0, 1);
  const customer = movementData[0][1];

  // to get so number in csv
  const so_noData = req.body.slice(1, 2);
  const so_no = so_noData[0][2];

  // to get date in csv
  const dateData = req.body.slice(2, 3);
  const date = dateData[0][2];

  // check if the order is already in the orderlist
  try {
    const sql = "SELECT no FROM store";
    const old_so_no = await db.executeAllSQL(sql, []);

    for (let old_so of old_so_no) {
      if (old_so.so_no === so_no) {
        res.json({ message: "Order already exist" });
        return;
      }
    }
  } catch (error) {
    console.log(error);
  }

  for (let order of orderlist) {
    let item_code = order[1];
    const item_desc = order[2];
    const quantity = order[3];
    const uom = order[4];

    // Convert item_code to a string
    item_code = item_code.toString();

    try {
      // add new order to orderist
      const sql =
        "INSERT INTO store (customer, no, date, item_code, item_desc, item_quantity, uom, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      const params = [
        customer,
        so_no,
        date,
        item_code,
        item_desc,
        quantity,
        uom,
        0,
      ];
      await db.executeRunSQL(sql, params);
    } catch (err) {
      // console.error(err.message); // ignore the repeated order_id
      message = err.message;
    }
  }
  res.json({ message: message }); // no use for now
});

app.delete("/delete_store/:id", async (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM store WHERE id = ?";
  await db.executeRunSQL(sql, [id]);
  res.json({ message: "Order deleted" });
});

// for station page
app.get("/get_store_numbers", async (req, res) => {
  const sql = "SELECT DISTINCT no FROM store WHERE status = 0";
  const result = await db.executeAllSQL(sql, []);
  res.send(result);
});

app.get("/get_store_data", async (req, res) => {
  const storeNo = req.query.store_no;

  try {
    const { leastItemsRack, leastItemsSide } = await getLeastItemsRackAndSide();
    fleet("come", leastItemsRack, leastItemsSide);
    const layout = await getRackLayout(leastItemsRack);

    res.send({ layout, leastItemsRack, leastItemsSide });
  } catch (error) {
    console.log(error);
  }
});

app.get("/get_item_info", async (req, res) => {
  const { item_code, store_no } = req.query;
  const data = {};

  try {
    const itemInfoSQL = `SELECT item.*, store.item_quantity FROM item JOIN store ON item.item_code = store.item_code WHERE item.item_code = ?`;
    const itemInfo = await db.executeAllSQL(itemInfoSQL, [item_code]);

    const storeSQL =
      "SELECT item_code, item_quantity FROM store WHERE no = ? AND item_code = ?";
    const storeResult = await db.executeGetSQL(storeSQL, [store_no, item_code]);

    if (!storeResult) {
      res.send({ message: "Item not in the list" });
      return;
    }

    if (itemInfo.length === 0) {
      data["message"] = "Item code not in item table";
    }

    data["itemInfo"] = itemInfo;
  } catch (error) {
    console.log(error);
  }

  try {
    const pigeonholeSQL = "SELECT pigeonhole_id FROM pigeonhole";
    const pigeonholeResult = await db.executeAllSQL(pigeonholeSQL, []);
    data["pigeonhole"] = pigeonholeResult;
  } catch (error) {
    console.log(error);
  }

  res.send(data);
});

app.post("/update_store", async (req, res) => {
  const { item_code, quantity, store_no, pigeonhole_id, user_id } = req.body;
  let message = "";

  try {
    // Fetch the current item_code value from the pigeonhole table
    const fetchPigeonholeSQL =
      "SELECT item_code FROM pigeonhole WHERE pigeonhole_id = ?";
    const result = await db.executeGetSQL(fetchPigeonholeSQL, [pigeonhole_id]);

    if (result) {
      const currentItemCodes = result.item_code
        ? result.item_code.split(",")
        : [];

      // Add the new item code to the list
      for (let i = 0; i < quantity; i++) {
        currentItemCodes.push(item_code);
      }

      // Create the new item_code string
      const newItemCodesStr = currentItemCodes.join(",");

      // Update the pigeonhole table with the new item_code list
      const updatePigeonholeSQL =
        "UPDATE pigeonhole SET item_code = ?, date = datetime('now'), user_id = ? WHERE pigeonhole_id = ?";
      await db.executeRunSQL(updatePigeonholeSQL, [
        newItemCodesStr,
        user_id,
        pigeonhole_id,
      ]);

      // Update the store table
      const storeSQL =
        "UPDATE store SET status = status + ?, datetime_store = datetime('now'), user_id = ? WHERE no = ? AND item_code = ?";
      await db.executeRunSQL(storeSQL, [
        quantity,
        user_id,
        store_no,
        item_code,
      ]);

      message = "success store item";
    } else {
      message = "Pigeonhole not found";
    }
  } catch (error) {
    console.log(error);
  }
  res.send({ message });
});

app.post("/next_store", async (req, res) => {
  const { rack, side } = req.body;
  let message = "";

  try {
    fleet("back", rack, side);

    message = `Rack send back at ${rack}, ${side}`;
  } catch (error) {
    console.log(error);
  }
  res.send({ message });
});

module.exports = app;
