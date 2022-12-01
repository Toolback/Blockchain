const { expect } = require("chai");
var assert = require('chai').assert
const { ethers } = require("hardhat");

const wMaticAbi = require("../contracts/abis/WMATIC.json");
const debtTokenContractAbi = require('../contracts/abis/DebtTokenBase.json');
const aTokenAbi = require('@aave/core-v3/artifacts/contracts/protocol/tokenization/AToken.sol/AToken.json')
const VaultABI = require('@aave/core-v3/artifacts/contracts/protocol/pool/Pool.sol/Pool.json');


//Balancer 

const { defaultAbiCoder } = require("@ethersproject/abi");
// const { formatUserSummaryAndIncentives } require '@aave/math-utils';
// import dayjs from 'dayjs';
const { getPoolAddress } = require("@balancer-labs/balancer-js");
// import { IERC20Abi } from ./IERC20.json
const { StablePoolEncoder } = require("@balancer-labs/balancer-js");


const poolId = "0x06df3b2bbb68adc8b0e302443692037ed9f91b42000000000000000000000012"
const poolAddress = getPoolAddress(poolId)
console.log("PoolAddress from Balancer:", poolAddress);
// poolAddress = "0x06df3b2bbb68adc8b0e302443692037ed9f91b42"

const balancerVaultABI = require("./balancerVaultAbi.json")


// Uniswap 

// const {Pool} = require("@uniswap/v3-sdk")
// const { Token } = require('@uniswap/sdk-core')
// const { IUniswapV3PoolABI } =  require('@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json')


require('chai')
  .use(require('chai-as-promised'))
  .should()

// Test Balance For Testing
let userAddress;
let contractAddress;
let Signer;
let signer;

// Contract Instance
let aaveXBal;
let Vault;

let wMaticContract;
let debtTokenContract;
let aTokenContract;
let GP;
let bptContract;
let balancerVault;
let uniswapPoolContract;

// Tokens Address
let wMatic = '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270';
let aToken = '0x6d80113e533a2C0fe82EaBD35f1875DcEA89Ea97';
let matic = '0x0000000000000000000000000000000000001010';
let usdc = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';
let dai = '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063';
let mai = '0xa3Fa99A148fA48D14Ed51d610c367C61876997F1';
let usdt = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';
let debtToken = '0x307ffe186F84a3bc2613D1eA417A5737D69A7007'
let WIETH = "0x9BdB5fcc80A49640c7872ac089Cc0e00A98451B6"
// TX Price Amount
let AMOUNT_1 = ethers.utils.parseEther('1');
let AMOUNT_2 = ethers.utils.parseEther('2');
let AMOUNT_USDC = ethers.BigNumber.from("5");
let AMOUNT_USDCMAX = ethers.BigNumber.from("500");
let AMOUNT_USDCOUT = ethers.BigNumber.from("4");

let AMOUNT_USDCOUT2 = ethers.BigNumber.from("2");
let AMOUNT_WMATICOUT = ethers.utils.parseEther('100');

let AMOUNT_400 = ethers.utils.parseEther('400');
let AMOUNT_500 = ethers.utils.parseEther('500');
let AMOUNT_700 = ethers.utils.parseEther('700');

let AMOUNT_1000 = ethers.utils.parseEther('1000');
let AMOUNT_BPT_OUT = ethers.utils.parseEther('4');
let AMOUNT_BPT_APPROVE = ethers.utils.parseEther('100')

const uniswapPoolAddress = ""



