import { useState } from 'react';
import { useWallet } from '../provider';
import { stake } from '../lib/contract.ts'

export default function SendEthButton() {
    const contactAddress = '0x01A01E8B862F10a3907D0fC7f47eBF5d34190341'

    const { sendTransaction } = useWallet();
    const [isSending, setIsSending] = useState(false);

    const handleSend = async () => {
        if (isSending) return; // 避免重复点击
        setIsSending(true);

        try {
            const txReceipt = await stake(contactAddress, 0.001)
            sendTransaction(txReceipt)
            console.log('交易完成:', txReceipt);
            alert('✅ 交易已确认!');
        } catch (err: any) {
            console.error('交易失败', err);
            alert('❌ 交易失败: ' + (err.message || err));
        } finally {
            setIsSending(false);
        }
    };

    return (
        <button
            onClick={handleSend}
            disabled={isSending}
            style={{
                marginTop: '20px',
                padding: '10px 20px',
                borderRadius: '8px',
                backgroundColor: isSending ? '#999' : '#4caf50',
                color: '#fff',
                cursor: isSending ? 'not-allowed' : 'pointer'
            }}
        >
            {isSending ? '交易进行中...' : 'Send 0.001 ETH'}
        </button>
    );
}
