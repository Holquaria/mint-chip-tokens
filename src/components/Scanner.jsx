import {
  getPublicKeysFromScan,
  getSignatureFromScan,
} from "pbt-chip-client/kong";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../data/testAbi.json";

const Scanner = ({ provider, walletAddress }) => {
  const [keys, setKeys] = useState(null);
  const [sig, setSig] = useState(null);
  const [blockNumber, setBlockNumber] = useState(0);
  const [blockhash, setBlockhash] = useState("");
  const [mintStatus, setMintStatus] = useState("");
  const [chipAddress, setChipAddress] = useState("");
  const [chipTokenId, setChipTokenId] = useState(0);

  async function getChipStatus() {
    try {
      let signer = new ethers.Wallet(
        process.env.REACT_APP_PRIVATE_KEY,
        provider
      );

      console.log("chipAddress:", chipAddress);

      const contractAddress = "0xE0a50019b55225AF109880Bf524376c71b1da6d4";
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const result = await contract.tokenIdMappedFor(chipAddress);
      console.log(result)
      setChipTokenId(result);

      const owner = await contract.ownerOf(result);
      if (owner === chipAddress) {
        console.log("you are the owner");
      } else {
        console.log("send user to desktop site/prompt connect wallet");
      }
    } catch (error) {
      console.error("Blockchain token not found:", error);
      console.log("token has not been minted, connect wallet to proceed");
    }
  }

  async function callMintFunction() {
    console.log("minting...");
    console.log("sig:", sig);
    console.log("blockNumber:", blockNumber);
    let signer = new ethers.Wallet(walletAddress, provider);

    const contractAddress = "0xE0a50019b55225AF109880Bf524376c71b1da6d4";
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const result = await contract.mint(sig, blockNumber);
      console.log("Mint function called successfully:", result);
      setMintStatus("Success! :)");
    } catch (error) {
      console.error("Error calling mint function:", error);
      setMintStatus("Failure :(");
    }
  }

  useEffect(() => {
    getChipStatus();
  }, [chipAddress]);

  return (
    <>
      <button
        disabled={!provider}
        onClick={async () => {
          try {
            const keys = await getPublicKeysFromScan();
            setKeys(keys);
            const computedAddress = ethers.computeAddress("0x" + keys.primaryPublicKeyRaw);
            console.log('computedAddress:', computedAddress);
            setChipAddress(computedAddress);
            console.log('chipAddress:', chipAddress);
            const blockNumberUsedInSig = await provider.getBlockNumber() - 1;
            console.log('setting block number', blockNumberUsedInSig);
            setBlockNumber(blockNumberUsedInSig);
            const block = await provider.getBlock(blockNumberUsedInSig);
            const blockhash = block.hash;
            console.log('setting blockhash', blockhash);
            setBlockhash(blockhash);
          } catch (error) {
            console.error('Error:', error);
          }
        }}
      >
        Click Me To Initiate Scan
      </button>
      {keys && <p>{keys.primaryPublicKeyRaw}</p>}
      <button
        onClick={() => {
          getSignatureFromScan({
            chipPublicKey: keys.primaryPublicKeyRaw,
            address: "0x5144c1D13a95Fb7A9714C53593B3957A75B79917",
            hash: blockhash,
          }).then((sig) => {
            console.log("setting sig", sig);
            setSig(sig);
          });
        }}
      >
        Click Me To Sign EOA+blockhash w/ Chip
      </button>
      <button
        disabled={!sig}
        onClick={() => {
          callMintFunction();
        }}
      >
        Mint Token
      </button>
      {mintStatus && <p>{mintStatus}</p>}
    </>
  );
};

export default Scanner;
