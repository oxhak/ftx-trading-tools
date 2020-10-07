# ftx-trading-tools
Trading tools for **[FTX](https://ftx.com/#a=oxhak)** exchange.\
(this application communicates directly with FTX, there is no third party involved)

You need **[NodeJS](https://nodejs.org/en/download/ "NodeJS")** with npm and **[Git](https://git-scm.com/downloads "Git")** on your machine to be able to install and use this application.

## Installation
Clone this repository:
> **git clone https://github.com/oxhak/ftx-trading-tools**

Enter into the **ftx-trading-tools** directory.\
Rename the file **FTXAPIKeys-SAMPLE.js** into **FTXAPIKeys.js**, open it with your favorite text editor and then replace its content with your FTX API Keys.

Set your terminal current directory to **ftx-trading-tools**.\
Then install the needed modules with:
> **npm install**

## How to use
Start the application with:
> **node ftx-trading-tools.js**

## Commands

-   **instrument {instrument}** (set the instrument to use on FTX)
> example:  **instrument btc-perp**

-   **balance** (get your wallet balances)

-  **price** (get the current price of the instrument)

-  **buy {amount}** (buy at market price)
 > example:  **buy 0.001**\
 > example:  **buy 100%account** (amount is calculated from your total USD wallet balance, you can set any % as you want, 200%account, 500%account)

- **sell {amount}** (sell at market price)
 > example:  **sell 0.001**\
 > example:  **sell 100%account** (amount is calculated from your total USD wallet balance, you can set any % as you want, 200%account, 500%account)

- **split {buy/sell} {amount} into {into} from {from} to {to}** (split limits orders into a range)
 > example:  **split buy 0.0493 into 20 from 8745 to 8900**\
 > example:  **split sell 100%account into 40 from M+0.07% to M+2%** (amount is calculated from your total USD wallet balance, you can set any % as you want, 200%account, 500%account)(for the range you can use M+ or M- for market price with numbers or % as you want)

-  **cancel all** (cancel all orders and close the current position)

-  **cancel buys** (cancel buy orders)

-  **cancel sells** (cancel sell orders)

-  **help** (list all commands)

- **about** (about this application)

- **version** (current version of the application)
