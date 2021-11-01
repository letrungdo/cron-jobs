const cron = require("node-cron");
const express = require("express");
const axios = require("axios");

app = express();

app.get("/", (_req, res) => {
  res.send("Welcome to GMO auto checkin/out");
});

function checkin(type) {
  console.log("Start " + type);
  axios("https://checkin.runsystem.info/attendance/submit", {
    method: "POST",
    maxRedirects: 0,
    headers: {
      "Content-Type": "application/json",
      Cookie: process.env.GMO_CHECKIN_AUTH,
    },
    data: {
      type: type,
      emoji: 3,
      comment: "",
    },
  }).then(function (res) {
    console.log(res.data);
  });
}

// Checkin
cron.schedule(
  "30 7 * * 1,5",
  function () {
    checkin("checkin");
  },
  {
    timezone: "Asia/Ho_Chi_Minh",
  }
);

// Checkout
cron.schedule(
  "30 17 * * 1,5",
  function () {
    checkin("checkout");
  },
  {
    timezone: "Asia/Ho_Chi_Minh",
  }
);

console.log("START server");
app.listen(process.env.PORT || 3000);
