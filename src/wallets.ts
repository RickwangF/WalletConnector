import type { Wallet } from './type.ts'
import {MetaMaskConnector} from "./connectors/MetaMaskConnector.ts";
import {OKXConnector} from "./connectors/OKXConnector.ts";
import {PhantomConnector} from "./connectors/PhantomConnector.ts";
import {CoinbaseConnector} from "./connectors/CoinbaseConnector.ts";
import matemaskIcon from './assets/metamask.png'
import okxIcon from './assets/okxwallet.png'
import phantomIcon from './assets/phantom.png'
import coinbaseIcon from './assets/coinbase.png'

const wallets: Wallet[] = [
    {
        id: "metamask",
        name: "MetaMask",
        icon: matemaskIcon,
        description: "最流行的以太坊钱包，支持大多数EVM链",
        connector: MetaMaskConnector,
        installed: typeof window !== "undefined" && (window as any).ethereum?.isMetaMask,
        downloadLink: "https://metamask.io/download/",
    },
    {
        id: "okx",
        name: "OKX Wallet",
        icon: okxIcon,
        description: "OKX 官方钱包，支持多链与DeFi生态",
        connector: OKXConnector,
        installed: typeof window !== "undefined" && !!(window as any).okxwallet,
        downloadLink: "https://www.okx.com/download",
    },
    {
        id: "phantom",
        name: "Phantom Wallet",
        icon: phantomIcon,
        description: "Phantom 是最受欢迎的 Solana 钱包，也支持以太坊和Polygon",
        connector: PhantomConnector,
        installed: typeof window !== "undefined" && !!(window as any).phantom,
        downloadLink: "https://phantom.app/download",
    },
    {
        id: "coinbase",
        name: "Coinbase Wallet",
        icon: coinbaseIcon,
        description: "Coinbase 官方钱包，支持EVM链与DApp交互",
        connector: CoinbaseConnector,
        installed: typeof window !== "undefined" && (window as any).coinbaseWalletExtension,
        downloadLink: "https://www.coinbase.com/wallet/downloads",
    },
]

export default wallets;