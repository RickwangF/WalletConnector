export type Chain = {
    id: number;
    name: string;
    rpcUrl: string;
    currency: {
        name: string;
        symbol: string;
        decimals: number;
    },
    blockExplorer: {
        name: string;
        url: string;
        apiUrl: string;
    },
    testnet: boolean
}

export interface WalletState {
    address: string | null;
    chainID: number | null;
    isConnecting: boolean;
    isConnected: boolean;
    ensName: string | null;
    error: Error | null;
    chains: Chain[];
    provider: any;
    wallets: Wallet[];
    isOpen: boolean;
}

export interface WalletContextValue extends WalletState {
    connect: (walletID: string) => Promise<void>;
    disconnect: () => Promise<void>;
    switchChain: (chainID: number) => Promise<void>;
    openModal: () => void;
    closeModal: () => void;
}

export type WalletProviderProps = {
    children: React.ReactNode;
    chains: Chain[];
    wallets: Wallet[];
    autoConnect?: boolean;
    provider?: any;
}

export interface Wallet {
    id: string,
    name: string,
    icon: string,
    connector: () => Promise<any>,
    description?: string,
    installed?: boolean,
    downloadLink?: string
}