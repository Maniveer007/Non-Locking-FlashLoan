// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import '../interface/IReactiveFlashLoan.sol';

library CircularQueueLibrary {

    // Fix: Added a check to ensure that if no liquidity is available, the loop breaks to avoid infinite loops.
    function getNextPointerforAmount(IReactiveFlashLoan.CircularQueue memory queue, uint amount) public pure returns (uint, uint) {
        uint pendingAmount = amount;
        IReactiveFlashLoan.LP[] memory lps = queue.LPs;
        uint currentPointer = queue.currentPointer;
        uint lpslength;

        // Added a check to prevent looping indefinitely if liquidity is 0
        uint checkedLPs = 0;
        while (pendingAmount > 0 && checkedLPs < lps.length) {
            uint liquidity = _getLiquidity(lps[currentPointer].balance, lps[currentPointer].allowance);
            
            if (liquidity > 0) {
                if (pendingAmount <= liquidity) {
                    lpslength++;
                    break;
                }
                pendingAmount -= liquidity;
            }

            currentPointer = (currentPointer + 1) % lps.length;
            lpslength++;
            checkedLPs++; // Track how many LPs we have checked
        }

        require(pendingAmount == 0, "Insufficient liquidity"); // If still pending, not enough liquidity

        return (currentPointer, lpslength);
    }

    function requestAmount(IReactiveFlashLoan.CircularQueue storage queue, uint amount) public returns (IReactiveFlashLoan.withdrawLP[] memory) {
        (uint nextpointer, uint lpslength) = getNextPointerforAmount(queue, amount);
        uint currentPointer = queue.currentPointer;
        require(nextpointer == currentPointer, "Pointer mismatch");

        uint pendingAmount = amount;
        IReactiveFlashLoan.withdrawLP[] memory withdrawlpdetails = new IReactiveFlashLoan.withdrawLP[](lpslength);

        for (uint i = 0; i < lpslength; i++) {
            uint liquidity = _getLiquidity(queue.LPs[currentPointer].balance, queue.LPs[currentPointer].allowance);

            if (liquidity > 0) {
                if (pendingAmount <= liquidity) {
                    withdrawlpdetails[i] = IReactiveFlashLoan.withdrawLP(queue.LPs[currentPointer].user, pendingAmount);
                    break;
                }

                withdrawlpdetails[i] = IReactiveFlashLoan.withdrawLP(queue.LPs[currentPointer].user, liquidity);

                // Update the allowance if it's not unlimited
                if (queue.LPs[currentPointer].allowance != type(uint256).max) {
                    queue.LPs[currentPointer].allowance -= liquidity;
                }

                pendingAmount -= liquidity;
            }

            currentPointer = (currentPointer + 1) % queue.LPs.length;
        }

        require(pendingAmount == 0, "Unable to fulfill the amount"); // Ensure that we have processed all the amount

        return withdrawlpdetails;
    }

    function _getLiquidity(uint balance, uint allowance) internal pure returns (uint256) {
        return balance > allowance ? allowance : balance;
    }
}
