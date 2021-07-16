import React, { Component } from 'react'
// import logo from '../logo.png';
import Web3 from 'web3'
// import './App.css';
import Token from '../abis/Token.json'
import EthSwap from '../abis/EthSwap.json'
import Navbar from './navbar'
import Main from './Main'

class App extends Component {

  // Mounting these functions before page renders
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3

    // Load user account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0]})

    // Load ETH balance
    const ethBalance = await web3.eth.getBalance(this.state.account)
    this.setState({ethBalance})

    // Load Token contract
    const networkId = await web3.eth.net.getId()
    const tokenData = Token.networks[networkId]
    if(tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address)
      this.setState({token})
      // ... And Token balance
      let tokenBalance = await token.methods.balanceOf(this.state.account).call()
      this.setState({tokenBalance: tokenBalance.toString() })
    }
    else {
      window.alert('Token contract not detected on current Network!')
    }
    
    // Load EthSwap contract
    const ethSwapData = EthSwap.networks[networkId]
    if(ethSwapData) {
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address)
      this.setState({ethSwap})
    }
    else {
      window.alert('EthSwap contract not detected on current Network!')
    }
    this.setState({loading: false})
  }

  // Prompt MetaMask
  async loadWeb3() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        await window.ethereum.enable()
      }
      else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
      }
      else {
        window.alert('Non-Ethereum browser detected. You should consider installing MetaMask!')
      }
  }

  // Set default states in React before page loads
  constructor(props){
    super(props)
    this.state = {
      account: '',
      token: {},
      ethSwap: {},
      tokenBalance: 0,
      ethBalance: 0,
      loading: true
    }
  }

  render() {
    let content
    if(this.state.loading) {
      content = <p id="loader" className='text-center'>Loading...</p>
    } else {
      content = <Main />
    }

    return (
      <div>
        <Navbar account = {this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
