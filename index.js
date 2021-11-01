const cron = require("node-cron");
const express = require("express");
const fs = require("fs");

app = express();

cron.schedule("01 16 * * 1,5", function () {
  console.log("---------------------");
  console.log("Running Cron Job");
}, {
  timezone: "Asia/Ho_Chi_Minh"
});

console.log("START server");
app.listen(process.env.PORT || 3000);
