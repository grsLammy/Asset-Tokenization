const HamichiToken = artifacts.require("HamichiToken");
const HamichiTokenSale = artifacts.require("HamichiTokenSale");
const KycContract = artifacts.require("KycContract");

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

require("dotenv").config({path:"../.env"});

contract("TokenSale Test", async (accounts) => {

    const [deployerAccount, recipient, anotherAccount] = accounts;

    it('should not have any tokens in my deployerAccount', async () => {
        let instance = await HamichiToken.deployed();
        return await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
    })

    it("all tokens should be in the HamichiTokenSale smart contract by default", async () => {
        let instance = await HamichiToken.deployed();
        let balanceOfHamichiTokenSale = await instance.balanceOf(HamichiTokenSale.address);
        let totalSupply = await instance.totalSupply();
        return await expect(balanceOfHamichiTokenSale).to.be.a.bignumber.equal(totalSupply);
    })

    it("should be possible to buy tokens", async () => {
        let HamichiTokenInstance= await HamichiToken.deployed();
        let HamichiTokenSaleInstance = await HamichiTokenSale.deployed();
        let KycContractInstance = await KycContract.deployed();
        await KycContractInstance.setKycCompleted(deployerAccount,{from: deployerAccount});
        let balanceBefore = await HamichiTokenInstance.balanceOf(deployerAccount);
        await expect(HamichiTokenSaleInstance.sendTransaction({from: deployerAccount, value: web3.utils.toWei("1","wei")})).to.be.fulfilled;
        let balanceAfter = balanceBefore.add(new BN(1));
        return await expect(HamichiTokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceAfter);
    })

})