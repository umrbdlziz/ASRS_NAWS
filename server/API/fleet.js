const express = require("express");
const app = express();
const db = require("../models/connectdb");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/request_fleet", async (req, res) => {
  const { task_type, rack, side } = req.body;

  console.log("Requesting Robot");
  console.log("Task type: ", task_type);
  console.log("Rack: ", rack);
  try {
    await fleet(task_type, rack, side);
  } catch (err) {
    console.error(err.message);
  }
  res.json({ message: "ok" });
});

let robot_api;
let mission;

async function fleet(task_type, rack, side) {
  console.log("Requesting Robot");
  console.log("Task type: ", task_type);
  console.log("Rack: ", rack, " Side: ", side);
  // get the robot api to be sent
  const sql_robot = "SELECT * FROM constants WHERE constant = ?";
  const params_robot = "robot api";
  const result_robot = await db.executeGetSQL(sql_robot, params_robot);
  robot_api = result_robot.value;
  mission = "mission" + Math.floor(Math.random() * 10000);

  if (robot_api == "") {
    throw new Error("Unable to get robot api");
  }

  if (task_type == "come") {
    // from station to rack

    if (side === "SA") {
      const data_send = {
        task_type: "PSDR",
        start_time: 0,
        priority: 0,
        description: {
          pick_up_station: { station: "NG_NICC_A1_0" },
          retrieve_station: { station: "Retrieval_station_1", oreiention: 0 },
        },
      };

      // call the function that will send to robot
      executeRobot(data_send);
    } else if (side === "SB") {
      const data_send = {
        task_type: "PSDR",
        start_time: 0,
        priority: 0,
        description: {
          pick_up_station: { station: "NG_NICC_A1_0" },
          retrieve_station: { station: "Retrieval_station_1", oreiention: 180 },
        },
      };

      // call the function that will send to robot
      executeRobot(data_send);
    }
  } else if (task_type == "back") {
    // from rack to station
    if (side === "SA") {
      const data_send = {
        task_type: "RSRS",
        start_time: 0,
        priority: 0,
        description: {
          retrieve_station: { station: "Retrieval_station_1", oreiention: 0 },
          storage_station: { station: "NG_NICC_A1_0" },
        },
      };

      // call the function that will send to robot
      executeRobot(data_send);
    } else if (side === "SB") {
      const data_send = {
        task_type: "RSRS",
        start_time: 0,
        priority: 0,
        description: {
          retrieve_station: { station: "Retrieval_station_1", oreiention: 180 },
          storage_station: { station: "NG_NICC_A1_0" },
        },
      };

      // call the function that will send to robot
      executeRobot(data_send);
    }
  }
}

async function fleetAbort() {
  const sql_robot = "SELECT * FROM constants WHERE constant = ?";
  const params_robot = "robot api";
  const result_robot = await db.executeGetSQL(sql_robot, params_robot);
  robot_api = result_robot.value;
  if (robot_api == "") {
    throw new Error("Unable to get robot api");
  }

  const api_url = `http://${robot_api}/mission/${mission}/cancel`;

  try {
    const response = await fetch(api_url, {
      method: "POST",
      body: JSON.stringify(data_send),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (err) {
    console.error(err.message);
    return;
  }

  console.log("Robot is abort");
}

async function executeRobot(data_send) {
  const api_url = `http://${robot_api}/submit_task`;
  console.log(`API: ${api_url}`);
  console.log(data_send);

  return;

  try {
    const response = await fetch(api_url, {
      method: "POST",
      body: JSON.stringify(data_send),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (err) {
    console.error(err.message);
    return;
  }

  console.log("Robot is called");
}

module.exports = { app, fleet, fleetAbort };
