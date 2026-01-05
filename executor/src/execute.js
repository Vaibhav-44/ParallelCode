const runners = require("./runners");

module.exports = async (req, res) => {
  if (req.headers.authorization !== `Bearer ${process.env.EXECUTION_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { language, code } = req.body;
  const runner = runners[language];

  if (!runner) {
    return res.status(400).s.json({ error: "Unsupported language" });
  }

  try {
    res.json(await runner(code));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Execution failed" });
  }
};
