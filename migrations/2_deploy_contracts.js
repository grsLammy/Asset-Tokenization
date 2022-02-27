var HamichiToken = artifacts.require("HamichiToken");
var HamichiTokenSale = artifacts.require("HamichiTokenSale")
var MyKycContract = artifacts.require("KycContract");
require("dotenv").config({path:"../.env"});
console.log(process.env);

module.exports = async function(deployer) {
  let address = await web3.eth.getAccounts();
  await deployer.deploy(HamichiToken, process.env.INITIAL_TOKENS);
  await deployer.deploy(MyKycContract);
  await deployer.deploy(HamichiTokenSale, 1, address[0], HamichiToken.address, MyKycContract.address);
  let instance = await HamichiToken.deployed();
  await instance.transfer(HamichiTokenSale.address, process.env.INITIAL_TOKENS);
};
