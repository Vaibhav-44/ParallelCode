const run = require("./_base");

module.exports = (code) =>
  run({ image: "parallelcode-go", filename: "main.go", code });
