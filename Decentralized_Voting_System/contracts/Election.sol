// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Election{

    struct Candidate{
        string name;
        bool registered;
        uint voteCount;
    }

    struct Voter{
        bool voted;
        bool registered;
    }

    address[] public candidateAddress;
    address public owner;
    string public electionName;

    mapping (address => Voter) private voters;
    mapping (address => Candidate) private candidates;
    uint public totalVotes;

    enum State{
        Created,
        Voting,
        Ended,
        WinnerAnnounced
    }

    State public state;

    modifier onlyOwner(){
        require(msg.sender == owner, "You are not the owner.");
        _;
    }

    modifier inState(State _state){
        require(state == _state, "Wrong State.");
        _;
    }

    constructor(string memory _electionName){
        owner = msg.sender;
        electionName = _electionName;
        state = State.Created;
    }

    /** 
      * Candidate Functions
      * addCandidate
      * getCandidateLength
      **/
    function addCandidate(address _candidateAddress, string memory _candidateName) onlyOwner inState(State.Created) public{
        candidates[_candidateAddress].name = _candidateName;
        candidates[_candidateAddress].voteCount = 0;
        candidates[_candidateAddress].registered = true;
        candidateAddress.push(_candidateAddress);
    }

    function getCandidateLength() view public returns (uint){
        return candidateAddress.length;
    }



    /**
      * Voter Functions:
      * 1. addVoter
      * 2. vote
      **/
    function addVoter(address _voterAddress) onlyOwner inState(State.Created) onlyOwner inState(State.Created) public{
        require(!voters[_voterAddress].registered, "Voter is already registered.");
        require(_voterAddress != owner, "Owner Cannot be registered as voter.");
        voters[_voterAddress].registered = true;
    }

    function vote(address _candidateAddress) inState(State.Voting) public {
        require(voters[msg.sender].registered, "Voter is not registered.");
        require(!voters[msg.sender].voted, "Voter has already Voted.");
        require(candidates[_candidateAddress].registered, "Candidate is not registered.");
        candidates[_candidateAddress].voteCount++;
        voters[msg.sender].voted = true;
        totalVotes++;
    }

    /**
      * Election Functions:
      * startElection
      * endElection
      * getWinner
      **/
    
    function startElection() onlyOwner inState(State.Created) public{
        state = State.Voting;
    }

    function endElection() onlyOwner inState(State.Voting) public{
        state = State.Ended;
    }

    function getWinner() inState(State.Ended) view public returns (address){
        uint max = 0;
        uint i=0;
        address winnerAddress;
        for(i=0; i<candidateAddress.length; i++){
            if(candidates[candidateAddress[i]].voteCount > max){
                max = candidates[candidateAddress[i]].voteCount;
                winnerAddress = candidateAddress[i]; 
            }
        }
        return winnerAddress;
    }
    

}