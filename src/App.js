import logo from './logo.svg';
import './App.css';
import Scanner from './components/Scanner';
import { useState } from 'react';
import { ethers } from 'ethers';
import Header from './components/Header';

function App() {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  let provider = ethers.getDefaultProvider(`https://eth-goerli.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_KEY}`)

  



  return (
    <div className='App'>
      <Header provider={provider} connected={connected} setConnected={setConnected} walletAddress={walletAddress} setWalletAddress={setWalletAddress} />
      <Scanner provider={provider} walletAddress={walletAddress} />
    </div>
  );
}

export default App;
