const run = require("./_base");

module.exports = (code) =>
  run({ image: "code-i-cpp", filename: "main.cpp", code });
