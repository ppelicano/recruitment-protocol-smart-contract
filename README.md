# Install & Test & Deploy

## Install
1) clone the repo
2) run command: npm install 
3) create a secret.json at the root of the project. Contents should look like:
{
    "mnemonic": [YOUR_MNEMONIC],
    "privateKey": [YOUR_PRIVATE_KET],
    "alchemyHost": "https://eth-goerli.g.alchemy.com/v2/ewNr6i4d6jtZsJJqY973pKtJUrQRQTzS",
    "webProjectPath": [FULL_PATH_TO_SOMEWHERE_YOU_HAVE_YOUR_WEB_PROJECT_RUNNING],
    ...
}
notes: 
- .gitignore is already excluding this file but make sure you don't commit and push this
- FULL_PATH_TO_SOMEWHERE_YOU_HAVE_YOUR_WEB_PROJECT_RUNNING: if you don't have your web project setup just add any folder path. This is only going to output an addresses.json file which contains the newly deployed smart contract addresses

## Test
1) build by running: npm run build
2) test locally by running: npm run test

## Deploy
1) deploy on goerli testnet by running: npm run test:goerli
note: you must have some test eth on goerli to do the above. If you don't hold and test eth you can get it from: https://goerlifaucet.com/


# Frontdoor technical design

<div align="center">
    <img  src="https://raw.githubusercontent.com/ppelicano/recruitment-protocol-smart-contract/main/screenshots/infrastructure-diagram.png" />
</div>


# hackonchain hackathon scope

The main goal is to have the referral flow working. For this we will need a smart contract method to write and read referrals

## Referral write method

input parameters: 
- referrer wallet address: address (sender)
- jobid: string
- referee wallet address: address
- referee email: string

notes: at least one (referee wallet address or email must be sent for the method to process). The idea is to have an onchain data relation between referrers and the referred candidates/referees.

output parameters:
- transaction hash of the sucessful transaction is enough

## Referral read method

input parameters:
- referrer wallet address

output parameters:
- a list of emails and wallet addresses and related jobids that this referrer has referred up to present time. Basically what was written in the write method. Note it is imperative that only referrer can see his/her referrals. The emails should be hidden onchain. Either we use encryption or make sure they are not readable by someone else.

