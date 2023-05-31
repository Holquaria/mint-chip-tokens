import { getPublicKeysFromScan, getSignatureFromScan } from 'pbt-chip-client/kong';
import { useState } from 'react';
import { ethers } from 'ethers';


const Scanner = () => {
  const [keys, setKeys] = useState(null);
  const [sig, setSig] = useState(null)
  const [blockNumber, setBlockNumber] = useState(0)
  const [blockhash, setBlockhash] = useState('')

  let provider = ethers.getDefaultProvider(`https://eth-goerli.g.alchemy.com/v2/u3dG3mJKRmi9yoxLdo341iSCdp-NeOC_`)
  
  async function callMintFunction() {
    console.log('minting...')
    let wallet = new ethers.Wallet("0x8a07d0f3b83102cbfff76c2b66adfeff3c7e37ebcd5d0c9fa54c0086cf810697", provider)
    
    const contractAddress = '0xd10820b5328364308Dd0Ec961c7A2a4E15938549';
    const abi = await getAbi()
    const contract = new ethers.Contract(contractAddress, abi, wallet);
  
  try {
    const result = await contract.mint(sig, blockNumber);
    console.log('Mint function called successfully:', result);
  } catch (error) {
    console.error('Error calling mint function:', error);
  }
  }

  async function getAbi() {
    try {
      const response = await fetch('../data/abi.json');
      const data = await response.json();
      console.log(data.abi)
      return data.abi;
    } catch (err) {
      console.log('error in fetching ABI:', err.message)
    }
  }

  return (
    <>
      <button disabled={!provider}
        onClick={() => {
          getPublicKeysFromScan().then((keys) => {
            setKeys(keys);
            return provider.getBlockNumber();
          }).then((blockNumberUsedInSig) => {
            console.log('setting block number', blockNumberUsedInSig)
            setBlockNumber(blockNumberUsedInSig)
            return provider.getBlock(blockNumberUsedInSig)
          }).then(block => block.hash)
            .then((blockhash) => {
            console.log('setting blockhash', blockhash)
            setBlockhash(blockhash)
          })
        }}
      >
        Click Me To Initiate Scan
      </button>
      {keys && <p>{keys.primaryPublicKeyRaw}</p>}
      <button
        onClick={() => {
          getSignatureFromScan({
            chipPublicKey: keys.primaryPublicKeyRaw,
            address: '0x5144c1D13a95Fb7A9714C53593B3957A75B79917',
            hash: blockhash,
          }).then((sig) => {
            console.log('setting sig', sig)
            setSig(sig);
          });
        }}
      >
        Click Me To Sign EOA+blockhash w/ Chip
      </button>
      <button disabled={!sig} onClick={() => {callMintFunction()}}>
        Mint Token
      </button>
    </>
  );
}

export default Scanner