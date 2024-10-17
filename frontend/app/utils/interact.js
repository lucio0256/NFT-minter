import {ethers} from "ethers"
import contractAddress  from "../../contract/contract-address.json"
import contractAbi from "../../contract/Token.json"

const CHAIN_ID = 11155111
const RPC_URLS = ["https://ethereum-sepolia-rpc.publicnode.com"]
const NETWORK_NAME = "sepolia"
const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY


export function loadContract(signer = null) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(
        contractAddress.Token,
        contractAbi.abi,
        signer ? signer : provider
      );

      return contract;
}



export async function checkBalance(client) {
    const contract = loadContract()
    const bal = await contract.balanceOf(client)
    return bal
}

export async function listTokens(client, callback) {
    const contract = loadContract()

    const balance = await checkBalance(client)

    if (balance > 0) {
        for(let i = 0; i < balance; i++) {
            const id = await contract.tokenOfOwnerByIndex(client, i)
            const uri = await contract.tokenURI(id)
            const data = await getMetadata(uri)
            callback(data)
        }
    }

}

function convertIpfsUrl(uri) {
    const gateway = PINATA_GATEWAY

    if (uri.startsWith("ipfs://")) {
        return uri.replace("ipfs://", gateway)
    }
    
    return gateway + uri
}


export async function getMetadata(uri) {
    try {
        const metadata = await fetch(convertIpfsUrl(uri))
        const response = await metadata.json()
        response.image = convertIpfsUrl(response.image)
        return response

    } catch (error) {
        const response = {
            name: "No data",
            description: "No data",
            image: ""
        }
        return response
    }

    
}




export const connectMetamask = async () => {
    if (window.ethereum) {

        try {
            const newProvider = new ethers.BrowserProvider(window.ethereum)
            const accounts = await newProvider.send("eth_requestAccounts", []);
            return accounts[0]
            
        } catch (error) {
            console.log(err)
            return null
        }

    }
}

export const checkNetwork = async () => {
    const currentNetwork = await window.ethereum.request({method: "eth_chainId"})
    if (currentNetwork != ethers.toBeHex(CHAIN_ID)) {
        await switchNetwork()
    }
}



export const switchNetwork = async () => {
    try {

        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [
                {
                    chainId: ethers.toBeHex(CHAIN_ID),
                }
            ]
        })
    } catch (error) {
        await addNetwork()
    }
}


export const addNetwork = async () => {

    await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
            {
            chainId: ethers.toBeHex(CHAIN_ID),
            rpcUrls: RPC_URLS,
            chainName: NETWORK_NAME,
            blockExplorerUrls: null,
            nativeCurrency: {
                name: "ETHEREUM",
                symbol: "ETH",
                decimals: 18
                }
            }
        ]
    })
}


export const disconnect = async () => {
    await window.ethereum.request({
        method: "wallet_revokePermissions", 
        params: [{eth_accounts: {}
        }]
    })
    return ""
}


export const checkConnection = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const accounts = await provider.send("eth_accounts", [])

    console.log("Account connected", accounts[0])
    return accounts[0]
}



export const handleAccountsChanged = (accounts, setClient) => {
    if (accounts.length > 0) {
        console.log("Account changed to:", accounts[0])
        setClient(accounts[0])

    } else {
        setClient(null)
    }



}