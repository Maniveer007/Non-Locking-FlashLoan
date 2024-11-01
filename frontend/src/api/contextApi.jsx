import { ethers } from "ethers";
import React, { createContext, useState, useContext, useEffect } from "react";
import erc20ABI from "../abi/Erc20";
import FlashLoanABI from "../abi/FlashLoanABI";
const Web3Context = createContext();

export const Web3provider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [USDCcontract, setUSDCcontract] = useState(null);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);

  // console.log(erc20ABI);

  useEffect(() => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
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
          let USDCcontractAddress =
            "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8";
          const USDCcontract = new ethers.Contract(
            USDCcontractAddress,
            erc20ABI,
            signer
          );

          setUSDCcontract(USDCcontract);
          setProvider(provider);

          let contractAddress = "0xa3F7120830896699304A5481255eF5199Fcf2091";
          const contract = new ethers.Contract(
            contractAddress,
            FlashLoanABI,
            signer
          );

          setContract(contract);
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
        USDCcontract,
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
