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
        error: { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' },
        info: { background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa' },
    }

    return (
        <ToastContext.Provider value={{ success, error, info }}>
            {children}
            <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '360px' }}>
                {toasts.map(toast => (
                    <div key={toast.id} className="animate-slide-up" style={{
                        ...typeStyles[toast.type],
                        padding: '12px 20px', borderRadius: '14px', fontSize: '13px', fontWeight: 500,
                        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                    }}>
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export const useToast = () => useContext(ToastContext)
