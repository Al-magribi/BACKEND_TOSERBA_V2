require("dotenv").config();
const app = require("./app");
const dbConnection = require("./config/database");
const path = require("path");
const express = require("express");

process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.stack}`);
  console.log("Shutting down due to uncaught exception");
  process.exit(1);
});

dbConnection();

if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "./build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./build/index.html"));
  });
}

const PORT = 1000;

app.listen(process.env.PORT || PORT, () => {
  console.log(
    `Server aktif di port ${process.env.PORT}${PORT} dimode ${process.env.NODE_ENV}`
  );
});
