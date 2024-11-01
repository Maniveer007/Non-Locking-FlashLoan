// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.8.0;

import '../IReactive.sol';
import '../AbstractReactive.sol';
import '../ISystemContract.sol';
import './interface/IReactiveFlashLoan.sol';

contract ReactiveFlashLoan is IReactive, AbstractReactive,IReactiveFlashLoan {

    event inputs(address indexed , uint indexed ,uint indexed );


    FlashLoanAddress public detail;
    mapping(uint256 => uint256) public reserves;


    uint256 private constant APPROVE_TOPIC_0 = 0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925;
    uint256 private constant TRANSFER_TOPIC_0 = 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef;

    uint256 private constant SEPOLIA_CHAIN_ID = 11155111;
    uint64 private constant GAS_LIMIT = 10000000;

    // State specific to reactive network instance of the contract

    // address private _callback;

    // State specific to ReactVM instance of the contract

    uint256 public counter;

    constructor(address _service, address flashLoanContract, address flashLoanToken) {
        service = ISystemContract(payable(_service));


        bytes memory payload = abi.encodeWithSignature(
            "subscribe(uint256,address,uint256,uint256,uint256,uint256)",
            SEPOLIA_CHAIN_ID,
            flashLoanToken,
            APPROVE_TOPIC_0,
            REACTIVE_IGNORE,
            uint256(uint160(flashLoanContract)),
            REACTIVE_IGNORE
        );

        detail=FlashLoanAddress(flashLoanContract,flashLoanToken);
        
        (bool subscription_result,) = address(service).call(payload);
        vm = !subscription_result;
    }

    receive() external payable {}

    // Methods specific to ReactVM instance of the contract

    function react(
        uint256 chain_id,
        address _contract,
        uint256 topic_0,
        uint256 topic_1,
        uint256 topic_2,
        uint256 topic_3,
        bytes calldata data,
        uint256 /* block_number */,
        uint256 /* op_code */
    ) external vmOnly {
        if(topic_0 == APPROVE_TOPIC_0 && _contract == detail.flashLoanToken && detail.flashLoanContract == address(uint160(topic_2))){
            bytes memory payload = abi.encodeWithSignature("updateUser(address,address)", address(0),address(uint160(topic_1)));
            emit Callback(chain_id, detail.flashLoanContract, GAS_LIMIT, payload);
        } else if(topic_0 == TRANSFER_TOPIC_0 && _contract == detail.flashLoanToken){
            if(!(detail.flashLoanContract == address(uint160(topic_1)) || detail.flashLoanContract == address(uint160(topic_2)))){
            bytes memory payload1 = abi.encodeWithSignature("updateUser(address,address)", address(0),address(uint160(topic_1)));
            bytes memory payload2 = abi.encodeWithSignature("updateUser(address,address)", address(0),address(uint160(topic_2)));
            emit Callback(chain_id, detail.flashLoanContract, GAS_LIMIT, payload1);
            emit Callback(chain_id, detail.flashLoanContract, GAS_LIMIT, payload2);
            }
        }else {
            // emit inputs(_contract,topic_0,topic_1);
            revert();
        }
}

    // Methods for testing environment only

    function pretendVm() external {
        vm = true;
    }

    function subscribe(address _contract, uint256 topic_0) external {
        service.subscribe(
            SEPOLIA_CHAIN_ID,
            _contract,
            topic_0,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE
        );
    }

    function unsubscribe(address _contract, uint256 topic_0) external {
        service.unsubscribe(
            SEPOLIA_CHAIN_ID,
            _contract,
            topic_0,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE
        );
    }

}


/*


0x0000000000000000000000000000000000FFFFFF,
0xA8Edb607791670323622e4dB9E5823F13A51873c,
0x27F6448A5EaD4a429262780d5D009de36F0bb71b


*/

// 115792089237316195423570985008687907853269984665640564039457584007913129639935

// 1000000

//    
