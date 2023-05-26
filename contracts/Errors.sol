// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

/**
 * @title Errors (Library)
 * @author Zeeshan Jan
 */

library Errors {
    // ascendance
    error StakingDisabled();
    error MinimumLockLimitNotMet();
    error MinimumStakingDurationNotMet();
    error RingLeaderMinimumFrozenDurationNotMet();
    error ParticipantMinimumFrozenDurationNotMet();
    error InvalidAlphaScore();
    error InvalidNoOfParticipants();
    error DuplicateParticipants();
    error RingleaderCannotBeAParticipant();
}
