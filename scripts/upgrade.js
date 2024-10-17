const { ethers, upgrades, artifacts } = require("hardhat");
const path = require("path");

const newContract = ""
const oldContranct = ""

async function main() {
    const [deployer] = await ethers.getSigners();
    const myNFT2 = await ethers.getContractFactory(newContract);
    const contract = await upgrades.upgradeProxy(oldContranct, myNFT2, { kind: "uups", } );
    console.log("proxy upgraded to: ", await contract.getAddress())

    const implementationAddress = await upgrades.erc1967.getImplementationAddress(await contract.getAddress());
    console.log("Implementation address:", implementationAddress);

    saveFrontendArtifacts(await contract.getAddress())


}

async function saveFrontendArtifacts(contract) {
    const fs = require("fs");

    const contractDir = path.join(__dirname, "..", "frontend", "contract");
    console.log("Saving frontend artifacts to:", contractDir);

    if (!fs.existsSync(contractDir)) {
        fs.mkdirSync(contractDir);
    }

    // Save the new implementation address
    fs.writeFileSync(
        path.join(contractDir, "contract-address.json"),
        JSON.stringify({ Token: newImplementationAddress }, undefined, 2)
    );

    // Save the ABI of the updated contract
    const TokenArtifact = artifacts.readArtifactSync(contract);

    fs.writeFileSync(
        path.join(contractDir, "Token.json"),
        JSON.stringify(TokenArtifact, null, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
