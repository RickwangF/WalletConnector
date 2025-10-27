
import { useState, useEffect } from 'react';
import { useWallet } from '../provider';
import { formatEther } from 'ethers';
import { Button, Box, Typography, CircularProgress } from '@mui/material';

export default function ConnectButton() {
    const {
        address,
        isConnected,
        isConnecting,
        provider,
        openModal,
        disconnect,
    } = useWallet();

    const [balance, setBalance] = useState<string>('0');

    // 💰 获取余额
    useEffect(() => {
        const fetchBalance = async () => {
            // TODO: 
            // if (provider && address) {
            //     const balanceWei = await provider.getBalance(address);
            //     setBalance(parseFloat(formatEther(balanceWei)).toFixed(4));
            // }
        };

        if (isConnected) fetchBalance();
    }, [provider, address, isConnected]);

    // 🧮 显示格式化的地址
    const shortAddress = address
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : '';

    if (isConnecting)
        return (
            <Button variant="outlined" disabled startIcon={<CircularProgress size={14} />}>
                连接中...
            </Button>
        );

    return (
        <Box>
            {!isConnected ? (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={openModal}
                    sx={{ borderRadius: '12px', paddingX: 2 }}
                >
                    连接钱包
                </Button>
            ) : (
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={disconnect}
                    sx={{ borderRadius: '12px', paddingX: 2 }}
                >
                    {shortAddress} · {balance} ETH
                </Button>
            )}
        </Box>
    );
}
