// SPDX-License-Identifier: MIT
 
pragma solidity ^0.8.9;

contract Lottery {
    address public manager; // store manager address
    address[] public players; // array for players whos payed

    constructor () {
        manager = msg.sender; // Manager pushed on contract deployment
    }

    function enter() public payable {  // Enter the lottery (array) and pay fees
        require(msg.value> .001 ether);
        players.push(msg.sender);

    }

    function random() private view returns (uint) { // Pick a random number
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }

    function pickWinner() public restricted {
        require(msg.sender == manager);
        uint index = random() %players.length;
        payable(players[index]).transfer(address(this).balance);
        players = new address[](0);
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function getPlayers() public view returns(address[] memory){
        return players;

    }
    
}