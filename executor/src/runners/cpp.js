const run = require("./_base");

module.exports = (code) =>
  run({ image: "parallelcode-cpp", filename: "main.cpp", code });
