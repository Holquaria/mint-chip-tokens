import { getPublicKeysFromScan, getSignatureFromScan } from 'pbt-chip-client/kong';
import { useState } from 'react';

const Scanner = () => {
  const [keys, setKeys] = useState(null);
  const [sig, setSig] = useState(null)

  console.log(keys)

  return (
    <>
      <button
        onClick={() => {
          getPublicKeysFromScan().then((keys) => {
            setKeys(keys);
          });
        }}
      >
        Click Me To Initiate Scan
      </button>
      {keys && <p>{keys}</p>}
      <button
        onClick={() => {
          getSignatureFromScan({
            chipPublicKey: keys.primaryPublicKeyRaw,
            address: '<user_eth_address>',
            hash: '<blockhash>',
          }).then((sig) => {
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