const run = require("./_base");

module.exports = (code) =>
  run({ image: "code-i-python", filename: "main.py", code });
