// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract PoetryWall {


    uint256 totalPoems;
    address public manager;
    mapping(address => Lines) public poetsSociety;

    struct Lines {
        string author;
        string title;
        string text;
    }

    
    constructor() {
        manager = msg.sender; // Manager pushed on contract deployment 
    }



    function poem() public { // Write poem
        totalPoems += 1;
    }

    function addPoem(string memory _author, string memory _title, string memory _text) public {
        poetsSociety[msg.sender] = Lines(_author, _title, _text);
    }


    function getTotalPoems() public view returns (uint) { // Return total poems
        return totalPoems;
    }

    // function getTotalPoets() public view returns (uint) { // Return total poets
    //     console.log("We have %d Poet's Souls onboard", poetsSociety.length);
    //     return poetsSociety.length;
    // }

    // function random() private view returns (uint) { // Pick random number
    //     return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, poets)));
    // }

    // function pickWinner () public restricted { // Manager only : pick a winner, and restart Poets array
    //     require(msg.sender == manager);
    //     uint index = random() %poets.length;
    //     payable(poets[index]).transfer(address(this).balance);
    //     poets = new address[](0);

    // }

    // modifier restricted() {
    //     require(msg.sender == manager);
    //     _;
    // }
}