const Namehash = require('eth-ens-namehash-ms');
const secret = require("../secret.json");
const fs = require('fs');
const path = require('path');
const abi_path = "../artifacts/build-info";
let factoryInstance,minterMockInstance,recruitmentInstance;

async function main() {
  const [deployer] = await ethers.getSigners();
console.log(deployer);
  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());
  
  const MinterMock = await ethers.getContractFactory("MinterMock");
  const Recruitment = await ethers.getContractFactory("Recruitment");

  minterMockInstance = await MinterMock.deploy();
  recruitmentInstance = await Recruitment.deploy();
  console.log("MinterMock address:", minterMockInstance.address);
  console.log("Recruitment address:", recruitmentInstance.address);

  const DAI = ethers.utils.formatBytes32String('DAI');
  await recruitmentInstance.whitelistToken(DAI, minterMockInstance.address, 18);
  const daiAddress = await recruitmentInstance.getWhitelistedTokenAddresses(DAI);
  console.log(`...whitelisted DAI at contract address ${minterMockInstance.address} => ${daiAddress}`);

  await updateContractAddresses(factoryInstance, recruitmentInstance, minterMockInstance);
	await updateABIS();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

async function updateContractAddresses(factoryInstance, recruitmentInstance, minterMockInstance) {
  let filePath = secret.webProjectPath + '/src/contract-addresses.json';
  var currentAddresses = JSON.parse(fs.readFileSync(filePath, 'utf8') ?? "{}");
  let newAddresses = {
    EnsSubdomainFactory: typeof factoryInstance === 'undefined' ? currentAddresses.EnsSubdomainFactory : factoryInstance.address, 
    Recruitment: typeof recruitmentInstance === 'undefined' ? currentAddresses.Recruitment : recruitmentInstance.address,
    MinterMock: typeof minterMockInstance === 'undefined' ? currentAddresses.MinterMock : minterMockInstance.address 
  };

  fs.writeFileSync(secret.webProjectPath + '/src/contract-addresses.json', JSON.stringify(newAddresses));
  fs.writeFileSync('/contract-addresses.json', JSON.stringify(newAddresses));
  console.log(`...updated contract address file at ${secret.webProjectPath}/src/contract-addresses.json`);
}

async function updateABIS() {
  let abis_folder = secret.webProjectPath + '/src',
  abiFileName = fs.readdirSync(path.resolve(__dirname, abi_path))[0];
  if (!abiFileName)
    throw new Error("no abi build exists!");
  fs.writeFileSync(`${abis_folder}/abi.json`, JSON.stringify(require(`${abi_path}/${abiFileName}`)));
  console.log(`...updated abi file at ${abis_folder}/abi.json`);
}


