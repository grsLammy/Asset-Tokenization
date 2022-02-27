// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract HamichiToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Hamichi Token", "Hami") {
        _mint(msg.sender, initialSupply);
    }
}
