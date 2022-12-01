require("dotenv").config();
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;

// Some quick checks to make sure our .env is working.
if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY == "") {
    console.log("🛑 Private key not found.")
  }
  
  if (!process.env.API_URL || process.env.API_URL == "") {
    console.log("🛑 API URL not found.")
  }
  
  if (!process.env.PUBLIC_KEY || process.env.PUBLIC_KEY == "") {
    console.log("🛑 Wallet Address not found.")
  }

const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(API_URL)

const contract = require("../artifacts/contracts/NftMembership.sol/NftMembership.json")
const contractAddress = "0x4A86929642c72497Cd23Ed7Dfd36E23447fe43a6"
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)




async function mintNFT(tokenURI) {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest") //get latest nonce

    //the transaction
    const tx = {
        from: PUBLIC_KEY,
        to: contractAddress,
        nonce: nonce,
        gas: 500000,
        data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
    }

    const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
    signPromise
        .then((signedTx) => {
            web3.eth.sendSignedTransaction(
                signedTx.rawTransaction,
                function (err, hash) {
                    if (!err) {
                        console.log(
                            "The hash of your transaction is: ",
                            hash,
                            "\nCheck Alchemy's Mempool to view the status of your transaction!"
                        )
                    } else {
                        console.log(
                            "Something went wrong when submitting your transaction:",
                            err
                        )
                    }
                }
            )
        })
        .catch((err) => {
            console.log("Promise failed:", err)
        })
}

mintNFT(
    "https://gateway.pinata.cloud/ipfs/QmNvKMwXFKJJ8kLiuqNCw7Tfb18WqAKDsz8QX7Nkjxv3L9"
)
  