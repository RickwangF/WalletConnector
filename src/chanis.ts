const chains = [
    {
        id: 11_155_111,
        name: 'Sepolia',
        currency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
        rpcUrl: 'https://sepolia.drpc.org',
        blockExplorer: {
            name: 'Etherscan',
            url: 'https://sepolia.etherscan.io',
            apiUrl: 'https://api-sepolia.etherscan.io/api',
        },
        testnet: true,
    }, {
        id: 1,
        name: 'Ethereum',
        currency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrl: 'https://eth.merkle.io',
        blockExplorer: {
            name: 'Etherscan',
            url: 'https://etherscan.io',
            apiUrl: 'https://api.etherscan.io/api',
        },
        testnet: false
    }
]

export default chains;