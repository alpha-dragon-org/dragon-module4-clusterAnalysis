# Dragon Data Modules

Dragon is an open source browser extension designed to visualize deceptions and power concentrations of any token on the Solana blockchain. The extension opens a side panel divided into data-modules that provide various analyses on a project's holder distribution and security metrics. The initial release includes four modules:

- **Token Info/Security:** Basic token information such as ticker, age, market cap, and number of holders. Basic security measures such as mint authority, freeze authority, and locked liquidity pool.
- **Bundle Analysis:** An analysis of any bundled supply still holding (number of active bundles, percentage held in active bundles, number of wallets per bundle, etc.).
- **Sniper Analysis:** An analysis of any sniped supply still holding (total active snipers, percentage of sniped supply still active, relative timestamp per snipe, etc.).
- **Holder Analyses:** Currently two analysis of a token's holders: wallet clusters and Top 10. A cluster is a group of wallets that have transferred the token between themselves instead of buying it from an exchange.
  
Soon, Dragon will produce analyses on many other holder distributions and deceptive behaviors crowd-sourced by builders and traders in the memecoin trenches.

---

## Table of Contents

- [Dragon Data Modules](#dragon-data-modules)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Folder Structure](#folder-structure)
  - [Setup \& Installation](#setup--installation)
  - [Current Modules \& Bounties](#current-modules--bounties)
    - [Cluster Analysis](#cluster-analysis)
    - [Data Fields Explanation](#data-fields-explanation)
    - [Module Output](#module-output)
  - [Using Helius RPC for Open Source Integration](#using-helius-rpc-for-open-source-integration)
  - [Future Bounties \& Modules](#future-bounties--modules)
  - [Contributing](#contributing)
  - [License](#license)

---

## Overview

Dragon is built with the vision of making complex on-chain analyses accessible and open source. Developers can contribute new modules (or "mods") to add more analyses on a token's distribution. The front-end for the initial four modules is built and gathers data by web-scraping various online tools. Your challenge (and bounty) is to build efficient data pipelines that integrate a Solana node RPC (via [Helius](https://www.helius.dev)) to provide fast, real-time blockchain data.

By replacing or supplementing web-scraping methods with Helius RPC calls, we can achieve quicker response times and more reliable data updates for the front-end extension.

---

## Folder Structure



```
dragon-data-modules/
├── package.json             # Project metadata and dependencies
├── README.md                # This file
├── src
│   ├── api
│   │   └── server.js        # Express API server for data storage and retrieval
│   ├── config
│   │   └── config.js        # Configuration file (ports, API keys, Helius RPC endpoint)
│   ├── modules
│   │   ├── bundleAnalysis.js   # Module for Bundle Analysis
│   │   ├── clusterAnalysis.js  # Module for Cluster Analysis
│   │   ├── tokenInfo.js        # Module for Token Info (Helius RPC integration)
│   │   └── sniperAnalysis.js   # Module for Sniper Analysis (Helius RPC)
│   ├── telegram
│   │   └── telegramClient.js   # Telegram API integration & message processing
│   └── utils
│       ├── apiUtils.js         # Utility functions for API communication
│       └── telegramUtils.js    # Utility functions for parsing Telegram messages
│
└── frontend                  # Frontend code for the developer to test the backend
    ├── node_modules
    ├── public
    │   ├── css
    │   │   └── styles.css
    │   ├── images
    │   └── js
    │       ├── chart2.js
    │       ├── charts.js
    │       └── sidepanel.js
    ├── lib
    │   ├── fontawesome
    │   ├── chart.js
    │   └── vis-network.min.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    └── server.js

```

---

## Setup & Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/alpha-dragon-dev/dragon-module4-clusterAnalysis.git
   cd dragon-data-modules
   ```

2. **Install Dependencies:**

   Install all required Node.js packages by running:

   ```bash
   npm install
   ```

3. **Configure the Application:**

   Open `src/config/config.js` and update the following parameters as needed:

   - `API_SERVER_PORT` and `TELEGRAM_SERVER_PORT`: Set the ports for the API and Telegram servers.
   - `TELEGRAM_API_ID` and `TELEGRAM_API_HASH`: Replace with your Telegram API credentials.
   - `HELIUS_RPC_URL`: Update with your Helius RPC endpoint and API key. This endpoint is used for blockchain data queries.

4. **Run the Servers:**

   Start the API server in one terminal:

   ```bash
   npm start
   ```

   And then start the Telegram client (which also includes a small Express server) in another terminal:

   ```bash
   npm run telegram
   ```
5. **To View Results on Frontend:**
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

## Current Modules & Bounties

 The details for the Module (Token Info)  are outlined below:


### Cluster Analysis
- **Build:** Cluster Analysis
- **Bounty:** 0.xx% of $DRAGON supply
- **Details:**
  The front-end is built. Your goal is to build an RPC pipeline via our Helius node that retrieves data on wallet clusters. This includes the total percentage of tokens held in active clusters, the number of wallets per cluster, and the activity percentage of each cluster.
- **Job Repo:** See job, Go to repo

---

### Data Fields Explanation

- **Total % in Active Clusters:**  
  *Example:* `Total % in active clusters`

- **# of Wallets in Each Cluster:**  
  *Example:* `# of wallets in each cluster`

- **% Active in Each Cluster(Metadata):**  
  *Example:* `% active in each cluster`

---

### Module Output

- **Actively Holding(Total % of holdings in clusters):**  
  *Example:* `10.44%`


---

## Using Helius RPC for Open Source Integration

Helius is a powerful RPC service that enables quick and direct access to on-chain data on Solana. By integrating Helius RPC calls into our modules, we can:

- **Replace Slow Web-Scraping:** Instead of relying solely on web-scraping methods, modules such as Token Info Analysis and Sniper Analysis can fetch real-time data directly from the blockchain.
- **Enhance Data Accuracy:** Helius provides accurate and up-to-date blockchain metrics (e.g., token supply, market cap, holder counts).
- **Quick Response Times:** The use of Helius RPC ensures fast responses, which is essential for real-time updates in the front-end extension.

**How to Update the Current Code:**
- **Modify the Stub Functions:** In files like `src/modules/tokenInfo.js` and `src/modules/sniperAnalysis.js`, update the stub implementations to call the appropriate Helius RPC endpoints.
- **Leverage Configured Endpoints:** Use the `HELIUS_RPC_URL` from `src/config/config.js` to ensure that your RPC calls are directed to the correct endpoint with your API key.
- **Improve Performance:** Integrate caching or batching of RPC calls if necessary to further improve response times for the front-end.

---

## Future Bounties & Modules

Dragon is an evolving project. In addition to the current four modules, future bounties will include:

- **Deception Metrics Module:** Analyze deceptive practices in token projects and flag potential red flags.
- **Holder Distribution Analysis:** Provide a detailed breakdown of token holders, including concentration analysis.
- **Liquidity Analysis:** Monitor and report on liquidity pool dynamics and trading activities.
- **Community Sentiment Analysis:** Integrate social media and on-chain data to gauge community sentiment.
- **New Metrics Modules:** Based on community feedback and emerging trends, new modules can be crowd-sourced and developed.

These future modules will be developed by community contributions and bounty rewards. If you have a new idea or module that could benefit the Dragon ecosystem, feel free to propose it and start working on a bounty.

---

## Contributing

We welcome contributions from the community! To contribute:

1. **Fork the Repository**

2. **Create a Feature Branch:**

   ```bash
   git checkout -b feature/new-module
   ```

3. **Commit Your Changes:**

   ```bash
   git commit -am 'Add new module for XYZ'
   ```

4. **Push the Branch:**

   ```bash
   git push origin feature/new-module
   ```

5. **Open a Pull Request** describing your changes and the module you are adding.

---

## License

This project is open source and available under the MIT License.

Happy coding and bounty hunting!
Build Mods, Collect Bounties.
Contribute to Dragon and help reveal the hidden techniques in token projects on Solana.
