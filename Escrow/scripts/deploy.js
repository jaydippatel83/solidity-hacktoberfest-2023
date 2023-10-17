// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const payerAddress = '0x73426923AF5FdaDa87c6a3662E3d9253b87AC084'; // Payer Address
  const payeeAddress = '0xFeB49918A0025Eaf5cE1D25CeACE3385A416ea4c'; // Payee Address
  const amount = hre.ethers.parseEther('1'); // escrow amount in Ether
  const Escrow = await hre.ethers.deployContract("Escrow", [payerAddress, payeeAddress, amount]);
  await Escrow.waitForDeployment();
  console.log('Escrow Address', Escrow.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
