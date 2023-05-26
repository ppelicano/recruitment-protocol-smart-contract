// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title FrontDoorStructs (Library)
 * @author Zeeshan Jan
 */

library FrontDoorStructs {
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
        Referrer referrer;
        Referee referee;
        Job job;
    }
}