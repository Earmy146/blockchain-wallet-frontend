/**
 * Transaction Item Component
 * File: src/components/transaction/TransactionItem.jsx
 */

import { ArrowUpRight, ArrowDownLeft, ExternalLink, Clock, CheckCircle, XCircle } from 'lucide-react'
import { useWallet } from '../../context/WalletContext'
import { formatAddress, formatEth, formatDateRelative, getExplorerTxUrl } from '../../utils/formatter'
import clsx from 'clsx'

const TransactionItem = ({ transaction }) => {
  const { walletAddress } = useWallet()
  
  const isSend = transaction.type === 'send'
  const isConfirmed = transaction.status === 'confirmed'
  const isPending = transaction.status === 'pending'
  const isFailed = transaction.status === 'failed'
  
  const StatusIcon = isPending ? Clock : isConfirmed ? CheckCircle : XCircle
  const statusColor = isPending ? 'text-yellow-500' : isConfirmed ? 'text-green-500' : 'text-red-500'
  const statusBg = isPending ? 'bg-yellow-500' : isConfirmed ? 'bg-green-500' : 'bg-red-500'

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg transition-colors">
      {/* Icon */}
      <div className={clsx(
        'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
        isSend ? 'bg-red-500 bg-opacity-20' : 'bg-green-500 bg-opacity-20'
      )}>
        {isSend ? (
          <ArrowUpRight className="w-5 h-5 text-red-400" />
        ) : (
          <ArrowDownLeft className="w-5 h-5 text-green-400" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-100">
            {isSend ? 'Gửi' : 'Nhận'}
          </span>
          <div className={clsx(
            'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs',
            statusBg, 'bg-opacity-20'
          )}>
            <StatusIcon className={clsx('w-3 h-3', statusColor)} />
            <span className={statusColor}>
              {isPending ? 'Pending' : isConfirmed ? 'Confirmed' : 'Failed'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{isSend ? 'To' : 'From'}:</span>
          <code className="font-mono">
            {formatAddress(isSend ? transaction.to : transaction.from, 6, 4)}
          </code>
          <span>•</span>
          <span>{formatDateRelative(transaction.createdAt)}</span>
        </div>
      </div>

      {/* Amount */}
      <div className="text-right">
        <div className={clsx(
          'text-base font-semibold',
          isSend ? 'text-red-400' : 'text-green-400'
        )}>
          {isSend ? '-' : '+'}{formatEth(transaction.amount)} ETH
        </div>
        {transaction.totalFee && transaction.totalFee !== '0' && (
          <div className="text-xs text-gray-500">
            Fee: {parseFloat(transaction.totalFee).toFixed(6)} ETH
          </div>
        )}
      </div>

      {/* Explorer Link */}
      <a
        href={transaction.explorerUrl || getExplorerTxUrl(transaction.txHash, transaction.network)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 p-2 hover:bg-gray-700 rounded-lg transition-colors"
        title="Xem trên Explorer"
      >
        <ExternalLink className="w-4 h-4 text-gray-400 hover:text-gray-100" />
      </a>
    </div>
  )
}

export default TransactionItem