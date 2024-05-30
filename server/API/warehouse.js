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

module.exports = { getRackLayout, getLeastItemsRackAndSide };
