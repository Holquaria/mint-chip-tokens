import { getPublicKeysFromScan, getSignatureFromScan } from 'pbt-chip-client/kong';
import { useState } from 'react';
import { ethers } from 'ethers';
import abi from '../data/testAbi.json'
import 'dotenv/config'; 

const Scanner = ({provider, walletAddress}) => {
  const [keys, setKeys] = useState(null);
  const [sig, setSig] = useState(null)
  const [blockNumber, setBlockNumber] = useState(0)
  const [blockhash, setBlockhash] = useState('')
  const [mintStatus, setMintStatus] = useState('')
  const [chipAddress, setChipAddress] = useState('')
  const [chipTokenId, setChipTokenId] = useState(0)

  console.log('secret:', process.env.PRIVATE_KEY)

  async function getChipStatus() {
    let signer = new ethers.Wallet(walletAddress, provider)

    setChipAddress(ethers.computeAddress("0x" + keys["primaryPublicKeyRaw"]))
    
    const contractAddress = '0xE0a50019b55225AF109880Bf524376c71b1da6d4';
    const contract = new ethers.Contract(process.env.PRIVATE_KEY, abi, signer);
  
    try {
      const result = await contract.tokenIsMappedFor(chipAddress)
      setChipTokenId(result)
      
      const owner = await contract.ownerOf(chipTokenId)
      if (owner === chipAddress) {
        console.log('you are the owner')
      } else {
        console.log('send user to desktop site/prompt connect wallet')
      }
      
    } catch (error) {
      console.error('Blockchain token not found:', error);
      console.log('token has not been minted, connect wallet to proceed')
    }
  }
  
  async function callMintFunction() {
    console.log('minting...')
    console.log('sig:', sig)
    console.log('blockNumber:', blockNumber)
    let signer = new ethers.Wallet(walletAddress, provider)
    
    const contractAddress = '0xE0a50019b55225AF109880Bf524376c71b1da6d4';
    const contract = new ethers.Contract(contractAddress, abi, signer);
  
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
          }).then(() => {
            getChipStatus()
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