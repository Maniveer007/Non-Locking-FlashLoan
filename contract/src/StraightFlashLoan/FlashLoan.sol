// SPDX-License-Identifier: GPL-2.0-or-later

pragma solidity >=0.8.0;

import '../AbstractCallback.sol';
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interface/IFlashLoan.sol";
import "./interface/IReactiveFlashLoan.sol";
import "./interface/IFlashLoanReceiver.sol";

contract FlashLoan is AbstractCallback, IFlashLoan, IReactiveFlashLoan {

    address public callbackSender;
    IERC20 public token;

    LP[] public liquidityProviders;
    mapping(address => uint256) public userLPindex;
    uint256 public reserves;

    constructor(address _token, address _callback_sender) AbstractCallback(_callback_sender) payable {
        token = IERC20(_token);
        callbackSender = _callback_sender;
        liquidityProviders.push(LP(address(0), 0, 0));  // Default placeholder LP
    }

    receive() external payable {}


    // the reason for this function to not have a visibility modifier is to allow the callback contract to call it
    // and also it is not meant to be called by any other contract or user
    // it can be called by any user which doesnt effect our business logic
    function updateUser(address /**/, address user) public  {
        uint256 balance = token.balanceOf(user);
        uint256 allowance = token.allowance(user, address(this));
        uint256 newLiquidity = _getLiquidity(balance, allowance);
        
        // Check if user is a new liquidity provider
        if (userLPindex[user] == 0 && newLiquidity > 0) {
            userLPindex[user] = liquidityProviders.length;
            liquidityProviders.push(LP(user, balance, allowance));
            reserves += newLiquidity;
        } else if (userLPindex[user] != 0) {
            uint256 index = userLPindex[user];
            uint256 userBalanceBefore = liquidityProviders[index].balance;
            uint256 userAllowanceBefore = liquidityProviders[index].allowance;

            liquidityProviders[index].balance = balance;
            liquidityProviders[index].allowance = allowance;

            uint256 previousLiquidity = _getLiquidity(userBalanceBefore, userAllowanceBefore);

            if (previousLiquidity > newLiquidity) {
                reserves -= previousLiquidity - newLiquidity;
            } else {
                reserves += newLiquidity - previousLiquidity;
            }

            // Remove user if liquidity is zero
            if (newLiquidity == 0) {
                _removeUser(index);
            }
        }
        emit UserUpdated(user, balance, allowance);
    }


    function sendFlashLoan(IReactiveFlashLoan.withdrawLP[] memory withdrawlps, address receiver, uint256 amount) internal {
        // Transfer tokens from LPs
        for (uint256 i = 0; i < withdrawlps.length; i++) {
            if(withdrawlps[i].user != address(0)){
            token.transferFrom(withdrawlps[i].user, address(this), withdrawlps[i].withdrawAmount);
            }
        }

        // Send the loan to the receiver
        token.transfer(receiver, amount);
        IFlashLoanReceiver(receiver).executeOperation(address(this), amount);

        // Repay the loan + fees (0.003% fee)
        token.transferFrom(receiver, address(this), (amount * 1003) / 1000);

        // Return liquidity to LPs
        for (uint256 i = 0; i < withdrawlps.length; i++) {
            if(withdrawlps[i].user != address(0)){
            token.transfer(withdrawlps[i].user, withdrawlps[i].withdrawAmount);
            updateUser(address(0), withdrawlps[i].user);
            }
        }
    }

    function requestFlashLoan(address receiver, uint256 amount) public {
        require(reserves >= amount, "Reserves not sufficient");

        uint256 pendingAmount = amount;
        uint256 length = 0;
        LP[] memory queue = liquidityProviders;

        // Determine how many LPs are required to fulfill the loan
        for (uint256 i = 0; i < queue.length; i++) {
            if (pendingAmount <= _getLiquidity(queue[i].balance, queue[i].allowance)) {
                length++;
                break;
            }
            pendingAmount -= _getLiquidity(queue[i].balance, queue[i].allowance);
            length++;
        }

        // Create an array of LPs to withdraw liquidity from
        IReactiveFlashLoan.withdrawLP[] memory ret = new IReactiveFlashLoan.withdrawLP[](length);

        uint256 pendingAmount2 = amount;
        for (uint256 i = 0; i < length; i++) {
            uint256 availableLiquidity = _getLiquidity(queue[i].balance, queue[i].allowance);
            
            if (pendingAmount2 <= availableLiquidity) {
                ret[i] = IReactiveFlashLoan.withdrawLP(queue[i].user, pendingAmount2);
                break;
            }

            ret[i] = IReactiveFlashLoan.withdrawLP(queue[i].user, availableLiquidity);
            pendingAmount2 -= availableLiquidity;

        }

        // Execute the flash loan
        sendFlashLoan(ret, receiver, amount);

    }


    function _removeUser(uint256 index) internal {
        uint256 lastIndex = liquidityProviders.length - 1;

        if (index != lastIndex) {
            // Swap with the last LP
            LP memory lastUser = liquidityProviders[lastIndex];
            liquidityProviders[index] = lastUser;
            userLPindex[lastUser.user] = index;
        }else

        // Remove the user from the index
        userLPindex[liquidityProviders[index].user] = 0;
        // Remove the last LP
        liquidityProviders.pop();
    }

    function _getLiquidity(uint256 balance, uint256 allowance) internal pure returns (uint256) {
        return balance > allowance ? allowance : balance;
    }
}
