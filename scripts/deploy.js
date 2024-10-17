
const { ethers, upgrades, artifacts } = require("hardhat");
const path = require("path")

async function main() {
    const [deployer] = await ethers.getSigners();
    const NFTFactory = await ethers.getContractFactory("FreeMintNFT");
    const proxy = await upgrades.deployProxy(NFTFactory, [deployer.address], {kind: "uups", redeployImplementation: 'always'});
    await proxy.waitForDeployment();
    console.log("Proxy deployed to:", await proxy.getAddress());

    const implementationAddress = await upgrades.erc1967.getImplementationAddress(await proxy.getAddress());
    console.log("Implementation address:", implementationAddress);

    console.log("saving fronted artifacts...")
    saveFrontendArtifacts(proxy)
}


async function saveFrontendArtifacts(token) {
    const fs = require("fs")


    const contractDir = path.join(__dirname, "..", "frontend", "contract")

    if (!fs.existsSync(contractDir)) {
        fs.mkdirSync(contractDir)
    }

    fs.writeFileSync(path.join(contractDir, "contract-address.json"),
        JSON.stringify({ Token: await token.getAddress() }, undefined, 2)
    )

    const TokenArtifact = artifacts.readArtifactSync("FreeMintNFT")

    fs.writeFileSync(path.join(contractDir, "Token.json"),
        JSON.stringify(TokenArtifact, null, 2))
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});