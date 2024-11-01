// SPDX-License-Identifier: GPL-2.0-or-later

pragma solidity >=0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';


contract Token is ERC20 {
    constructor() ERC20("TESTING", "T") {}

    function mint(address _to, uint256 amount) public {
        _mint(_to,amount);
    }
}
