const run = require("./_base");

module.exports = (code) =>
  run({
    image: "code-i-java",
    filename: "Main.java",
    code,
  });
