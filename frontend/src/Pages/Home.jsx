import React, { useEffect, useState } from "react";
import "./home.css";
import LiquidityProviders from "../Components/LiquidityProviders";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useWeb3 } from "../api/contextApi";
import { ethers } from "ethers";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [activeComponent, setActiveComponent] = useState("Component1");
  const {
    account,
    setAccount,
    provider,
    setProvider,
    USDCcontract,
    contract,
    setContract,
  } = useWeb3();
  const [amount, setAmmount] = useState("");
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [totalLiquidity, setTotalLiquidity] = useState("");
  const [yourLiquidity, setYourLiquidity] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [borrowAmount, setBorrowAmount] = useState("");
  const [liqProvidersArray, setLiqProviderArray] = useState([]);

  const handleClick = (component) => {
    setActiveComponent(component);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const getTotalBalance = async () => {
    const totBalance = await contract?.reserves();
    console.log(totBalance);

    const integerValue = ethers.utils.formatUnits(totBalance, 6);

    setTotalLiquidity(integerValue);
  };

  const userLiquidity = async () => {
    const userLiquidityIndex = await contract?.userLPindex(account);
    const integerValue = ethers.utils.formatUnits(userLiquidityIndex, "wei");
    console.log(integerValue);

    const temp = await contract?.liquidityProviders(integerValue);

    const intFirst = ethers.utils.formatUnits(temp[1], 6);
    const intSecond = ethers.utils.formatUnits(temp[2], 6);

    const minNumber = Math.min(intFirst, intSecond);
    setYourLiquidity(minNumber);
  };

  const getLiquidityProvider = async () => {
    const results = [];

    for (let index = 1; index < 1000; index++) {
      try {
        const temp = await contract?.liquidityProviders(index);
        results.push(temp);
      } catch (error) {
        console.error(`Error at index ${index}: ${error.message}`);
        console.log("Results before error:", results);
        setLiqProviderArray(results);
        return;
      }
    }

    setLiqProviderArray(results);
    return;
  };

  const balance = async () => {
    try {
      console.log(account);
      console.log(contract);
      const balanceOF = await USDCcontract.balanceOf(account);
      console.log("balanceOF", balanceOF);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    contract && balance();
    contract && getTotalBalance();
    contract && userLiquidity();
    contract && getLiquidityProvider();
  }, [account]);

  const handleMaxFunction = (e) => {
    e.preventDefault();
    setAmmount("MAX Amount");
  };

  const handleBorrowFormSubmit = async (e) => {
    e.preventDefault();

    if (borrowAmount > totalLiquidity) {
      toast.error(`We don't have enough resource`, {
        position: "top-right",
        theme: "dark",
      });
    }

    console.log(recipientAddress, borrowAmount * 10 ** 6);

    const reqFlashLoan = await contract?.requestFlashLoan(
      recipientAddress,
      borrowAmount * 10 ** 6
    );

    console.log(reqFlashLoan);
  };

  const handleDepositFormSubmit = async (e) => {
    e.preventDefault();
    if (amount === "MAX Amount") {
      let ammountuint256 = ethers.BigNumber.from(
        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      )?.toString();
      console.log(ammountuint256);

      const approve = await USDCcontract.approve(
        contract?.address,
        ammountuint256
      );
      console.log(approve);
    } else {
      let ammountuint256 = ethers.BigNumber.from(amount)
        .mul(ethers.BigNumber.from(10).pow(6))
        .toString();
      const approve = await USDCcontract.approve(
        contract?.address,
        ammountuint256
      );
      console.log(ammountuint256);
      console.log(approve);
    }
    handleClose();
  };

  return (
    <div className="home_container">
      <ToastContainer />
      <div className="home_container_upper">
        <h2>${totalLiquidity}</h2>
        <p>USDC</p>
      </div>

      <div className="home_bottom_container">
        <div className="home_container_middle">
          <div className="home_container_middle_left">
            <p>Total Liquidity</p>
            <p>${totalLiquidity}</p>
          </div>
          <div className="home_container_middle_middle"></div>
          <div className="home_container_middle_right">
            <p>Your Liquidity</p>
            <p>${yourLiquidity}</p>
          </div>
        </div>

        <div className="home_container_lower">
          <div className="home_container_lower_navcomp">
            <div
              onClick={() => handleClick("Component1")}
              className={`${activeComponent === "Component1" ? "active" : ""}`}
            >
              Liquidity Providers
            </div>
          </div>

          <div className="home_container_lower_datas">
            <LiquidityProviders data={liqProvidersArray} />
          </div>

          <div className="fixed-buttons-container">
            <div className="fixed-button" onClick={handleClickOpen}>
              Deposit
            </div>
            <div className="fixed-button" onClick={handleClickOpen2}>
              Borrow
            </div>
          </div>

          <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                width: "40%",
                maxWidth: "none",
              },
            }}
          >
            <form onSubmit={handleDepositFormSubmit}>
              <DialogTitle>Give Liquidity just by approval</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Provide amount you want to give as liquidity.
                </DialogContentText>
                <div className="input_contianer">
                  <TextField
                    autoFocus
                    required
                    margin="dense"
                    label="Amount"
                    type="text"
                    fullWidth
                    value={amount}
                    onChange={(e) => setAmmount(e.target.value)}
                    variant="standard"
                  />
                </div>
                <button className="max-button" onClick={handleMaxFunction}>
                  Max
                </button>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit">Deposit </Button>
              </DialogActions>
            </form>
          </Dialog>

          <Dialog
            open={open2}
            onClose={handleClose2}
            PaperProps={{
              style: {
                width: "40%",
                maxWidth: "none",
              },
            }}
          >
            <form onSubmit={handleBorrowFormSubmit}>
              <DialogTitle>Borrow Liquidity </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Provide flash loan recipient address, which follow our flash
                  loan interface
                </DialogContentText>
                <div className="input_contianer">
                  <TextField
                    autoFocus
                    required
                    margin="dense"
                    label="Recipient Address"
                    type="text"
                    fullWidth
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    variant="standard"
                  />

                  <TextField
                    autoFocus
                    required
                    margin="dense"
                    label="Amount"
                    type="text"
                    fullWidth
                    value={borrowAmount}
                    onChange={(e) => setBorrowAmount(e.target.value)}
                    variant="standard"
                  />
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose2}>Cancel</Button>
                <Button type="submit">Borrow</Button>
              </DialogActions>
            </form>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Home;
