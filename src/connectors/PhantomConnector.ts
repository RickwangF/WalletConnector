import { ethers } from "ethers";
import type { WalletConnectResult } from "../type.ts";

export async function PhantomConnector({
  onAccountsChanged,
  onChainChanged,
  onDisconnect,
}: {
  onAccountsChanged?: (accounts: string[]) => void;
  onChainChanged?: (chainId: number, provider: ethers.BrowserProvider) => void;
  onDisconnect?: () => void;
} = {}): Promise<WalletConnectResult> {
  const phantom = (window as any).phantom?.ethereum;

  if (!phantom || !phantom.isPhantom) {
    throw new Error("Phantom Wallet 未安装或不支持 EVM 网络");
  }

  const provider = new ethers.BrowserProvider(phantom);
  await provider.send("eth_requestAccounts", []);

  if (phantom.on) {
    phantom.on("accountsChanged", (accounts: string[]) => {
      console.log("[Phantom Wallet] accountsChanged:", accounts);
      onAccountsChanged?.(accounts);
    });

    phantom.on("chainChanged", (chainIdHex: string) => {
      const chainId = Number(chainIdHex);
      const provider = new ethers.BrowserProvider(phantom);
      console.log("[Phantom Wallet] chainChanged:", chainId);
      onChainChanged?.(chainId, provider);
    });

    phantom.on("disconnect", (error: any) => {
      console.log("[Phantom Wallet] disconnect:", error);
      onDisconnect?.();
    });
  }

  return {
    id: "phantom",
    provider,
    walletType: "PhantomWallet",
    disconnectProcess: () => {
      phantom.removeAllListeners?.("accountsChanged");
      phantom.removeAllListeners?.("chainChanged");
      phantom.removeAllListeners?.("disconnect");
    },
  };
}
