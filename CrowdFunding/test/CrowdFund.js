const { expect } = require('chai');
const { ethers } = require('hardhat');
const { time, loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe('CrowdFunding Platform Smart Contract', function() {
	let owner, campaign_owner1, campaign_owner2, contributer1, contributer2, contributer3, non_contributer;
	let CrowdFundToken, RewardToken, CrowdFunding;
	let crowdFundToken, rewardToken, crowdFunding;
	before(async function(){
		[owner, campaign_owner1, campaign_owner2, contributer1, contributer2, contributer3, non_contributer] = await ethers.getSigners();
		CrowdFundToken = await ethers.getContractFactory("CrowdFundToken");
		crowdFundToken = await CrowdFundToken.deploy(owner.address);
		RewardToken = await ethers.getContractFactory("RewardToken");
		rewardToken = await RewardToken.deploy(owner.address);
		CrowdFunding = await ethers.getContractFactory("CrowdFunding");
		crowdFunding = await CrowdFunding.deploy(crowdFundToken.target, rewardToken.target);
		await rewardToken.setPriviledgeAccount(crowdFunding.target);

		crowdFundToken.transfer(campaign_owner2.address, 100);
		crowdFundToken.transfer(contributer1.address, 100);
		crowdFundToken.transfer(contributer2.address, 100);
		crowdFundToken.transfer(contributer3.address, 100);
		crowdFundToken.transfer(non_contributer.address, 100);
	})

	describe("Creating Campaign Tests:", function(){
		it("Any User Can Create Campaign", async function(){
			let deadline = Math.round(new Date().getTime() / 1000) + 1 * 24 * 60 * 60; // 1 day after
			let title = "Covid 19 Donation";
			let targetGoal = 10;
			await expect(crowdFunding.connect(campaign_owner1).createCampaign(title, deadline, targetGoal)).not.to.be.reverted;
		});

		it("A User Can Create Multiple Campaign", async function(){
			let deadline = Math.round(new Date().getTime() / 1000) + 1 * 24 * 60 * 60; // 1 day after
			let title = "Tree Plantation Donation";
			let targetGoal = 20;
			await expect(crowdFunding.connect(campaign_owner1).createCampaign(title, deadline, targetGoal)).not.to.be.reverted;
		});

		it("Other User Can Create Campaign", async function(){
			let deadline = Math.round(new Date().getTime() / 1000) + 1 * 24 * 60 * 60; // 1 day after
			let title = "Medical CrowdFunding";
			let targetGoal = 20;
			await expect(crowdFunding.connect(campaign_owner2).createCampaign(title, deadline, targetGoal)).not.to.be.reverted;
		});
	})

	describe("Ongoing Campaign Tests:", function(){
		it("Campaign Owner cannot pledge funds in their own campaign", async function(){
			await crowdFundToken.connect(campaign_owner1).approve(crowdFunding.target, 10);
			await expect(crowdFunding.connect(campaign_owner1).pledgeFund(0, 10)).to.be.revertedWith("The creator cannot pledge funds.");
		});
		it("Other Campaign Owner can pledge funds in other's campaign", async function(){
			await crowdFundToken.connect(campaign_owner2).approve(crowdFunding.target, 10);
			await expect(crowdFunding.connect(campaign_owner2).pledgeFund(0, 10)).not.to.be.reverted;
		});
		it("Other User can pledge funds in campaign", async function(){
			await crowdFundToken.connect(contributer1).approve(crowdFunding.target, 20);
			await crowdFundToken.connect(contributer2).approve(crowdFunding.target, 10);
			await expect(crowdFunding.connect(contributer1).pledgeFund(0, 10)).not.to.be.reverted;
			await expect(crowdFunding.connect(contributer1).pledgeFund(2, 10)).not.to.be.reverted;
			await expect(crowdFunding.connect(contributer2).pledgeFund(1, 10)).not.to.be.reverted;
		});
		it("Contributer can unpledge funds from the campaign", async function(){
			await expect(crowdFunding.connect(contributer1).unPledgeFund(0)).not.to.be.reverted;
		});
		it("Contributer cannot unpledge funds twice", async function(){
			await expect(crowdFunding.connect(contributer1).unPledgeFund(0)).to.be.revertedWith("You have not pledged any fund.");
		});
		it("Non Contributer cannot unpledge funds", async function(){
			await expect(crowdFunding.connect(non_contributer).unPledgeFund(0)).to.be.revertedWith("You have not pledged any fund.");
		});
		it("Campaign creator cannot claim funds before deadline", async function(){
			await expect(crowdFunding.connect(campaign_owner1).claimFunds(0)).to.be.revertedWith("The campaign is ongoing.");
		});
	})

	describe("After Deadline", function(){
		before(async function(){
			let deadline = (await crowdFunding.campaigns(0))[2];
			await time.increaseTo(deadline);
			await time.increase(2);
		});
		it("Contributer cannot pledge funds after deadline", async function(){
			await crowdFundToken.connect(contributer1).approve(crowdFunding.target, 10);
			await expect(crowdFunding.connect(contributer1).pledgeFund(0, 10)).to.be.revertedWith("The campaign has ended.");
		});
		it("Contributer cannot unpledge funds after deadline", async function(){
			await expect(crowdFunding.connect(contributer1).unPledgeFund(0)).to.be.revertedWith("The campaign has ended.");
		});
		it("Campaign creator cannot claim funds before deadline", async function(){
			await expect(crowdFunding.connect(campaign_owner1).claimFunds(0)).not.to.be.reverted;
		});
		it("Campaign creator cannot claim funds twice", async function(){
			await expect(crowdFunding.connect(campaign_owner1).claimFunds(0)).to.be.revertedWith("Funds has already been claimed.");
		});
		it("Contributer can get refund when target funds have not achieved", async function(){
			await expect(crowdFunding.connect(contributer2).claimRefund(1)).not.to.be.reverted;
		});
		it("Contributer cannot get refund when target funds have achieved", async function(){
			await expect(crowdFunding.connect(contributer1).claimRefund(0)).to.be.revertedWith("The campaign is successful.");
		});
		it("Contributer can get Reward when campaign is successful", async function() {
			await expect(crowdFunding.connect(contributer1).claimReward(0)).not.to.be.reverted;
		});
		it("Contributer cannot get Reward twice once claimed", async function() {
			await expect(crowdFunding.connect(contributer1).claimReward(0)).to.be.revertedWith("Reward has been already claimed.");
		});
		it("Contributer cannot get Reward when target funds have not achieved", async function() {
			await expect(crowdFunding.connect(contributer1).claimReward(1)).to.be.revertedWith("Target Goal Cannot Be Achieved.");
		})
	})
})