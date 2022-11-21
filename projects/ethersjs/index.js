const ethers = require("ethers");
const dotenv = require("dotenv");

dotenv.config();

const socket = new ethers.providers.WebSocketProvider(
  process.env.ENCODE_INFURA_ENDPOINT_MAINNET,
  "homestead"
);

socket.on("pending", async (tx) => {
  const transaction = await socket.getTransaction(tx);
  if (
    transaction?.to?.toLowerCase() ===
    "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D".toLowerCase()
  ) {
    console.log(transaction);
  }
});
