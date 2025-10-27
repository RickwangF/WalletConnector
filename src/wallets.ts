import type { Wallet } from './type.ts'
import {MetaMaskConnector} from "./connectors/MetaMaskConnector.ts";
import {OKXConnector} from "./connectors/OKXConnector.ts";
import {PhantomConnector} from "./connectors/PhantomConnector.ts";
import {CoinbaseConnector} from "./connectors/CoinbaseConnector.ts";

const wallets: Wallet[] = [
    {
        id: "metamask",
        name: "MetaMask",
        icon: "https://play-lh.googleusercontent.com/lm6Rk4Qc3eXUIxC8qkFCj46Bho6fbi6Lu3TwWuS3JNU2bBEcNU61arw_wG5wA0c-4IE=w240-h480-rw",
        description: "最流行的以太坊钱包，支持大多数EVM链",
        connector: MetaMaskConnector,
        installed: typeof window !== "undefined" && (window as any).ethereum?.isMetaMask,
        downloadLink: "https://metamask.io/download/",
    },
    {
        id: "okx",
        name: "OKX Wallet",
        icon: "https://play-lh.googleusercontent.com/N00SbjLJJrhg4hbdnkk3Llk2oedNNgCU29DvR9cpep7Lr0VkzvBkmLqajWNgFb0d7IOO=w240-h480-rw",
        description: "OKX 官方钱包，支持多链与DeFi生态",
        connector: OKXConnector,
        installed: typeof window !== "undefined" && !!(window as any).okxwallet,
        downloadLink: "https://www.okx.com/download",
    },
    {
        id: "phantom",
        name: "Phantom Wallet",
        icon: "https://play-lh.googleusercontent.com/bPCH5e3tVc-ixf0viNf8n1727-pSDPmP0W20fypVl1GSLcpcHU6ZwGRv4arIad20gXk=s94-rw",
        description: "Phantom 是最受欢迎的 Solana 钱包，也支持以太坊和Polygon",
        connector: PhantomConnector,
        installed: typeof window !== "undefined" && !!(window as any).phantom,
        downloadLink: "https://phantom.app/download",
    },
    {
        id: "coinbase",
        name: "Coinbase Wallet",
        icon: "https://avatars.githubusercontent.com/u/1885080?s=200&v=4",
        description: "Coinbase 官方钱包，支持EVM链与DApp交互",
        connector: CoinbaseConnector,
        installed: typeof window !== "undefined" && (window as any).coinbaseWalletExtension,
        downloadLink: "https://www.coinbase.com/wallet/downloads",
    },
]

export default wallets;