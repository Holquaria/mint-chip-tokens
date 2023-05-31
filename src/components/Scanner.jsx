import { getPublicKeysFromScan, getSignatureFromScan } from 'pbt-chip-client/kong';
import { useState } from 'react';
import { ethers } from 'ethers';


const Scanner = () => {
  const [keys, setKeys] = useState(null);
  const [sig, setSig] = useState(null)
  const [blockNumber, setBlockNumber] = useState(0)
  const [blockhash, setBlockhash] = useState('')

  console.log(keys?.primaryPublicKeyRaw)

  return (
    <>
      <button
        onClick={() => {
          getPublicKeysFromScan().then((keys) => {
            setKeys(keys);
            return ethers.provider.getBlockNumber() - 1;
          }).then((blockNumberUsedInSig) => {
            console.log('setting block number', blockNumberUsedInSig)
            setBlockNumber(blockNumberUsedInSig)
            return ethers.provider.getBlock(blockNumberUsedInSig).then(block => block.hash);
          }).then((blockhash) => {
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
    </>
  );
}

export default Scanner