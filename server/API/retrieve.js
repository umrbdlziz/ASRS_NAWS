const express = require("express");
const app = express();
const db = require("../models/connectdb");
const { getRackLayout, getPigeonholeId } = require("./warehouse");
const { fleet } = require("./fleet");
const { removeItemCodes } = require("./item");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// for order list page
app.get("/all_orders", async (req, res) => {
  const sql = "SELECT * FROM retrieve";
  const result = await db.executeAllSQL(sql, []);
  res.send(result);
});

app.post("/add_order", async (req, res) => {
  let message = "success";
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
    const sql = "SELECT so_no FROM retrieve";
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
        "INSERT INTO retrieve (customer, so_no, date, item_code, item_desc, item_quantity, uom, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
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

app.delete("/delete_order/:id", async (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM retrieve WHERE id = ?";
  await db.executeRunSQL(sql, [id]);
  res.json({ message: "Order deleted" });
});

// for station page
app.get("/get_retrieve", async (req, res) => {
  const { station_id, user } = req.query;
  let pigeonhole = {};
  let emptyPigeonhole = true;
  let layout = {};
  let storage = {};
  let message = "";

  // get the station type
  const stationSQL = "SELECT type FROM station WHERE station_id = ?";
  const stationResult = await db.executeGetSQL(stationSQL, [station_id]);

  if (stationResult.type === "pigeonhole") {
    // get order list
    const numberSQL = "SELECT DISTINCT so_no FROM retrieve WHERE status = 0";
    const numberResult = await db.executeAllSQL(numberSQL, []);

    for (let number of numberResult) {
      const orderSQL = "SELECT * FROM retrieve WHERE so_no = ? AND status = 0";
      const orderResult = await db.executeAllSQL(orderSQL, [number.so_no]);

      pigeonhole[number.so_no] = await getPigeonholeId(orderResult);
    }

    // to check if there is any pigeonhole available
    for (let so in pigeonhole) {
      if (Object.keys(pigeonhole[so]).length !== 0) {
        emptyPigeonhole = false;
        break;
      }
    }

    // get the pigeonhole layout
    for (let so in pigeonhole) {
      if (Object.keys(pigeonhole[so])[0]) {
        const [rack, side] = Object.keys(pigeonhole[so])[0].split("-");
        fleet("retrieve", rack, side);
        layout = await getRackLayout(rack);
        layout === "undefined" && (message = "Rack layout not found");
        break;
      } else {
        continue;
      }
    }
  }

  if (emptyPigeonhole) {
    res.send({ message: "No item in pigeonhole" });
  } else {
    res.send({ pigeonhole, layout, message, storage });
  }
});

app.get("/get_green_pigeonhole", async (req, res) => {
  const { rack, side, so_no } = req.query;
  let data = [];

  try {
    const orderSQL = "SELECT * FROM retrieve WHERE so_no = ? AND status = 0";
    const orderResult = await db.executeAllSQL(orderSQL, [so_no]);

    const rackSide = await getPigeonholeId(orderResult);
    for (let so in rackSide) {
      if (so == `${rack}-${side}`) {
        data = rackSide[so];
        break;
      }
    }
  } catch (error) {
    console.log("Error getting green pigeonhole:", error);
  }

  res.json(data);
});

app.post("/get_item", async (req, res) => {
  const { so_number, pigeonhole } = req.body;
  const itemArray = [];
  try {
    const itemCodeSQL = "SELECT item_code FROM retrieve WHERE so_no = ?";
    const itemCodeResult = await db.executeAllSQL(itemCodeSQL, [so_number]);

    const pigeonholeSQL =
      "SELECT item_code FROM pigeonhole WHERE pigeonhole_id = ?";
    const pigeonholeResult = await db.executeGetSQL(pigeonholeSQL, [
      pigeonhole,
    ]);

    if (pigeonholeResult) {
      const itemCodes = pigeonholeResult.item_code.split(",");

      for (let itemCode of itemCodeResult) {
        if (itemCodes.includes(itemCode.item_code)) {
          const itemImgSQL = "SELECT * FROM item WHERE item_code = ?";
          const itemImgResult = await db.executeGetSQL(itemImgSQL, [
            itemCode.item_code,
          ]);

          itemArray.push(itemImgResult);
        }
      }

      res.json({ items: itemArray });
    } else {
      console.log("Wrong pigeonhole");
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/get_ratrieve_rack", async (req, res) => {
  const station_id = req.query.station_id;

  try {
    const retrieveRackSQL =
      "SELECT retrieve_rack_id FROM station WHERE station_id = ?";
    const retrieveRackresult = await db.executeGetSQL(retrieveRackSQL, [
      station_id,
    ]);

    const rackLayoutSQL =
      "SELECT * FROM retrieve_rack WHERE retrieve_rack_id = ?";
    const rackLayoutResult = await db.executeGetSQL(rackLayoutSQL, [
      retrieveRackresult.retrieve_rack_id,
    ]);

    res.json(rackLayoutResult);
  } catch (error) {
    console.log(error);
  }
});

app.get("/get_bin", async (req, res) => {
  const so_no = req.query.so_no;
  const binSQL = "SELECT position, bin_id FROM retrieve_bin WHERE so_no = ?";
  const binResult = await db.executeGetSQL(binSQL, [so_no]);

  res.json(binResult);
});

app.post("/update_retrieve", async (req, res) => {
  const { dataSend, so_number, pigeonholeId } = req.body;

  try {
    for (let data of dataSend) {
      const { item_code, quantity } = data;

      // Fetch the item from the retrieve table
      const retrieveSQL =
        "SELECT item_code, item_quantity FROM retrieve WHERE so_no = ? AND item_code = ?";
      const retrieveResult = await db.executeGetSQL(retrieveSQL, [
        so_number,
        item_code,
      ]);

      if (retrieveResult) {
        // Fetch the item codes from the pigeonhole table
        const quantitySQL =
          "SELECT item_code FROM pigeonhole WHERE pigeonhole_id = ?";
        const quantityResult = await db.executeGetSQL(quantitySQL, [
          pigeonholeId,
        ]);

        if (quantityResult && quantityResult.item_code) {
          const updatedItemCodeList = removeItemCodes(
            quantityResult.item_code,
            item_code,
            quantity
          );

          // Update the pigeonhole table with the new item_code list
          const updatePigeonholeSQL =
            "UPDATE pigeonhole SET item_code = ? WHERE pigeonhole_id = ?";
          await db.executeRunSQL(updatePigeonholeSQL, [
            updatedItemCodeList,
            pigeonholeId,
          ]);

          // Update the retrieve table
          const updateRetrieveSQL =
            "UPDATE retrieve SET status = true, datetime_retrieve = datetime('now') WHERE item_code = ? AND so_no = ?";
          await db.executeRunSQL(updateRetrieveSQL, [
            retrieveResult.item_code,
            so_number,
          ]);
        }
      }
    }

    res.json({ message: "Order updated" });
  } catch (error) {
    console.error("Error updating retrieve:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = app;
