import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Loader2, Sparkles } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hola. Soy la IA de SoftwareCraft. ¿En qué puedo ayudarte a escalar hoy?' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef(null)

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      // Conexión con tu Backend Python
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg.content })
      })
      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Error conectando con el servidor." }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      
      {/* VENTANA FLOTANTE */}
      {isOpen && (
        <Card className="w-[380px] h-[550px] flex flex-col shadow-2xl border-slate-800 bg-slate-950/90 backdrop-blur-xl text-slate-100 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300 rounded-2xl">
          {/* Header */}
          <div className="p-4 bg-slate-900/50 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div className="absolute top-0 left-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-75" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white">SoftwareCraft AI</h3>
                <p className="text-[10px] text-slate-400 font-mono">ONLINE • v1.0</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full">
              <X size={16} />
            </Button>
          </div>

          {/* Area de Chat */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-5">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-sm' 
                      : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-900 border border-slate-800 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-3 text-slate-400 text-xs items-center">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                    <span className="animate-pulse">Procesando respuesta...</span>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 bg-slate-900/50 border-t border-slate-800">
            <form onSubmit={handleSubmit} className="relative group">
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje..." 
                className="pr-12 bg-slate-950 border-slate-800 focus-visible:ring-blue-600/50 text-sm py-6 rounded-xl shadow-inner transition-all group-focus-within:border-blue-600/50"
              />
              <Button 
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-2 h-8 w-8 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all disabled:opacity-50 disabled:bg-slate-800"
              >
                <Send size={14} />
              </Button>
            </form>
          </div>
        </Card>
      )}

      {/* BOTÓN DE APERTURA (FAB) */}
      <Button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-16 w-16 rounded-full shadow-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 hover:scale-110 hover:shadow-blue-500/25 transition-all duration-300 p-0 border border-white/10"
      >
        {isOpen ? <X className="text-white w-7 h-7" /> : <Sparkles className="text-white w-7 h-7" />}
      </Button>
    </div>
  )
}