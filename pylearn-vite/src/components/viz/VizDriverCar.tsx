'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Props {
  data: {
    driverName?: string
    carBrand?: string
    carModel?: string
  }
}

export default function VizDriverCar({ data }: Props) {
  const driverName = data.driverName || 'Alice'
  const carBrand = data.carBrand || 'Tesla'
  const carModel = data.carModel || 'Model 3'

  const [isInside, setIsInside] = useState(false)
  const [speed, setSpeed] = useState(0)
  const [log, setLog] = useState('Objects created: alice = Person(), my_car = Car()')

  const toggleInside = () => {
    if (isInside) {
      if (speed > 0) {
        setLog('⚠️ Cannot exit while car is in motion!')
        return
      }
      setIsInside(false)
      setLog(`🚶 ${driverName} stepped out of the ${carBrand}`)
    } else {
      setIsInside(true)
      setLog(`🔑 ${driverName} entered ${carBrand} -> my_car.driver = alice`)
    }
  }

  const accelerate = (amount: number) => {
    if (!isInside) {
      setLog(`🚫 Cannot drive! No driver inside ${carBrand}.`)
      return
    }
    const newSpeed = speed + amount
    setSpeed(newSpeed)
    setLog(`🏎 my_car.accelerate(${amount}) -> Current speed: ${newSpeed} km/h`)
  }

  const brake = () => {
    setSpeed(0)
    setLog(`🛑 my_car.brake() -> Car stopped. Speed: 0 km/h`)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Interactive Methods Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-[var(--text-dim)] font-semibold">Call Methods:</span>
        <button
          onClick={toggleInside}
          className="px-2.5 py-1 text-xs rounded bg-[var(--surface)] hover:bg-[var(--surface2)] border border-[var(--border)] font-mono transition-colors text-[var(--text)]"
        >
          {isInside ? `🚪 ${driverName}.exit_car()` : `🔑 ${driverName}.enter_car()`}
        </button>
        <button
          onClick={() => accelerate(30)}
          className="px-2.5 py-1 text-xs rounded bg-[var(--green)]/20 text-[var(--green)] border border-[var(--green)]/40 hover:bg-[var(--green)]/30 font-mono font-semibold transition-colors"
        >
          ⚡ my_car.accelerate(+30)
        </button>
        <button
          onClick={brake}
          disabled={speed === 0}
          className="px-2.5 py-1 text-xs rounded bg-[var(--red)]/20 text-[var(--red)] border border-[var(--red)]/40 hover:bg-[var(--red)]/30 disabled:opacity-30 font-mono font-semibold transition-colors"
        >
          🛑 my_car.brake()
        </button>
      </div>

      {/* Visual Simulation Display */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 flex items-center justify-around min-h-[90px]">
        {/* Person / Driver Object */}
        <div className="flex flex-col items-center">
          <div className="text-[10px] uppercase font-bold text-[var(--text-dim)] mb-1">
            Object: <span className="text-[var(--mauve)] font-mono">alice (Person)</span>
          </div>
          <div className="border border-[var(--mauve)]/50 bg-[var(--mauve)]/10 rounded-lg p-2 flex items-center gap-2 min-w-[120px]">
            <span className="text-2xl">👩‍💻</span>
            <div className="text-[11px] font-mono leading-tight">
              <div className="font-bold text-[var(--text)]">{driverName}</div>
              <div className="text-[var(--text-dim)]">license = True</div>
              <div className="text-[var(--mauve)] text-[10px]">
                {isInside ? 'in_car = True' : 'standing outside'}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic connection indicator */}
        <div className="flex flex-col items-center text-xs font-mono text-[var(--text-dim)]">
          <span>{isInside ? '➔ driving ➔' : 'waiting'}</span>
          {speed > 0 && (
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="text-[var(--green)] font-bold text-[10px]"
            >
              {speed} km/h
            </motion.span>
          )}
        </div>

        {/* Car Object */}
        <div className="flex flex-col items-center">
          <div className="text-[10px] uppercase font-bold text-[var(--text-dim)] mb-1">
            Object: <span className="text-[var(--primary)] font-mono">my_car (Car)</span>
          </div>
          <motion.div
            animate={{
              x: speed > 0 ? [0, 2, -2, 0] : 0,
            }}
            transition={{ repeat: speed > 0 ? Infinity : 0, duration: 0.2 }}
            className="border border-[var(--primary)]/50 bg-[var(--primary)]/10 rounded-lg p-2 flex items-center gap-2 min-w-[140px]"
          >
            <span className="text-2xl">🚗</span>
            <div className="text-[11px] font-mono leading-tight">
              <div className="font-bold text-[var(--text)]">{carBrand} {carModel}</div>
              <div className="text-[var(--text-dim)]">speed = {speed}</div>
              <div className="text-[var(--primary)] text-[10px]">
                driver = {isInside ? `"${driverName}"` : 'None'}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Log Console Output */}
      <div className="text-xs font-mono text-[var(--green)] bg-[var(--bg-deep)] px-2.5 py-1.5 rounded-lg border border-[var(--border)]">
        {log}
      </div>
    </div>
  )
}
