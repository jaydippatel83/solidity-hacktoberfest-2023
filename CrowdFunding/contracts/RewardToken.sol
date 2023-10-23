// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardToken is ERC20, Ownable {
    address public contractAddress;

    constructor(address initialOwner)
        ERC20("RewardToken", "RTK")
        Ownable(initialOwner)
    {}

    function setPriviledgeAccount (address _contractAddress) onlyOwner public{
        contractAddress = _contractAddress;
    }

    function mint(address to, uint256 amount) public {
        require (msg.sender == contractAddress || msg.sender == owner(), "You cannot mint reward tokens");        
        _mint(to, amount);
    }
}
