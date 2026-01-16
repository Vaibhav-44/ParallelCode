const run = require("./_base");

module.exports = (code) =>
  run({ image: "parallelcode-node", filename: "main.js", code });
