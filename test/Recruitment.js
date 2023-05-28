const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("Recruitment contract", function () {
  async function deployRecruitmentFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    console.log(owner.address, addr1, addr2);
    const Recruitment = await ethers.getContractFactory("Recruitment");
    const MinterMock = await ethers.getContractFactory(
      "MinterMock",
      addr1.address
    );

    const rInstance = await Recruitment.deploy();
    const tInstance = await MinterMock.deploy();

    await rInstance.deployed();
    await tInstance.deployed();
    await tInstance.transfer(addr1.address, `1000000${"0".repeat(18)}`);

    await tInstance
      .connect(addr1)
      .approve(rInstance.address, `1000${"0".repeat(18)}`);
    const DAI = ethers.utils.formatBytes32String("DAI");

    await rInstance.whitelistToken(DAI, tInstance.address, 18);

    // Fixtures can return anything you consider useful for your tests
    return { rInstance, tInstance, owner, addr1, addr2, DAI };
  }

  it("Address 1 balance to be initialized at 1,000,000 DAI", async function () {
    const { rInstance, tInstance, owner, addr1, addr2, DAI } =
      await loadFixture(deployRecruitmentFixture);
    const addr1Balance = await tInstance.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(`1000000${"0".repeat(18)}`);
  });

  it("DAI to be whitelisted from recruitment smart contract", async function () {
    const { rInstance, tInstance, owner, addr1, addr2, DAI } =
      await loadFixture(deployRecruitmentFixture);
    const whitelistedAddress = await rInstance.getWhitelistedTokenAddresses(
      DAI
    );
    expect(whitelistedAddress).to.equal(tInstance.address);
    expect(whitelistedAddress).to.equal(tInstance.address);
  });

  it("DAI to be whitelisted with 18 decimals", async function () {
    const { rInstance, tInstance, owner, addr1, addr2, DAI } =
      await loadFixture(deployRecruitmentFixture);
    const decimals = await rInstance.getWhitelistedTokenDecimals(DAI);
    expect(decimals).to.equal(18);
  });

  it("Initial deposit monthly refunds must be 80, 60 and 40", async function () {
    const { rInstance, tInstance, owner, addr1, addr2, DAI } =
      await loadFixture(deployRecruitmentFixture);
    await tInstance
      .connect(addr1)
      .approve(rInstance.address, `2000${"0".repeat(18)}`);
    await rInstance.connect(addr1).setPercentages(50, 20, 0);
    await rInstance.connect(addr1).setPercentages(80, 60, 40);
    const percentages = await rInstance
      .connect(addr1.address)
      .getAccountMonthlyRefundPcts();
    const lastAddedDepositPcts = percentages[percentages.length - 1];

    expect(lastAddedDepositPcts[0]).to.equal(80);
    expect(lastAddedDepositPcts[1]).to.equal(60);
    expect(lastAddedDepositPcts[2]).to.equal(40);
  });

  it("Total deposits amount to 25,000 USD", async function () {
    const { rInstance, tInstance, owner, addr1, addr2, DAI } =
      await loadFixture(deployRecruitmentFixture);
    await tInstance
      .connect(addr1)
      .approve(rInstance.address, `1000${"0".repeat(18)}`);
    await rInstance.connect(addr1).setPercentages(75, 60, 40);
    await tInstance
      .connect(addr1)
      .approve(rInstance.address, `25000${"0".repeat(18)}`);
    await rInstance
      .connect(addr1)
      .setFinalDeposit(DAI, `25000${"0".repeat(18)}`, 0);
    const rBalance = await rInstance.accountBalances(addr1.address, DAI);
    expect(rBalance).to.equal(`25000${"0".repeat(18)}`);
  });

  it("Account balances equals 15,000 after withdraw of 10,000", async function () {
    const { rInstance, tInstance, owner, addr1, addr2, DAI } =
      await loadFixture(deployRecruitmentFixture);
    await tInstance
      .connect(addr1)
      .approve(rInstance.address, `1000${"0".repeat(18)}`);
    await rInstance.connect(addr1).setPercentages(75, 50, 20);
    await tInstance
      .connect(addr1)
      .approve(rInstance.address, `25000${"0".repeat(18)}`);
    await rInstance
      .connect(addr1)
      .setFinalDeposit(DAI, `25000${"0".repeat(18)}`, 0);
    await rInstance.connect(owner).withdrawTokens(DAI, `1000${"0".repeat(18)}`);
    const rBalance = await rInstance.accountBalances(addr1.address, DAI);
    expect(rBalance).to.equal(`15000${"0".repeat(18)}`);
  });

  // company setting scores for a candidate
  it("Enable a company to add scores for a candidate", async function () {
    const { rInstance, tInstance, owner, addr1, addr2, DAI } =
      await loadFixture(deployRecruitmentFixture);

    await rInstance.connect(owner).submitReferralScore(1, addr1.address);
    const scores = await rInstance.getReferralScores(addr1.address);
    expect(scores[0].score).to.equal(1);
  });

  it("A candidate should be able to give company scores", async function () {
    const { rInstance, tInstance, owner, addr1, addr2, DAI } =
      await loadFixture(deployRecruitmentFixture);

    await rInstance.connect(owner).submitCompanyScore(1, addr1.address);
    const scores = await rInstance.getCompanyScores(addr1.address);
    expect(scores[0].score).to.equal(1);
  });

  it("Same candidate shouldn't be able to score a company more than once", async function () {
    const { rInstance, tInstance, owner, addr1, addr2, DAI } =
      await loadFixture(deployRecruitmentFixture);

    // Submit a score for a company from addr1
    const score1 = 4;
    await rInstance.connect(owner).submitCompanyScore(score1, addr1.address);

    // Try to submit another score for the same company from addr1
    const score2 = 3;
    await expect(
      rInstance.connect(owner).submitCompanyScore(score2, addr1.address)
    ).to.be.revertedWith("You have already scored this company");

    // Get the company scores to verify there's only one score from addr1
    const companyScores = await rInstance.getCompanyScores(addr1.address);
    expect(companyScores.length).to.equal(1);
    expect(companyScores[0].senderAddress).to.equal(owner.address);
    expect(companyScores[0].score).to.equal(score1);
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
