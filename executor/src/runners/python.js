const run = require("./_base");

module.exports = (code) =>
  run({ image: "parallelcode-python", filename: "main.py", code });
