const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const secret = require("../secret.json");
const { abi } = require("../artifacts/contracts/Recruitment.sol/Recruitment.json");

describe("Recruitment contract", function () {
  it("refers candidates via email", async function () {
    this.timeout(6000000);
    const [owner] = await ethers.getSigners();
    const provider = new ethers.providers.JsonRpcProvider(secret.skale.endpoint);
    const recruitmentAddress = "0x49455a2f59E8Ae9a1f213036B8e36Cf719C04148";
    const contract = new ethers.Contract(recruitmentAddress, abi, provider);
    for (let i = 0; i < 150 ; i++) {
      await contract.connect(owner).setEmailReferrals(`pedro${Math.round(Math.random()*1000000)}@gmail.com`);
      console.log("...setEmailReferrals", i);
    }
    const result = await contract.connect(owner).getEmailReferrals();
    console.log("emails", result);
    expect(result.length).to.be.greaterThan(0);
  });
  

//   it("Final payment with wrong initial deposit index fails", async function() {
//     const { rInstance, tInstance, owner, addr1, addr2, DAI } = await loadFixture(deployRecruitmentFixture);
//     await tInstance.connect(addr1).approve(
//         rInstance.address,
//         `1000${"0".repeat(18)}`
//       );
//     await rInstance.connect(addr1).setPercentages(DAI,50,20);
//     await tInstance.connect(addr1).approve(
//         rInstance.address,
//         `24000${"0".repeat(18)}`
//       );
//     expect(await rInstance.connect(addr1).setFinalDeposit(DAI,`24000${"0".repeat(18)}`,1)).to.revertedWith("Initial deposit index does not match!");
//   });
});