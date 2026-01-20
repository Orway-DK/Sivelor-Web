// @/app/imposition/_components/CanvasImposition.tsx
'use client'
import React, {
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef
} from 'react'
import { MACHINE_LIMITS } from '@/lib/constants'

const mmToPx = (mm: number) => mm * 3.7795
const getRandomColor = (i: number) => `hsl(${(i * 55) % 360}, 72%, 84%)`

const CanvasImposition = forwardRef(
  (
    {
      specs,
      activePaper,
      workOrientation,
      zoomLevel,
      setZoomLevel,
      onCountChange
    }: any,
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [pan, setPan] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [labels, setLabels] = useState<any[]>([])

    useImperativeHandle(ref, () => ({
      resetView: () => {
        setPan({ x: 0, y: 0 })
        setZoomLevel(0.4)
      }
    }))

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Kağıt SABİT
      const paperW = activePaper.w
      const paperH = activePaper.h

      canvas.width = mmToPx(paperW)
      canvas.height = mmToPx(paperH)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const isL = workOrientation === 'landscape'
      const itemW = isL ? specs.height : specs.width
      const itemH = isL ? specs.width : specs.height

      // GÜVENLİ ALAN HESABI
      let safeTop = specs.margin
      let safeBottom = specs.margin
      let safeSide = specs.margin

      if (specs.templateMode === 'summa') {
        const sum = MACHINE_LIMITS.summa || {
          staticTop: 10,
          staticBottom: 5,
          staticSide: 10
        } // Fallback
        safeTop = Math.max(specs.margin, sum.staticTop + 10)
        safeBottom = Math.max(specs.margin, sum.staticBottom + 10)
        safeSide = Math.max(specs.margin, sum.staticSide + 5)
      } else if (specs.templateMode === 'plotter') {
        const plt = MACHINE_LIMITS.plotter || {
          centerOffset: 10,
          markerRadius: 5
        } // Fallback
        const safeZone = plt.centerOffset + plt.markerRadius + 2
        safeTop = Math.max(specs.margin, safeZone)
        safeBottom = Math.max(specs.margin, safeZone)
        safeSide = Math.max(specs.margin, safeZone)
      }

      const availW = paperW - safeSide * 2
      const availH = paperH - (safeTop + safeBottom)

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
      const startY = safeTop + (availH - totalGridH) / 2

      onCountChange(Number.isNaN(cols * rows) ? 0 : cols * rows)

      // KUTULAR
      const newLabels = []
      if (cols > 0 && rows > 0) {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const x = startX + c * (itemW + specs.gapX)
            const y = startY + r * (itemH + specs.gapY)
            ctx.fillStyle = getRandomColor(r * cols + c)
            ctx.fillRect(mmToPx(x), mmToPx(y), mmToPx(itemW), mmToPx(itemH))
            ctx.strokeStyle = 'rgba(0,0,0,0.1)'
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

      // STATİK MARKÖRLER
      if (specs.templateMode !== 'none') {
        ctx.fillStyle = '#000000'

        if (specs.templateMode === 'summa') {
          const sum = MACHINE_LIMITS.summa || {
            staticTop: 10,
            staticBottom: 5,
            staticSide: 10,
            markerSize: 4,
            lineThickness: 1
          }
          const s = mmToPx(sum.markerSize)
          const side = mmToPx(sum.staticSide)
          const top = mmToPx(sum.staticTop)
          const bot = mmToPx(sum.staticBottom)

          const yCoords = [
            top,
            mmToPx(paperH / 2) - s / 2,
            mmToPx(paperH) - bot - mmToPx(10) - s
          ]
          yCoords.forEach(y => {
            ctx.fillRect(side, y, s, s)
            ctx.fillRect(mmToPx(paperW) - side - s, y, s, s)
          })

          ctx.fillRect(
            side + s + mmToPx(2),
            mmToPx(paperH) - bot - mmToPx(sum.lineThickness),
            mmToPx(paperW) - side * 2 - s * 2 - mmToPx(4),
            mmToPx(sum.lineThickness)
          )
        } else if (specs.templateMode === 'plotter') {
          const plt = MACHINE_LIMITS.plotter || {
            centerOffset: 10,
            markerRadius: 5
          }
          const r = mmToPx(plt.markerRadius)
          const c = mmToPx(plt.centerOffset)

          const points = [
            [c, c],
            [mmToPx(paperW) - c, c],
            [c, mmToPx(paperH) - c],
            [mmToPx(paperW) - c, mmToPx(paperH) - c]
          ]
          points.forEach(([px, py]) => {
            ctx.beginPath()
            ctx.arc(px, py, r, 0, Math.PI * 2)
            ctx.fill()
          })
        }

        // Güvenli Alan
        ctx.setLineDash([5, 5])
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)'
        ctx.strokeRect(
          mmToPx(safeSide),
          mmToPx(safeTop),
          mmToPx(availW),
          mmToPx(availH)
        )
      }
    }, [specs, activePaper, workOrientation])

    return (
      <div
        className='flex-1 w-full h-full bg-[#111] overflow-hidden relative cursor-grab active:cursor-grabbing flex items-center justify-center'
        onWheel={e =>
          setZoomLevel((p: any) =>
            Math.min(4, Math.max(0.01, p - e.deltaY * 0.001))
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
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
            transformOrigin: 'center center'
          }}
          className='shadow-2xl bg-white relative'
        >
          <canvas ref={canvasRef} className='block pointer-events-none' />
          <div className='absolute inset-0 pointer-events-none'>
            {labels.map(l => (
              <span
                key={l.id}
                style={{
                  left: l.x,
                  top: l.y,
                  fontSize: `${mmToPx(2.5)}px`,
                  transform: 'translate(-50%, -50%)',
                  fontWeight: '900',
                  color: 'rgba(0,0,0,0.4)',
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
