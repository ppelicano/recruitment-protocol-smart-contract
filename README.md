# Contract RecruitmentProtocol:

## Methods

### - initialDeposit (clientAddress address, month1 uint256, month2 uint256, month3 uint256) payable
  sent amount => 1000 usdt fixed
  returns transactionHash => jobid
  money deposited is transferable

#### Initial deposits dashboard
  table: date of deposit / wallet address / chain / stable coin symbol / joiId / jobTitle ???

#### Offchain data (IPFS ???)
  add IPNS logic for latest changed content
  build user data JSON logic

### - finalDeposit (jobId hash, amount uint256) payable
  sent amount => 25% anual salary - initial 1000 usdt
  money is locked in
