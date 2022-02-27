// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;
import './CrowdSale.sol';

contract HamichiTokenSale is Crowdsale {
    constructor(uint256 rate, address payable wallet, IERC20 token)
    Crowdsale(rate, wallet, token) public {

    }
}