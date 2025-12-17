/**
 * Send Form Component
 * File: src/components/transaction/SendForm.jsx
 */

import { useState, useEffect } from 'react'
import { Send, AlertCircle } from 'lucide-react'
import { useWallet } from '../../context/WalletContext'
import { useToast } from '../../context/ToastContext'
import { validateSendForm } from '../../utils/validation'
import { formatEth } from '../../utils/formatter'
import Input from '../common/Input'
import Button from '../common/Button'
import Card from '../common/Card'

const SendForm = ({ onSuccess }) => {
  const { balance, sendTransaction, estimateGasFee } = useWallet()
  const toast = useToast()

  const [formData, setFormData] = useState({
    toAddress: '',
    amount: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [gasEstimate, setGasEstimate] = useState(null)
  const [estimating, setEstimating] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error khi user nhập
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Auto estimate gas khi có đủ toAddress và amount
  useEffect(() => {
    const estimateGas = async () => {
      if (formData.toAddress && formData.amount) {
        try {
          setEstimating(true)
          const estimate = await estimateGasFee(formData.toAddress, formData.amount)
          setGasEstimate(estimate)
        } catch (error) {
          setGasEstimate(null)
        } finally {
          setEstimating(false)
        }
      } else {
        setGasEstimate(null)
      }
    }

    const debounce = setTimeout(estimateGas, 500)
    return () => clearTimeout(debounce)
  }, [formData.toAddress, formData.amount, estimateGasFee])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate
    const validationErrors = validateSendForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // Kiểm tra số dư
    const totalRequired = parseFloat(formData.amount) + (gasEstimate ? parseFloat(gasEstimate.estimatedFee.split(' ')[0]) : 0)
    if (parseFloat(balance) < totalRequired) {
      toast.error('Số dư không đủ để thực hiện giao dịch')
      return
    }

    try {
      setLoading(true)
      
      const tx = await sendTransaction(
        formData.toAddress,
        formData.amount,
        formData.password
      )

      toast.success('Giao dịch đã được gửi thành công!')
      
      // Reset form
      setFormData({ toAddress: '', amount: '', password: '' })
      setGasEstimate(null)
      
      // Callback
      if (onSuccess) onSuccess(tx)
      
    } catch (error) {
      toast.error(error.message || 'Gửi giao dịch thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* To Address */}
        <Input
          label="Địa chỉ người nhận"
          name="toAddress"
          type="text"
          placeholder="0x..."
          value={formData.toAddress}
          onChange={handleChange}
          error={errors.toAddress}
          required
        />

        {/* Amount */}
        <div>
          <Input
            label="Số tiền"
            name="amount"
            type="number"
            step="0.000001"
            placeholder="0.0"
            value={formData.amount}
            onChange={handleChange}
            error={errors.amount}
            helperText={`Số dư: ${formatEth(balance)} ETH`}
            required
          />
          
          {/* Quick Amount Buttons */}
          <div className="flex gap-2 mt-2">
            {[0.001, 0.01, 0.1].map(amount => (
              <button
                key={amount}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, amount: amount.toString() }))}
                className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors text-gray-300"
              >
                {amount} ETH
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                const maxAmount = Math.max(0, parseFloat(balance) - 0.001) // Reserve for gas
                setFormData(prev => ({ ...prev, amount: maxAmount.toFixed(6) }))
              }}
              className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors text-gray-300"
            >
              Max
            </button>
          </div>
        </div>

        {/* Gas Estimate */}
        {estimating && (
          <div className="p-3 bg-gray-800 border border-gray-700 rounded-lg">
            <p className="text-sm text-gray-400">Đang ước tính phí gas...</p>
          </div>
        )}
        
        {gasEstimate && !estimating && (
          <div className="p-4 bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5" />
              <div className="flex-1 text-sm">
                <p className="text-blue-400 font-medium mb-1">Ước tính phí giao dịch</p>
                <div className="space-y-1 text-blue-300">
                  <p>Gas: {gasEstimate.estimatedFee}</p>
                  <p>Tổng cộng: {gasEstimate.totalAmount}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Password */}
        <Input
          label="Mật khẩu ví"
          name="password"
          type="password"
          placeholder="Nhập mật khẩu để xác nhận"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          helperText="Mật khẩu dùng để giải mã seed phrase"
          required
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
          disabled={!gasEstimate || estimating}
          icon={<Send className="w-5 h-5" />}
        >
          {loading ? 'Đang gửi...' : 'Gửi giao dịch'}
        </Button>
      </form>
    </Card>
  )
}

export default SendForm


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

/**
 * Transaction List Component
 * File: src/components/transaction/TransactionList.jsx
 */

import { useEffect, useState } from 'react'
import { History, RefreshCw } from 'lucide-react'
import { useWallet } from '../../context/WalletContext'
import { useToast } from '../../context/ToastContext'
import TransactionItem from './TransactionItem'
import Loading from '../common/Loading'
import Card from '../common/Card'

const TransactionList = ({ limit = 10 }) => {
  const { fetchTransactions } = useWallet()
  const toast = useToast()
  
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadTransactions = async () => {
    try {
      setLoading(true)
      const txs = await fetchTransactions(limit)
      setTransactions(txs)
    } catch (error) {
      toast.error('Không thể tải lịch sử giao dịch')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      const txs = await fetchTransactions(limit)
      setTransactions(txs)
      toast.success('Đã cập nhật lịch sử giao dịch')
    } catch (error) {
      toast.error('Không thể tải lịch sử giao dịch')
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  if (loading) {
    return (
      <Card>
        <Loading text="Đang tải giao dịch..." />
      </Card>
    )
  }

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-100">
            Giao dịch gần đây
          </h3>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
          title="Làm mới"
        >
          <RefreshCw className={`w-4 h-4 text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Transaction List */}
      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <History className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Chưa có giao dịch nào</p>
          <p className="text-sm text-gray-500 mt-1">
            Các giao dịch của bạn sẽ hiển thị ở đây
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))}
        </div>
      )}

      {/* View All Link */}
      {transactions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-800 text-center">
          <a
            href="/history"
            className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
          >
            Xem tất cả giao dịch →
          </a>
        </div>
      )}
    </Card>
  )
}

export default TransactionList