import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { WalletProvider } from './context/WalletContext'
import { ToastProvider } from './context/ToastContext'
import AppRoutes from './router'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WalletProvider>
          <ToastProvider>
            <div className="app min-h-screen bg-gray-950">
              <AppRoutes />
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#1e293b',
                    color: '#f1f5f9',
                    border: '1px solid #334155',
                  },
                  success: {
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#f1f5f9',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#f1f5f9',
                    },
                  },
                }}
              />
            </div>
          </ToastProvider>
        </WalletProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App