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
    }
})

export const WalletProvider: React.FC<WalletProviderProps> = ({ children, wallets, chains, provider, autoConnect }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [state, setState] = useState<WalletState>({
        address: '',
        chainID: 0,
        isConnected: false,
        isConnecting: false,
        ensName: '',
        error: null,
        isOpen: isModalOpen,
        chains,
        provider,
        wallets
    })

    const value: WalletContextValue = {
        ...state,
        connect: async ()=> {},
        disconnect: async () => {},
        switchChain: async () => {},
        openModal: () => {
            setIsModalOpen(true);
        },
        closeModal: () => {
            setIsModalOpen(false);
        }
    }

    useEffect(() => {
        if (autoConnect) {
            console.log('')
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