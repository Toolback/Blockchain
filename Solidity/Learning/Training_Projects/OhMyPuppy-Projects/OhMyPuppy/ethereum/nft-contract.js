import web3 from './web3';
import NftMembership from './build/NftMembership.json';

const nftContract = new web3.eth.Contract(
    JSON.parse(JSON.stringify(NftMembership.abi)),
    '0x4A86929642c72497Cd23Ed7Dfd36E23447fe43a6'
);

export default nftContract;