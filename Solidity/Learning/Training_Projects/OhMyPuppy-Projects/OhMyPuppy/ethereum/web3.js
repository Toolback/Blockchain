import Web3 from "web3";
require("dotenv").config();

// const alchemyUrl = process.env.RINKEBY_ENDPOINT;
 
let web3;
 
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    'https://eth-rinkeby.alchemyapi.io/v2/60PeFVesMLNQUG-F8sWt-xpTBNi_u9f-'
  );
  web3 = new Web3(provider);
}
 
export default web3;
