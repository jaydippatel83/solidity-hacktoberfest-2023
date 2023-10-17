const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Escrow Contract', function () {
  let Escrow;
  let escrowContract;
  let payer;
  let payee;
  let lawyer;

  before(async function () {
    [payer, lawyer, payee] = await ethers.getSigners();
    Escrow = await ethers.getContractFactory('Escrow');
    escrowContract = await Escrow.deploy(payer.address, payee.address, ethers.parseEther('1'));
  });

  it('Should allow the payer to deposit funds', async function () {
    // Deposit less than the specified amount
    await escrowContract.connect(payer).deposit({ value: ethers.parseEther('0.5') });
    const balance = await escrowContract.balanceOf();
    expect(balance).to.equal(ethers.parseEther('0.5'));
  });

  it('Should not allow others to deposit funds', async function () {
    // Try to deposit as a lawyer, which should fail
    await expect(
      escrowContract.connect(lawyer).deposit({ value: ethers.parseEther('0.5') })
    ).to.be.revertedWith('Sender Must be the payer');
  });

  it('Should release funds to the payee by the lawyer', async function () {
    // Deposit the full amount
    await escrowContract.connect(payer).deposit({ value: ethers.parseEther('1') });
    const initialBalance = await escrowContract.balanceOf();

    // Check the initial balance
    expect(initialBalance).to.equal(ethers.parseEther('1'));

    // Release the funds by the lawyer
    await escrowContract.connect(lawyer).release();
    const finalBalance = await escrowContract.balanceOf();

    // Check that the balance is now 0
    expect(finalBalance).to.equal(0);
  });

  it('Should not release funds to the payee without lawyer authorization', async function () {
    // Deposit the full amount
    await escrowContract.connect(payer).deposit({ value: ethers.parseEther('1') });
    const initialBalance = await escrowContract.balanceOf();

    // Check the initial balance
    expect(initialBalance).to.equal(ethers.parseEther('1'));

    // Try to release funds by the payee, which should fail
    await expect(escrowContract.connect(payee).release()).to.be.revertedWith('Only the lawyer can release funds');

    // Ensure the balance remains the same
    const finalBalance = await escrowContract.balanceOf();
    expect(finalBalance).to.equal(ethers.parseEther('1'));
  });
});
