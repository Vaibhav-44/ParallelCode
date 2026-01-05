const run = require("./_base");

module.exports = (code) =>
  run({ image: "code-i-rust", filename: "main.rs", code });
