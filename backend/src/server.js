const express = require("express");
const http = require("http");
const cors = require("cors");
const setupSocket = require("./socket");
const executeRoute = require("./routes/execute");

function createServer() {
  const app = express();
  app.set("trust proxy", 1);
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_, res) => {
    res.json({ status: "ok" });
  });

  app.use("/v1/code-execution", executeRoute);

  const server = http.createServer(app);

  setupSocket(server);

  return server;
}

module.exports = { createServer };
