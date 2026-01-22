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
      // GÜVENLİK: activePaper yoksa hesaplama yapma
      if (!containerRef.current || !activePaper || !activePaper.w) return

      const containerW = containerRef.current.offsetWidth - 80
      const containerH = containerRef.current.offsetHeight - 80
      const paperPxW = mmToPx(activePaper.w)
      const paperPxH = mmToPx(activePaper.h)

      const scaleW = containerW / paperPxW
      const scaleH = containerH / paperPxH
      const fitZoom = Math.min(scaleW, scaleH) * 0.98

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

      // --- KRİTİK HATA DÜZELTMESİ (Guard Clause) ---
      if (!activePaper || !activePaper.w) return

      const paperW = activePaper.w
      const paperH = activePaper.h

      canvas.width = mmToPx(paperW)
      canvas.height = mmToPx(paperH)

      // Canvas arkaplan rengini tema değişkenlerine göre ayarla
      const computedStyle = getComputedStyle(document.documentElement)
      const canvasBg = computedStyle.getPropertyValue('--admin-bg-primary').trim() || '#FFFFFF'
      ctx.fillStyle = canvasBg
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const isL = workOrientation === 'landscape'
      const itemW = isL ? specs.height : specs.width
      const itemH = isL ? specs.width : specs.height

      let availW, availH
      let summaCfg = null

      if (specs.templateMode === 'summa') {
        summaCfg = SUMMA_CONFIGS[activePaper.id] || SUMMA_CONFIGS['default']
        availW = summaCfg.safeAreaW
        availH = summaCfg.safeAreaH
      } else if (specs.templateMode === 'plotter') {
        const plt = MACHINE_LIMITS.plotter || {
          centerOffset: 10,
          markerRadius: 5
        }
        const m = Math.max(
          specs.margin,
          plt.centerOffset + plt.markerRadius + 2
        )
        availW = paperW - m * 2
        availH = paperH - m * 2
      } else {
        availW = paperW - specs.margin * 2
        availH = paperH - specs.margin * 2
      }

      const cols = Math.max(
        0,
        Math.floor((availW + specs.gapX) / (itemW + specs.gapX))
      )
      const rows = Math.max(
        0,
        Math.floor((availH + specs.gapY) / (itemH + specs.gapY))
      )
      const totalGridW = cols * itemW + (cols - 1) * specs.gapX
      const totalGridH = rows * itemH + (rows - 1) * specs.gapY
      const startX = (paperW - totalGridW) / 2
      const startY = (paperH - totalGridH) / 2

      onCountChange(Number.isNaN(cols * rows) ? 0 : cols * rows)

      const newLabels = []
      if (cols > 0 && rows > 0) {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const x = startX + c * (itemW + specs.gapX)
            const y = startY + r * (itemH + specs.gapY)
            ctx.fillStyle = getRandomColor(r * cols + c)
            ctx.fillRect(mmToPx(x), mmToPx(y), mmToPx(itemW), mmToPx(itemH))
            newLabels.push({
              id: r * cols + c + 1,
              x: mmToPx(x + itemW / 2),
              y: mmToPx(y + itemH / 2)
            })
          }
        }
      }
      setLabels(newLabels)

      if (showSafeArea) {
        let sX = 0,
          sY = 0,
          sW = 0,
          sH = 0
        if (specs.templateMode === 'none') {
          const m = mmToPx(specs.margin)
          sX = m
          sY = m
          sW = canvas.width - m * 2
          sH = canvas.height - m * 2
        } else if (specs.templateMode === 'summa' && summaCfg) {
          sX = mmToPx((paperW - summaCfg.safeAreaW) / 2)
          sY = mmToPx((paperH - summaCfg.safeAreaH) / 2)
          sW = mmToPx(summaCfg.safeAreaW)
          sH = mmToPx(summaCfg.safeAreaH)
        }

        if (sW > 0 && sH > 0) {
          ctx.save()
          ctx.fillStyle = 'rgba(69, 10, 10, 0.4)'
          ctx.fillRect(0, 0, canvas.width, sY)
          ctx.fillRect(0, sY + sH, canvas.width, canvas.height - (sY + sH))
          ctx.fillRect(0, sY, sX, sH)
          ctx.fillRect(sX + sW, sY, canvas.width - (sX + sW), sH)
          ctx.strokeStyle =
            specs.templateMode === 'summa'
              ? 'rgba(239, 68, 68, 0.4)'
              : 'rgba(255, 255, 255, 0.15)'
          ctx.setLineDash([10, 5])
          ctx.strokeRect(sX, sY, sW, sH)
          ctx.restore()
        }
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
          className='admin-bg-primary shadow-[0_0_20px_rgba(0,0,0,0.5)]'
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
                  color: 'var(--admin-text-tertiary)',
                  opacity: '0.5',
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
