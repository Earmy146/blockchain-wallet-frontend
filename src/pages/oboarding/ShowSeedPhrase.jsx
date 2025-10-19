/**
 * Show Seed Phrase Page
 * File: src/pages/onboarding/ShowSeedPhrase.jsx
 */

import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CheckCircle, ArrowRight } from 'lucide-react'
import SeedPhraseDisplay from '../../components/wallet/SeedPhraseDisplay'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'

const ShowSeedPhrase = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { seedPhrase, encryptedSeed } = location.state || {}

  const [confirmed, setConfirmed] = useState(false)

  if (!seedPhrase) {
    navigate('/onboarding/create')
    return null
  }

  const handleContinue = () => {
    if (!confirmed) {
      return
    }
    
    navigate('/onboarding/confirm-seed', {
      state: { seedPhrase, encryptedSeed }
    })
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            Ví của bạn đã được tạo!
          </h1>
          <p className="text-gray-400">
            Hãy lưu lại 12 từ khôi phục này ngay
          </p>
        </div>

        {/* Seed Phrase */}
        <Card className="mb-6">
          <SeedPhraseDisplay 
            seedPhrase={seedPhrase}
            showWarning={true}
            allowCopy={true}
          />
        </Card>

        {/* Confirmation Checkbox */}
        <Card className="mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-700 bg-gray-800 text-primary-600 focus:ring-primary-500 focus:ring-offset-gray-900"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-100 mb-1">
                Tôi đã ghi lại 12 từ khôi phục
              </p>
              <p className="text-xs text-gray-400">
                Tôi hiểu rằng nếu mất seed phrase, tôi sẽ mất toàn bộ quyền truy cập vào ví và tất cả tài sản.
              </p>
            </div>
          </label>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate('/onboarding/create')}
          >
            Quay lại
          </Button>
          
          <Button
            variant="primary"
            fullWidth
            disabled={!confirmed}
            onClick={handleContinue}
            icon={<ArrowRight className="w-5 h-5" />}
          >
            Tiếp tục
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ShowSeedPhrase