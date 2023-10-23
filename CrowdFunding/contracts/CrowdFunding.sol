// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CrowdFundToken.sol";
import "./RewardToken.sol";

contract CrowdFunding {

	struct Campaign{
		string title;
		address creator;
		uint deadline;
		uint targetGoal;
		uint raisedFunds; // Total Fund raised till noe
		bool claimFunds; // Has Creator claimed the fund
	}

	// Campaign
	uint public campaignCount = 0;
	mapping (uint => Campaign) public campaigns;

	// Contributers List
	// id => address => amount
	mapping(uint => mapping(address => uint)) contributers;
	mapping(uint => mapping(address => bool)) claimedReward;
	
	// Custom Tokens
	CrowdFundToken public immutable token;
	RewardToken public immutable rewardToken;

	uint public REWARD_TOKEN = 10; // Reward Token to recieve when campaign is successful
	
	constructor(address _token, address _rewardToken) {
        token = CrowdFundToken(_token);
        rewardToken = RewardToken(_rewardToken);
    }

    // Campaign is created
	function createCampaign(string memory _title, uint _deadline, uint _targetGoal) external returns(uint) {
		Campaign memory campaign = Campaign({
			title: _title,
			creator: msg.sender,
			deadline: _deadline,
			targetGoal: _targetGoal,
			raisedFunds: 0,
			claimFunds: false
			});
        uint id = campaignCount;
		campaigns[id] = campaign;
		campaignCount++;
        return id;
	}

	// User pledge tokens of particular campaign.
	function pledgeFund(uint _id, uint _amount) external{
		require (msg.sender != campaigns[_id].creator, "The creator cannot pledge funds."); 
		require (block.timestamp <= campaigns[_id].deadline, "The campaign has ended.");
		Campaign storage campaign = campaigns[_id];
		token.transferFrom(msg.sender, address(this), _amount);
		campaign.raisedFunds += _amount;
		contributers[_id][msg.sender] += _amount;
	}

	// User unPledge tokens of particular campaign 
	function unPledgeFund(uint _id) external {
		require (block.timestamp <= campaigns[_id].deadline, "The campaign has ended.");
		require (msg.sender != campaigns[_id].creator, "The creator cannot pledge funds."); 
		require (contributers[_id][msg.sender] > 0, "You have not pledged any fund.");
		Campaign storage campaign = campaigns[_id];
		uint unpledgeAmount = contributers[_id][msg.sender];
		campaign.raisedFunds -= unpledgeAmount;
		contributers[_id][msg.sender] = 0;
		token.transfer(msg.sender , unpledgeAmount);
	}

	// Campaign creator withdraw tokens
	function claimFunds (uint _id) external {
		require (block.timestamp > campaigns[_id].deadline, "The campaign is ongoing.");
		require (msg.sender == campaigns[_id].creator, "The creator can only claim funds.");
		require (campaigns[_id].raisedFunds >= campaigns[_id].targetGoal, "Target Goal Cannot Be Achieved.");
		require (!campaigns[_id].claimFunds, "Funds has already been claimed.");
		campaigns[_id].claimFunds = true;
		token.transfer(campaigns[_id].creator, campaigns[_id].raisedFunds); 
	}

	// For Failed Campaign, Contributers get their token back
	function claimRefund (uint _id) external {
		require (block.timestamp > campaigns[_id].deadline, "The campaign is ongoing.");
		require (campaigns[_id].raisedFunds < campaigns[_id].targetGoal, "The campaign is successful.");
		require (contributers[_id][msg.sender] > 0, "You have not pledged any fund.");
		Campaign storage campaign = campaigns[_id];
		uint unpledgeAmount = contributers[_id][msg.sender];
		campaign.raisedFunds -= unpledgeAmount;
		contributers[_id][msg.sender] = 0;
		token.transfer(msg.sender , unpledgeAmount);
	}

	// Claim Reward Token
	function claimReward (uint _id) external{
		require (block.timestamp > campaigns[_id].deadline, "The campaign is ongoing.");
		require (msg.sender != campaigns[_id].creator, "The creator cannot claim reward tokens.");
		require (campaigns[_id].raisedFunds >= campaigns[_id].targetGoal, "Target Goal Cannot Be Achieved.");
		require (!claimedReward[_id][msg.sender], "Reward has been already claimed.");
		claimedReward[_id][msg.sender] = true;
		rewardToken.mint(msg.sender, REWARD_TOKEN);
	}
			
}