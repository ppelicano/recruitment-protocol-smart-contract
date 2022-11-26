// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Recruitment {
  event InitialDepositCompleted(address indexed sender, uint256 amount);
  address owner;
  mapping(bytes32 => address) public whitelistedTokens;
  mapping(bytes32 => uint8) public whitelistedTokenDecimals;
  mapping(address => mapping(bytes32 => uint256)) public accountBalances;
  mapping(address => uint)public balances;

  constructor() {
    owner = msg.sender;
  }

  function whitelistToken(bytes32 symbol, address tokenAddress, uint8 decimals) external {
    require(msg.sender == owner, 'This function is not public');
    whitelistedTokenDecimals[symbol] = decimals;
    whitelistedTokens[symbol] = tokenAddress;
  }

  function getWhitelistedTokenAddresses(bytes32 token) external view returns(address) {
    return whitelistedTokens[token];
  }

  function getWhitelistedTokenDecimals(bytes32 token) external view returns(uint8) {
    return whitelistedTokenDecimals[token];
  }

  function initialDeposit(uint256 amount, bytes32 symbol) external {
    require(amount == 1000*10**whitelistedTokenDecimals[symbol] ,"Amount should be equal to 1000 USD");
    require(ERC20(whitelistedTokens[symbol]).allowance(msg.sender, address(this)) >= amount, "Error no allowance");
    accountBalances[msg.sender][symbol] += amount;
    ERC20(whitelistedTokens[symbol]).transferFrom(msg.sender, address(this), amount);
    emit InitialDepositCompleted(msg.sender, amount);
  }

  function withdrawTokens(uint256 amount, bytes32 symbol) external {
    require(accountBalances[msg.sender][symbol] >= amount, 'Insufficent funds');
    accountBalances[msg.sender][symbol] -= amount;
    ERC20(whitelistedTokens[symbol]).transfer(msg.sender, amount);
  }
}