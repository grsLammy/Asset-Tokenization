// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;
import './CrowdSale.sol';
<<<<<<< HEAD

contract HamichiTokenSale is Crowdsale {
    constructor(uint256 rate, address payable wallet, IERC20 token)
    Crowdsale(rate, wallet, token) public {

=======
import './KycContract.sol';

contract HamichiTokenSale is Crowdsale {

    KycContract kyc;
    constructor(uint256 rate, address payable wallet, IERC20 token, KycContract _kyc)
    Crowdsale(rate, wallet, token) public {
        kyc = _kyc; 
    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view override {
        super._preValidatePurchase(beneficiary, weiAmount);
        require(kyc.kycCompleted(msg.sender),"KYC not completed purchase not allowed");
>>>>>>> dev
    }
}