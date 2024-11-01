import { ethers } from "ethers";
import React, { createContext, useState, useContext, useEffect } from "react";
// import thetaVidContract from "../contract/abi";

const Web3Context = createContext();

export const Web3provider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const loadProvider = async () => {
        if (provider) {
          await provider.send("eth_requestAccounts");
          const signer = await provider.getSigner();
          const address = await signer.getAddress();

          const network = await provider.getNetwork();
          if (network.chainId !== 0x98a) {
            try {
              await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0xaa36a7" }],
              });
            } catch (switchError) {
              if (switchError.code === 11155111) {
                alert("selected network not added");
              } else {
                console.error("Failed to switch network:", switchError);
              }
            }
          }

          setAccount(address);
          //   let contractAddress = "0xecFBc22B04Efc8f071443cB8ec54f4f13177B7Fa";

          //   const contract = new ethers.Contract(
          //     contractAddress,
          //     thetaVidContract,
          //     signer
          //   );

          //   setContract(contract);
          setProvider(provider);
        } else {
          alert("Metamask not installed");
        }
      };
      provider && loadProvider();
    } catch (error) {
      console.log(error);
    }
  }, [account, contract]);

  return (
    <Web3Context.Provider
      value={{
        account,
        setAccount,
        provider,
        setProvider,
        contract,
        setContract,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};
