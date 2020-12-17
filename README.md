# ftx-trading-tools
Trading tools for the **[FTX](https://ftx.com/#a=oxhak "FTX")** exchange.\
Communicates directly with the FTX api, no third party involved.\
Asynchronous, can execute multiple tasks at the same time.\
Easy to use with a **[Stream Deck](https://www.elgato.com/en/gaming/stream-deck "Stream Deck")**.\
![](streamdeck-demo.gif)

You need **[NodeJS](https://nodejs.org/en/download/ "NodeJS")** with npm and **[Git](https://git-scm.com/downloads "Git")** on your machine to be able to install and use this application.

## Installation
Clone this repository:
> **git clone https://github.com/oxhak/ftx-trading-tools**

Enter into the **ftx-trading-tools** directory.\
Rename the file **FTXAPIKeys-SAMPLE.js** into **FTXAPIKeys.js**, open it with your favorite text editor and then replace its content with your FTX api keys.

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
 > example:  **buy 100%account** (amount is calculated from your total USD wallet balance, you can set any % as you want, 200%account, 500%account)\
 > example:  **buy 100%position** (amount is calculated from your open position size, you can set any % as you want from 1-100, 50%position, 10%position)

- **sell {amount}** (sell at market price)
 > example:  **sell 0.001**\
 > example:  **sell 100%account** (amount is calculated from your total USD wallet balance, you can set any % as you want, 200%account, 500%account)\
 > example:  **sell 100%position** (amount is calculated from your open position size, you can set any % as you want from 1-100, 50%position, 10%position)

- **split {buy/sell} {amount} into {into} from {from} to {to}** (split limits orders into a range)\

| :exclamation:  this works but something is wrong with distance from price, take care using this until it is fixed. |
|-----------------------------------------|

 > example:  **split buy 0.0493 into 20 from 8745 to 8900**\
 > example:  **split sell 100%account into 40 from M+0.07% to M+2%** (amount is calculated from your total USD wallet balance, you can set any % as you want, 200%account, 500%account)(for the range you can use M+ or M- for market price with numbers or % as you want)\
 > example:  **split sell 100%position into 40 from M+0.07% to M+2%** (amount is calculated from your open position size, you can set any % as you want from 1-100, 50%position, 10%position)(for the range you can use M+ or M- for market price with numbers or % as you want)

-  **stop {distance}%** (set a stop loss at % distance from entry price (needs an open position))
 > example:  **stop 0.75%**

-  **cancel all** (cancel all orders and close the current position)

-  **cancel buys** (cancel buy orders)

-  **cancel sells** (cancel sell orders)

-  **help** (list all commands)

- **about** (about this application)

- **version** (current version of the application)

## How to support my work

- **BTC**
>3PqYu21eTnWVJovqF1HNqxfaAfYwEfwUTb

- **Use my [referal link](https://ftx.com/#a=oxhak) to trade on FTX and get a 5% fees discount!**
