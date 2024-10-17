import { NextResponse, NextRequest } from "next/server";
import ipfsOnlyHash from "ipfs-only-hash";
import { BigNumberish, ethers } from "ethers";
import contractAbi from "../../../contract/Token.json";
import contractAddress from "../../../contract/contract-address.json";

const pinataApiKey = process.env.PINATA_API_KEY;
const wsProvider = process.env.RPC_PROVIDER;

const uploadToPinata = async (file: any) => {
  try {
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${pinataApiKey}`,
        },
        body: file,
    });
    
    return await res.json();
    } catch (error) {
        console.error(error);
  }
};


const calculateIpfsHash = async (file: ArrayBuffer) => {
    const buffer = Buffer.from(file)
    return await ipfsOnlyHash.of(buffer)
}

export async function POST(request: Request) {
  try {
    const req = await request.formData();
    const file = req.get("picture") as Blob;
    const client = req.get("client");

    
    const pictCid = await calculateIpfsHash(await file.arrayBuffer())


    

    const metadata = JSON.stringify({
      name: req.get("name"),
      description: req.get("description"),
      image: "ipfs://" + pictCid,
    });

    const metadataCid = await ipfsOnlyHash.of(Buffer.from(metadata));


    if (!wsProvider) {
        throw new Error("RPC provider URL is not defined in the environment variables");
    }

    
    const provider = new ethers.JsonRpcProvider(wsProvider)
    const contract = new ethers.Contract(
      contractAddress.Token,
      contractAbi.abi,
      provider,
    );

    const handleTransfer = async (from: string, to: string, tokenId: BigNumberish, event: Event) => {
      if (client && to.toLowerCase() === client.toString().toLowerCase()) {
        console.log(`NFT SERVER minted for address ${to} with token ID ${tokenId}`,);
        try {
            const imageForm = new FormData();

            // Upload the image to Pinata
            imageForm.append("file", file);
            const imageIpfs = await uploadToPinata(imageForm);

            // Upload the metadata to Pinata
            const blob = new Blob([metadata], { type: "application/json" });
            const metadataFile = new File([blob], "metadata.json");
            const metadataForm = new FormData();
            metadataForm.append("file", metadataFile);
            await uploadToPinata(metadataForm);

        } catch (error) {
            console.log("Error uploading metadata to IPFS")
        }

      }
    };

    contract.once("Transfer", handleTransfer);


    return new NextResponse(JSON.stringify({
        hash: metadataCid,
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log("ERROR:!!! ", error);
    return new NextResponse("Error processing request", { status: 500 });
  }
}
