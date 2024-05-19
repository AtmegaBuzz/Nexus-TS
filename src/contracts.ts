import Web3 from "web3";
import dotenv from "dotenv";
import { readFileSync } from "fs";

const abi = JSON.parse(readFileSync("./abi.json", 'utf8'));

const network = process.env.ETHEREUM_NETWORK;
const web3 = new Web3(
    new Web3.providers.HttpProvider(
        `https://sepolia.infura.io/v3/${process.env.INFURA_API}`,
    ),
);

const signer = web3.eth.accounts.privateKeyToAccount(
    process.env.WALLET_PRIVATE_KEY?
);
web3.eth.accounts.wallet.add(signer);

const contract = new web3.eth.Contract(
    abi,
    process.env.CONTRACT_ADDRESS,
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
