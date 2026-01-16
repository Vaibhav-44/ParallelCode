const run = require("./_base");

module.exports = (code) =>
  run({
    image: "parallelcode-java",
    filename: "Main.java",
    code,
  });
