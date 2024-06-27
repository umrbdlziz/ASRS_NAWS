# ASRS NAWS

This ASRS is build specifically for Pigeonhole Rack of version 2, which is using the AMR robot.

## Getting Started

### Prerequisites

1. This system using [node](https://nodejs.org/en) version 20 and [sqlite](https://sqlitebrowser.org/dl/) for the overall structure
2. We also use [rmf-demos](https://github.com/open-rmf/rmf_demos) for simulation and [rmf-web](https://github.com/open-rmf/rmf-web) for communication with fleet manager

### Clone the repositories

```bash
  https://github.com/umrbdlziz/ASRS_NAWS.git
```

### Server Side

Go to the project directory

```bash
  cd ASRS_NAWS/server
```

Install dependencies

```bash
  npm install
```

Create a file named `.env` and include content below.

```bash
  PORT=5001
  DB_NAME="asrs_db.sqlite3"
  DEFAULT_USERNAME=admin
  DEFAULT_PASSWORD=admin
  SECRET_KEY="Secret"
  CLIENT_URL="http://192.168.1.48:5173"
  RMF_URL="http://192.168.1.48:8000"
```

Start the server

```bash
  npm start
```

### Client Side

Go to the project directory

```bash
  cd ASRS_NAWS/client
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

## Tech Stack

**Client:** Vite, React, Material UI

**Server:** Node, Express, Sqlite

## Usage

### Step in this section assume that server is running.

1. Open localhost:\<PORT\>, where PORT is determine in `.env` file.
2. Login as admin using `username` & `password` from `.env` file.
3. Navigate to the `Inventory list` page.
4. Click `Upload Inventory` to add item data in the database and `Upload Images` to add item images in the database. Refer [item.xlsx](demo/item.xlsx) for file formater.
5. Navigate to the `Order list` page.
6. Click `Upload Order`to add order list in the databese. Refer [retrieve1.xlsx](demo/retrieve1.xlsx) for file formater.
7. Navigate to the `Store list` page.
8. Click `Upload Store List` to add store list in the database. Refer [store1.xlsx](demo/store1.xlsx) for file formater.
9. Update the IP address of the robot, rmf api-server and ASRS client accordingly.
10. Add the `Stations` that use for load and unload the items or bins.
11. Add new pattern and click `Edit` to customize pigeonhole rack and save.
12. Add new rack and choose the pattern that have been created.
13. Add bin and retrieve rack to place the item that we received.
14. (Optional) To add new admin, click on `User` and register a new admin there. Admin of username "admin" will be hidden.

### Retrieve item

1. Press start button (make sure the switch at the retrieve) then pigeonhole and retrieve rack will be display
2. Scan the green pigeonhole then the item description and the position to put the item in the retrieve rack will be available.
3. Increase or decrease the quantity for the item as needed.
4. [1] Scan the barcode of the bin in the retrieve rack
5. [2] Press the button at the retrieve rack
