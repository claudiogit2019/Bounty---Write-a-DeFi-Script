import { ethers } from "ethers";
import FACTORY_ABI from "./abis/factory.json" assert { type: "json" };
import SWAP_ROUTER_ABI from "./abis/swaprouter.json" assert { type: "json" };
import POOL_ABI from "./abis/pool.json" assert { type: "json" };
import TOKEN_IN_ABI from "./abis/token.json" assert { type: "json" };
import AAVE_LENDING_POOL_ABI from "./abis/lendingpool.json" assert { type: "json" };

import dotenv from "dotenv";
dotenv.config();

const POOL_FACTORY_CONTRACT_ADDRESS =
  "0x0227628f3F023bb0B980b67D528571c95c6DaC1c";
const SWAP_ROUTER_CONTRACT_ADDRESS =
  "0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E";
const AAVE_LENDING_POOL_ADDRESS = 
  "0x5c94e75316CAD5f5e0eF2E8A460Bd4aBAd6222Ee"; // Dirección del contrato LendingPool de Aave en Sepolia

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const factoryContract = new ethers.Contract(
  POOL_FACTORY_CONTRACT_ADDRESS,
  FACTORY_ABI,
  provider
);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

//Part A - Input Token Configuration
const USDC = {
  chainId: 11155111,
  address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  decimals: 6,
  symbol: "USDC",
  name: "USD//C",
  isToken: true,
  isNative: true,
  wrapped: false,
};

const LINK = {
  chainId: 11155111,
  address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
  decimals: 18,
  symbol: "LINK",
  name: "Chainlink",
  isToken: true,
  isNative: true,
  wrapped: false,
};

//Part B - Write Approve Token Function
async function approveToken(tokenAddress, tokenABI, amount, wallet) {
  try {
    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, wallet);
    const approveAmount = ethers.parseUnits(amount.toString(), USDC.decimals);
    const approveTransaction = await tokenContract.approve.populateTransaction(
      SWAP_ROUTER_CONTRACT_ADDRESS,
      approveAmount
    );
    const transactionResponse = await wallet.sendTransaction(
      approveTransaction
    );
    console.log(`-------------------------------`);
    console.log(`Sending Approval Transaction...`);
    console.log(`-------------------------------`);
    console.log(`Transaction Sent: ${transactionResponse.hash}`);
    console.log(`-------------------------------`);
    const receipt = await transactionResponse.wait();
    console.log(
      `Approval Transaction Confirmed! https://sepolia.etherscan.io/tx/${receipt.hash}`
    );
  } catch (error) {
    console.error("An error occurred during token approval:", error);
    throw new Error("Token approval failed");
  }
}

//Part C - Write Get Pool Info Function
async function getPoolInfo(factoryContract, tokenIn, tokenOut) {
  const poolAddress = await factoryContract.getPool(
    tokenIn.address,
    tokenOut.address,
    3000
  );
  if (!poolAddress) {
    throw new Error("Failed to get pool address");
  }
  const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider);
  const [token0, token1, fee] = await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
  ]);
  return { poolContract, token0, token1, fee };
}

//Part D - Write Prepare Swap Params Function
async function prepareSwapParams(poolContract, signer, amountIn) {
  return {
    tokenIn: USDC.address,
    tokenOut: LINK.address,
    fee: await poolContract.fee(),
    recipient: signer.address,
    amountIn: amountIn,
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0,
  };
}

//Part E - Write Execute Swap Function
async function executeSwap(swapRouter, params, signer) {
  const transaction = await swapRouter.exactInputSingle.populateTransaction(
    params
  );
  const receipt = await signer.sendTransaction(transaction);
  console.log(`-------------------------------`);
  console.log(`Receipt: https://sepolia.etherscan.io/tx/${receipt.hash}`);
  console.log(`-------------------------------`);
}

//Part F - Write Function to Deposit LINK in Aave
async function depositToAave(tokenAddress, amount, signer) {
  try {
    const aaveLendingPool = new ethers.Contract(
      AAVE_LENDING_POOL_ADDRESS,
      AAVE_LENDING_POOL_ABI,
      signer
    );
    const amountInWei = ethers.parseUnits(amount.toString(), LINK.decimals);
    
    // Approve Aave to spend the tokens
    const tokenContract = new ethers.Contract(tokenAddress, TOKEN_IN_ABI, signer);
    await tokenContract.approve(AAVE_LENDING_POOL_ADDRESS, amountInWei);

    // Deposit the LINK tokens into Aave
    const depositTx = await aaveLendingPool.deposit(
      tokenAddress,
      amountInWei,
      signer.address,
      0 // referral code
    );
    console.log(`-------------------------------`);
    console.log(`Depositing LINK into Aave...`);
    console.log(`Transaction Sent: ${depositTx.hash}`);
    const receipt = await depositTx.wait();
    console.log(`Deposit Confirmed! https://sepolia.etherscan.io/tx/${receipt.hash}`);
    console.log(`-------------------------------`);
  } catch (error) {
    console.error("An error occurred during the deposit to Aave:", error);
    throw new Error("Deposit to Aave failed");
  }
}

//Part G - Write Main Function
async function main(swapAmount) {
  const inputAmount = swapAmount;
  const amountIn = ethers.parseUnits(inputAmount.toString(), USDC.decimals);

  try {
    await approveToken(USDC.address, TOKEN_IN_ABI, inputAmount, signer);
    const { poolContract } = await getPoolInfo(factoryContract, USDC, LINK);
    const params = await prepareSwapParams(poolContract, signer, amountIn);
    const swapRouter = new ethers.Contract(
      SWAP_ROUTER_CONTRACT_ADDRESS,
      SWAP_ROUTER_ABI,
      signer
    );
    await executeSwap(swapRouter, params, signer);

    // After swapping, deposit LINK to Aave
    const linkBalance = "1"; // Replace with the actual LINK amount obtained from the swap
    await depositToAave(LINK.address, linkBalance, signer);
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}

// Enter Swap Amount
main(1);
