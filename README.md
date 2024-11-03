# Project Title: Non-Locking FlashLoan Protocol

## Overview

In traditional DeFi protocols like Aave, when users provide liquidity to the flash loan pool, their assets are staked and represented by receipt tokens. However, these staked assets remain locked, limiting their usability. Users effectively hold tokens in a pool, unable to fully leverage their value or liquidity potential. Our project, the **Non-Locking FlashLoan Protocol**, introduces a novel solution using a reactive network to address these limitations and enhance asset liquidity.

video tutorial : [https://www.loom.com/share/ed734581998249eb853a9cff7dce9cad?sid=c2a5d99b-b640-4c2d-bc61-05489a1209e4](https://www.loom.com/share/ed734581998249eb853a9cff7dce9cad?sid=c2a5d99b-b640-4c2d-bc61-05489a1209e4)
deployed FlashLoan Address : [0xff8b1bba3a612e27236347cdbeff220d19028c81e1446a122cbdb224a9443223](https://sepolia.etherscan.io/tx/0xff8b1bba3a612e27236347cdbeff220d19028c81e1446a122cbdb224a9443223)

## Key Innovation: Reactive Network in DeFi

The core of this project lies in the reactive network’s capabilities. Unlike conventional cross-chain read-then-transaction approaches, our use of the reactive network makes it possible to trigger automatic, on-chain actions in response to specific events. This event-driven framework enables transactions to occur based on predefined conditions without holding assets locked in a pool, giving users dynamic control over their funds.

## Unique Features of the Non-Locking FlashLoan Protocol

- **Token Ownership Retained by Users**: In our protocol, users retain full ownership of their tokens while still participating as liquidity providers for flash loans. Instead of transferring tokens to a central pool, users hold their assets directly, enabling full access and control over their funds.

- **Instant Liquidity Management**: In our system, users become liquidity providers by simply approving the flash loan contract. When a user’s approval event is detected, our protocol automatically updates the liquidity pool details. If the user transfers assets, the protocol instantly reflects these changes, making the liquidity dynamic and responsive.

- **Event-Triggered Transactions**: This protocol is driven by event-triggered transactions rather than static pools. When users request a flash loan, the reactive network initiates an immediate transaction, taking the required tokens from the liquidity providers and directing them to the flash loan receiver. After the loan is utilized and repaid, the tokens are returned and redistributed among liquidity providers, bypassing the need for any locked assets.

- **Fee Structure**: For each flash loan transaction, a fee of **0.3%** is applied. This fee is distributed among liquidity providers, ensuring a continuous incentive while maintaining the non-locking nature of the protocol.

- **Unmatched Asset Accessibility**: Users maintain full access to their assets, as there is no asset lock-up in the liquidity pool. This structure empowers liquidity providers, enabling them to freely move, trade, or leverage their tokens across other DeFi protocols while still participating in the flash loan ecosystem.

## How Reactive Network Empowers DeFi Efficiency

The design of this protocol is guided by the philosophy that any event can be the catalyst for a transaction. When users approve, transfer, or interact with the contract, these actions are automatically reflected in the protocol’s ledger, keeping liquidity details updated in real-time. This dynamic reaction mechanism not only ensures liquidity but also empowers users to utilize their tokens across the DeFi ecosystem without sacrificing access or control.
