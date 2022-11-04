var HDWalletProvider = require("truffle-hdwallet-provider");
const secret = require("./secret.json");
console.log(secret.mnemonic)

module.exports = {
  networks: {
    // development: {
    //   host: "127.0.0.1",
    //   port: 7545,
    //   network_id: "*"
    // },
    goerli: {
      provider: () =>
        new HDWalletProvider(secret.mnemonic, "https://goerli.infura.io/v3/86cf6b02f7ad4c24be9d8797a2018c2a"),
        //new HDWalletProvider(secret.mnemonic, "https://mainnet.infura.io/v3/86cf6b02f7ad4c24be9d8797a2018c2a"), => Mainnet
      network_id: 5,
      //chainId: 3,
      //gasPrice: 19967323139,
      //gas: 8000000,
      skipDryRun: true,
      networkCheckTimeoutnetworkCheckTimeout: 10000,
      timeoutBlocks: 200
    }
  }
};