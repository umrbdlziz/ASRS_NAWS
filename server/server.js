const express = require("express");
const path = require("path");
const app = express();
const port = 5001;

// for production after running $npm run build in client folder
/*
app.use(express.static(path.join(__dirname, "..", "client", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"));
});
*/

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
