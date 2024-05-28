const express = require("express");
const app = express();
const db = require("../models/connectdb");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/request_fleet", async (req, res) => {
  const task_type = req.body.task_type;
  const rack = req.body.rack;
  const side = req.body.side;

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
  console.log("Rack: ", rack);
  // get the robot api to be sent
  const sql_robot = "SELECT * FROM constants WHERE constant = ?";
  const params_robot = "robot api";
  const result_robot = await db.executeGetSQL(sql_robot, params_robot);
  robot_api = result_robot.value;
  mission = "mission" + Math.floor(Math.random() * 10000);

  if (robot_api == "") {
    throw new Error("Unable to get robot api");
  }

  if (task_type == "retrieve") {
    // from station to rack

    if (side === "S1") {
      const data_send = {
        robot: "nanobot02",
        mission_tree: [
          {
            name: "string",
            parent: "root",
            action: {
              action_type: "fake_fleet",
              action_parameters: {
                target_task: "loading_front",
              },
            },
          },
        ],
        timeout: 300,
        deadline: "2022-10-07T00:21:31.112Z",
        needs_canceled: false,
        name: mission,
      };

      // call the function that will send to robot
      executeRobot(data_send);
    } else if (side === "S2") {
      const data_send = {
        robot: "nanobot02",
        mission_tree: [
          {
            name: "string",
            parent: "root",
            action: {
              action_type: "fake_fleet",
              action_parameters: {
                target_task: "loading_back",
              },
            },
          },
        ],
        timeout: 300,
        deadline: "2022-10-07T00:21:31.112Z",
        needs_canceled: false,
        name: mission,
      };

      // call the function that will send to robot
      executeRobot(data_send);
    }
  } else {
    // from rack to station

    if (side === "S1") {
      const data_send = {
        robot: "nanobot02",
        mission_tree: [
          {
            name: "string",
            parent: "root",
            action: {
              action_type: "fake_fleet",
              action_parameters: {
                target_task: "unloading_front",
              },
            },
          },
        ],
        timeout: 300,
        deadline: "2022-10-07T00:21:31.112Z",
        needs_canceled: false,
        name: mission,
      };

      // call the function that will send to robot
      executeRobot(data_send);
    } else if (side === "S2") {
      const data_send = {
        robot: "nanobot02",
        mission_tree: [
          {
            name: "string",
            parent: "root",
            action: {
              action_type: "fake_fleet",
              action_parameters: {
                target_task: "unloading_back",
              },
            },
          },
        ],
        timeout: 300,
        deadline: "2022-10-07T00:21:31.112Z",
        needs_canceled: false,
        name: mission,
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
  const api_url = `http://${robot_api}/mission`;
  console.log(`API: ${api_url}`);
  console.log(data_send.mission_tree[0].action);

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
