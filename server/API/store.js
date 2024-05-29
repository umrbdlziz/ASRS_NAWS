const express = require("express");
const app = express();
const db = require("../models/connectdb");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/get_store_list", async (req, res) => {
  try {
    const sql = "SELECT * FROM store";
    const result = await db.executeAllSQL(sql, []);
    res.send(result);
  } catch (error) {
    console.log(error);
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

module.exports = app;
