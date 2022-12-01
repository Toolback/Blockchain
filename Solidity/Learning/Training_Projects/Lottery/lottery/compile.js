const solc = require("solc");
const path = require("path");
const fs = require("fs");

const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
const source = fs.readFileSync(lotteryPath, 'utf8')

const input = {
    language: 'Solidity',
    sources: {
        'Lottery.sol': {
            content: source,
        },
    },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const CompileTime = JSON.parse(solc.compile(JSON.stringify(input)));
module.exports = CompileTime.contracts["Lottery.sol"]["Lottery"];