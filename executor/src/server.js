const express = require("express");
const executeHandler = require("./execute");

function createServer() {
  const app = express();

  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_, res) => {
    res.json({ status: "ok" });
  });

  app.post("/execute", executeHandler);

  return app;
}

module.exports = { createServer };
