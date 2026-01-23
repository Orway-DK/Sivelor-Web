// @/app/admin/dizgi/_components/CanvasImposition.tsx
'use client'
import React, {
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback
} from 'react'
import { MACHINE_LIMITS, SUMMA_CONFIGS } from '@/lib/constants'

const mmToPx = (mm: number) => mm * 3.7795
const getRandomColor = (i: number) => `hsl(${(i * 55) % 360}, 45%, 55%)`

const CanvasImposition = forwardRef(
  (
    {
      specs,
      activePaper,
      workOrientation,
      zoomLevel,
      setZoomLevel,
      labelSize,
      onCountChange,
      showSafeArea
    }: any,
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [pan, setPan] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [labels, setLabels] = useState<any[]>([])

    const handleAutoFit = useCallback(() => {
      if (!containerRef.current || !activePaper || !activePaper.w) return
      const containerW = containerRef.current.offsetWidth - 80
      const containerH = containerRef.current.offsetHeight - 80
      const paperPxW = mmToPx(activePaper.w)
      const paperPxH = mmToPx(activePaper.h)
      const fitZoom =
        Math.min(containerW / paperPxW, containerH / paperPxH) * 0.95
      setZoomLevel(fitZoom)
      setPan({ x: 0, y: 0 })
    }, [activePaper, setZoomLevel])

    useEffect(() => {
      const timer = setTimeout(handleAutoFit, 50)
      window.addEventListener('resize', handleAutoFit)
      return () => {
        clearTimeout(timer)
        window.removeEventListener('resize', handleAutoFit)
      }
    }, [handleAutoFit])

    useImperativeHandle(ref, () => ({ resetView: () => handleAutoFit() }))

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      if (!activePaper || !activePaper.w) return

      const paperW = activePaper.w
      const paperH = activePaper.h

      canvas.width = mmToPx(paperW)
      canvas.height = mmToPx(paperH)

      // 1. ZEMİN (KIRMIZI OVERLAY)
      ctx.fillStyle = showSafeArea ? 'rgba(254, 226, 226, 1)' : '#FFFFFF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const isL = workOrientation === 'landscape'
      const itemW = isL ? specs.height : specs.width
      const itemH = isL ? specs.width : specs.height

      let sX = 0,
        sY = 0,
        sW = 0,
        sH = 0
      let summaCfg = null

      // --- HESAPLAMA MANTIĞI ---
      if (specs.templateMode === 'summa') {
        summaCfg = SUMMA_CONFIGS[activePaper.id] || SUMMA_CONFIGS['default']

        sW = summaCfg.safeAreaW
        sH = summaCfg.safeAreaH

        // YATAY: Ortala
        sX = (paperW - sW) / 2

        // DİKEY: Alt marker referanslı konumlandırma
        // Kağıt Boyu - (Alt Boşluk + Marker Boyu + 2mm Güvenlik) - SafeArea Boyu
        // Bu formül Safe Area'nın üst başlangıç noktasını (sY) verir.
        const bottomReference =
          paperH - summaCfg.staticBottom - summaCfg.markerSize
        const safetyGap = 2 // 2mm boşluk
        const safeAreaBottomY = bottomReference - safetyGap

        sY = safeAreaBottomY - sH
      } else if (specs.templateMode === 'plotter') {
        const plt = MACHINE_LIMITS.plotter
        const m = Math.max(
          specs.margin,
          plt.centerOffset + plt.markerRadius + 2
        )
        sW = paperW - m * 2
        sH = paperH - m * 2
        sX = m
        sY = m
      } else {
        sW = paperW - specs.margin * 2
        sH = paperH - specs.margin * 2
        sX = specs.margin
        sY = specs.margin
      }

      // 2. GÜVENLİ ALAN (BEYAZ)
      if (showSafeArea) {
        ctx.save()
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(mmToPx(sX), mmToPx(sY), mmToPx(sW), mmToPx(sH))

        ctx.strokeStyle = 'rgba(0,0,0,0.1)'
        ctx.lineWidth = 1
        ctx.setLineDash([5, 5])
        ctx.strokeRect(mmToPx(sX), mmToPx(sY), mmToPx(sW), mmToPx(sH))
        ctx.restore()
      }

      // 3. GRID (Safe Area İçine Ortala)
      const cols = Math.max(
        0,
        Math.floor((sW + specs.gapX) / (itemW + specs.gapX))
      )
      const rows = Math.max(
        0,
        Math.floor((sH + specs.gapY) / (itemH + specs.gapY))
      )

      const totalContentW = cols * itemW + (cols - 1) * specs.gapX
      const totalContentH = rows * itemH + (rows - 1) * specs.gapY

      const startX = sX + (sW - totalContentW) / 2
      const startY = sY + (sH - totalContentH) / 2

      onCountChange(Number.isNaN(cols * rows) ? 0 : cols * rows)

      const newLabels = []
      if (cols > 0 && rows > 0) {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const x = startX + c * (itemW + specs.gapX)
            const y = startY + r * (itemH + specs.gapY)

            ctx.fillStyle = getRandomColor(r * cols + c)
            ctx.fillRect(mmToPx(x), mmToPx(y), mmToPx(itemW), mmToPx(itemH))

            ctx.strokeStyle = 'rgba(0,0,0,0.3)'
            ctx.lineWidth = 1
            ctx.strokeRect(mmToPx(x), mmToPx(y), mmToPx(itemW), mmToPx(itemH))

            newLabels.push({
              id: r * cols + c + 1,
              x: mmToPx(x + itemW / 2),
              y: mmToPx(y + itemH / 2)
            })
          }
        }
      }
      setLabels(newLabels)

      // 4. MARKERLAR (SABİT)
      if (showSafeArea && specs.templateMode === 'summa' && summaCfg) {
        ctx.save()
        const mSize = mmToPx(summaCfg.markerSize)
        const barH = mmToPx(summaCfg.barHeight)
        const barGap = mmToPx(summaCfg.barGap || 0)

        ctx.fillStyle = '#000000'

        // Marker Koordinatları (Config'den gelen mutlak değerler)
        const leftX = mmToPx(summaCfg.staticSide)
        const rightX = mmToPx(
          paperW - summaCfg.staticSide - summaCfg.markerSize
        )
        const topY = mmToPx(summaCfg.staticTop)
        const bottomY = mmToPx(
          paperH - summaCfg.staticBottom - summaCfg.markerSize
        )
        const midY = topY + (bottomY - topY) / 2

        ctx.fillRect(leftX, topY, mSize, mSize) // Sol Üst
        ctx.fillRect(rightX, topY, mSize, mSize) // Sağ Üst
        ctx.fillRect(leftX, midY, mSize, mSize) // Sol Orta
        ctx.fillRect(rightX, midY, mSize, mSize) // Sağ Orta
        ctx.fillRect(leftX, bottomY, mSize, mSize) // Sol Alt
        ctx.fillRect(rightX, bottomY, mSize, mSize) // Sağ Alt

        // Alt Bar
        const barStartX = leftX + mSize + barGap
        const barEndX = rightX - barGap
        const barY = bottomY + (mSize - barH) / 2
        ctx.fillRect(barStartX, barY, barEndX - barStartX, barH)

        ctx.restore()
      } else if (showSafeArea && specs.templateMode === 'plotter') {
        // Plotter kodu aynı...
        const plt = MACHINE_LIMITS.plotter
        const r = mmToPx(plt.markerRadius)
        const offset = mmToPx(plt.centerOffset)
        const m = Math.max(
          specs.margin,
          plt.centerOffset + plt.markerRadius + 2
        )
        const pX = mmToPx(m)
        const pY = mmToPx(m)
        const pW = mmToPx(paperW - m * 2)
        const pH = mmToPx(paperH - m * 2)

        ctx.fillStyle = 'rgba(37, 99, 235, 0.8)'
        const pts = [
          { x: pX + offset, y: pY + offset },
          { x: pX + pW - offset, y: pY + offset },
          { x: pX + offset, y: pY + pH - offset },
          { x: pX + pW - offset, y: pY + pH - offset }
        ]
        pts.forEach(p => {
          ctx.beginPath()
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
          ctx.fill()
        })
      }
    }, [specs, activePaper, workOrientation, onCountChange, showSafeArea])

    return (
      <div
        ref={containerRef}
        className='flex-1 w-full h-full admin-canvas-container overflow-hidden relative cursor-grab active:cursor-grabbing'
        onWheel={e =>
          setZoomLevel((prev: number) =>
            Math.min(4, Math.max(0.01, prev + e.deltaY * -0.0008))
          )
        }
        onMouseDown={e => {
          if (e.button === 0) {
            setIsDragging(true)
            setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
          }
        }}
        onMouseMove={e =>
          isDragging &&
          setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
        }
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${zoomLevel})`,
            transformOrigin: 'center center',
            transition: isDragging
              ? 'none'
              : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
          }}
          className='bg-white shadow-[0_0_50px_rgba(0,0,0,0.5)]'
        >
          <canvas ref={canvasRef} className='block pointer-events-none' />
          <div className='absolute inset-0 pointer-events-none'>
            {labels.map(l => (
              <span
                key={l.id}
                style={{
                  left: l.x,
                  top: l.y,
                  fontSize: `${mmToPx(labelSize)}px`,
                  transform: 'translate(-50%, -50%)',
                  fontWeight: '900',
                  color: 'rgba(0,0,0,0.6)',
                  textShadow: '0 0 2px white',
                  position: 'absolute'
                }}
              >
                {l.id}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }
)
CanvasImposition.displayName = 'CanvasImposition'
export default CanvasImposition
