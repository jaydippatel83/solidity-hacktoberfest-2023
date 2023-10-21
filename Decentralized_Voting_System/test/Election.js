const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Election Contract', function() {
	let Election;
	let electionContract;
	let owner;
	let candidate1;
	let candidate2;
	let voter1;
	let voter2;
	let voter3;

	before(async function () {
		[owner, candidate1, candidate2, voter1, voter2, voter3] = await ethers.getSigners();
		Election = await ethers.getContractFactory('Election');
		electionContract = await Election.deploy('Election1');
	});

	describe('Before Voting has started', function(){
	
		it('Should allow only owner to add candidate', async function () {
			await expect(electionContract.connect(owner).addCandidate(candidate1.address, "Candidate 1")).not.to.be.reverted;
			await expect(electionContract.connect(owner).addCandidate(candidate2.address, "Candidate 2")).not.to.be.reverted;
		})
	
		it('Should not allow other to add candidate', async function () {
			await expect(electionContract.connect(voter1).addCandidate(candidate2.address, "Candidate 2")).to.be.revertedWith('You are not the owner.');
		})
	
		it('Should not allow other to add voter', async function(){
			await expect(electionContract.connect(candidate1).addVoter(voter1.address)).to.be.revertedWith('You are not the owner.');
		})
	
		it('Should allow owner to add voter', async function(){
			await expect(electionContract.connect(owner).addVoter(voter1.address)).not.to.be.reverted;
			await expect(electionContract.connect(owner).addVoter(voter2.address)).not.to.be.reverted;
			await expect(electionContract.connect(owner).addVoter(voter3.address)).not.to.be.reverted;
		})

		it('No One Should be able to vote before election is started.', async function(){
			await expect(electionContract.connect(voter1).vote(candidate1.address)).to.be.revertedWith("Wrong State.");
		})
	});

	describe('Voting Started', function () {
		it('Should not allow other to start election', async function() {
			await expect(electionContract.connect(voter1).startElection()).to.be.revertedWith("You are not the owner.");
		})
		it('Should allow only owner to start election', async function() {
			await expect(electionContract.connect(owner).startElection()).not.to.be.reverted;
		})
		it('Only Registered Voters are allowed to vote', async function() {
			await expect(electionContract.connect(voter1).vote(candidate1.address)).not.to.be.reverted;
			await expect(electionContract.connect(voter2).vote(candidate2.address)).not.to.be.reverted;
			await expect(electionContract.connect(voter3).vote(candidate1.address)).not.to.be.reverted;
		})
		it('Non Registered Voters are not allowed to vote', async function() {
			await expect(electionContract.connect(candidate1).vote(candidate1.address)).to.be.revertedWith("Voter is not registered.");
		})
		it('Already Votered voters are not allowed to vote again', async function() {
			await expect(electionContract.connect(voter1).vote(candidate1.address)).to.be.revertedWith("Voter has already Voted.");
		})
	})

	describe('Voting Ended', function () {
		it('Should not allow any other (except owner) to end election', async function(){
			await expect(electionContract.connect(voter1).endElection()).to.be.revertedWith("You are not the owner.");
		})

		it('Should not reveal winner before election ends', async function(){
			await expect(electionContract.connect(owner).getWinner()).to.be.revertedWith("Wrong State.");	
		})

		it('Should allow only owner to end election', async function(){
			await expect(electionContract.connect(owner).endElection()).not.to.be.reverted;
		})

		it('Should reveal winner to public only after election ends', async function(){
			let winner = await electionContract.connect(voter1).getWinner();
			expect(winner).to.equal(candidate1.address);	
		})
	})
})