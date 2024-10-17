import { task } from "hardhat/config";
import { MyNFT__factory, type MyNFT } from "../typechain-types";

task("mint", "Mint NFT")
    .addParam("contract", "contract address")
    .setAction(async function(taskArgs, { ethers }) {
        const [deployer, user1, user2] = await ethers.getSigners()

        const caller = deployer;
        const NFT = MyNFT__factory.connect(taskArgs.contract, caller)
        const tx = await NFT.safeMint("ipfs://.....")

        const balance = await NFT.balanceOf(caller)
        console.log("Minted! balanceOf: ", balance.toString())
    })

// task("ownerMint", "Mint NFT to given address from owner account")
//     .addParam("contract", "contract address")
//     .addParam("to", "who receive nft")
//     .setAction(async function(taskArgs, { ethers }) {
//         const [deployer, user1, user2] = await ethers.getSigners()

//         const to = user2;

//         const NFT = MyNFT__factory.connect(taskArgs.contract, deployer)
//         const tx = await NFT.ownerMint(taskArgs.to)

//         const balance = await NFT.balanceOf(taskArgs.to)
//         console.log("Minted! balanceOf: ", balance.toString())
// })

task("balanceOf", "Check total supply")
    .addParam("contract", "contract address")
    .addParam("address", "address to check")
    .setAction(async function(taskArgs, { ethers }) {
        const [deployer] = await ethers.getSigners()
        const NFT = MyNFT__factory.connect(taskArgs.contract, deployer)
        const balance = await NFT.balanceOf(taskArgs.address)
        console.log("Balance: ", balance)

})


task("metadata", "Check metadata")
    .addParam("contract", "contract address")
    .addParam("tokenid", "token id of nft")
    .setAction(async function(taskArgs, { ethers }) {
        const [deployer] = await ethers.getSigners()
        const NFT = MyNFT__factory.connect(taskArgs.contract, deployer)
        const data = await NFT.tokenURI(taskArgs.tokenid)
        console.log("data: ", data)

})