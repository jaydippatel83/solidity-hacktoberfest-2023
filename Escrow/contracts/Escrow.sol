// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Escrow {
    address public payer;
    address public lawyer;
    address payable public payee;
    uint public amount;

    constructor(address _payer, address payable _payee, uint _amount) {
        payer = _payer;
        payee = _payee;
        amount = _amount;
        lawyer = msg.sender;
    }

    function deposit() public payable {
        require(msg.sender == payer, "Sender Must be the payer");
        require(address(this).balance <= amount);
    }

    function release() public {
        require(address(this).balance == amount, "cannot release fund");
        require(msg.sender == lawyer, "only lawyer can ");
        payee.transfer(amount);
    }

    function balanceOf() public view returns (uint) {
        return address(this).balance;
    }
}
