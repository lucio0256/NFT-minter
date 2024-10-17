# nft-minter
Just simple web site where you can mint NFT from custom image

This project allows users to mint NFTs from custom images using a smart contract deployed on the EVM blockchain.
A key feature of this project is that the NFT is uploaded to IPFS only after the transaction is successfully confirmed. The CID (Content Identifier) is generated from the input data and used in the transaction. This approach prevents spam by ensuring that the upload occurs only for valid, confirmed transactions.

The project consists of two main parts:

Smart Contract deployment using Hardhat
Frontend application built with Next.js to interact with the contract

# Setting Up the Project
#### Clone the Repository
```
git clone https://github.com/yourusername/nft-minter.git
```
```
cd nft-minter
```

### Install Dependencies
In the root directory of the project (where the Hardhat scripts are), install the necessary dependencies:
```
npm install
```
Navigate to the frontend directory and install the dependencies there as well:
```
cd frontend
npm install
```

### Setting Up Environment Variables
You will need to create a .env file inside the **frontend** directory<br/>
```
PINATA_API_KEY=
NEXT_PUBLIC_PINATA_GATEWAY=
RPC_PROVIDER=
DEPLOYER_PRIVATE_KEY=
ETHERSCAN_API_KEY=
```

### Smart Contract Deployment

In the root directory, run:
```
npx hardhat compile
```


To deploy the contract to a test network (e.g., Sepolia or Erhereum mainnet), make sure you have funded the account associated with the ***PRIVATE_KEY*** in your .env file and change network configuration in following files:<br/>
***- frontend/app/utils/interact.js***<br/>
***- hardhat.config.ts*** <br/>
Then, deploy the contract:
```
npx hardhat run scripts/deploy.ts --network YOUR NETWORK
```


### Frontend Deployment
```
cd frontend
npm run build
npm run start
```



