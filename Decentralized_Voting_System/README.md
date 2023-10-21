# Decentralized Voting System

## Overview

This is a Solidity smart contract that implements an decentralized voting system on the Ethereum blockchain. 

## Features
- Owner can add candidates and voters before Voting has started
- Owner can start election
- Once Voter has started election, registered voters can vote
- Owner can end election and then the public can see the results
- Owner cannot add voters or candidate once the voting has started

## Smart Contract Functions

### Election Functions:
- startElection: (owner only) Starts Voting
- endElection: (owner only) Ends Voting
- getWinner: (public) Get Winner Address

### Voter Functions:
- addVoter(voter_address): (only owner) Add Voter
- vote(candidate_address): (only registered voter) Vote for the candidate_address

### Candidate Functions
- addCandidate(candidate_address): (only owner) Add Candidate
- getCandidateLength(): (public) Returns Length of Candidate

