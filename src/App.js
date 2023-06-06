import logo from './logo.svg';
import './App.css';
import Scanner from './components/Scanner';
import { useState } from 'react';
import { ethers } from 'ethers';
import Header from './components/Header';

function App() {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  let provider = ethers.getDefaultProvider(`https://eth-goerli.g.alchemy.com/v2/u3dG3mJKRmi9yoxLdo341iSCdp-NeOC_`)

  



  return (
    <>
      <Header provider={provider} connected={connected} setConnected={setConnected} walletAddress={walletAddress} setWalletAddress={setWalletAddress} />
      <Scanner provider={provider} walletAddress={walletAddress} />
    </>
  );
}

export default App;
