
import './App.css'
import { WalletProvider } from './provider/index.tsx'
import {BrowserProvider} from "ethers";
import type {Wallet} from './type.ts'
import ConnectButton from "./components/ConnectButton.tsx";
import WalletModal from "./components/WalletModal.tsx";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";

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

declare global {
    interface Window {
        ethereum: any
    }
}

const provider = new BrowserProvider(window.ethereum);

// 钱包列表
const wallets: Wallet[] = [
    {
        id: "metamask",
        name: "MetaMask",
        icon: "https://play-lh.googleusercontent.com/lm6Rk4Qc3eXUIxC8qkFCj46Bho6fbi6Lu3TwWuS3JNU2bBEcNU61arw_wG5wA0c-4IE=w240-h480-rw",
        description: "最流行的以太坊钱包，支持大多数EVM链",
        connector: async () => {
            const provider = (window as any).metaMask?.ethereum;
            if (!provider) throw new Error("MetaMask Wallet 未安装");
            await provider.request({ method: "eth_requestAccounts" });
            return new ethers.BrowserProvider(provider);
        },
        installed: typeof window !== "undefined" && (window as any).ethereum?.isMetaMask,
        downloadLink: "https://metamask.io/download/",
    },
    {
        id: "okx",
        name: "OKX Wallet",
        icon: "https://play-lh.googleusercontent.com/N00SbjLJJrhg4hbdnkk3Llk2oedNNgCU29DvR9cpep7Lr0VkzvBkmLqajWNgFb0d7IOO=w240-h480-rw",
        description: "OKX 官方钱包，支持多链与DeFi生态",
        connector: async () => {
            const provider = (window as any).okxwallet?.ethereum;
            if (!provider) throw new Error("OKX Wallet 未安装");
            await provider.request({ method: "eth_requestAccounts" });
            return new ethers.BrowserProvider(provider);
        },
        installed: typeof window !== "undefined" && !!(window as any).okxwallet,
        downloadLink: "https://www.okx.com/download",
    },
    {
        id: "phantom",
        name: "Phantom Wallet",
        icon: "https://play-lh.googleusercontent.com/bPCH5e3tVc-ixf0viNf8n1727-pSDPmP0W20fypVl1GSLcpcHU6ZwGRv4arIad20gXk=s94-rw",
        description: "Phantom 是最受欢迎的 Solana 钱包，也支持以太坊和Polygon",
        connector: async () => {
            const provider = (window as any).phantom?.ethereum || (window as any).phantom?.solana;
            if (!provider) throw new Error("Phantom 未安装");
            // 根据链类型（Solana/EVM）选择连接方法
            if (provider.isPhantom) {
                await provider.connect();
            } else {
                await provider.request({ method: "eth_requestAccounts" });
            }
            return new ethers.BrowserProvider(provider);
        },
        installed: typeof window !== "undefined" && !!(window as any).phantom,
        downloadLink: "https://phantom.app/download",
    },
    {
        id: "coinbase",
        name: "Coinbase Wallet",
        icon: "https://avatars.githubusercontent.com/u/1885080?s=200&v=4",
        description: "Coinbase 官方钱包，支持EVM链与DApp交互",
        connector: async () => {
            const { CoinbaseWalletSDK } = await import("@coinbase/wallet-sdk");
            const sdk = new CoinbaseWalletSDK({
                appName: "Your DApp",
                appLogoUrl: "/logo.png",
            });
            const provider = sdk.makeWeb3Provider("https://mainnet.infura.io/v3/YOUR_INFURA_ID", 1);
            await provider.request({ method: "eth_requestAccounts" });
            return new ethers.BrowserProvider(provider as any);
        },
        installed: typeof window !== "undefined" && (window as any).coinbaseWalletExtension,
        downloadLink: "https://www.coinbase.com/wallet/downloads",
    },
];

function App() {
  return (
    <>
      <WalletProvider chains={chains} provider={provider} autoConnect={true} wallets={wallets}>
          <div className="flex content-center items-center bg-blue-400 min-w-2xl min-h-20">
                Wallet Connector
          </div>
          <ConnectButton />
          <WalletModal />
      </WalletProvider>
    </>
  )
}

export default App
