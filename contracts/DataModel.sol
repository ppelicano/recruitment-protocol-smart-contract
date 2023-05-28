// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title FrontDoorStructs (Library)
 * @author Zeeshan Jan
 */

library FrontDoorStructs {
    struct CompanyScore{
        uint256 score; //score given to the company
        address senderAddress; //address of the candidate
    }

    struct Candidate {
        address wallet;
        string email;
        uint256 score;
    }

     struct Referrer{
        address wallet;
        string email;
        uint256 score;
    }

    struct Referee{
        address wallet;
        string email;
        bytes32 emailHash;
        uint256 score;
    }

    struct Job {
        uint256 id;
        uint256 bounty;
        uint256 maxSalary;
        uint256 minSalary;
        string companyName;
        string location;
        string role;
        string webURL;
    }

    struct Referral{
        uint256 id;
        bool confirmed;
        Referrer referrer;
        Referee referee;
        Job job;
    }
}