import {useState, createContext, useEffect, useContext} from "react";
import type { WalletContextValue, WalletState, WalletProviderProps } from "../type.ts";

const WalletContext = createContext<WalletContextValue>({
    address: '',
    chainID: 0,
    isConnecting: false,
    isConnected: false,
    ensName: '',
    error: null,
    chains: [],
    wallets: [],
    isOpen: false,
    openModal(): void {

    },
    closeModal(): void {

    },
    connect(walletID: string): Promise<void> {
        console.log(walletID);
        return Promise.resolve(undefined);
    },
    disconnect(): Promise<void> {
        return Promise.resolve(undefined);
    },
    provider: undefined,
    switchChain(chainID: number): Promise<void> {
        console.log(chainID);
        return Promise.resolve(undefined);
    },
    connectedRsult: {
        id: '',
        provider: undefined,
        walletType: '',
        disconnectProcess: () => {}
    }
})

export const WalletProvider: React.FC<WalletProviderProps> = ({ children, wallets, chains, provider, autoConnect }) => {

    const [state, setState] = useState<WalletState>({
        address: '',
        chainID: 0,
        isConnected: false,
        isConnecting: false,
        ensName: '',
        error: null,
        isOpen: false,
        chains,
        provider,
        wallets,
        connectedRsult:{
            id: '',
            provider: undefined,
            walletType: '',
            disconnectProcess: () => {}
        }
    })

    const disconnect = async () => {
        try {
            if (state.connectedRsult) {
                state.connectedRsult.disconnectProcess()
            }

            setState(prev => ({
                ...prev,
                address: null,
                chainID: null,
                provider: null,
                isConnected: false,
                error: null,
                connectedRsult: {
                    id: '',
                    provider: undefined,
                    walletType: '',
                    disconnectProcess: () => {}
                }
            }));

            localStorage.removeItem("connectedWalletID");
        } catch (err) {
            console.error("[WalletProvider] disconnect failed:", err);
        }
    };

    const connect = async (walletID: string) => {
        const wallet = wallets.find((w) => w.id === walletID);
        if (!wallet) throw new Error("未找到钱包: " + walletID);

        try {
            setState((prev) => ({ ...prev, isConnecting: true }));

            const connector = wallet.connector;

            // 传入事件回调
            const { provider, walletType, disconnectProcess } = await connector({
                onAccountsChanged: (accounts) => {
                    if (accounts.length === 0) disconnect();
                    else setState((prev) => ({ ...prev, address: accounts[0] }));
                },
                onChainChanged: (chainId) => {
                    setState((prev) => ({ ...prev, chainID: chainId }));
                },
                onDisconnect: () => {
                    disconnect();
                },
            });

            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const network = await provider.getNetwork();

            setState({
                ...state,
                address,
                chainID: Number(network.chainId),
                isConnected: true,
                isConnecting: false,
                chains,
                provider,
                isOpen: false,
                connectedRsult: {
                    id: walletID,
                    provider,
                    walletType,
                    disconnectProcess
                }
            });

            localStorage.setItem("connectedWalletID", walletID);
        } catch (err: any) {
            console.error("连接失败", err);
            setState((prev) => ({ ...prev, isConnecting: false, error: err }));
        }
    };

    const switchChain = async (chainID: number) => {
        const ethereum = (window as any).ethereum;
        if (!ethereum) {
            console.error("[WalletProvider] 未检测到钱包实例");
            return;
        }

        const hexChainId = "0x" + chainID.toString(16); // 转为16进制字符串
        console.log("[WalletProvider] Request switch to chain:", hexChainId);

        try {
            // 尝试切换网络
            await ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: hexChainId }],
            });

            // 更新 Context 中的 chainID
            setState((prev) => ({
                ...prev,
                chainID,
            }));

            console.log("[WalletProvider] 切换网络成功:", chainID);
            if (state.connectedRsult.id) {
                connect(state.connectedRsult.id)
            }

        } catch (error: any) {
            // 如果钱包未添加此链，添加之
            if (error.code === 4902) {
                const targetChain = chains.find((c) => c.id === chainID);
                if (!targetChain) throw new Error("未知链 ID：" + chainID);

                try {
                    await ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            {
                                chainId: hexChainId,
                                chainName: targetChain.name,
                                nativeCurrency: targetChain.currency,
                                rpcUrls: [targetChain.rpcUrl],
                                blockExplorerUrls: [targetChain.blockExplorer.url],
                            },
                        ],
                    });

                    // 添加成功后再切换
                    await ethereum.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: hexChainId }],
                    });

                    setState((prev) => ({
                        ...prev,
                        chainID,
                    }));

                    console.log("[WalletProvider] 成功添加并切换到:", targetChain.name);
                } catch (addError) {
                    console.error("[WalletProvider] 添加链失败:", addError);
                }
            } else {
                console.error("[WalletProvider] 切换链失败:", error);
            }
        }
    };

    const value: WalletContextValue = {
        ...state,
        connect,
        disconnect,
        switchChain,
        openModal: () => {
            setState({
                ...state,
                isOpen: true
            })
        },
        closeModal: () => {
            setState({
                ...state,
                isOpen: false
            })
        }
    }

    useEffect(() => {
        const cahcedConnectedWalletID = localStorage.getItem("connectedWalletID");
        if (autoConnect && !state.isConnected && cahcedConnectedWalletID) {
            console.log('autoLogin cached walletID :', cahcedConnectedWalletID);
            connect(cahcedConnectedWalletID)
        }
    }, []);

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    )
}

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error()
    }
    return context
}

export default WalletProvider