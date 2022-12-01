pragma solidity ^0.8.9;

contract Proxy {
    uint public num = 1;
    address public owner;
    address public logicContract;

    constructor(address _logicContract) {
        owner = msg.sender;
        logicContract = _logicContract;
    }

    modifier onlyOwner() 
    {
        require (msg.sender == owner, "Not Owner");
        _;
    }

    function setNumber(uint _num) external payable returns (bool) 
    {
        (bool status,) = logicContract.delegatecall(abi.encodeWithSignature("setNumber(uint256", _num));
        return (status);
    }

    function upgrade(address _newLogic) external onlyOwner
    {
        logicContract = _newLogic;
    }
}

contract LogicV1 {
    uint public num = 1;

    function setNumber(uint _num) external 
    {
        num = _num;
    }
}

contract LogicV2 {
    uint public num = 1;

    function setNumber(uint _num) external 
    {
        num = _num * 2;
    }
}