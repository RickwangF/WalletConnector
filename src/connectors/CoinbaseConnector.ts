import { ethers } from "ethers";
import type { WalletConnectResult } from '../type.ts'

export async function CoinbaseConnector({
                                            onAccountsChanged,
                                            onChainChanged,
                                            onDisconnect,
                                        }: {
    onAccountsChanged?: (accounts: string[]) => void;
    onChainChanged?: (chainId: number) => void;
    onDisconnect?: () => void;
} = {}) : Promise<WalletConnectResult> {
    const coinbase = (window as any).coinbaseWalletExtension || (window as any).ethereum;

    if (!coinbase || !coinbase.isCoinbaseWallet) {
        throw new Error("Coinbase Wallet 未安装");
    }

    const provider = new ethers.BrowserProvider(coinbase);
    await provider.send("eth_requestAccounts", []);

    if (coinbase.on) {
        coinbase.on("accountsChanged", (accounts: string[]) => {
            console.log("[Coinbase Wallet] accountsChanged:", accounts);
            onAccountsChanged?.(accounts);
        });

        coinbase.on("chainChanged", (chainIdHex: string) => {
            const chainId = Number(chainIdHex);
            console.log("[Coinbase Wallet] chainChanged:", chainId);
            onChainChanged?.(chainId);
        });

        coinbase.on("disconnect", (error: any) => {
            console.log("[Coinbase Wallet] disconnect:", error);
            onDisconnect?.();
        });
    }

    return {
        id: 'coinbase',
        provider,
        walletType: "Coinbase Wallet",
        disconnectProcess: () => {
            coinbase.removeAllListeners?.("accountsChanged");
            coinbase.removeAllListeners?.("chainChanged");
            coinbase.removeAllListeners?.("disconnect");
        },
    };
}
