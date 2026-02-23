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

    useEffect(() => {
        loadLogo()
    }, [id])

    const loadLogo = async () => {
        try {
            const res = await api.get(`/logos/${id}`)
            const data = res.data.data.logo
            setLogo(data)
            setEditName(data.name || '')
            setEditSlogan(data.slogan || '')
            setEditColors(data.colors || [])
            setSvgContent(data.svg_content || '')
        } catch (err) {
            toast.error('Không tìm thấy logo.')
            navigate('/dashboard')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            await api.put(`/logos/${id}`, {
                name: editName,
                slogan: editSlogan,
                svg_content: svgContent,
                colors: editColors,
                status: 'completed',
            })
            toast.success('Đã lưu logo!')
        } catch (err) {
            toast.error('Lỗi khi lưu.')
        } finally {
            setSaving(false)
        }
    }

    // Cập nhật text trong SVG real-time
    const updateSvgText = (svg, name, slogan) => {
        let updatedSvg = svg
        // Tìm và thay thế text elements (đơn giản hóa cho quy trình cơ bản)
        if (logo?.name && name !== logo.name) {
            updatedSvg = updatedSvg.replace(new RegExp(escapeRegex(logo.name), 'g'), name)
        }
        return updatedSvg
    }

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    // Thay đổi màu trong SVG
    const changeColor = (oldColor, newColor) => {
        const updated = svgContent.replace(new RegExp(escapeRegex(oldColor), 'gi'), newColor)
        setSvgContent(updated)
        setEditColors(prev => prev.map(c => c.toLowerCase() === oldColor.toLowerCase() ? newColor : c))
    }

    // Export SVG
    const downloadSvg = () => {
        const blob = new Blob([svgContent], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${editName || 'logo'}.svg`
        a.click()
        URL.revokeObjectURL(url)
        toast.success('Đã tải file SVG!')
    }

    // Export PNG via Canvas
    const downloadPng = () => {
        const canvas = document.createElement('canvas')
        canvas.width = 800
        canvas.height = 600
        const ctx = canvas.getContext('2d')
        const img = new Image()
        const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(svgBlob)
        img.onload = () => {
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(0, 0, 800, 600)
            ctx.drawImage(img, 0, 0, 800, 600)
            canvas.toBlob(blob => {
                const a = document.createElement('a')
                a.href = URL.createObjectURL(blob)
                a.download = `${editName || 'logo'}.png`
                a.click()
                toast.success('Đã tải file PNG!')
            })
            URL.revokeObjectURL(url)
        }
        img.src = url
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-surface-dim flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-surface-dim flex flex-col">
            {/* Top Bar */}
            <div className="bg-surface border-b border-outline px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link to="/dashboard" className="p-2 rounded-xl hover:bg-surface-container transition-colors">
                        <svg className="w-5 h-5 text-on-surface" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <input
                        type="text"
                        value={editName}
                        onChange={e => {
                            const name = e.target.value
                            setEditName(name)
                            setSvgContent(updateSvgText(svgContent, name, editSlogan))
                        }}
                        className="text-lg font-semibold text-on-surface bg-transparent border-none focus:outline-none"
                        placeholder="Tên logo"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleSave} disabled={saving} className="px-5 py-2 rounded-full bg-primary-light text-primary text-sm font-medium hover:bg-blue-200 transition-colors disabled:opacity-50">
                        {saving ? 'Đang lưu...' : '💾 Lưu'}
                    </button>
                    <button onClick={downloadSvg} className="px-5 py-2 rounded-full border border-outline text-on-surface text-sm font-medium hover:bg-surface-container transition-colors">
                        📥 SVG
                    </button>
                    <button onClick={downloadPng} className="px-5 py-2 rounded-full bg-primary text-on-primary text-sm font-medium hover:bg-primary-hover transition-colors">
                        📥 PNG
                    </button>
                </div>
            </div>

            <div className="flex flex-1 flex-col lg:flex-row">
                {/* Canvas / Preview Area */}
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="bg-surface rounded-3xl border border-outline p-8 w-full max-w-2xl aspect-[4/3] flex items-center justify-center">
                        <div
                            className="w-full h-full"
                            dangerouslySetInnerHTML={{ __html: svgContent }}
                        />
                    </div>
                </div>

                {/* Right Panel — Tools */}
                <div className="w-full lg:w-80 bg-surface border-t lg:border-t-0 lg:border-l border-outline p-6 flex flex-col gap-6 overflow-y-auto">
                    {/* Text Edit */}
                    <div>
                        <h3 className="text-sm font-semibold text-on-surface mb-3">📝 Văn bản</h3>
                        <div className="flex flex-col gap-3">
                            <div>
                                <label className="text-xs text-on-surface-variant mb-1 block">Tên thương hiệu</label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={e => {
                                        setEditName(e.target.value)
                                        setSvgContent(updateSvgText(svgContent, e.target.value, editSlogan))
                                    }}
                                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-on-surface-variant mb-1 block">Tagline</label>
                                <input
                                    type="text"
                                    value={editSlogan}
                                    onChange={e => setEditSlogan(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Color Editor */}
                    <div>
                        <h3 className="text-sm font-semibold text-on-surface mb-3">🎨 Bảng màu</h3>
                        <div className="flex flex-col gap-2">
                            {editColors.map((color, i) => (
                                <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-surface-container">
                                    <input
                                        type="color"
                                        value={color}
                                        onChange={e => changeColor(color, e.target.value)}
                                        className="w-10 h-10 rounded-lg border border-outline cursor-pointer"
                                    />
                                    <span className="text-xs font-mono text-on-surface-variant flex-1">{color.toUpperCase()}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="mt-auto pt-4 border-t border-outline">
                        <div className="flex flex-col gap-1 text-xs text-on-surface-variant">
                            <span>Phong cách: <strong className="text-on-surface">{logo?.style}</strong></span>
                            <span>Ngành: <strong className="text-on-surface">{logo?.industry}</strong></span>
                            <span>Model: <strong className="text-on-surface">{logo?.model_used}</strong></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
