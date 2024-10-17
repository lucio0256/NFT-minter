import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@openzeppelin/hardhat-upgrades';
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";

require("dotenv").config({ path: "./frontend/.env" });

require("./tasks/mint");


const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY


const config: HardhatUserConfig = {

    defaultNetwork: "sepolia",

    solidity: {
        version: "0.8.24",
        settings: {
        optimizer: {
            enabled: true,
            runs: 200,
        },
        },
  },
  
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    sepolia: {
      chainId: 11155111,
      url: "https://ethereum-sepolia-rpc.publicnode.com",
      accounts: [DEPLOYER_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  sourcify: {
    enabled: true,
  },
  paths: {
    sources: 'contracts',
  },
};

export default config;
