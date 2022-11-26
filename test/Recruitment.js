const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("Recruitment contract", function () {
  async function deployRecruitmentFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const Recruitment = await ethers.getContractFactory("Recruitment");
    const MinterMock = await ethers.getContractFactory('MinterMock', addr1.address);

    const rInstance = await Recruitment.deploy();
    const tInstance = await MinterMock.deploy();

    await rInstance.deployed();
    await tInstance.deployed();
    await tInstance.transfer(addr1.address, `5000${"0".repeat(18)}`);

    await tInstance.connect(addr1).approve(
      rInstance.address,
      `1000${"0".repeat(18)}`
    );
    const DAI = ethers.utils.formatBytes32String('DAI');
    
    await rInstance.whitelistToken(
      DAI,
      tInstance.address,
      18
    );
    // Fixtures can return anything you consider useful for your tests
    return { rInstance, tInstance, owner, addr1, addr2, DAI };
  }

  it("Address 1 balance to be initialized at 5000 DAI", async function () {
    const { rInstance, tInstance, owner, addr1, addr2, DAI } = await loadFixture(deployRecruitmentFixture);
    const addr1Balance = await tInstance.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(`5000${"0".repeat(18)}`);
  });

  it("DAI to be whitelisted from recruitment smart contract", async function () {
    const { rInstance, tInstance, owner, addr1, addr2, DAI } = await loadFixture(deployRecruitmentFixture);    
    const whitelistedAddress = await rInstance.getWhitelistedTokenAddresses(DAI);
    expect(whitelistedAddress).to.equal(tInstance.address);
    expect(whitelistedAddress).to.equal(tInstance.address);
  });

  it("DAI to be whitelisted with 18 decimals", async function () {
    const { rInstance, tInstance, owner, addr1, addr2, DAI } = await loadFixture(deployRecruitmentFixture);    
    const decimals = await rInstance.getWhitelistedTokenDecimals(DAI);
    expect(decimals).to.equal(18);
  });
  

  it("Recruitment balance to be 1000 DAI", async function () {
    const { rInstance, tInstance, owner, addr1, addr2, DAI } = await loadFixture(deployRecruitmentFixture);
    console.log("owner", owner.address);
    console.log("Owner balance before is ", await rInstance.accountBalances(addr1.address, DAI), tInstance.address);    
    //console.log("Whitelisted token DAI address =>", await rInstance.getWhitelistedTokenAddresses(DAI));
    await rInstance.connect(addr1).initialDeposit(
      `1000${"0".repeat(18)}`,
      DAI,
    );
    const rBalance = await rInstance.accountBalances(addr1.address, DAI);
    console.log("Owner balance after is ", rBalance);

    expect(rBalance).to.equal(`1000${"0".repeat(18)}`);
  });
});