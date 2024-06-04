const express = require("express");
const app = express();
const db = require("../models/connectdb");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

async function getRackLayout(rack) {
  const rackSQL = "SELECT pattern FROM rack WHERE rack_id = ?";
  const rackResult = await db.executeGetSQL(rackSQL, rack);

  if (!rackResult) {
    console.log(`Rack ${rack} don't have in database`);
    return;
  } else {
    const patternSQL = "SELECT pattern FROM pattern WHERE pattern_id = ?";
    const patternResult = await db.executeGetSQL(
      patternSQL,
      rackResult.pattern
    );

    return JSON.parse(patternResult.pattern);
  }
}

async function getLeastItemsRackAndSide() {
  try {
    const pigeonholeSQL = "SELECT pigeonhole_id, item_code FROM pigeonhole";
    const pigeonholeResult = await db.executeAllSQL(pigeonholeSQL, []);
    const rackItemsCount = {};

    // Iterate through each row to count items in each rack and side
    pigeonholeResult.forEach((pigeonhole) => {
      const itemCodes = pigeonhole.item_code
        ? pigeonhole.item_code.split(",")
        : [];
      const [rack, side] = pigeonhole.pigeonhole_id
        ? pigeonhole.pigeonhole_id.split("-")
        : [null, null];

      if (rack && side) {
        if (!rackItemsCount[rack]) {
          rackItemsCount[rack] = {};
        }
        if (!rackItemsCount[rack][side]) {
          rackItemsCount[rack][side] = 0;
        }
        rackItemsCount[rack][side] += itemCodes.length;
      }
    });

    // console.log("Rack items count:", rackItemsCount);

    // Find the rack and side with the least number of items
    let leastItemsRack = null;
    let leastItemsSide = null;
    let leastItemsCount = Infinity;

    for (const rack in rackItemsCount) {
      for (const side in rackItemsCount[rack]) {
        if (rackItemsCount[rack][side] < leastItemsCount) {
          leastItemsCount = rackItemsCount[rack][side];
          leastItemsRack = rack;
          leastItemsSide = side;
        }
      }
    }

    console.log("Rack with the least items:", leastItemsRack);
    console.log("Side with the least items:", leastItemsSide);

    return { leastItemsRack, leastItemsSide };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getPigeonholeId(orderResult) {
  const tempData = {};
  for (let order of orderResult) {
    const pigeonholeSQL = "SELECT * FROM pigeonhole WHERE item_code LIKE ?";
    const pigeonholeResult = await db.executeGetSQL(pigeonholeSQL, [
      `%${order.item_code}%`,
    ]);

    if (pigeonholeResult) {
      // Split the item_code string into an array and count the occurrences of each item code
      const itemCodes = pigeonholeResult.item_code.split(",");
      const itemCount = itemCodes.reduce((acc, code) => {
        acc[code] = (acc[code] || 0) + 1;
        return acc;
      }, {});

      // Check if the quantity in the order matches the count of the item code in the pigeonhole
      if (itemCount[order.item_code] >= order.item_quantity) {
        // Split the pigeonhole_id into an array
        const pigeonholeIdParts = pigeonholeResult.pigeonhole_id.split("-");

        // Get the first two parts
        const part1 = pigeonholeIdParts[0]; // "R1"
        const part2 = pigeonholeIdParts[1]; // "S1"

        // Create a key from part1 and part2
        const key = `${part1}-${part2}`;

        // If the key already exists, append the pigeonhole_id to the existing array
        // If it doesn't exist, create a new array with the pigeonhole_id
        tempData[key] = tempData[key]
          ? [...tempData[key], pigeonholeResult.pigeonhole_id]
          : [pigeonholeResult.pigeonhole_id];
      }
    }
  }

  return tempData;
}

// for warehouse page
app.get("/all_pattern", async (req, res) => {
  try {
    const patternSQL = "SELECT * FROM pattern";
    const patternResult = await db.executeAllSQL(patternSQL, []);
    res.send(patternResult);
  } catch (error) {
    console.log("Error in /all_pattern:", error);
  }
});

app.delete("/delete_pattern", async (req, res) => {
  const { pattern } = req.body;
  try {
    const deleteSQL = "DELETE FROM pattern WHERE pattern_id = ?";
    const deleteResult = await db.executeRunSQL(deleteSQL, [pattern]);
    res.send(deleteResult);
  } catch (error) {
    console.log("Error in /delete_pattern:", error);
  }
});

app.post("/add_pattern", async (req, res) => {
  const { pattern_id, pattern } = req.body;
  try {
    const insertOrUpdateSQL =
      "INSERT OR REPLACE INTO pattern (pattern_id, pattern) VALUES (?, ?)";
    const result = await db.executeRunSQL(insertOrUpdateSQL, [
      pattern_id,
      pattern,
    ]);
    res.send(result);
  } catch (error) {
    console.log("Error in /add_pattern:", error);
  }
});

app.get("/pattern", async (req, res) => {
  const { pattern_id } = req.query;

  try {
    const patternSQL = "SELECT * FROM pattern WHERE pattern_id = ?";
    const patternResult = await db.executeGetSQL(patternSQL, pattern_id);
    res.send(patternResult);
  } catch (error) {
    console.log("Error in /pattern:", error);
  }
});

module.exports = {
  getRackLayout,
  getLeastItemsRackAndSide,
  getPigeonholeId,
  app,
};
