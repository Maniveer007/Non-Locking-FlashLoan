import React, { useState } from "react";
import "./home.css";
import YourAssets from "../Components/YourAssets";
import YourLoans from "../Components/YourLoans";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const Home = () => {
  const [activeComponent, setActiveComponent] = useState("Component1");

  const [isUploading, setIsUploading] = useState(false);
  const [amount, setAmmount] = useState("");
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

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

  const handleFormSubmit = () => {};

  return (
    <div className="home_container">
      <div className="home_container_upper">
        <h2>
          $88421.
          <span>21</span>
        </h2>
        <p>~ 3.69 ETH</p>
      </div>

      <div className="home_bottom_container">
        <div className="home_container_middle">
          <div className="home_container_middle_left">
            <p>Collateral</p>
            <p>$8824.21</p>
          </div>
          <div className="home_container_middle_middle"></div>
          <div className="home_container_middle_right">
            <p>Borrowed</p>
            <p>$8824.21</p>
          </div>
        </div>

        <div className="home_container_lower">
          <div className="home_container_lower_navcomp">
            <div
              onClick={() => handleClick("Component1")}
              className={`${activeComponent === "Component1" ? "active" : ""}`}
            >
              Your assets
            </div>
            <div
              onClick={() => handleClick("Component2")}
              className={`${activeComponent === "Component2" ? "active" : ""}`}
            >
              Your loans
            </div>
          </div>

          <div className="home_container_lower_datas">
            {activeComponent === "Component1" && <YourAssets />}
            {activeComponent === "Component2" && <YourLoans />}
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
            <form onSubmit={handleFormSubmit}>
              <DialogTitle>Upload NFT</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Please fill out the form to upload your NFT.
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
                <button className="max-button">Max</button>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Upload"}
                </Button>
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
            <form onSubmit={handleFormSubmit}>
              <DialogTitle>Upload NFT</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Please fill out the form to upload your NFT.
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
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose2}>Cancel</Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Upload"}
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Home;
