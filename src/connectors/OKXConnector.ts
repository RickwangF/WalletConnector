import { ethers } from "ethers";
import type { WalletConnectResult } from '../type.ts'

export async function OKXConnector({
                                       onAccountsChanged,
                                       onChainChanged,
                                       onDisconnect,
                                   }: {
    onAccountsChanged?: (accounts: string[]) => void;
    onChainChanged?: (chainId: number) => void;
    onDisconnect?: () => void;
} = {}) : Promise<WalletConnectResult> {
    const okx = (window as any).okxwallet || (window as any).ethereum;

    if (!okx || !okx.isOkxWallet) {
        throw new Error("OKX Wallet 未安装");
    }

    const provider = new ethers.BrowserProvider(okx);
    await provider.send("eth_requestAccounts", []);

    if (okx.on) {
        okx.on("accountsChanged", (accounts: string[]) => {
            console.log("[OKX Wallet] accountsChanged:", accounts);
            onAccountsChanged?.(accounts);
        });

        okx.on("chainChanged", (chainIdHex: string) => {
            const chainId = Number(chainIdHex);
            console.log("[OKX Wallet] chainChanged:", chainId);
            onChainChanged?.(chainId);
        });

        okx.on("disconnect", (error: any) => {
            console.log("[OKX Wallet] disconnect:", error);
            onDisconnect?.();
        });
    }

    return {
        id: 'okx',
        provider,
        walletType: "OKX Wallet",
        disconnectProcess: () => {
            okx.removeAllListeners?.("accountsChanged");
            okx.removeAllListeners?.("chainChanged");
            okx.removeAllListeners?.("disconnect");
        },
    };
}
