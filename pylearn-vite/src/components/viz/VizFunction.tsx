'use client'

import { motion } from 'framer-motion'

interface Props {
  data: any
}

export default function VizFunction({ data }: Props) {
  // Normalize inputs safely
  let inputs: { name: string; value: string }[] = []
  if (Array.isArray(data?.inputs)) {
    inputs = data.inputs
  } else if (Array.isArray(data?.args)) {
    inputs = data.args.map((a: any) =>
      typeof a === 'string' ? { name: a, value: a } : { name: a.name || 'arg', value: a.value || String(a) }
    )
  } else {
    inputs = [{ name: 'param', value: 'x = 1000' }]
  }

  const funcName = data?.name || 'calculate_tax'
  const output = data?.output || data?.returnValue || '$150.0'

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Input */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0 }}
        className="bg-[#181920] border-2 border-black rounded-xl p-3 text-center min-w-[90px] shadow-brutal-sm"
      >
        <div className="text-[10px] font-mono text-zinc-400 font-bold uppercase mb-1">INPUT</div>
        {inputs.map((inp, idx) => (
          <div key={idx} className="font-mono text-xs text-[#38bdf8] font-bold">
            {inp.value || inp.name}
          </div>
        ))}
        <div className="text-[9px] font-mono text-zinc-500 mt-1">parameters</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-[#facc15] text-lg font-black"
      >
        ➔
      </motion.div>

      {/* Function machine */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="bg-[#facc15] text-black border-2 border-black rounded-xl p-3 text-center min-w-[100px] shadow-brutal-sm"
      >
        <div className="text-[10px] font-mono font-black uppercase opacity-75 mb-0.5">FUNCTION</div>
        <div className="font-mono text-xs font-black">{funcName}()</div>
        <div className="text-[9px] font-mono font-bold opacity-75 mt-0.5">CPython PVM</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-[#facc15] text-lg font-black"
      >
        ➔
      </motion.div>

      {/* Output */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="border-2 border-black bg-[#a3e635]/15 text-[#a3e635] rounded-xl p-3 text-center min-w-[90px] shadow-brutal-sm font-mono"
      >
        <div className="text-[10px] text-zinc-400 font-bold uppercase mb-1">OUTPUT</div>
        <div className="text-xs font-black text-[#a3e635]">{output}</div>
        <div className="text-[9px] text-zinc-500 mt-1">return value</div>
      </motion.div>
    </div>
  )
}
