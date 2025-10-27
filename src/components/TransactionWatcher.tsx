import { useWaitForTransactionReceipt } from 'wagmi'
import {useEffect} from 'react'
import { useWallet } from '../provider'

function TransactionWatcher({ txHash }: { txHash?: `0x${string}` }) {
    const { refreshBalance } = useWallet()

    const { isSuccess } = useWaitForTransactionReceipt({
        hash: txHash,
        confirmations: 1,
    })

    useEffect(() => {
        if (isSuccess) {
            refreshBalance()
        }
    }, [isSuccess])

    return null
}

