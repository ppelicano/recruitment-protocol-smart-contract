pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Recruitment {
  event InitialDepositCompleted(address indexed sender, uint256 amount);
  address owner;
  mapping(bytes32 => address) public whitelistedTokens;
  mapping(address => mapping(bytes32 => uint256)) public accountBalances;
  mapping(address => uint)public balances;

  constructor() {
    owner = msg.sender;
  }

  function whitelistToken(bytes32 symbol, address tokenAddress) external {
    require(msg.sender == owner, 'This function is not public');
    whitelistedTokens[symbol] = tokenAddress;
  }

  function getWhitelistedTokenAddresses(bytes32 token) external view returns(address) {
    return whitelistedTokens[token];
  }

  function initialDeposit(bytes32 symbol) external payable {
    require(msg.value == 1000,"Amount should be equal to 1 Ether");
    accountBalances[msg.sender][symbol] += msg.value;
    ERC20(whitelistedTokens[symbol]).transferFrom(msg.sender, address(this), msg.value);
    emit InitialDepositCompleted(msg.sender, msg.value);
  }

  function withdrawTokens(uint256 amount, bytes32 symbol) external {
    require(accountBalances[msg.sender][symbol] >= amount, 'Insufficent funds');
    accountBalances[msg.sender][symbol] -= amount;
    ERC20(whitelistedTokens[symbol]).transfer(msg.sender, amount);
  }
}