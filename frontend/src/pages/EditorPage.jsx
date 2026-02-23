import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { useToast } from '../contexts/ToastContext'

export default function EditorPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const toast = useToast()
    const [logo, setLogo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [editName, setEditName] = useState('')
    const [editSlogan, setEditSlogan] = useState('')
    const [editColors, setEditColors] = useState([])
    const [svgContent, setSvgContent] = useState('')

    useEffect(() => { loadLogo() }, [id])

    const loadLogo = async () => {
        try {
            const res = await api.get(`/logos/${id}`)
            const d = res.data.data.logo
            setLogo(d); setEditName(d.name || ''); setEditSlogan(d.slogan || '')
            setEditColors(d.colors || []); setSvgContent(d.svg_content || '')
        } catch { toast.error('Không tìm thấy logo.'); navigate('/dashboard') }
        finally { setLoading(false) }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            await api.put(`/logos/${id}`, { name: editName, slogan: editSlogan, svg_content: svgContent, colors: editColors, status: 'completed' })
            toast.success('Đã lưu logo!')
        } catch { toast.error('Lỗi khi lưu.') }
        finally { setSaving(false) }
    }

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    const changeColor = (oldColor, newColor) => {
        setSvgContent(prev => prev.replace(new RegExp(escapeRegex(oldColor), 'gi'), newColor))
        setEditColors(prev => prev.map(c => c.toLowerCase() === oldColor.toLowerCase() ? newColor : c))
    }

    const downloadSvg = () => {
        const blob = new Blob([svgContent], { type: 'image/svg+xml' })
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
        a.download = `${editName || 'logo'}.svg`; a.click()
        toast.success('Đã tải file SVG!')
    }

    const downloadPng = () => {
        const canvas = document.createElement('canvas'); canvas.width = 800; canvas.height = 600
        const ctx = canvas.getContext('2d'); const img = new Image()
        const url = URL.createObjectURL(new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' }))
        img.onload = () => {
            ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, 800, 600)
            ctx.drawImage(img, 0, 0, 800, 600)
            canvas.toBlob(blob => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${editName || 'logo'}.png`; a.click() })
            URL.revokeObjectURL(url); toast.success('Đã tải file PNG!')
        }
        img.src = url
    }

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-surface-dim)' }}>
                <div style={{ width: '48px', height: '48px', border: '4px solid var(--color-outline)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-surface-dim)' }}>
            {/* Top Bar */}
            <div style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-outline)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Link to="/dashboard" style={{ padding: '8px', borderRadius: '12px', display: 'flex', textDecoration: 'none', color: 'var(--color-on-surface)' }}>
                        <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <input type="text" value={editName} onChange={e => setEditName(e.target.value)} style={{ fontSize: '18px', fontWeight: 600, border: 'none', outline: 'none', backgroundColor: 'transparent', fontFamily: 'var(--font-sans)', color: 'var(--color-on-surface)', minWidth: '200px' }} placeholder="Tên logo" />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={handleSave} disabled={saving} className="btn-tonal" style={{ padding: '8px 20px', fontSize: '13px' }}>{saving ? 'Đang lưu...' : '💾 Lưu'}</button>
                    <button onClick={downloadSvg} className="btn-secondary" style={{ padding: '8px 20px', fontSize: '13px' }}>📥 SVG</button>
                    <button onClick={downloadPng} className="btn-primary" style={{ padding: '8px 20px', fontSize: '13px' }}>📥 PNG</button>
                </div>
            </div>

            <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
                {/* Canvas */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
                    <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-outline)', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '640px', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '100%', height: '100%' }} dangerouslySetInnerHTML={{ __html: svgContent }} />
                    </div>
                </div>

                {/* Right Panel */}
                <div style={{ width: '320px', backgroundColor: 'var(--color-surface)', borderLeft: '1px solid var(--color-outline)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
                    {/* Text */}
                    <div>
                        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>📝 Văn bản</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <label style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginBottom: '4px', display: 'block' }}>Tên thương hiệu</label>
                                <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="input-field" style={{ borderRadius: '12px', padding: '10px 16px' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginBottom: '4px', display: 'block' }}>Tagline</label>
                                <input type="text" value={editSlogan} onChange={e => setEditSlogan(e.target.value)} className="input-field" style={{ borderRadius: '12px', padding: '10px 16px' }} />
                            </div>
                        </div>
                    </div>

                    {/* Colors */}
                    <div>
                        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>🎨 Bảng màu</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {editColors.map((color, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', backgroundColor: 'var(--color-surface-dim)', borderRadius: '12px' }}>
                                    <input type="color" value={color} onChange={e => changeColor(color, e.target.value)} style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid var(--color-outline)', cursor: 'pointer', padding: '2px' }} />
                                    <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--color-on-surface-variant)', flex: 1 }}>{color.toUpperCase()}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info */}
                    <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--color-outline)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
                            <span>Phong cách: <strong style={{ color: 'var(--color-on-surface)' }}>{logo?.style}</strong></span>
                            <span>Ngành: <strong style={{ color: 'var(--color-on-surface)' }}>{logo?.industry}</strong></span>
                            <span>Model: <strong style={{ color: 'var(--color-on-surface)' }}>{logo?.model_used}</strong></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