// Let's play =D 
describe("Testing Aave X Balancer Contracts", async () => {

  before(async () => {
    Signer = await ethers.getSigner();
    signer = await ethers.provider.getSigner(Signer.address);

    // Deploy Contract
    const AaveXBal = await ethers.getContractFactory("AaveXBal", Signer);
    aaveXBal = await AaveXBal.deploy();
    await aaveXBal.deployed();
    // console.log(aaveXBal, "aaveXBAL : details")

    // Ether.js .Contrat || .getContractAt ?
    wMaticContract = new ethers.Contract('0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', wMaticAbi, Signer);
    await wMaticContract.deployed(); debtTokenContractAbi

    // Ether.js .Contrat || .getContractAt ?
    debtTokenContract = new ethers.Contract('0x307ffe186F84a3bc2613D1eA417A5737D69A7007', debtTokenContractAbi, Signer);
    await debtTokenContract.deployed();

    aTokenContract = new ethers.Contract('0x6d80113e533a2C0fe82EaBD35f1875DcEA89Ea97', aTokenAbi, Signer);
    await aTokenContract.deployed();

    // Balancer Pool
    bptContract = new ethers.Contract(poolAddress, wMaticAbi, Signer);
    await bptContract.deployed()

    //Usdc Contract
    usdcContract = new ethers.Contract(usdc, wMaticAbi, Signer);
    await usdcContract.deployed();

    // Balancer Vault
    balancerVault = new ethers.Contract('0xBA12222222228d8Ba445958a75a0704d566BF2C8', balancerVaultABI, Signer);
    await balancerVault.deployed();

    // AavePool
    VaultContract = new ethers.Contract('0x794a61358D6845594F94dc1DB02A252b5b4814aD', VaultABI, Signer);
    await VaultContract.deployed();

    // // Uniswap Pool
    // uniswapPoolContract = new ethers.Contract(uniswapPoolAddress, IUniswapV3PoolABI, Signer)
    // await uniswapPoolContract.deployed();

    // Set User and Contract address for input testing
    await aaveXBal.setUserAddress();

    const user = await aaveXBal.userAddress();
    userAddress = user;

    const contract = await aaveXBal.contractAddress();
    contractAddress = contract;

    GP = await aaveXBal.GP();

  })

  describe("Wrapping Matic for testing", async () => {
    it("Should Wrap 1000 Matic", async () => {
      const wMaticUserBalanceBefore = await aaveXBal.getERC20Balance(wMatic, userAddress);
      await aaveXBal.wrapMatic(wMatic, { value: AMOUNT_1000 });
      const wMaticUserBalanceAfter = await aaveXBal.getERC20Balance(wMatic, userAddress);

      assert.isAbove(wMaticUserBalanceAfter, wMaticUserBalanceBefore, "User Should be Funded with 500 wMatic")
    })
  })

  describe("Start on User Behalf Farming", async () => {

    it("User Should Approve Pool MaxSpend", async () => {
      const poolwMaticAllowanceBefore = await aaveXBal.getERC20Allowance(wMatic, contractAddress, GP);

      await aaveXBal.approveMaxSpend(wMatic, GP);

      const poolwMaticAllowanceAfter = await aaveXBal.getERC20Allowance(wMatic, contractAddress, GP);

      assert.isAbove(poolwMaticAllowanceAfter, poolwMaticAllowanceBefore, "Contract wMatic allowance of User Funds should have increase");
    })

    it("Should transfer Initial Amout to Contract", async () => {
      const wMaticContractBalanceBefore = await aaveXBal.getERC20Balance(wMatic, contractAddress);
      console.log("wMatic Contract Balance Before TX :", ethers.utils.formatUnits(wMaticContractBalanceBefore, 18));

      await wMaticContract.transferFrom(userAddress, contractAddress, AMOUNT_500)

      const wMaticContractBalanceAfter = await aaveXBal.getERC20Balance(wMatic, contractAddress);
      console.log("wMatic Contract Balance After TX :", ethers.utils.formatUnits(wMaticContractBalanceAfter, 18));

      assert.isAbove(wMaticContractBalanceAfter, wMaticContractBalanceBefore, "Contract Should be Funded with 500 wMatic")
    })


    it("User Should deposit 500 wMatic to Pool", async () => {
      const useraTokenBalanceBefore = await aaveXBal.getERC20Balance(aToken, userAddress);

      await aaveXBal.supplyToPool(wMatic, AMOUNT_500, userAddress);

      const useraTokenBalanceAfter = await aaveXBal.getERC20Balance(aToken, userAddress);

      assert.isAbove(useraTokenBalanceAfter, useraTokenBalanceBefore, "aToken User's Balance should have increase");
    })


    it("User Should Approve Contract Credit Delegation", async () => {
      const delegationBalanceBefore = await aaveXBal.getBorrowAllowance(debtToken, userAddress, contractAddress);

      await debtTokenContract.approveDelegation(contractAddress, AMOUNT_1000);

      const delegationBalanceAfter = await aaveXBal.getBorrowAllowance(debtToken, userAddress, contractAddress);

      assert.isAbove(delegationBalanceAfter, delegationBalanceBefore, "aToken User's Balance should have increase");
    })

    it("User Should Borrow USDC From Pool", async () => {
      const userUsdcBalanceBefore = await aaveXBal.getERC20Balance(usdc, userAddress);

      await aaveXBal.borrowFromPool(usdc, 10000000, 1, userAddress);
      await VaultContract.borrow(usdc, 10000000, 1, 0, userAddress);

      const userUsdcBalanceAfter = await aaveXBal.getERC20Balance(usdc, userAddress);;
      console.log("User USDC Balance After Borrowing:", ethers.utils.formatUnits(userUsdcBalanceAfter, 6));

      const contractUsdcBalanceAfter = await aaveXBal.getERC20Balance(usdc, contractAddress);;
      console.log("User USDC Balance After Borrowing:", ethers.utils.formatUnits(contractUsdcBalanceAfter, 6));

      assert.isAbove(userUsdcBalanceAfter, userUsdcBalanceBefore, "Usdc User's Balance should have increase");

    })

    // it("Should retrieve Pool Tokens", async () => {

    //   const GPT = await balancerVault.getPoolTokens(poolId)
    //   console.log("Pool Tokens", GPT);
    // })

    // it("should Approve Contract to BPT", async () => {
    //   await bptContract.approve(userAddress, AMOUNT_BPT_APPROVE)
    //   await bptContract.approve(contractAddress, AMOUNT_BPT_APPROVE)
    //   await bptContract.approve(poolAddress, AMOUNT_BPT_APPROVE)
    //   await bptContract.approve("0xBA12222222228d8Ba445958a75a0704d566BF2C8", AMOUNT_BPT_APPROVE)

    //   const BalancerAllowance = await aaveXBal.getERC20Allowance(poolAddress, userAddress, "0xBA12222222228d8Ba445958a75a0704d566BF2C8");
    //   console.log("Allowance for BPT Token spending:", BalancerAllowance);
    // })



    it("should Increase Balancer Vault USDC Allowance", async () => {
      await usdcContract.approve("0xBA12222222228d8Ba445958a75a0704d566BF2C8", "100000000000000000000000000000000000000")
      const BalancerAllowance = await aaveXBal.getERC20Allowance(usdc, userAddress, "0xBA12222222228d8Ba445958a75a0704d566BF2C8");
      assert.isAbove(BalancerAllowance, 0, "Balancer Vault Allowance should be > 0")
    })



    it("User should supply borrowed Usdc to Balancer Pool", async () => {

      const userUsdcBalanceBefore = await aaveXBal.getERC20Balance(usdc, userAddress);

      // const TOKEN_IN_FOR_EXACT_BPT_OUT = AMOUNT_USDC; // 5.0 usdc
      // console.log('TOKEN_IN_FOR_EXACT_BPT_OUT', TOKEN_IN_FOR_EXACT_BPT_OUT)
      // const bptAmountOut = AMOUNT_BPT_OUT;
      // const enterTokenIndex = 0;
      // const abi = ['uint256', 'uint256', 'uint256'];
      // const data = [TOKEN_IN_FOR_EXACT_BPT_OUT, bptAmountOut, enterTokenIndex];
      // const userDataEncoded = defaultAbiCoder.encode(abi,data);

      // // JoinPoolRequest ( address[] assets, uint256[] maxAmountsIn, bytes userData, bool fromInternalBalance )
      // const requestEncoded = {assets:[usdc, dai, mai, usdt], maxAmountsIn:[5e6, 0, 0, 0], userData:userDataEncoded, fromInternalBalance:false};

      // await balancerVault.joinPool("0x06df3b2bbb68adc8b0e302443692037ed9f91b42000000000000000000000012", userAddress, userAddress, requestEncoded)

      // const userUsdcBalanceAfter = await aaveXBal.getERC20Balance(usdc, userAddress);;
      // console.log("User USDC Balancer After Borrowing:", userUsdcBalanceAfter);

      // assert.isAbove(userUsdcBalanceBefore, userUsdcBalanceAfter, "Usdc User's Balance should have increase");


      const poolId = "0x06df3b2bbb68adc8b0e302443692037ed9f91b42000000000000000000000012"
      const tokens = [usdc, dai, mai, usdt]
      const amountsIn = [AMOUNT_USDC, 0, 0, 0];
      const minimumBPT = 0

      await balancerVault.joinPool(
        poolId,
        userAddress,
        userAddress,
        {
          assets: tokens,
          maxAmountsIn: amountsIn,
          fromInternalBalance: false,
          userData: StablePoolEncoder.joinExactTokensInForBPTOut(amountsIn, minimumBPT),
        }
      );

      const BPTBalance = await bptContract.balanceOf(userAddress);
      console.log("BPT Balance After Depositing usdc;", BPTBalance);

      const userUsdcBalanceAfter = await aaveXBal.getERC20Balance(usdc, userAddress);;

      assert.isBelow(userUsdcBalanceAfter, userUsdcBalanceBefore, "Usdc User's Balance should have decrease");
    })
  })


  describe("Close Users's Farming Position / Repay + TP", async () => {
    it("should Withdraw supplied borrowed USDC from Pool", async () => {
      const BPTBalance = await bptContract.balanceOf(userAddress);
      console.log("BPT Balance After Depositing usdc;", BPTBalance);

      const userUsdcBalance = await aaveXBal.getERC20Balance(usdc, userAddress);
      console.log("User USDC Balancer Before Withdrawing:", userUsdcBalance);

      const poolId = "0x06df3b2bbb68adc8b0e302443692037ed9f91b42000000000000000000000012"
      const tokens = [usdc, dai, mai, usdt]
      const bptAmountIn = BPTBalance;
      const amountsOut = [AMOUNT_USDCOUT, 0, 0, 0];
      const exitTokenIndex = 0;
      await balancerVault.exitPool(
        poolId,
        userAddress,
        userAddress,
        {
          assets: tokens,
          minAmountsOut: amountsOut,
          toInternalBalance: false,
          userData: StablePoolEncoder.exitExactBPTInForOneTokenOut(bptAmountIn, exitTokenIndex)
        }
      )

      const BPTBalanceAfter = await bptContract.balanceOf(userAddress);
      console.log("BPT Balance After Withdrawing usdc;", BPTBalanceAfter);

      const userUsdcBalanceAfter = await aaveXBal.getERC20Balance(usdc, userAddress);;
      console.log("User USDC Balancer After Borrowing:", userUsdcBalanceAfter);
    })

    it("should Increase Aave Pool USDC Allowance", async () => {
      GP = await aaveXBal.GP();

      await usdcContract.approve(GP, "100000000000000000000000000000000000000")
      await usdcContract.approve(contractAddress, "100000000000000000000000000000000000000")

      await aaveXBal.approveMaxSpend(usdc, GP);
      await aaveXBal.approveMaxSpend(usdc, contractAddress);


      const BalancerAllowance = await aaveXBal.getERC20Allowance(usdc, userAddress, "0xBA12222222228d8Ba445958a75a0704d566BF2C8");
      assert.isAbove(BalancerAllowance, 0, "Balancer Vault Allowance should be > 0")
    })

    it("Should Repay Borrowed Usdc to AavePool", async () => {
      const userUsdcBalance = await aaveXBal.getERC20Balance(usdc, userAddress);
      console.log("User USDC Balance Before Repay (should be full):", userUsdcBalance);

      await aaveXBal.repayToPool(usdc, AMOUNT_USDCOUT2, 1, userAddress)
      // ethers.constants.MaxUint256

      const userUsdcBalanceAfter = await aaveXBal.getERC20Balance(usdc, userAddress);
      console.log("User USDC Balance After Repay (should be null):", userUsdcBalanceAfter);
    })

    it("Should Withdraw initial funds from AavePool", async () => {
      const wMaticUserBalanceBefore = await aaveXBal.getERC20Balance(wMatic, userAddress);
      console.log("wMatic User Balance Before TX :", ethers.utils.formatUnits(wMaticUserBalanceBefore, 18));
      const useraTokenBalanceBefore = await aaveXBal.getERC20Balance(aToken, userAddress);
      console.log("User aToken before :", useraTokenBalanceBefore)
      await aaveXBal.withdrawFromPool(wMatic, AMOUNT_WMATICOUT, userAddress)

      const useraTokenBalanceAfter = await aaveXBal.getERC20Balance(aToken, userAddress);
      console.log("User aToken After :", useraTokenBalanceAfter)

      const wMaticUserBalanceAfter = await aaveXBal.getERC20Balance(wMatic, userAddress);
      console.log("wMatic User Balance After TX :", ethers.utils.formatUnits(wMaticUserBalanceAfter, 18));

    })
  })
})
