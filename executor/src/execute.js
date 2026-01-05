const runPython = require("./runners/python");

module.exports = async function execute(req, res) {
  const auth = req.headers.authorization;

  if (!auth || auth !== `Bearer ${process.env.EXECUTION_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { language, code, stdin } = req.body;

  if (language !== "python") {
    return res.status(400).json({ error: "Unsupported language" });
  }

  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Invalid code" });
  }

  try {
    const result = await runPython(code, stdin || "");
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Execution failed" });
  }
};
