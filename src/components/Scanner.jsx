import { getPublicKeysFromScan, getSignatureFromScan } from 'pbt-chip-client/kong';
import { useState } from 'react';
import { ethers } from 'ethers';
import abi from '../data/testAbi.json'


const Scanner = () => {
  const [keys, setKeys] = useState(null);
  const [sig, setSig] = useState(null)
  const [blockNumber, setBlockNumber] = useState(0)
  const [blockhash, setBlockhash] = useState('')
  const [mintStatus, setMintStatus] = useState('')

  let provider = ethers.getDefaultProvider(`https://eth-goerli.g.alchemy.com/v2/u3dG3mJKRmi9yoxLdo341iSCdp-NeOC_`)
  
  async function callMintFunction() {
    console.log('minting...')
    console.log('sig:', sig)
    console.log('blockNumber:', blockNumber)
    let wallet = new ethers.Wallet("0x8a07d0f3b83102cbfff76c2b66adfeff3c7e37ebcd5d0c9fa54c0086cf810697", provider)
    
    const contractAddress = '0xE0a50019b55225AF109880Bf524376c71b1da6d4';
    const contract = new ethers.Contract(contractAddress, abi, wallet);
  
  try {
    const result = await contract.mint(sig, blockNumber);
    console.log('Mint function called successfully:', result);
    setMintStatus('Success! :)')
    
  } catch (error) {
    console.error('Error calling mint function:', error);
    setMintStatus('Failure :(')
  }
  }

  return (
    <>
      <button disabled={!provider}
        onClick={() => {
          getPublicKeysFromScan().then(async (keys) => {
            setKeys(keys);
            return await provider.getBlockNumber() - 1
          }).then(async (blockNumberUsedInSig) => {

            console.log('setting block number', blockNumberUsedInSig)
            setBlockNumber(blockNumberUsedInSig)
            return await provider.getBlock(blockNumberUsedInSig)
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
      {mintStatus && <p>{mintStatus}</p>}
    </>
  );
}

export default Scanner