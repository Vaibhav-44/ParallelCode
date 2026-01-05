require("dotenv").config();
const { createServer } = require("./server");

const PORT = process.env.PORT || 5000;

const server = createServer();

server.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
