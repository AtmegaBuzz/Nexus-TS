import Web3 from "web3";

import { readFileSync } from "fs";
const abi = JSON.parse(readFileSync("./abi.json", 'utf8'));

const network = process.env.ETHEREUM_NETWORK;
const web3 = new Web3(
    new Web3.providers.HttpProvider(
        `https://sepolia.infura.io/v3/ed98fbfcd55f46489f27a07dcdbeb869`,
    ),
);

const signer = web3.eth.accounts.privateKeyToAccount(
    "0xe5875d5550484e5f20bfa8efe3976432890ba8e43f3b77dd37375f61c0acfc2d"
);
web3.eth.accounts.wallet.add(signer);

const contract = new web3.eth.Contract(
    abi,
    "0xa4061cdFf9f8d286B9FB8fB54C010Ab91E69443a",
);


async function safeMint() {

    const method_abi = contract.methods.safeMint("0x375C11FD30FdC95e10aAD66bdcE590E1bccc6aFA", "fuck").encodeABI();
    let tx = {
        from: signer.address,
        to: contract.options.address,
        data: method_abi,
        value: '0',
        gasPrice: '100000000000',
        gas: 12
    };

    const gas_estimate = await web3.eth.estimateGas(tx);
    tx.gas = gas_estimate;
    const signedTx = await web3.eth.accounts.signTransaction(tx, signer.privateKey);
    console.log("Raw transaction data: " + (signedTx).rawTransaction);
    // Sending the transaction to the network
    const receipt = await web3.eth
        .sendSignedTransaction(signedTx.rawTransaction)
        .once("transactionHash", (txhash) => {
            console.log(`Mining transaction ...`);
            console.log(`https://${network}.etherscan.io/tx/${txhash}`);
        });
    // The transaction is now on chain!
    console.log(`Mined in block ${receipt.blockNumber}`);
}

async function mintInfo(machine_addr: string, machine_cid: string,cid: string,location: string,timestamp: string,energy: number) {

    await safeMint();
    let supply = parseInt((await contract.methods.totalSupply().call())!.toString())

    const method_abi = contract.methods.mintInfo(machine_addr,machine_cid,cid,location,timestamp,energy,supply-1).encodeABI();

    let tx = {
        from: signer.address,
        to: contract.options.address,
        data: method_abi,
        value: '0',
        gasPrice: '100000000000',
    };

    const gas_estimate = await web3.eth.estimateGas(tx);
    tx.gas = gas_estimate;
    const signedTx = await web3.eth.accounts.signTransaction(tx, signer.privateKey);
    console.log("Raw transaction data: " + (signedTx).rawTransaction);
    // Sending the transaction to the network
    const receipt = await web3.eth
        .sendSignedTransaction(signedTx.rawTransaction)
        .once("transactionHash", (txhash) => {
            console.log(`Mining transaction ...`);
            console.log(`https://${network}.etherscan.io/tx/${txhash}`);
        });
    // The transaction is now on chain!
    console.log(`Mined in block ${receipt.blockNumber}`);
}
