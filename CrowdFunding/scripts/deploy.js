// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const address = "0xdD870fA1b7C4700F2BD7f44238821C26f7392148";
  const CrowdFundToken = await hre.ethers.deployContract("CrowdFundToken", [address]);
  await CrowdFundToken.waitForDeployment();
  console.log('CrowdFundToken Address', CrowdFundToken.target);

  const RewardToken = await hre.ethers.deployContract("RewardToken", [address]);
  await RewardToken.waitForDeployment();
  console.log('RewardToken Address', RewardToken.target);

  const CrowdFunding = await hre.ethers.deployContract("CrowdFunding", [CrowdFundToken.target, RewardToken.target]);
  await CrowdFunding.waitForDeployment();
  console.log('CrowdFunding Address', CrowdFunding.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
