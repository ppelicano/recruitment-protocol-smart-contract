const Recruitment = artifacts.require('../contracts/Recruitment.sol');
const Namehash = require('eth-ens-namehash-ms');

const addressRecruitment = '0x1bcc14A17fE935DE9C6324AC6AE0405d82F73398';
let recruitment;
contract('Recruitment', (accounts) => {
    before(async () => {
        console.log(recruitment)
        recruitment = await Recruitment.at(addressRecruitment);
        console.log(recruitment)
    });
    it('Test ', () => {
        assert.ok(recruitment, 'Contract should be deployed');
    });
  })