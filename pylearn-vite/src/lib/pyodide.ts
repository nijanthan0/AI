'use client'

let pyodideInstance: any = null
let loadPromise: Promise<any> | null = null

export async function loadPyodideRuntime() {
  if (pyodideInstance) return pyodideInstance
  if (loadPromise) return loadPromise

  loadPromise = (async () => {
    // Dynamically import at runtime — never bundled by webpack
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js'
    document.head.appendChild(script)

    await new Promise<void>((resolve, reject) => {
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Pyodide script'))
    })

    // @ts-ignore — loadPyodide is injected by the script above
    pyodideInstance = await (window as any).loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/',
    })

    return pyodideInstance
  })()

  return loadPromise
}

export async function runPython(
  code: string
): Promise<{ stdout: string; stderr: string; error: string | null }> {
  const py = await loadPyodideRuntime()

  const stdout: string[] = []
  const stderr: string[] = []

  py.setStdout({ batched: (s: string) => stdout.push(s) })
  py.setStderr({ batched: (s: string) => stderr.push(s) })

  try {
    await py.runPythonAsync(code)
    return { stdout: stdout.join('\n'), stderr: stderr.join('\n'), error: null }
  } catch (err: any) {
    return {
      stdout: stdout.join('\n'),
      stderr: stderr.join('\n'),
      error: err.message || String(err),
    }
  }
}

export function isPyodideReady() {
  return pyodideInstance !== null
}
