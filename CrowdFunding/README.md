# CrowdFunding Smart Contract

## Overview
A decentralized crowdfunding platform where creators can raise funds for their projects by issuing tokens or NFTs to backers.

## Features:

- Anybody can create campaign
- User can pledge funds if campaign deadline has not ended.
- The user can unpledge funds before the deadline
- After deadline, if the target funds is achieved, the campaign creator can claim funds and the contributers can claim reward tokens.
- But if the target fund is not achieved, users are eligible for refund

## Smart Contract Files

1. CrowdFundToken: The token in which user pledge fund
2. RewardToken: The token which is given as reward to the user
3. CrowdFunding: The core smart contract consisting of all logic

## CrowFunding Smart Contract

1. We need to pass address of CrowdFundToken and RewardToken in the constructor
2. The owner of RewardToken should set contract address of CrowdFunding smart contract as priviledge account using function `setPriviledgeAccount(address _contractAddress)`
2. `createCampaign(string memory _title, uint _deadline, uint _targetGoal)` is used to create campaign
3. `pledgeFund(uint _id, uint _amount)` is used to pledge funds
   The user can pledge funds if the following condition satisfy:
   - Campaign is ongoing.
   - The user is not the creator
4. `unPledgeFund(uint _id)` is used to unpledge funds
   The user can unpledge funds if the following condition satisfy:
   - Campaign is ongoing.
   - The user is not the creator
   - The user has contributed to the campaign
5. `claimFunds (uint _id)` can be used only by **creator** to claim fund if target fund is reached and the campaign has ended.
6. `claimRefund (uint _id)` can be used by **contributers** to claim their contributed funds as the target amount cannot be reached.
7. `claimReward (uint _id)` can be used by **contributers** to claim their reward NFT if the target amount has been reached and the campaign has ended.

