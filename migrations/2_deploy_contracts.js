const RegistryMock = artifacts.require('./EnsRegistryMock.sol');
const ResolverMock = artifacts.require('./EnsResolverMock.sol');
const SubdomainFactory = artifacts.require('./EnsSubdomainFactory.sol');
const Namehash = require('eth-ens-namehash-ms');

module.exports = async function(deployer, network, accounts) {
	deployer.then(async () => {
        let registryInstance = await deployer.deploy(RegistryMock);
		console.log("--------------------- registryInstance")
		let resolverInstance = await deployer.deploy(ResolverMock);
		console.log("--------------------- resolverInstance")
		let factoryInstance = await deployer.deploy(SubdomainFactory, registryInstance.address, resolverInstance.address)
		console.log("--------------------- factoryInstance")
        registryInstance.setOwner(
			Namehash.hash("repro.eth"),
			factoryInstance.address
		);    
    });
};