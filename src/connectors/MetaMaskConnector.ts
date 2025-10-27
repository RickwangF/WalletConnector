import { ethers } from "ethers";
import type { WalletConnectResult } from '../type.ts'

export async function MetaMaskConnector({
                                            onAccountsChanged,
                                            onChainChanged,
                                            onDisconnect,
                                        }: {
    onAccountsChanged?: (accounts: string[]) => void;
    onChainChanged?: (chainId: number) => void;
    onDisconnect?: () => void;
} = {}) : Promise<WalletConnectResult> {
    const ethereum = (window as any).ethereum;

    // 1️⃣ 检查 MetaMask 是否存在
    if (!ethereum || !ethereum.isMetaMask) {
        throw new Error("MetaMask 未安装");
    }

    // 2️⃣ 创建 provider 并请求授权
    const provider = new ethers.BrowserProvider(ethereum);
    await provider.send("eth_requestAccounts", []);

    // 3️⃣ 注册事件监听（如存在）
    if (ethereum.on) {
        // 账户切换
        ethereum.on("accountsChanged", (accounts: string[]) => {
            console.log("[MetaMask] accountsChanged:", accounts);
            onAccountsChanged?.(accounts);
        });

        // 链切换
        ethereum.on("chainChanged", (chainIdHex: string) => {
            const chainId = Number(chainIdHex);
            console.log("[MetaMask] chainChanged:", chainId);
            onChainChanged?.(chainId);
        });

        // 断开连接
        ethereum.on("disconnect", (error: any) => {
            console.log("[MetaMask] disconnect:", error);
            onDisconnect?.();
        });
    }

    // 4️⃣ 返回连接结果
    return {
        id: 'metamask',
        provider,
        walletType: "MetaMask",
        disconnectProcess: () => {
            // MetaMask 无法真正“断开连接”，但可以触发清理逻辑
            ethereum.removeAllListeners?.("accountsChanged");
            ethereum.removeAllListeners?.("chainChanged");
            ethereum.removeAllListeners?.("disconnect");
        },
    };
}
