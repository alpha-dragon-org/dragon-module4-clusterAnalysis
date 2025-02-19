# Intro to Dragon Data-Modules

Dragon is a browser extension that visualizes the power concentrations of any token on the Solana blockchain. The extension is separated into "data-modules" that produce different analyses on a token's holders. Soon, developers will contribute their own modules to Dragon based on what they think is important for traders to know when in the trenches. 

The Alpha-Dragon includes four data-modules, and the module of focus for this bounty is:

**4. Cluster Analysis**  
- This module will display an overview of all the holder wallets that have transferred the token freely between themselves, instead of buying it directly from an exchange. Our defintion of cluster at this stage includes three types of transfers between holder wallets: `A) SOL`, `B) The token of interest`, OR `C) SOL and/or the token of interest` (more details in the [example](#module-details) below). The specific data to be retrieved includes total % held in active clusters, # of wallets per cluster, and more. You can learn more about clusters from this Bubblemaps [video](https://youtu.be/WGLXQgMNTAg?si=KG_t_7k7GCNvqfQ_). We understand that our definition is a smaller scope than theirs at the moment.
  
---

## Table of Contents

- [Intro to Dragon Data-Modules](#intro-to-dragon-data-modules)
- [Table of Contents](#table-of-contents)
  - [Contribution Overview](#contribution-overview)
  - [Folder Structure](#folder-structure)
  - [Setup \& Installation](#setup--installation)
  - [Module Details](#module-details)
  - [Bounty Selection Criteria](#bounty-selection-criteria)
  - [Integrating RPCs For Data Retrieval](#integrating-rpcs-for-data-retrieval)
  - [Contributing](#contributing)
  - [Future Bounties](#future-bounties)
  - [Issues](#issues)
  - [License](#license)

---

## Contribution Overview

This module currently gathers data by web-scraping Bubblemaps. The task is to build a pipeline that connects this module with a Solana RPC (eg. [Helius](https://www.helius.dev)) and replace all scrapes. If any data can not be retrieved from RPC, the developer can use whatever means necessary given the goals stated in the [Module Details](#module-details) below.

If the data retrieved is as close to real-time as possible, Dragon will become an unbeatable companion in the trenches.

---

## Folder Structure



```
dragon-data-modules/
├── package.json             # Project metadata and node dependencies
├── README.md                # This file
├── src
│   ├── api
│   │   └── server.js        # Express API server for data storage and retrieval which connects to the endpoints
│   ├── config
│   │   └── config.js        # Configuration file (ports, API keys, Helius RPC endpoint)
│   ├── modules
│   │   ├── bundleAnalysis.js   # Module for Bundle Analysis
│   │   ├── clusterAnalysis.js  # Module for Cluster Analysis
│   │   ├── tokenInfo.js        # Module for Token Info (Helius RPC integration) 
│   │   └── sniperAnalysis.js   # Module for Sniper Analysis (Helius RPC)
│   ├── telegram
│   │   └── telegramClient.js   # Telegram API integration & message processing which is used for tokenInfo.js and sniperAnalysis.js 
│   └── utils
│       ├── apiUtils.js         # Utility functions for API communication
│       └── telegramUtils.js    # Utility functions for parsing Telegram messages
│
└── frontend                  # Frontend code for the developer to test the backend
    ├── node_modules
    ├── public                # Contains static assets like images and stylesheets
    │   ├── css
    │   │   └── styles.css    
    │   ├── images
    │   └── js
    │       ├── chart2.js
    │       ├── charts.js    # Contains the frontend logic and connection requests to the backend 
    │       └── sidepanel.js
    ├── lib
    │   ├── fontawesome
    │   ├── chart.js
    │   └── vis-network.min.js
    ├── index.html           # The main entry point of the frontend, to all scripts and server
    ├── package-lock.json
    ├── package.json         # Manage dependencies and configurations for frontend
    └── server.js            # A backend entry point or middleware for API interaction

```

---

## Setup & Installation

1. **Clone the repository.**

   ```bash
   git clone https://github.com/alpha-dragon-dev/dragon-module4-clusterAnalysis.git
   cd dragon-module4-clusterAnalysis
   ```

2. **Install dependencies.**

   Install all required Node.js packages by running:

   ```bash
   npm install
   ```

3. **Configure the application.**

   Open `src/config/config.js` and update the following parameters as needed:

   - `API_SERVER_PORT` and `TELEGRAM_SERVER_PORT`: Set the ports for the API and Telegram servers.
   - `TELEGRAM_API_ID` and `TELEGRAM_API_HASH`: Replace with your Telegram API credentials.
   - `HELIUS_RPC_URL`: Update with your Helius RPC endpoint and API key. This endpoint is used for blockchain data queries.

4. **Run the servers.**

   Start the API server in one terminal:

   ```bash
   npm start
   ```

   And then start the Telegram client (which also includes a small Express server) in another terminal:

   ```bash
   npm run telegram
   ```
5. **View results in the testing environment.**
   
   Start the API server to fetch data from backend:

   ```bash
   cd frontend
   npm install
   npm start
   ```   

   View results on:

   ```bash
   http://localhost:8080/
   ```



---

## Module Details

- **Module Name:** Cluster Analysis 
- **Bounty:** 0.10% of $DRAGON supply  
- **Goals:** Retrieve all data below in real-time and with extremely high accuracy.
  
### Cluster Example

A cluster is any group of wallets that interact in 1 of 3 ways: `SOL transfer`, `Token transfer`, OR `Combo`. A `Combo` cluster could be when Wallet A sends SOL to Wallet B and then sends the token of interest to Wallet C. We would aggregate the % of token held between the 3 of these wallets, and call them one cluster.  

[insert diagram]

### Data To Fetch

- **Total % in active clusters:**  
  The total amount of token supply actively held, in wallets that transferred the token or SOL between themselves.  
  **Example Output:** `14.7`

- **Total # of active clusters**  
  The total number of clusters that are still holding token supply.  
   **Example Output:** `3`

- **Metadata for each active cluster**

  - **% active in cluster**  
  The amount of token supply actively held within the cluster, as defined [above](###cluster example). There may be multiple values to fetch, depending on the total # of active clusters.  
  **Example Output:** `3.5`
    
  - **# of wallets in cluster**  
  The number of distinct wallets within the cluster. There may be multiple values to fetch, depending on the total # of active clusters.  
  **Example Output:** `4`
    
- **Total # of inactive clusters**  
  The total number of clusters that are no logner holding token supply, ie. all have sold to 0%.  
   **Example Output:** `12`

- **Metadata for each inactive cluster**

  - **# of wallets in cluster**  
  The number of distinct wallets within the cluster. There may be multiple values to fetch, depending on the total # of inactive clusters.  
  **Example Output:** `4`

### Module Output

We have included a testing environment where you can see your code displayed live in the module. The test module will be interactive, meaning you can hover to reveal the metadata per cluster. *Note:* The module output will only display active clusters.

---

## Bounty Selection Criteria

We will select a recipient for this bounty based on the following criteria, in order of evaluation:

1. A fully complete retrieval of the data outlined in [Module Details](#module-details)
2. The highest accuracy for data retrieved
3. The fastest speed for retrieval, updated within seconds to real-time
   
If there is more than one developer to meet the above criteria, the first pull request will receive the bounty.

---

## Integrating RPCs for Data Retrieval

[Helius](https://www.helius.dev) is an example of an RPC service that enables quick and direct access to on-chain data on Solana. By integrating RPCs into Dragon's data-modules, we can **replace slow web-scraping techniques** and **increase data accuracy.** 

**How to update the code (with Helius)**
- **Modify the stub functions:** In files like `src/modules/tokenInfo.js` and `src/api/server.js`, update the stub implementations to call the appropriate Helius RPC endpoints.
- **Leverage the configured endpoints:** Use the `HELIUS_RPC_URL` from `src/config/config.js` to ensure that your RPC calls are directed to the correct endpoint with your API key.
- **Improve performance:** Integrate batching of RPC calls if necessary to further improve response time.

*Note:* If any data can not be retrieved from RPC, or if data can be faster retrieved via another method such as data streams, the developer can implement the alternative method with a brief explanation for their choice.

---

## Contributing

1. **Fork the repository.**

2. **Create a feature branch.**

   ```bash
   git checkout -b feature/updated-module
   ```

3. **Replace** `server.js`, `tokenInfo.js`, `apiUtils.js`, **and** `telegramUtils.js` **with your stub functions.**


4. **Commit your changes.**

   ```bash
   git commit -am 'Add updated module for XYZ'
   ```

5. **Push the branch.**

   ```bash
   git push origin feature/updated-module
   ```

6. **Open a pull request describing your changes and the code you have contributed.**

---

## Future Bounties

Dragon’s aim is to make token analyses more transparent and community-driven. At the community's direction, bounties will expand to include more types of holder analyses and deception analyses on token supply.

If you have an idea for a data-module that could benefit traders in the trenches, please propose it in the discussion [here](https://github.com/alpha-dragon-org/dragon-module-openIdeas) to be considered for a bounty.

---
## Issues

Please report any software “bugs” or other problems with this module through the issues tab here: [github.com/alpha-dragon-org/dragon-module4-clusterAnalysis](https://github.com/alpha-dragon-org/dragon-module4-clusterAnalysis)

---
## License

This project is open source and available under [the MIT License](https://opensource.org/license/mit).

---
<img src="https://github.com/alpha-dragon-org/dragon-module1-tokeninfo/blob/main/frontend/public/images/logo.gif?raw=true" width="200">
Want to meet the project co-founders?
