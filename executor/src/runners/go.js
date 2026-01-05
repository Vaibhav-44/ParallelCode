const run = require("./_base");

module.exports = (code) =>
  run({ image: "code-i-go", filename: "main.go", code });
