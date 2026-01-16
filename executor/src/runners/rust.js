const run = require("./_base");

module.exports = (code) =>
  run({ image: "parallelcode-rust", filename: "main.rs", code });
