import "./App.css";
import Web3 from "web3";
import React, { Component } from "react";
import HamichiToken from "./contracts/HamichiToken.json";
import HamichiTokenSale from "./contracts/HamichiTokenSale.json";
import KycContract from "./contracts/KycContract.json";


class App extends Component {

	async UNSAFE_componentWillMount() {
		await this.loadWeb3()
		await this.loadBlockchainData()
	}

	constructor(props) {
		super(props) 
		this.state = {
            hamichiTokenInstance: {},
            hamichiTokenSaleInstance: {},
            kycContractInstance: {},
            customerAccount: '0x0',
            kycAddress: "0x0",
			loading: true
		}
	}

	async loadWeb3() {
		if(window.ethereuem) {
			window.web3 = new Web3(window.ethereuem)
			try{
				await window.web3.enable()
			} catch(error) {
				window.alert('User account access denied by the user.')
			}
		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider)
		} else {
			window.alert('Opps! It seems like Ehereuem browser was nowhere to be found. You can check out MetaMask!')
		}
	}

	async loadBlockchainData() {
		const web3 = window.web3 
        const customerAccount = await web3.eth.requestAccounts()
		this.setState({customerAccount: customerAccount[0]})
		const networkId = await web3.eth.net.getId()

		//load HamichiToken Contract
		const hamichiTokenData = HamichiToken.networks[networkId]
		if(hamichiTokenData) {
			const hamichiTokenInstance = new web3.eth.Contract(HamichiToken.abi, hamichiTokenData.address)
      this.setState({hamichiTokenInstance: hamichiTokenInstance})
		} else {
			window.alert('Tether not deployed to the network')
		}

		//load HamichiTokenSale Contract
		const hamichiTokenSaleData = HamichiTokenSale.networks[networkId]
		if(hamichiTokenSaleData) {
			const hamichiTokenSaleInstance = new web3.eth.Contract(HamichiTokenSale.abi, hamichiTokenSaleData.address)
      this.setState({hamichiTokenSaleInstance: hamichiTokenSaleInstance})
		} else {
			window.alert('Tether not deployed to the network')
		}

		///load KycContract Contract
		const KYCData = KycContract.networks[networkId]
		if(KYCData) {
			const kycContractInstance = new web3.eth.Contract(KycContract.abi, KYCData.address)
      this.setState({kycContractInstance: kycContractInstance})
		} else {
			window.alert('Tether not deployed to the network')
		}
  
    this.setState({loading:false})
	}

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        this.setState({[name]:value})
    }
  
    handleKycWhitelisting = () => {
        this.setState({loading: true})
        this.state.kycContractInstance.methods.setKycCompleted(this.state.kycAddress).send({from: this.state.customerAccount}).on('transactionHash', (hash) => {
            this.setState({loading: false})
            alert("KYC for "+this.state.kycAddress+" is completed.");
        })
    }

  render() {
      let content 
	  if(this.state.loading == true) {
        content = <p id='loader' className='text-center' style={{margin:'30', color:'white'}}>
	    LOADING PLEASE...</p>
	  } 
        return (
            <div className="App">
                <h1>Hamichi Token Sale</h1>
                <p>Get your Tokens today!</p>
                <h2>KYC Whitelisting</h2>
                Address to allow: <input type="text" name="kycAddress" value={this.state.kycAddress} onChange = {this.handleInputChange} />
                <button type="button" onClick={this.handleKycWhitelisting}>Add to Whitelist</button>
            </div>
        )
    }
}

export default App;
