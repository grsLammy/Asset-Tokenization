
import React, { Component } from "react";
import "./App.css";
import getWeb3 from "./getWeb3";
import HamichiToken from "./contracts/HamichiToken.json";
import HamichiTokenSale from "./contracts/HamichiTokenSale.json";
import KycContract from "./contracts/KycContract.json";


class App extends Component {
    state = { 
        loaded: false ,
        userTokens: "0",
		kycAddress: "0x0...",
        HamichiTokenSaleAddress: null
    };

	componentDidMount = async () => {
        try{
            // Get network provider and web3 instance.
            this.web3 = await getWeb3();

            // Use web3 to get the user's accounts
            this.accounts = await this.web3.eth.getAccounts()

            // Get networkID
            this.networkId = await this.web3.eth.net.getId()

            // Get Instance of HamichiToken Contract
            this.hamichiToken = new this.web3.eth.Contract(
                HamichiToken.abi, 
                HamichiToken.networks[this.networkId] && HamichiToken.networks[this.networkId].address,
            )
        
            //load HamichiTokenSale Contract
            this.hamichiTokenSale = new this.web3.eth.Contract(
                HamichiTokenSale.abi, 
                HamichiTokenSale.networks[this.networkId] && HamichiTokenSale.networks[this.networkId].address,
            )

            ///load KycContract Contract
            this.kycContract = new this.web3.eth.Contract(
                KycContract.abi, 
                KycContract.networks[this.networkId] && KycContract.networks[this.networkId].address,
            )

            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            this.listenToTokenTransfer()
            this.setState({loaded:true, HamichiTokenSaleAddress: HamichiTokenSale.networks[this.networkId].address}, this.updateUserTokens)

        } catch (error) {
            // Catch any errors for any of the above operations.
            alert("Failed to load web3, accounts, or contract. Check console for details.")
            console.error(error)
        }   
	}

    updateUserTokens = async () => {
        let userTokens = await this.hamichiToken.methods.balanceOf(this.accounts[0]).call();
        this.setState({userTokens: userTokens})
    }

    listenToTokenTransfer = () => {
        this.hamichiToken.events.Transfer({to: this.accounts[0]}).on("data", this.updateUserTokens)
    }

    buyTokens = async () => {
        await this.hamichiTokenSale.methods.buyTokens(this.accounts[0]).send({from: this.accounts[0], value: this.web3.utils.toWei("1","wei")})
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        this.setState({[name]:value})
    }
  
    handleKycWhitelisting = async () => {
        await this.kycContract.methods.setKycCompleted(this.state.kycAddress).send({from: this.accounts[0]});
        alert("KYC for "+this.state.kycAddress+" is completed");
      }

  render() { 
	  if(!this.state.loaded) {
        return <div>Loading Web3, accounts, and contract...</div>;
	  } 
        return (
            <div className="App">
                <h1>Hamichi Token Sale</h1>
                <p>Get your Tokens today!</p>
                <h2>KYC Whitelisting</h2>
                Address to allow: <input type="text" name="kycAddress" value={this.state.kycAddress} onChange = {this.handleInputChange} />
                <button type="button" onClick={this.handleKycWhitelisting}>Add to Whitelist</button>
                <h2>Buy Hamichi-Tokens</h2>
                <p>Send Ether to this address: {this.state.HamichiTokenSaleAddress}</p>
                <p>You currently have: {this.state.userTokens} HAMI Tokens</p>
                <button type="button" onClick={this.buyTokens}>Buy tokens NOW!</button>
            </div>
        )
    }
}

export default App;
