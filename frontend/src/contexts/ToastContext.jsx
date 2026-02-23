import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now() + Math.random()
        setToasts(prev => [...prev, { id, message, type }])
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
    }, [])

    const success = useCallback((msg) => addToast(msg, 'success'), [addToast])
    const error = useCallback((msg) => addToast(msg, 'error'), [addToast])
    const info = useCallback((msg) => addToast(msg, 'info'), [addToast])

    const typeStyles = {
        success: { background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80' },
        error: { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' },
        info: { background: 'rgba(122,178,178,0.15)', border: '1px solid rgba(122,178,178,0.3)', color: 'var(--color-ocean-primary)' },
    }

    return (
        <ToastContext.Provider value={{ success, error, info }}>
            {children}
            <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '380px' }}>
                {toasts.map(toast => (
                    <div key={toast.id} className="animate-slide-up" style={{
                        ...typeStyles[toast.type],
                        padding: '16px 24px', borderRadius: '16px', fontSize: '14px', fontWeight: 600,
                        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                        boxShadow: '0 8px 32px rgba(9, 99, 126, 0.4)'
                    }}>
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export const useToast = () => useContext(ToastContext)
