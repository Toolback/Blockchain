// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// Here we return a bool to check the possible errors of the second contract call function (low level call bypass security check as arguments)
contract A is ReentrancyGuard {
    bytes public returnValue;

    function sendEth(address contractB) external payable nonReentrant returns(bool) 
    {
        // (bool sent, bytes memory data) = contractB.call{value: 1 wei}("");
        (bool sent, ) = contractB.call{value: 1 wei}("");
        return sent;
    }

    function callFunction(address contractB) external payable returns (bool)
    {
        (bool sent, bytes memory data) = contractB.call{value: 1 ether, gas: 30000}(
            abi.encodeWithSignature("incrementNumber(uint256)", 10));
        returnValue = data;
        require(sent);
        return sent;
    }
} 

contract B
{
    uint public number = 1;

    function getBalance() external view returns (uint)
    {
        return address(this).balance;
    }

    receive() external payable
    {
        console.log("receive function was called");
    } 

    fallback() external payable 
    {
        console.log("fallback function was call");
    }

    function incrementNumber(uint by) external payable returns (string memory)
    {
        number += by;
        return "succeed increment";
    }
}