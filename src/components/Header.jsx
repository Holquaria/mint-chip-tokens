import React, { useState } from 'react';


const Header = ({connected, setConnected, walletAddress, setWalletAddress}) => {


  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new window.ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
        setConnected(true);
      } catch (error) {
        console.log(error);
        // Handle error connecting wallet
      }
    } else {
      // Handle case where Web3 provider is not available
    }
  };

  return (
    <header>
      {!connected ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <p>Connected: {walletAddress}</p>
      )}
    </header>
  );
};

export default Header;