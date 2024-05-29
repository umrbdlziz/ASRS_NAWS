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

module.exports = { getRackLayout };
