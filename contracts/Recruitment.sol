// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Recruitment {
  event DepositCompleted(address indexed sender, uint256 amount);
  address owner;
  mapping(bytes32 => address) public whitelistedTokens;
  mapping(bytes32 => uint8) public whitelistedTokenDecimals;
  mapping(address => mapping(bytes32 => uint256)) public accountBalances;
  mapping(address => uint8[3][]) public accountMonthlyRefundPcts;
  mapping(address => uint8[]) public accountCompleteDeposits;
  mapping(address => uint)public balances;
  uint256 initialAmountUSD = 1000;
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

  function getAccountCompleteDeposits() external view returns(uint8[] memory) {
    return accountCompleteDeposits[msg.sender];
  }

  function getAccountMonthlyRefundPcts() external view returns(uint8[2][] memory) {
    return accountMonthlyRefundPcts[msg.sender];
  }

  function setInitialDeposit(
    bytes32 symbol
    ,uint8 month1RefundPct
    ,uint8 month2RefundPct
    ,uint8 month3RefundPct
  ) external {
    uint256 amount = initialAmountUSD*10**whitelistedTokenDecimals[symbol];
    require(ERC20(whitelistedTokens[symbol]).allowance(msg.sender, address(this)) >= amount, "Allowance of 1000 USD needed!");
    accountBalances[msg.sender][symbol] += amount;
    ERC20(whitelistedTokens[symbol]).transferFrom(msg.sender, address(this), amount);
    accountMonthlyRefundPcts[msg.sender].push([month1RefundPct, month2RefundPct, month3RefundPct]);
    emit DepositCompleted(msg.sender, amount);
  }

  function setFinalDeposit(
    bytes32 symbol,
    uint256 amount,
    uint8 index
  ) external {
    require(ERC20(whitelistedTokens[symbol]).allowance(msg.sender, address(this)) >= amount, "Allowance does reach amount to be treansferred!");
    require(accountMonthlyRefundPcts[msg.sender].length > index, "Initial deposit index does not match!");
    accountBalances[msg.sender][symbol] += amount;
    ERC20(whitelistedTokens[symbol]).transferFrom(msg.sender, address(this), amount);
    accountCompleteDeposits[msg.sender].push(index);
    emit DepositCompleted(msg.sender, amount);
  }

  
  function withdrawTokens(bytes32 symbol, uint256 amount) external {
    // to be continued...
    require(msg.sender == owner, 'Only owner can withdraw!');
    require(ERC20(whitelistedTokens[symbol]).balanceOf(msg.sender) > amount, 'Not enough balances!');
    accountBalances[msg.sender][symbol] -= amount;
    ERC20(whitelistedTokens[symbol]).transfer(msg.sender, amount);
  }
}