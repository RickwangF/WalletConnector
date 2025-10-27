
import './App.css'
import { WalletProvider } from './provider/index.tsx'
import {BrowserProvider} from "ethers";
import chains from './chanis.ts'
import ConnectButton from "./components/ConnectButton.tsx";
import WalletModal from "./components/WalletModal.tsx";
import wallets from "./wallets.ts";

declare global {
    interface Window {
        ethereum: any
    }
}

const provider = new BrowserProvider(window.ethereum);

function App() {
  return (
    <>
      <WalletProvider chains={chains} provider={provider} autoConnect={true} wallets={wallets}>
          <ConnectButton />
          <WalletModal />
      </WalletProvider>
    </>
  )
}

export default App
