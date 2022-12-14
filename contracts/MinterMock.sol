// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MinterMock is ERC20 {
  constructor() ERC20('DAI', 'DAI Mock') {
    _mint(msg.sender, 1000000*10**18);
  }
}