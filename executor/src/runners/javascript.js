const run = require("./_base");

module.exports = (code) =>
  run({ image: "code-i-node", filename: "main.js", code });
