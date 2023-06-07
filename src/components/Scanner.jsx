import {
  getPublicKeysFromScan,
  getSignatureFromScan,
} from "pbt-chip-client/kong";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../data/testAbi.json";
import ClaimGarment from "./ClaimGarment";
import MintedGarment from "./MintedGarment";

const Scanner = ({ provider, walletAddress }) => {
  const [keys, setKeys] = useState({});

  const [blockNumber, setBlockNumber] = useState(0);
  const [blockhash, setBlockhash] = useState("");

  const [chipAddress, setChipAddress] = useState("");
  const [tokenStatus, setTokenStatus] = useState('not minted')
  const [scanError, setScanError] = useState(false)

  console.log(tokenStatus)

  async function getChipStatus(chip) {
    try {
      let signer = new ethers.Wallet(
        process.env.REACT_APP_PRIVATE_KEY,
        provider
      );

      const contractAddress = "0xE0a50019b55225AF109880Bf524376c71b1da6d4";
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const result = await contract.tokenIdMappedFor(chip);
      console.log(result)

      const owner = await contract.ownerOf(result);
      if (owner === walletAddress) {
        console.log("you are the owner");
        setTokenStatus('owned by user')
      } else {
        console.log("send user to desktop site/prompt connect wallet");
        setTokenStatus('owned')
      }
    } catch (error) {
      setTokenStatus('not minted')
      console.error("Blockchain token not found:", error);
      console.log("token has not been minted, connect wallet to proceed");
    }
  }

  return (
    <>
      <button
        disabled={!provider}
        onClick={async () => {
          try {
            const keys = await getPublicKeysFromScan();
            setKeys(keys);
            const computedAddress = ethers.computeAddress("0x" + keys.primaryPublicKeyRaw);
            setChipAddress(computedAddress);
            getChipStatus(computedAddress);
            const blockNumberUsedInSig = await provider.getBlockNumber() - 1;
            setBlockNumber(blockNumberUsedInSig);
            const block = await provider.getBlock(blockNumberUsedInSig);
            const blockhash = block.hash;
            setBlockhash(blockhash);
          } catch (error) {
            console.log('Error getting public keys:', error);
            setScanError(true)
          }
        }}
      >
        Scan Garment
      </button>
      {keys && <p>Scan successful</p>}
      {keys && tokenStatus === 'not minted' 
        ? (
        <ClaimGarment keys={keys} blockhash={blockhash} walletAddress={walletAddress} blockNumber={blockNumber} provider={provider}/>
      ) : (
        <MintedGarment tokenStatus={tokenStatus} />
      )}


    </>
  );
};

export default Scanner;
