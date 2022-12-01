const HDWalletProvider = require("@truffle/hdwallet-provider");
const infuraUrl = "https://rinkeby.infura.io/v3/9e6406861487496cadd5154a1d42ef70";
const privKeys = ["f7c3c828bd3ba350a107e9295bb6fafcc3a272d0a2c8a36d129925ecf1bc7353", "cf5d1050c4f8756fcb0cd17d47eea824880a7a5772a4d2fc72bdd1382335da92"];
const Web3 = require("web3");
const provider = new HDWalletProvider(privKeys, infuraUrl);
const web3 = new Web3(provider);

const compilerOutput = require("./compile");
const abi = compilerOutput.abi;
const bytecode = compilerOutput.evm.bytecode.object;

async function deploy() {
  const accounts = await web3.eth.getAccounts();
  console.log("deploying from", accounts[0]);
  const contract = await new web3.eth.Contract(abi)
    .deploy({
      data: bytecode,
    })
    .send({
      from: accounts[0],
      gas: "1000000",
    });
  console.log(abi);
  provider.engine.stop();
  console.log("deployed to", contract.options.address);
}

deploy();