/**
 * Address Display Component
 * File: src/components/wallet/AddressDisplay.jsx
 */

import { ExternalLink } from 'lucide-react'
import { useWallet } from '../../context/WalletContext'
import { formatAddress, getExplorerAddressUrl } from '../../utils/formatter'
import CopyButton from '../common/CopyButton'

const AddressDisplay = ({ 
  showFull = false, 
  showExplorer = true,
  className 
}) => {
  const { walletAddress, network } = useWallet()

  if (!walletAddress) return null

  const explorerUrl = getExplorerAddressUrl(walletAddress, network)

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-400 mb-2">
        Địa chỉ ví của bạn
      </label>
      
      <div className="flex items-center gap-2 p-4 bg-gray-800 border border-gray-700 rounded-lg">
        <code className="flex-1 text-sm text-gray-100 font-mono break-all">
          {showFull ? walletAddress : formatAddress(walletAddress, 10, 8)}
        </code>
        
        <div className="flex items-center gap-1">
          <CopyButton 
            text={walletAddress}
            successMessage="Đã sao chép địa chỉ!"
            size="md"
          />
          
          {showExplorer && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Xem trên Explorer"
            >
              <ExternalLink className="w-4 h-4 text-gray-400 hover:text-gray-100" />
            </a>
          )}
        </div>
      </div>
      
      {showExplorer && (
        <p className="mt-2 text-xs text-gray-500">
          Click biểu tượng để xem trên {network === 'sepolia' ? 'Sepolia ' : ''}Etherscan
        </p>
      )}
    </div>
  )
}

export default AddressDisplay