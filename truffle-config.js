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
    ropsten: {
      provider: () =>
        new HDWalletProvider(secret.mnemonic, "https://ropsten.infura.io/v3/fb3ae38cae744d8aa0800ca9684a99ac"),
      network_id: 3,
      //chainId: 3,
      //gasPrice: 19967323139,
      //gas: 8000000,
      skipDryRun: true,
      networkCheckTimeoutnetworkCheckTimeout: 10000,
      timeoutBlocks: 200
    }
  }
};