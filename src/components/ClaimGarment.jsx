import { getSignatureFromScan } from "pbt-chip-client/kong";
import { ethers } from "ethers";
import abi from "../data/testAbi.json";
import { useState } from "react";
import { saveDesktopRequest, getDesktopRequests } from "../sample/database";

const ClaimGarment = ({
  keys,
  blockhash,
  walletAddress,
  provider,
  blockNumber,
}) => {
  const [mintStatus, setMintStatus] = useState("");
  const [formWalletAddress, setFormWalletAddress] = useState("");
  const [sig, setSig] = useState(null);
  const [submittedWallet, setSubmittedWallet] = useState(false)

  async function callMintFunction() {
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

  const handleInputChange = (event) => {
    setFormWalletAddress(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    saveDesktopRequest({
        blockNumber: 9133278,
        chipSignature: '0x40da07995ddb694a7afbed57104e3cafc5f16a718cb2c94a185070a7d2fd1e1860dc0f061158ea35b268e7f478ccc3abf4ef503e200ed14a5669479634dc23421b',
        wallet_address: formWalletAddress,
        pbt_contract_address: "0xE0a50019b55225AF109880Bf524376c71b1da6d4"
    }).then((response) => {
        setSubmittedWallet(true)
        console.log(response)
    }).catch((err) => {
        console.log('error submitting address:', err)
    })
    console.log('Submitted wallet address:', formWalletAddress);
  };

  console.log(formWalletAddress)

  return (
    <div>
      <h2>Garment Claim</h2>

      <button
        disabled={!keys}
        onClick={() => {
          getSignatureFromScan({
            chipPublicKey: keys.primaryPublicKeyRaw,
            address: "0x5144c1D13a95Fb7A9714C53593B3957A75B79917",
            hash: blockhash,
          }).then((sig) => {
            setSig(sig);
          });
        }}
      >
        Generate Signature
      </button>
      {walletAddress ? (
        <button
          disabled={!sig || !walletAddress}
          onClick={() => {
            callMintFunction();
          }}
        >
          Mint Token
        </button>
      ) : (
        <div>
          <p>
            Token has not been claimed, please connect wallet to register your
            Master Tee or enter wallet address to continue on desktop
          </p>
          <form onSubmit={handleSubmit}>
            <label>
              Wallet Address:
              <input
                type="text"
                placeholder="Enter wallet address"
                value={formWalletAddress}
                onChange={handleInputChange}
              />
            </label>
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
      <button onClick={() => {getDesktopRequests({
        wallet_address: '0x5144c1D13a95Fb7A9714C53593B3957A75B79917',
        pbt_contract_address: '0xE0a50019b55225AF109880Bf524376c71b1da6d4'
      }).then((response) => {
        console.log(response)
      })}}>Get requests</button>
      {mintStatus && <p>{mintStatus}</p>}
    </div>
  );
};

export default ClaimGarment;
