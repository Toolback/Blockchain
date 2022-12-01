// SPDX-License-Identifier: MIT
 
pragma solidity ^0.8.10;

contract CampaignFactory {
    kickstarter[] public deployedCampaigns;

    function createCampaign(uint _minimumContribution, string memory _campaignDescription) public {
        kickstarter newCampaign = new kickstarter(_minimumContribution, msg.sender, _campaignDescription);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (kickstarter[] memory) {
        return deployedCampaigns;
    }
}

contract kickstarter {

    // VARIABLES 

    address public manager;
    uint public minimumContribution;
    string public campaignDescription;
    uint public numRequests;
    uint public voicesCount;
    mapping(address => bool) public contributor;
    mapping(address => uint) participationVoices;
    mapping(address => uint) public balanceOfContributor;
    mapping(uint256 => Request) public requests;

    // TEMPLATE OF REQUEST CREATED BY MANAGER
    
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        uint disapprovalCount;

    }

    // MODIFIERS

    modifier owner {
        require(msg.sender == manager, 
        "Only Manager can user this action");
        _;
    }

    // INIT

    constructor (uint _minimumContribution, address _creator, string memory _campaignDescription) {
        manager = _creator;
        minimumContribution = _minimumContribution;
        campaignDescription = _campaignDescription;
    }

    // CONTRIBUTE BY FUNDING A CAMPAIGN - USERS'S ETH GOES TO ADDRESS.THIS

    function contribute () public payable {
        require(
            msg.value >= minimumContribution,
        "A minimum contribution is required"
        );
        balanceOfContributor[msg.sender] += msg.value;
        participationVoices[msg.sender]++;
        voicesCount++;

        contributor[msg.sender] = true;

    }

    // CREATE A NEW SPENDING REQUEST BY MANAGER

    function createRequest (string memory _description, uint _value, address payable _recipient) public owner {
        Request storage r = requests[numRequests++];
            r.description = _description;
            r.value = _value;
            r.recipient = _recipient;
            r.complete = false;
            r.approvalCount = 0;
            r.disapprovalCount =0;
    }

    // USER VOTE TO APPROVE A SPENDING REQUEST 

    function approveRequest (uint _index) public {
        require(contributor[msg.sender],
        "Only Contributors may approve a specific request from Manager.");
        Request storage request = requests[_index];
        require(participationVoices[msg.sender] >= 1,
        "You need more contribution to vote !");
        participationVoices[msg.sender]--;
        request.approvalCount++;
        voicesCount--;
    }

        // USER VOTE TO DISAPPROVE A SPENDING REQUEST 

    function disapproveRequest (uint _index) public {
        require(contributor[msg.sender],
        "Only Contributors may disapprove a specific request from Manager.");
        Request storage request = requests[_index];
        require(participationVoices[msg.sender] >= 1, 
        "You need more contribution to vote !");
        participationVoices[msg.sender]--;
        request.disapprovalCount++;
        voicesCount--;
    }

    // ALLOW MANAGER TO SPEND REQUESTED AMOUNT IF ENOUGHT USERS VOTED YES

    function finalizeRequest(uint _index) public owner {
        Request storage request = requests[_index];

        require(request.approvalCount > (voicesCount/3),
        "You need more votes to finalize your request !");
        require(request.approvalCount > request.disapprovalCount,
        "You need more approvals before finalize your request.");

        require(!request.complete, 
        "This request has already been finalized");

        payable(request.recipient).transfer(request.value);

        request.complete = true;

    }

    function getResume() public view returns (string memory, uint, uint, uint, uint, address) {
        return (
            campaignDescription,
            minimumContribution,
            address(this).balance,
            numRequests,
            voicesCount,
            manager
        );
    }

    function getAllRequests() public view returns (uint) {
        return numRequests;
    }



}