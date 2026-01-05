require("dotenv").config();
const { createServer } = require("./server");

const PORT = process.env.PORT || 4000;

const app = createServer();
app.listen(PORT, () => {
  console.log(`Executor running on port ${PORT}`);
});
