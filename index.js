const cron = require("node-cron");
const express = require("express");
const fs = require("fs");

app = express();

cron.schedule("*/1 * * * *", function () {
  console.log("---------------------");
  console.log("Running Cron Job");
});

console.log("START server");
app.listen(3000);
