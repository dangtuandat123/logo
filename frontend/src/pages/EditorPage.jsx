import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { useToast } from '../contexts/ToastContext'
import { ChevronLeft, Save, Download } from 'lucide-react'

export default function EditorPage() {
    const { id } = useParams(); const navigate = useNavigate(); const toast = useToast()
    const [logo, setLogo] = useState(null); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false)
    const [editName, setEditName] = useState(''); const [editSlogan, setEditSlogan] = useState('')
    const [editColors, setEditColors] = useState([]); const [svgContent, setSvgContent] = useState('')

    useEffect(() => { loadLogo() }, [id])
    const loadLogo = async () => {
        try { const r = await api.get(`/logos/${id}`); const d = r.data.data.logo; setLogo(d); setEditName(d.name || ''); setEditSlogan(d.slogan || ''); setEditColors(d.colors || []); setSvgContent(d.svg_content || '') }
        catch { toast.error('Không tìm thấy logo.'); navigate('/dashboard') } finally { setLoading(false) }
    }
    const handleSave = async () => {
        setSaving(true)
        try { await api.put(`/logos/${id}`, { name: editName, slogan: editSlogan, svg_content: svgContent, colors: editColors, status: 'completed' }); toast.success('Đã lưu!') }
        catch { toast.error('Lỗi lưu.') } finally { setSaving(false) }
    }
    const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const changeColor = (o, n) => { setSvgContent(p => p.replace(new RegExp(esc(o), 'gi'), n)); setEditColors(p => p.map(c => c.toLowerCase() === o.toLowerCase() ? n : c)) }
    const downloadSvg = () => { const b = new Blob([svgContent], { type: 'image/svg+xml' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `${editName || 'logo'}.svg`; a.click(); toast.success('Đã tải SVG!') }
    const downloadPng = () => { const cv = document.createElement('canvas'); cv.width = 800; cv.height = 600; const ctx = cv.getContext('2d'); const img = new Image(); const u = URL.createObjectURL(new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' })); img.onload = () => { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 800, 600); ctx.drawImage(img, 0, 0, 800, 600); cv.toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `${editName || 'logo'}.png`; a.click() }); URL.revokeObjectURL(u); toast.success('Đã tải PNG!') }; img.src = u }

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: '48px', height: '48px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /></div>

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-dark-950)' }}>
            {/* Top Bar */}
            <div style={{ background: 'rgba(15,15,24,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Link to="/dashboard" style={{ padding: '8px', borderRadius: '10px', display: 'flex', textDecoration: 'none', color: 'rgba(255,255,255,0.6)' }}><ChevronLeft size={20} /></Link>
                    <input type="text" value={editName} onChange={e => setEditName(e.target.value)} style={{ fontSize: '17px', fontWeight: 600, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.95)', minWidth: '200px' }} placeholder="Tên logo" />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={handleSave} disabled={saving} className="btn-glass" style={{ padding: '8px 18px', fontSize: '13px' }}><Save size={14} /> {saving ? 'Lưu...' : 'Lưu'}</button>
                    <button onClick={downloadSvg} className="btn-glass" style={{ padding: '8px 18px', fontSize: '13px' }}><Download size={14} /> SVG</button>
                    <button onClick={downloadPng} className="btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}><Download size={14} /> PNG</button>
                </div>
            </div>
            <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
                {/* Canvas */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
                    <div className="glass-card" style={{ width: '100%', maxWidth: '640px', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
                        <div style={{ width: '100%', height: '100%' }} dangerouslySetInnerHTML={{ __html: svgContent }} />
                    </div>
                </div>
                {/* Panel */}
                <div style={{ width: '300px', background: 'rgba(15,15,24,0.6)', backdropFilter: 'blur(12px)', borderLeft: '1px solid rgba(255,255,255,0.05)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }} className="hidden md:flex">
                    <div>
                        <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Văn bản</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div><label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px', display: 'block' }}>Tên</label><input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="glass-input" style={{ padding: '10px 14px' }} /></div>
                            <div><label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px', display: 'block' }}>Tagline</label><input type="text" value={editSlogan} onChange={e => setEditSlogan(e.target.value)} className="glass-input" style={{ padding: '10px 14px' }} /></div>
                        </div>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bảng màu</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {editColors.map((c, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <input type="color" value={c} onChange={e => changeColor(c, e.target.value)} style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', padding: '2px', background: 'transparent' }} />
                                <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', flex: 1 }}>{c.toUpperCase()}</span>
                            </div>)}
                        </div>
                    </div>
                    <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                        <span>Phong cách: <strong style={{ color: 'rgba(255,255,255,0.7)' }}>{logo?.style}</strong></span>
                        <span>Ngành: <strong style={{ color: 'rgba(255,255,255,0.7)' }}>{logo?.industry}</strong></span>
                    </div>
                </div>
            </div>
        </div>
    )
}
