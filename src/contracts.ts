import Web3 from "web3";
import { readFileSync } from "fs";
import BigNumber from "bignumber.js";
import { execPath } from "process";

const abi = JSON.parse(readFileSync("./abi.json", 'utf8'));

const network = 'sepolia';
const web3 = new Web3(
    new Web3.providers.HttpProvider(
        `https://sepolia.infura.io/v3/${process.env.INFURA_API}`,
    ),
);

const signer = web3.eth.accounts.privateKeyToAccount(
    process.env.WALLET_PRIVATE_KEY!
);
web3.eth.accounts.wallet.add(signer);

const contract = new web3.eth.Contract(
    abi,
    process.env.CONTRACT_ADDRESS,
);



async function uploadPinata(machine_addr: string, machine_cid: string, cid: string, location: string, timestamp: string, energy: number) {

    try {


        const metadata = {
            "description": "Offset and trade your cabon emmisions using blockvolt carbon token", 
            "external_url": "https://openseacreatures.io/3", 
            "image": "ipfs://QmWLBC5GqxcHKV4Ab8o3Ffvc8BWMZceRd9gq1Czjq8L2rL/blockvolt.png", 
            "attributes": {
                "provider": "blockvolt",
                "machine_cid": machine_cid,
                "machine_address": machine_addr,
                "cid": cid,
                "location": location,
                "timestamp": timestamp,
                "energy": energy

            }
        }

        const resp = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
            method: "POST",
            headers: {
                'pinata_api_key': process.env.PINATA_KEY!,
                'pinata_secret_api_key': process.env.PINATA_SECRET!,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(metadata)
        })

        const jsn = await resp.json()
        console.log(jsn)
        return jsn.IpfsHash

    } catch (e: any) {
        console.log(e)
    }
}

export async function safeMint(machine_addr: string, machine_cid: string, cid: string, location: string, timestamp: string, energy: number) {


    let ipfshash = await uploadPinata(machine_addr,machine_cid,cid,location,timestamp,energy);

    const method_abi = contract.methods.safeMint("0x375C11FD30FdC95e10aAD66bdcE590E1bccc6aFA", `ipfs://${ipfshash}`).encodeABI();
    let tx = {
        from: signer.address,
        to: contract.options.address,
        data: method_abi,
        value: '0',
        gasPrice: '100000000000',
        gas: BigInt(1)
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

// export async function mintInfo(machine_addr: string, machine_cid: string, cid: string, location: string, timestamp: string, energy: number) {

//     let ipfshash = await uploadPinata(machine_addr,machine_cid,cid,location,timestamp,energy);
//     await safeMint(ipfshash);
//     let supply = parseInt((await contract.methods.totalSupply().call())!.toString())

//     console.log(supply)
//     const method_abi = contract.methods.mintInfo(machine_addr, machine_cid, cid, location, timestamp, 2, supply - 1).encodeABI();
//     console.log("supply", supply);

//     let tx = {
//         from: signer.address,
//         to: contract.options.address,
//         data: method_abi,
//         value: 0.00001,
//         gasPrice: '100000000000',
//         gas: BigInt(1)
//     };

//     const gas_estimate = await web3.eth.estimateGas(tx);
//     tx.gas = gas_estimate;
//     const signedTx = await web3.eth.accounts.signTransaction(tx, signer.privateKey);
//     console.log("Raw transaction data: " + (signedTx).rawTransaction);
//     // Sending the transaction to the network
//     const receipt = await web3.eth
//         .sendSignedTransaction(signedTx.rawTransaction)
//         .once("transactionHash", (txhash) => {
//             console.log(`Mining transaction ...`);
//             console.log(`https://${network}.etherscan.io/tx/${txhash}`);
//         });
//     // The transaction is now on chain!
//     console.log(`Mined in block ${receipt.blockNumber}`);
// }
