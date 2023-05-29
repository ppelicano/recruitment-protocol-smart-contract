require("@nomicfoundation/hardhat-toolbox");
const secret = require("./secret.json");
// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key

module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: secret.alchemyHost,
      accounts: [secret.privateKey],
      allowUnlimitedContractSize: true,
      //timeout: 60000
    },
    skale: {
      url: secret.skale.endpoint,
      accounts: [secret.privateKey]
    },
  },
  etherscan: {
    apiKey: {
      skale: secret.skale.etherscanApiKey,
    },
    customChains: [
      {
        network: "skale",
        chainId: parseInt(secret.skale.chainId),
        urls: {
          apiURL: secret.skale.apiUrl,
          browserURL: secret.skale.blockExplorerUrl,
        }
      }
    ]
  }
  
};