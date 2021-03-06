import axios from "axios";
import dotenv from "dotenv";
import express from "express";
import cron from "node-cron";
import fetch from "node-fetch";

dotenv.config();
const app = express();

app.get("/", (_req, res) => {
  res.send("Welcome to GMO auto checkin/out");
});

const getAuthenCookie = async (body) => {
  const result = await fetch("https://checkin.runsystem.work/auth/login", {
    method: "POST",
    redirect: "manual",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const cookie = result.headers.get("set-cookie");
  if (cookie?.includes("Authorization=Bearer")) {
    return cookie;
  }
  return process.env.AUTH_TOKEN || "";
};

app.get("/checkin", async (_req, res) => {
  checkin("checkin")
    .then(function (res) {
      console.log(res.data);
      res.send(JSON.stringify(res.data));
    })
    .catch(function (e) {
      res.send(e);
    });
});

app.get("/checkout", (_req, res) => {
  checkin("checkout")
    .then(function (res) {
      console.log(res.data);
      res.send(JSON.stringify(res.data));
    })
    .catch(function (e) {
      res.send(e);
    });
});

const checkin = async (type) => {
  console.log("Start " + type);
  const body = {
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
  };
  const authenCookie = await getAuthenCookie(body);
  console.log(authenCookie);
  return axios("https://checkin.runsystem.work/attendance/submit", {
    method: "POST",
    maxRedirects: 0,
    headers: {
      "Content-Type": "application/json",
      Cookie: authenCookie,
    },
    data: {
      type: type,
      emoji: 3,
      comment: "",
    },
  });
};

// Checkin
cron.schedule(
  "30 7 * * 1-5",
  function () {
    checkin("checkin").then(function (res) {
      console.log(res.data);
    });
  },
  {
    timezone: "Asia/Ho_Chi_Minh",
  }
);

// Checkout
cron.schedule(
  "30 17 * * 1-5",
  function () {
    checkin("checkout").then(function (res) {
      console.log(res.data);
    });
  },
  {
    timezone: "Asia/Ho_Chi_Minh",
  }
);

console.log("START server");
app.listen(process.env.PORT || 3000);
