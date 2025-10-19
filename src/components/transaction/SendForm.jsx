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