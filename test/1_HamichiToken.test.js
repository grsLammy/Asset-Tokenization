const HamichiToken = artifacts.require("HamichiToken");

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

require("dotenv").config({path:"../.env"});

beforeEach(async () => {
    this.HamichiToken = await HamichiToken.new(process.env.INITIAL_TOKENS);
})

contract("Token Test", async (accounts) => {

    const [deployerAccount, recipient, anotherAccount] = accounts;

    it("all tokens should be in my account", async () => {
        let instance = this.HamichiToken;
        let totalSupply = await instance.totalSupply();
        return await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
    })

    it("it is possible to send tokens between accounts", async () => {
        const sendTokens = 1;
        let instance = this.HamichiToken;
        let totalSupply = await instance.totalSupply();

        await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
        await expect(instance.transfer(recipient,sendTokens)).to.eventually.be.fulfilled;
        await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN (sendTokens)));
        return await expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(sendTokens));
    })

    it("it is not possible to send more tokens than avaliable in total", async () => {
        let instance = this.HamichiToken;
        let balanceOfDeployer = instance.balanceOf(deployerAccount);
        let totalSupply = await instance.totalSupply();

        await expect(instance.transfer(recipient, new BN (balanceOfDeployer+1))).to.eventually.be.rejected;
        return await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
    })
})