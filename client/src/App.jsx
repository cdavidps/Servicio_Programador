import { ChatWidget } from "@/components/ChatWidget"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code2, Terminal, Cpu } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-40 bg-slate-950/50 backdrop-blur-md border-b border-white/5">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Code2 className="text-white w-5 h-5" />
            </div>
            Bambi_Dev
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Servicios</a>
            <a href="#" className="hover:text-white transition-colors">Proyectos</a>
            <a href="#" className="hover:text-white transition-colors">Stack</a>
          </div>
          <Button variant="outline" className="border-slate-800 hover:bg-slate-900 text-slate-200 hidden sm:flex">
            Contacto
          </Button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Luces de fondo (Glow Effects) */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-blue-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            Disponible para nuevos proyectos
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Ingeniería de Software <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              Potenciada por IA
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Desarrollo soluciones full-stack escalables y agentes de inteligencia artificial autónomos. Transformo ideas complejas en eficiencia y rendimiento.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-8 h-12 text-base font-medium shadow-lg shadow-blue-900/20 group">
              Hablar con mi IA <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="secondary" className="bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-full px-8 h-12 text-base border border-slate-800">
              Ver Portafolio
            </Button>
          </div>
        </div>

        {/* FEATURE GRID (Decorativo) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-24">
          {[
            { icon: Terminal, title: "Backend Robusto", desc: "APIs rápidas y seguras con FastAPI y Python." },
            { icon: Cpu, title: "Inteligencia Artificial", desc: "Integración de modelos LLM y RAG." },
            { icon: Code2, title: "Frontend Moderno", desc: "Interfaces reactivas con React y Tailwind." }
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-blue-500/30 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER SIMPLE */}
      <footer className="py-8 text-center text-slate-600 text-sm border-t border-white/5 bg-slate-950">
        <p>© 2026 SoftwareCraft. Built with React & LangChain.</p>
      </footer>

      {/* EL WIDGET FLOTANTE VIVE AQUÍ */}
      <ChatWidget />
    </div>
  )
}

export default App