import { useState, useEffect } from "react";
import { useWallet } from "../provider";
import { Button, Menu, MenuItem, Box, CircularProgress } from "@mui/material";
import chains from "../chanis.ts";
import wallets from "../wallets.ts";

export default function ConnectButton() {
  const {
    address,
    chainID,
    isConnected,
    isConnecting,
    provider,
    openModal,
    disconnect,
    switchChain,
    connectedResult,
    balance,
  } = useWallet();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [walletIcon, setWalletIcon] = useState<string>("");

  // 💰 获取余额
  useEffect(() => {
    // const fetchBalance = async () => {
    //     if (provider && address) {
    //         const balanceWei = await provider.getBalance(address);
    //         setBalance(parseFloat(formatEther(balanceWei)).toFixed(4));
    //     }
    // };

    const connectedWallet = wallets.find((w) => w.id === connectedResult.id);

    // if (isConnected) fetchBalance();

    if (connectedWallet) {
      setWalletIcon(connectedWallet.icon);
    }
  }, [provider, address, isConnected, chainID]); // ⚡ chainID变化时也刷新余额

  // 🧮 显示格式化的地址
  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  const handleNetworkClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNetworkClose = () => {
    setAnchorEl(null);
  };

  const handleSwitchChain = async (chainId: number) => {
    handleNetworkClose();
    try {
      await switchChain(chainId);
    } catch (err) {
      console.error("切换网络失败:", err);
    }
  };

  if (isConnecting)
    return (
      <Button
        variant="outlined"
        disabled
        startIcon={<CircularProgress size={14} />}
      >
        Connecting...
      </Button>
    );

  return (
    <Box display="flex" alignItems="center" gap={1}>
      {!isConnected ? (
        <Button
          variant="contained"
          color="primary"
          onClick={openModal}
          sx={{ borderRadius: "12px", paddingX: 2 }}
        >
          Connect
        </Button>
      ) : (
        <>
          {walletIcon && (
            <img
              alt="钱包图标"
              src={walletIcon}
              width={28}
              height={28}
              className="rounded-sm"
            />
          )}
          <Button
            variant="outlined"
            color="inherit"
            onClick={disconnect}
            sx={{ borderRadius: "12px", paddingX: 2 }}
          >
            {shortAddress} · {balance} ETH
          </Button>

          {/* 网络切换按钮 */}
          <Button
            variant="outlined"
            color="primary"
            onClick={handleNetworkClick}
            sx={{ borderRadius: "12px", paddingX: 2 }}
          >
            {chains.find((c) => c.id === chainID)?.name || "Unknown"}
          </Button>

          {/* 下拉菜单 */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleNetworkClose}
          >
            {chains.map((chain) => (
              <MenuItem
                key={chain.id}
                selected={chain.id === chainID}
                onClick={() => handleSwitchChain(chain.id)}
              >
                {chain.name}
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </Box>
  );
}
