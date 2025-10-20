/**
 * Confirm Seed Phrase Page
 * File: src/pages/onboarding/ConfirmSeedPhrase.jsx
 */

import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CheckCircle, X } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'

const ConfirmSeedPhrase = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const { seedPhrase } = location.state || {}

  const [selectedWords, setSelectedWords] = useState([])
  const [shuffledWords, setShuffledWords] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!seedPhrase) {
      navigate('/onboarding/create')
      return
    }

    // Shuffle words
    const words = seedPhrase.split(' ')
    const shuffled = [...words].sort(() => Math.random() - 0.5)
    setShuffledWords(shuffled)
  }, [seedPhrase, navigate])

  const handleWordClick = (word) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word))
    } else {
      setSelectedWords([...selectedWords, word])
    }
    setError('')
  }

  const handleVerify = () => {
    const correctOrder = seedPhrase.split(' ')
    const isCorrect = selectedWords.length === 12 && 
                     selectedWords.every((word, index) => word === correctOrder[index])

    if (isCorrect) {
      toast.success('Xác nhận thành công!')
      navigate('/dashboard')
    } else {
      setError('Thứ tự các từ không đúng. Vui lòng thử lại.')
      toast.error('Thứ tự không đúng')
    }
  }

  const handleReset = () => {
    setSelectedWords([])
    setError('')
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-primary-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            Xác nhận seed phrase
          </h1>
          <p className="text-gray-400">
            Chọn các từ theo đúng thứ tự để xác nhận bạn đã lưu đúng
          </p>
        </div>

        {/* Selected Words */}
        <Card className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-3">
            Seed phrase của bạn ({selectedWords.length}/12)
          </label>
          
          <div className="min-h-32 p-4 bg-gray-800 border border-gray-700 rounded-lg mb-3">
            {selectedWords.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Chọn các từ bên dưới theo thứ tự
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedWords.map((word, index) => (
                  <button
                    key={`selected-${index}`}
                    onClick={() => {
                      setSelectedWords(selectedWords.filter((_, i) => i !== index))
                      setError('')
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-sm text-white transition-colors"
                  >
                    <span className="font-medium">{index + 1}.</span>
                    <span>{word}</span>
                    <X className="w-3 h-3" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-500 mb-3">{error}</p>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={selectedWords.length === 0}
          >
            Đặt lại
          </Button>
        </Card>

        {/* Available Words */}
        <Card className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-3">
            Chọn từ theo thứ tự
          </label>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {shuffledWords.map((word, index) => (
              <button
                key={`word-${index}`}
                onClick={() => handleWordClick(word)}
                disabled={selectedWords.includes(word)}
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-600 border border-gray-700 rounded-lg text-sm text-gray-100 transition-colors disabled:cursor-not-allowed"
              >
                {word}
              </button>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
          
          <Button
            variant="primary"
            fullWidth
            onClick={handleVerify}
            disabled={selectedWords.length !== 12}
          >
            Xác nhận
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmSeedPhrase