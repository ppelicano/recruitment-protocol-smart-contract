const RegistryMock = artifacts.require('./EnsRegistryMock.sol');
const ResolverMock = artifacts.require('./EnsResolverMock.sol');
const EnsSubdomainFactory = artifacts.require('./EnsSubdomainFactory.sol');
const Recruitment = artifacts.require('./Recruitment.sol');
const MinterMock = artifacts.require('./MinterMock.sol');
const ABI_EnsSubdomainFactory = require('../build/contracts/EnsSubdomainFactory.json');
const ABI_Recruitment = require('../build/contracts/Recruitment.json');
const ABI_MinterMock = require('../build/contracts/MinterMock.json');

const Namehash = require('eth-ens-namehash-ms');
const secret = require("../secret.json");
const fs = require('fs');
const abis_web_project = ['EnsSubdomainFactory.json','MinterMock.json', 'Recruitment.json'];


module.exports = async function(deployer, network, accounts) {
	deployer.then(async () => {
        // let registryInstance = await deployer.deploy(RegistryMock);
		// console.log("--------------------- registryInstance");
		// let resolverInstance = await deployer.deploy(ResolverMock);
		// console.log("--------------------- resolverInstance");
		// let factoryInstance = await deployer.deploy(EnsSubdomainFactory, registryInstance.address, resolverInstance.address);
		// console.log("--------------------- f	actoryInstance");
		// registryInstance.setOwner(
		// 	Namehash.hash("repro.eth"),
		// 	factoryInstance.address
		// );  
		let recruitmentInstance = await deployer.deploy(Recruitment);
		let minterMockInstance = await deployer.deploy(MinterMock);
		recruitmentInstance.whitelistToken(Namehash.hash("DAI"), minterMockInstance.address);
		console.log(`...whitelisted DAI at contract address ${minterMockInstance.address}`);

		await updateContractAddresses();
		await updateABIS();
    });
};
async function updateContractAddresses() {
	let filePath = secret.webProjectPath + '/src/contract-addresses.json';
	var currentAddresses = JSON.parse(fs.readFileSync(filePath, 'utf8'));
	let newAddresses = {
		EnsSubdomainFactory: typeof factoryInstance === 'undefined' ? currentAddresses.EnsSubdomainFactory : factoryInstance.address, 
		Recruitment: typeof recruitmentInstance === 'undefined' ? currentAddresses.Recruitment : recruitmentInstance.address,
		MinterMock: typeof minterMockInstance === 'undefined' ? currentAddresses.MinterMock : minterMockInstance.address 
	};
	fs.writeFileSync(secret.webProjectPath + '/src/contract-addresses.json', JSON.stringify(newAddresses));
}
async function updateABIS() {
	let abis_folder = secret.webProjectPath + '/src/ABIS';
	for await (const abiFileName of abis_web_project) {
		fs.writeFileSync(`${abis_folder}/${abiFileName}`, JSON.stringify(require(`../build/contracts/${abiFileName}`)));
		console.log(`...updated ABI file ${abis_folder}/${abiFileName}`);
	}
}