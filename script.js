const contractAddress = "0x3BC3fBDE8F07A2647d74641078cda800C766f9af"
const abi = [
    {
        "inputs": [
            {
                "internalType": "enum Game.Items",
                "name": "item",
                "type": "uint8"
            }
        ],
        "name": "game",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_minBid",
                "type": "uint256"
            }
        ],
        "stateMutability": "payable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "player",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "wonValue",
                "type": "uint256"
            }
        ],
        "name": "GamePlayed",
        "type": "event"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    },
    {
        "inputs": [],
        "name": "gameId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "minBid",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "results",
        "outputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "enum Game.Result",
                "name": "result",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

const provider = new ethers.providers.Web3Provider(window.ethereum, 97);

let signer;
let contract;

const Result = Object.freeze({
    0: "Won",
    1: "Draw",
    2: "Lost"
});

provider.send("eth_requestAccounts", []).then(() => {
    provider.listAccounts().then((accounts) => {
        signer = provider.getSigner(accounts[0]);
        contract = new ethers.Contract(contractAddress, abi, signer);
        getPreviousGames()
    });
});

async function game(idx) {
    let bidEth = document.getElementById('bid').value
    bid = Number(bidEth) * 10 ** 18
    await contract.game(idx, { value: bid, gasLimit: 5000000 });
    setTimeout(
        window.location = window.location.href,
        7000
    )
}

async function getPreviousGames() {
    const maxID = Number(await contract.gameId());
    let resStr = ""
    for (let id = maxID; id >= 1; id--) {
        let result = await contract.results(id)
        let amount = Number(result.amount) / 10 ** 18
        resStr += `${result.user} | ${String(amount + "eth")} | ${Result[result.result]} <br/>`
    }
    document.getElementById('results').innerHTML = resStr
}