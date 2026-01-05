const express = require("express");
const axios = require("axios");

const router = express.Router();

const EXECUTION_URL = process.env.EXECUTION_URL || "https://exec.vaibh.me";
const EXECUTION_SECRET =
  process.env.EXECUTION_SECRET || "super_long_random_string";

router.post("/", async (req, res) => {
  const { language, code, stdin } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  try {
    const response = await axios.post(
      EXECUTION_URL + "/execute",
      { language, code, stdin },
      {
        headers: {
          Authorization: `Bearer ${EXECUTION_SECRET}`,
        },
        timeout: 5000,
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err.message);

    res.status(500).json({
      error: "Execution service unavailable",
    });
  }
});

module.exports = router;
