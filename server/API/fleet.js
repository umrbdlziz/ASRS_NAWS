const express = require("express");
const app = express();
const db = require("../models/connectdb");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/fleet", async (req, res) => {
  const { task_type, station, rack, side } = req.body;

  try {
    const message = await fleet(task_type, station, rack, side);
    res.send(message);
  } catch (err) {
    console.error(err.message);
  }
});

async function fleet(task_type, station, rack, side) {
  console.log("Requesting Robot");
  console.log("Task type: ", task_type);
  console.log("Rack: ", rack, " Side: ", side, " Station: ", station);
  // get the robot api to be sent
  const sql_robot = "SELECT * FROM constants WHERE constant = ?";
  const params_robot = "robot api";
  const result_robot = await db.executeGetSQL(sql_robot, params_robot);
  const robot_api = result_robot.value;

  if (!robot_api || robot_api === "") {
    console.log("Unable to get robot api");
    return { message: "Unable to get robot api" };
  }

  // from station to rack
  if (task_type == "deliver") {
    if (side === "SA") {
      const data_send = {
        task_type: "PSDR",
        start_time: 0,
        priority: 0,
        description: {
          pick_up_station: { station: `pgv_${rack}` },
          retrieve_station: {
            staging_station: `staging_${station}`,
            target_station: station,
            oreiention: 0.0,
          },
        },
      };

      // call the function that will send to robot
      executeRobot(data_send, robot_api);
    } else if (side === "SB") {
      const data_send = {
        task_type: "PSDR",
        start_time: 0,
        priority: 0,
        description: {
          pick_up_station: { station: `pgv_${rack}` },
          retrieve_station: {
            staging_station: `staging_${station}`,
            target_station: station,
            oreiention: 180.0,
          },
        },
      };

      // call the function that will send to robot
      executeRobot(data_send, robot_api);
    }
  } else if (task_type == "return") {
    // from rack to station
    if (side === "SA") {
      const data_send = {
        task_type: "RSRS",
        start_time: 0,
        priority: 0,
        description: {
          retrieve_station: {
            staging_station: `staging_${station}`,
            target_station: station,
            oreiention: 0.0,
          },
          storage_station: { station: `pgv_${rack}` },
          parking_station: { station: "wp1" },
        },
      };

      // call the function that will send to robot
      executeRobot(data_send, robot_api);
    } else if (side === "SB") {
      const data_send = {
        task_type: "RSRS",
        start_time: 0,
        priority: 0,
        description: {
          retrieve_station: {
            staging_station: `staging_${station}`,
            target_station: station,
            oreiention: 180.0,
          },
          storage_station: { station: `pgv_${rack}` },
          parking_station: { station: "wp1" },
        },
      };

      // call the function that will send to robot
      executeRobot(data_send, robot_api);
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

async function executeRobot(data_send, robot_api) {
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

/*
tasks/dispatch_task
{
  "unix_millis_earliest_start_time": 0,
  "unix_millis_request_time": 1715315298891,
  "priority": {
    "type": "binary",
    "value": 0
  },
  "category": "patrol",
  "description": {
    "places": [
      "patrol_D2"
    ],
    "rounds": 1
  },
  "labels": null,
  "requester": "stub"
}
*/
