require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
const { solidity } = require("ethereum-waffle");
require("chai").use(solidity);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY],
    }
  },
};
