import React, { useState, useEffect, useRef } from 'react';
import { supabase } from "./supabase";
import { 
  ShoppingCart, Cpu, Smartphone, MessageCircle, X, Send, Menu, Monitor, Wifi, 
  ChevronRight, Trash2, Shield, Video, Lock, Bell, Zap, Activity, Terminal
} from 'lucide-react';

// --- CONFIGURACIÓN GEMINI API ---
const apiKey = ""; // La clave se inyectará automáticamente en el entorno de ejecución

const callGemini = async (prompt, systemInstruction = "") => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] }
  };

  let attempt = 0;
  const maxRetries = 5;
  let delay = 1000;

  while (attempt < maxRetries) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Error en la respuesta de IA.";
    } catch (error) {
      attempt++;
      if (attempt >= maxRetries) return "SISTEMA FUERA DE LÍNEA. INTENTE MÁS TARDE.";
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
};

// --- CONSTANTES DE DATOS ---
const SERVICES = [
  {
    id: 1,
    title: "Reparación Notebooks",
    desc: "Diagnóstico profundo, reballing y optimización térmica.",
    icon: <Monitor className="w-8 h-8" />
  },
  {
    id: 2,
    title: "Servicio Mobile",
    desc: "Cambio de módulos, baterías y recuperación de datos.",
    icon: <Smartphone className="w-8 h-8" />
  },
  {
    id: 3,
    title: "PC Gamer Build",
    desc: "Ensamblaje de alto rendimiento y cable management.",
    icon: <Cpu className="w-8 h-8" />
  },
  {
    id: 4,
    title: "Infraestructura Red",
    desc: "Configuración de routers, cableado estructurado y WiFi Mesh.",
    icon: <Wifi className="w-8 h-8" />
  }
];

const SECURITY_SOLUTIONS = [
  {
    id: 's1',
    title: "Cámaras CCTV/IP",
    desc: "Monitoreo remoto en tiempo real. Sistemas autónomos.",
    icon: <Video className="w-10 h-10 text-cyan-400" />
  },
  {
    id: 's2',
    title: "Access Control",
    desc: "Porteros inteligentes con biometría y video HD.",
    icon: <Bell className="w-10 h-10 text-green-400" />
  },
  {
    id: 's3',
    title: "Sensores IoT",
    desc: "Detección de intrusos y automatización de alertas.",
    icon: <Activity className="w-10 h-10 text-cyan-400" />
  },
  {
    id: 's4',
    title: "Smart Home Core",
    desc: "Centralización de domótica y control por voz.",
    icon: <Lock className="w-10 h-10 text-green-400" />
  }
];

const PRODUCTS = [
  {
    id: 417879,
    name: "AIO HP Pro One 240 G10",
    desc: "Core i5 1334U | 16GB RAM | 512GB SSD",
    price: 1300955, 
    category: "Computación",
    brand: "HP",
    image: "https://placehold.co/400x300/0f172a/06b6d4?text=HP+SYSTEM+NODE"
  },
  {
    id: 416339,
    name: "AIO Lenovo IdeaCentre 3",
    desc: "Core i3 1215U | 8GB RAM | 512GB NVMe",
    price: 1139976,
    category: "Computación",
    brand: "LENOVO",
    image: "https://placehold.co/400x300/0f172a/06b6d4?text=LENOVO+TERMINAL"
  },
  {
    id: 417515,
    name: "IP Cam Tapo C520WS",
    desc: "Outdoor | Color Night Vision | AI Tracking",
    price: 97133,
    category: "Seguridad",
    brand: "TP-Link",
    image: "https://placehold.co/400x300/0f172a/22c55e?text=OPTIC+SENSOR+V1"
  },
  {
    id: 417516,
    name: "IP Cam Tapo C530WS",
    desc: "3K Res | 360 Patrol | Vehicle Detection",
    price: 111602,
    category: "Seguridad",
    brand: "TP-Link",
    image: "https://placehold.co/400x300/0f172a/22c55e?text=OPTIC+SENSOR+V2"
  },
  {
    id: 412405,
    name: "Mini Cam Tapo C100",
    desc: "Indoor | 1080p | Two-way Audio",
    price: 33751,
    category: "Seguridad",
    brand: "TP-Link",
    image: "https://placehold.co/400x300/0f172a/22c55e?text=MINI+CAM"
  },
  {
    id: 412156,
    name: "Dome Cam Tapo C200",
    desc: "Pan/Tilt | Motion Detection | Privacy Mode",
    price: 39657,
    category: "Seguridad",
    brand: "TP-Link",
    image: "https://placehold.co/400x300/0f172a/22c55e?text=DOME+CAM"
  },
  {
    id: 413320,
    name: "Bullet Cam Tapo C310",
    desc: "IP66 Weatherproof | Wired/Wireless",
    price: 62711,
    category: "Seguridad",
    brand: "TP-Link",
    image: "https://placehold.co/400x300/0f172a/22c55e?text=BULLET+CAM"
  },
  {
    id: 101,
    name: "SSD Kingston 480GB",
    desc: "Solid State Drive | SATA 3 | 10x Faster",
    price: 63000,
    category: "Almacenamiento",
    brand: "Kingston",
    image: "https://placehold.co/400x300/0f172a/06b6d4?text=DATA+BLOCK"
  },
];

// --- UTILIDADES ---
const formatPrice = (price) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price);
};

// --- HOOK: EFECTO DE ESCRITURA ---
const useTypewriter = (text, speed = 50, delay = 0) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayText('');
    setIsComplete(false);

    const startTimeout = setTimeout(() => {
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(typingInterval);
          setIsComplete(true);
        }
      }, speed);

      return () => clearInterval(typingInterval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, delay]);

  return { text: displayText, isComplete };
};

const BlinkingCursor = () => (
  <span className="animate-pulse text-cyan-500 inline-block ml-1 font-bold">_</span>
);

// --- COMPONENTES VISUALES ---
const MatrixRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    const columns = Math.floor(width / 20);
    const drops = Array(columns).fill(1);
    const chars = "01 TECHFIX SYSTEM KERNEL 010101 FIX REPAIR CODE";

    const draw = () => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.05)';
      ctx.fillRect(0, 0, width, height);
      
      ctx.fillStyle = '#06b6d4';
      ctx.font = '14px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * 20, drops[i] * 20);

        if (drops[i] * 20 > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-20 pointer-events-none" />;
};

const CircuitBorder = ({ children, className = "" }) => (
  <div className={`relative p-[1px] group ${className}`}>
    
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

    <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-cyan-500 pointer-events-none"></div>
    <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-cyan-500 pointer-events-none"></div>
    <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-cyan-500 pointer-events-none"></div>
    <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-cyan-500 pointer-events-none"></div>

    <div className="relative bg-slate-900 p-4">
      {children}
    </div>

  </div>
);

// --- APP PRINCIPAL ---
export default function PublicApp() {

  
    
  const [activeSection, setActiveSection] = useState('home');
  const [cart, setCart] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('Todos');
   const createTicket = async (formData) => {
  const ticketCode = `TFX-${Date.now()}`;

  const { data, error } = await supabase
  .from('tickets')
  .insert({
    ticket_code: ticketCode,
    customer_name: formData.name,
    email: formData.email,
    phone: formData.phone,
    issue_type: formData.issue,
    description: formData.message,
    status: 'recibido'
  })
  .select()
  .single();

if (error) {
  console.error('❌ ERROR SUPABASE:', error);
  throw error;
}

// 📩 enviar mail
const { error: mailError } = await supabase.functions.invoke(
  "send-ticket-email",
  {
    body: {
      email: data.email,
      ticket_code: data.ticket_code,
      issue_type: data.issue_type,
      status: data.status
    }
  }
);

if (mailError) {
  console.error("⚠️ Error enviando mail:", mailError);
}

return data;
};

  useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}, [activeSection]);

  // 🔹 HANDLER DEL FORM
 const [confirmationMessage, setConfirmationMessage] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = {
    name: e.target.name.value,
    email: e.target.email.value, 
    phone: e.target.phone.value,
    issue: selectedIssue,
    message: e.target.message.value
  };

  try {
    const ticket = await createTicket(formData);
    setConfirmationMessage(`✅ Ticket creado: ${ticket.ticket_code}`);
    e.target.reset();
  } catch (error) {
    console.error(error);
    setConfirmationMessage('❌ Error al crear el ticket');
  }
};


  
  


  // Chatbot State
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: 'SYSTEM ONLINE... Bienvenido. Soy TECHFIX_AI, conectado al mainframe. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const categories = ['Todos', ...new Set(PRODUCTS.map(p => p.category))];
  const filteredProducts = categoryFilter === 'Todos' ? PRODUCTS : PRODUCTS.filter(p => p.category === categoryFilter);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

const addToCart = (product) => {
  console.log('AGREGADO:', product.name);

  setCart((prev) => {
    const existing = prev.find((item) => item.id === product.id);

    if (existing) {
      return prev.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    return [...prev, { ...product, quantity: 1 }];
  });

  // 👉 ESTO ES LO ÚNICO NUEVO
  setIsCartOpen(true);
};

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const getTotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    const message = `// PEDIDO //%0A${cart.map(i => `> ${i.name} [x${i.quantity}]`).join('%0A')}%0A------------------%0ATOTAL: ${formatPrice(getTotal())}`;
    window.open(`https://wa.me/5491138508080?text=${message}`, '_blank');
  };

  // --- LLM CHATBOT ---
  const handleSendMessage = async () => {
    if (!inputMsg.trim()) return;
    const userText = inputMsg;
    setChatMessages(prev => [...prev, { role: 'user', text: inputMsg }]);
    setInputMsg('');
    setIsTyping(true);

    const productContext = PRODUCTS.map(p => 
        `- ${p.name} (${p.brand}): ${formatPrice(p.price)}. Cat: ${p.category}. Desc: ${p.desc}`
    ).join('\n');
    
    const serviceContext = SERVICES.map(s => `- ${s.title}: ${s.desc}`).join('\n');
    const securityContext = SECURITY_SOLUTIONS.map(s => `- ${s.title}: ${s.desc}`).join('\n');

    const systemPrompt = `Eres TECHFIX_AI, el asistente virtual de ventas y soporte técnico de una empresa estilo cyberpunk.
    
    TUS OBJETIVOS:
    1. Vender productos de nuestro INVENTARIO.
    2. Ofrecer nuestros SERVICIOS técnicos y SOLUCIONES DE SEGURIDAD.
    3. Responder con estilo técnico, futurista y breve.

    INVENTARIO ACTUAL (Precios en ARS):
    ${productContext}
    
    SERVICIOS DE REPARACIÓN Y REDES:
    ${serviceContext}
    
    SOLUCIONES DE SEGURIDAD:
    ${securityContext}
    
    Si preguntan por algo que no está en la lista, di que no hay stock en el mainframe y ofrece una alternativa.`;

    const botResponse = await callGemini(userText, systemPrompt);

    setIsTyping(false);
    setChatMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
  };

  const Navbar = () => (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-cyan-900/50">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveSection('home')}>
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <Cpu className="text-cyan-400 w-10 h-10 relative z-10" />
            </div>
            <div className="flex flex-col font-mono">
              <span className="font-bold text-xl tracking-widest text-white leading-none">TECH<span className="text-cyan-400">FIX</span>_</span>
              <span className="text-[10px] text-cyan-600 tracking-[0.3em]">SYSTEMS.INC</span>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2 bg-slate-900/50 p-1 rounded border border-cyan-900/30">
              {['Home', 'Servicios', 'Seguridad', 'Tienda', 'Contacto'].map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveSection(item.toLowerCase())}
                  className={`px-4 py-2 text-xs font-mono font-bold tracking-wide transition-all duration-300 relative overflow-hidden group ${
                    activeSection === item.toLowerCase() 
                    ? 'text-slate-950 bg-cyan-500 clip-path-slant' 
                    : 'text-cyan-500 hover:text-cyan-300 hover:bg-cyan-950/30'
                  }`}
                >
                  <span className="relative z-10">{`[ ${item.toUpperCase()} ]`}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              className="relative p-2 text-cyan-500 hover:text-white transition-colors border border-cyan-900/50 hover:border-cyan-500 bg-slate-900/50 rounded"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-slate-950 bg-green-500 border border-slate-950">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </button>
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-cyan-500">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-cyan-900 pb-4 px-4 font-mono">
          {['Home', 'Servicios', 'Seguridad', 'Tienda', 'Contacto'].map((item) => (
            <button
              key={item}
              onClick={() => { setActiveSection(item.toLowerCase()); setMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-3 text-sm text-cyan-500 hover:bg-cyan-900/20 border-l-2 border-transparent hover:border-cyan-500 mt-1"
            >
              {`> ${item.toUpperCase()}`}
            </button>
          ))}
        </div>
      )}
    </nav>
  );

  const Hero = () => {
    // Animación secuencial de escritura
    const title1 = useTypewriter("TECH", 150, 200);
    const title2 = useTypewriter("FIX", 150, 900); 
    const subtitle = useTypewriter("SOLUTIONS", 100, 1600); 
    
    // Líneas de comando
    const line1 = useTypewriter("> Initializing hardware repair protocols...", 40, 2700);
    const line2 = useTypewriter("> Loading security modules...", 40, 4500);
    const line3 = useTypewriter("> System upgrade ready.", 40, 6000);

    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 pt-16">
        <MatrixRain />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center justify-center">
          {/* LOGO GIGANTE CENTRALIZADO (TAMAÑO EQUILIBRADO) */}
          <div className="mb-6 relative group">
             <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000 animate-pulse"></div>
             <Cpu className="text-cyan-400 w-20 h-20 md:w-32 md:h-32 relative z-10 drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]" />
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-2 tracking-tighter font-mono leading-none flex flex-col items-center">
            <span className="block drop-shadow-[0_0_10px_rgba(6,182,212,0.5)] flex items-center">
              {title1.text}
              {!title1.isComplete && <BlinkingCursor/>}
              <span className="text-cyan-400">
                {title2.text}
                {title1.isComplete && !title2.isComplete && <BlinkingCursor/>}
              </span>
            </span>
          </h1>
          
          <span className="text-lg md:text-2xl text-cyan-700 tracking-[0.5em] font-mono font-bold block mb-12 opacity-90 h-8">
             {subtitle.text}
             {!subtitle.isComplete && title2.isComplete && <BlinkingCursor/>}
          </span>
          
          <div className="text-lg md:text-xl text-cyan-300/70 mb-10 max-w-2xl mx-auto font-mono border-l-2 border-cyan-500/30 pl-6 text-left min-h-[120px] w-full">
            <div className="h-8">{line1.text} {subtitle.isComplete && !line1.isComplete && <BlinkingCursor/>}</div>
            <div className="h-8">{line2.text} {line1.isComplete && !line2.isComplete && <BlinkingCursor/>}</div>
            <div className="h-8">{line3.text} {line2.isComplete && <BlinkingCursor/>}</div>
          </div>
          
          <div className={`flex flex-col sm:flex-row gap-6 justify-center transition-opacity duration-1000 ${line3.isComplete ? 'opacity-100' : 'opacity-0'}`}>
            <button onClick={() => setActiveSection('tienda')} className="group relative px-8 py-4 bg-cyan-600/10 overflow-hidden font-mono font-bold text-cyan-400 border border-cyan-500 hover:bg-cyan-500 hover:text-slate-950 transition-all clip-path-slant">
              <span className="absolute inset-0 w-full h-full bg-cyan-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></span>
              ACCESS STORE_
            </button>
            <button onClick={() => setActiveSection('seguridad')} className="group px-8 py-4 bg-slate-900 text-green-400 font-mono font-bold border border-green-500/50 hover:border-green-400 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all clip-path-slant">
              SECURITY MODULE_
            </button>
          </div>
        </div>
      </section>
    );
  };

  const StoreSection = ({ addToCart }) => (
    <section className="py-24 bg-slate-950 px-4 min-h-screen border-t border-cyan-900/30 relative">
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-cyan-900/10 to-transparent"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-cyan-900/50 pb-6">
          <div>
            <h2 className="text-3xl font-mono font-bold text-white mb-2 flex items-center gap-3">
              <Terminal className="text-cyan-500" />
              HARDWARE_STORE
            </h2>
            <p className="text-cyan-600 font-mono text-xs">/root/products/catalog</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 font-mono text-xs border ${
                  categoryFilter === cat 
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400' 
                    : 'bg-slate-900 text-cyan-500 border-cyan-900 hover:border-cyan-500'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <CircuitBorder key={product.id} className="bg-slate-900/80">
              <div className="relative h-48 overflow-hidden bg-slate-950 p-2 group-hover:bg-slate-900 transition-colors">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 grayscale group-hover:grayscale-0"
                />
                <span className={`absolute top-2 right-2 text-[10px] font-mono font-bold px-2 py-0.5 border ${
                  product.category === 'Seguridad' 
                  ? 'bg-green-950/80 text-green-400 border-green-500'
                  : 'bg-cyan-950/80 text-cyan-400 border-cyan-500'
                }`}>
                  {product.category.toUpperCase()}
                </span>
              </div>
              
              <div className="p-4 border-t border-cyan-900/30">
                <h3 className="text-white font-mono font-bold text-sm mb-2 truncate">{product.name}</h3>
                <p className="text-slate-500 text-xs mb-4 h-8 overflow-hidden font-mono leading-tight">{product.desc}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-mono font-bold text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">
                    {formatPrice(product.price)}
                  </span>
                  <button 
                    onClick={() => addToCart(product)}
                    className="p-2 bg-cyan-950 border border-cyan-600 text-cyan-400 hover:bg-cyan-400 hover:text-slate-950 transition-colors"
                  >
                    <ShoppingCart size={16} />
                  </button>
                </div>
              </div>
            </CircuitBorder>
          ))}
        </div>
      </div>
    </section>
  );




const CartSection = () => {
  
  const [paymentMethod, setPaymentMethod] = useState("tarjeta");

  const [showCmd, setShowCmd] = useState(false);
  const [cmdLines, setCmdLines] = useState([]);

  const ejecutarPago = () => {
    setShowCmd(true);
    setCmdLines([]);

    const secuencia = [
      "> iniciando_transacción...",
      "> conectando_con_pasarela_de_pago...",
      "> esperando_confirmación...",
      "",
      "PAGO_APROBADO ✓",
      "La orden ha sido confirmada.",
      "Gracias por su compra."
    ];

    secuencia.forEach((linea, i) => {
      setTimeout(() => {
        setCmdLines(prev => [...prev, linea]);
      }, i * 900);
    });
  };

  return (
    <section className="min-h-screen bg-slate-950 px-6 py-28 font-mono">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ================= IZQUIERDA ================= */}
        <div className="lg:col-span-2 space-y-8">

          {/* DATOS CLIENTE */}
          <div className="relative bg-slate-900/60 border border-cyan-900/40 p-6 shadow-[0_0_40px_rgba(6,182,212,0.08)]">
            <h3 className="text-cyan-400 text-xs tracking-widest mb-6">
              {"> DATOS_DEL_CLIENTE"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="bg-slate-950 border border-cyan-900/50 text-cyan-300 px-4 py-3 text-sm outline-none focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(6,182,212,0.25)]"
                placeholder="NOMBRE_COMPLETO_"
              />
              <input
                className="bg-slate-950 border border-cyan-900/50 text-cyan-300 px-4 py-3 text-sm outline-none focus:border-cyan-500"
                placeholder="EMAIL_"
              />
            </div>

            <input
              className="mt-4 w-full bg-slate-950 border border-cyan-900/50 text-cyan-300 px-4 py-3 text-sm outline-none focus:border-cyan-500"
              placeholder="TELÉFONO_"
            />
          </div>

{/* MÉTODO DE PAGO */}
<div className="relative bg-slate-900/60 border border-cyan-900/40 p-6">
  <h3 className="text-cyan-400 text-xs tracking-widest mb-6">
    {"> MÉTODO_DE_PAGO"}
  </h3>

  <div className="grid grid-cols-3 gap-4">
    {["tarjeta", "mercadopago", "transferencia"].map(method => (
      <button
        key={method}
        onClick={() => setPaymentMethod(method)}
        className={`py-4 border text-xs tracking-widest transition-all ${
          paymentMethod === method
            ? "bg-cyan-500 text-slate-950 border-cyan-400"
            : "bg-slate-950 text-cyan-400 border-cyan-900 hover:border-cyan-500"
        }`}
      >
        {method.toUpperCase()}
      </button>
    ))}
  </div>

  {/* ================= CONTENIDO DINÁMICO ================= */}
  <div className="mt-6 border-t border-cyan-900/40 pt-4 text-xs">

    {/* TARJETA */}
    {paymentMethod === "tarjeta" && (
      <div className="space-y-4">
        <p className="text-cyan-400">
          Ingrese los datos de la tarjeta para continuar con el pago.
        </p>

        <input
          className="w-full bg-slate-950 border border-cyan-900/50 text-cyan-300 px-4 py-3 text-sm outline-none focus:border-cyan-500"
          placeholder="NÚMERO_DE_TARJETA_"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            className="bg-slate-950 border border-cyan-900/50 text-cyan-300 px-4 py-3 text-sm outline-none focus:border-cyan-500"
            placeholder="MM / AA"
          />
          <input
            className="bg-slate-950 border border-cyan-900/50 text-cyan-300 px-4 py-3 text-sm outline-none focus:border-cyan-500"
            placeholder="CVV"
          />
        </div>

        <input
          className="w-full bg-slate-950 border border-cyan-900/50 text-cyan-300 px-4 py-3 text-sm outline-none focus:border-cyan-500"
          placeholder="NOMBRE_DEL_TITULAR_"
        />
      </div>
    )}

    {/* MERCADOPAGO */}
    {paymentMethod === "mercadopago" && (
      <div className="space-y-3">
        <p className="text-cyan-400">
          Se genero un enlace seguro para completar el pago mediante MercadoPago.
        </p>

        <a
          href="https://www.mercadopago.com.ar/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition-all tracking-widest"
        >
          IR_A_MERCADOPAGO {'>'}
        </a>
      </div>
    )}

    {/* TRANSFERENCIA */}
    {paymentMethod === "transferencia" && (
      <div className="space-y-3">
        <p className="text-cyan-400">
          Datos bancarios para realizar la transferencia:
        </p>

        <div className="bg-slate-950 border border-cyan-900/50 p-4 space-y-1 text-cyan-300">
          <p><span className="text-cyan-500">BANCO:</span> Banco Nación</p>
          <p><span className="text-cyan-500">CUENTA:</span> Caja de Ahorro</p>
          <p><span className="text-cyan-500">CBU:</span> 0000000000000000000000</p>
          <p><span className="text-cyan-500">ALIAS:</span> TECHFIX.PAGOS</p>
          <p><span className="text-cyan-500">TITULAR:</span> TechFix Systems</p>
        </div>

        <button
          onClick={() => navigator.clipboard.writeText("0000000000000000000000")}
          className="text-cyan-500 text-xs hover:underline"
        >
          COPIAR_CBU
        </button>
      </div>
    )}

  </div>
</div>


        </div>

        {/* ================= DERECHA ================= */}
        <div className="relative bg-slate-900/60 border border-cyan-900/40 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-cyan-400 text-xs tracking-widest mb-6">
              {"> RESUMEN_DE_ORDEN"}
            </h3>

            {cart.map(item => (
              <div key={item.id} className="flex justify-between text-sm text-cyan-300 mb-2">
                <span>{item.name} x{item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}

            <div className="border-t border-cyan-900/50 mt-4 pt-4 flex justify-between text-cyan-400 font-bold">
              <span>TOTAL</span>
              <span>{formatPrice(getTotal())}</span>
            </div>
          </div>

     {paymentMethod === "tarjeta" && (
  <button
    onClick={ejecutarPago}
    className="mt-8 py-4 bg-cyan-500 text-slate-950 font-bold tracking-widest hover:bg-cyan-400 transition-all"
  >
    EJECUTAR_PAGO_
  </button>
)}

        </div>
      </div>

      {showCmd && <FakeCMD lines={cmdLines} onClose={() => setShowCmd(false)} />}
    </section>
  );
};




const FakeCMD = ({ lines, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 z-[90] flex items-center justify-center">
      <div className="w-[720px] bg-black border border-gray-600 shadow-2xl">

        {/* BARRA SUPERIOR */}
        <div className="flex justify-between items-center px-3 py-1 bg-gray-800 text-gray-200 text-xs">
          <span>C:\Windows\System32\cmd.exe</span>
          <button
            onClick={onClose}
            className="hover:text-red-400 transition"
          >
            X
          </button>
        </div>

        {/* TERMINAL */}
        <div className="p-4 text-green-500 text-sm font-mono min-h-[260px] space-y-2">
          {lines.map((line, i) => (
            <div key={i}>
              {line}
            </div>
          ))}
          <span className="animate-pulse">_</span>
        </div>
      </div>
    </div>
  );
};




 const ServicesSection = ({ setActiveSection, setSelectedIssue }) => {
  return (
    <section className="py-20 bg-slate-950 px-4 relative border-t border-cyan-900/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-900/50 -z-10"></div>
          <span className="bg-slate-950 px-4 text-2xl font-mono font-bold text-white border border-cyan-900 inline-block py-2">
            SERVICIOS_PRINCIPALES
          </span>
        </div>

        {SERVICES.map((service) => (
          <div
            key={service.id}
            className="relative group bg-slate-900 p-6 border border-cyan-900/50 hover:border-cyan-500 transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
              <Zap className="text-cyan-500 w-16 h-16 -mr-4 -mt-4" />
            </div>

            <div className="w-12 h-12 bg-slate-950 border border-cyan-800 rounded flex items-center justify-center text-cyan-400 mb-4 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              {service.icon}
            </div>

            <h3 className="text-lg font-mono font-bold text-white mb-2">
              {service.title}
            </h3>

            <p className="text-cyan-700 text-xs font-mono mb-4">
              {service.desc}
            </p>

            {/* 🔥 BOTÓN SOLICITAR SERVICIO */}
            <button
              onClick={() => {
                setSelectedIssue(service.title); // Establecer el servicio seleccionado
                setActiveSection('contacto'); // Cambiar a la sección de contacto
              }}
              className="w-full border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition-all py-2 font-mono text-xs"
            >
              SOLICITAR_SERVICIO
            </button>

            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </div>
        ))}
      </div>
    </section>
  );
};
  const SecuritySection = () => (
    <section className="py-20 bg-slate-950 px-4 relative overflow-hidden border-t border-green-900/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-900/10 via-slate-950 to-slate-950"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="text-left border-l-4 border-green-500 pl-4">
             <div className="flex items-center gap-2 text-green-500 mb-1 font-mono text-xs tracking-widest animate-pulse">
              <Shield size={14} />
              <span>PROTOCOLOS DE DEFENSA ACTIVOS</span>
            </div>
            <h2 className="text-3xl font-mono font-bold text-white">SOLUCIONES_DE_SEGURIDAD</h2>
          </div>
          <button
  onClick={() => {
    setActiveSection('tienda');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }}
  className="px-6 py-2 border border-green-600 text-green-500 hover:bg-green-500 hover:text-slate-950 font-mono text-xs transition-colors"
>
  VER_CATÁLOGO {'>'}
</button>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SECURITY_SOLUTIONS.map((item) => (
            <div key={item.id} className="bg-slate-900/50 p-6 border border-green-900/30 hover:border-green-500/50 hover:bg-slate-900 transition-all group">
              <div className="text-green-500 mb-4 group-hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.6)] transition-all">{item.icon}</div>
              <h3 className="text-white font-mono font-bold mb-2 text-sm">{item.title}</h3>
              <p className="text-slate-500 text-xs font-mono">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

const ContactSection = ({ selectedIssue, handleSubmit }) => (
  <section className="py-20 bg-slate-950 px-4 border-t border-slate-900 relative">
    <div className="max-w-3xl mx-auto">
      <div className="bg-slate-900 border border-cyan-900/50 p-1 relative">
        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-500"></div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-500"></div>

        <div className="bg-slate-950 p-8 border border-cyan-900/30">
          <h2 className="text-2xl font-mono font-bold text-white mb-6 text-center text-glitch">
            ESTABLECER_CONEXIÓN
          </h2>

          {/* 🔹 SERVICIO SELECCIONADO */}
          {selectedIssue && (
            <div className="mb-6 p-3 border border-cyan-500 text-cyan-300 text-sm bg-slate-900 font-mono">
              <span className="text-cyan-500">SERVICIO_SELECCIONADO:</span>{" "}
              {selectedIssue}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="name"
                type="text"
                placeholder="ID_USUARIO"
                required
                className="bg-slate-900 border-b border-cyan-900 text-cyan-400 w-full px-4 py-3 outline-none focus:border-cyan-500 font-mono text-sm placeholder-cyan-900"
              />

              <input
                name="phone"
                type="text"
                placeholder="FRECUENCIA_COMMS (Teléfono)"
                required
                className="bg-slate-900 border-b border-cyan-900 text-cyan-400 w-full px-4 py-3 outline-none focus:border-cyan-500 font-mono text-sm placeholder-cyan-900"
              />
            </div>

            <textarea
              name="message"
              placeholder="INGRESAR_DATOS..."
              rows="4"
              required
              className="bg-slate-900 border-b border-cyan-900 text-cyan-400 w-full px-4 py-3 outline-none focus:border-cyan-500 font-mono text-sm placeholder-cyan-900 resize-none"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-cyan-900/20 border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 font-mono font-bold py-3 transition-all tracking-widest"
            >
              TRANSMITIR
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
);
  const CartModal = () => (
    <div className={`fixed inset-0 z-[60] ${isCartOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-slate-950/90 backdrop-blur-sm transition-opacity ${isCartOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsCartOpen(false)} />
      <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-slate-900 border-l border-cyan-500 shadow-[0_0_50px_rgba(6,182,212,0.2)] transform transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col font-mono">
          <div className="flex justify-between items-center mb-6 pb-6 border-b border-cyan-900/50">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-cyan-500">{'>'}</span> CARRITO_ACTUAL
            </h2>
            <button onClick={() => setIsCartOpen(false)} className="text-cyan-500 hover:text-white"><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-cyan-900">
                <Terminal size={48} className="mb-4 opacity-50" />
                <p>SIN DATOS</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-4 bg-slate-950 p-3 border border-cyan-900/30">
                  <div className="w-16 h-16 bg-slate-900 border border-cyan-900 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-cyan-300 font-bold text-xs truncate">{item.name}</h4>
                    <p className="text-white font-bold text-sm">{formatPrice(item.price)}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-cyan-700 text-xs">CANT: {item.quantity}</span>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-400"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {cart.length > 0 && (
            <div className="pt-6 border-t border-cyan-900/50 mt-auto">
              <div className="flex justify-between items-end mb-4">
                <span className="text-cyan-700 text-xs">TOTAL</span>
                <span className="text-2xl font-bold text-cyan-400">{formatPrice(getTotal())}</span>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setActiveSection('carrito'); // te lleva a la página checkout
                }}
                className="w-full bg-green-600 hover:bg-green-500 text-slate-950 font-bold py-4 flex items-center justify-center gap-2 transition-all"
              >
                FINALIZAR_COMPRA
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">

      <Navbar />
      <main className="flex-1 pt-24">




        {activeSection === 'home' && (
          <>
            <Hero />
            <ServicesSection 
  setActiveSection={setActiveSection} 
  setSelectedIssue={setSelectedIssue} 
/>

            <SecuritySection />
            <ContactSection />
          </>
        )}
         {activeSection === 'servicios' && (
    <ServicesSection 
      setActiveSection={setActiveSection} 
      setSelectedIssue={setSelectedIssue} 
    />
  )}
        {activeSection === 'seguridad' && <SecuritySection />}
        {activeSection === 'tienda' && <StoreSection addToCart={addToCart} />}
        {activeSection === 'contacto' && (
  <ContactSection
    selectedIssue={selectedIssue}
    handleSubmit={handleSubmit}
  />
)}
        {activeSection === 'carrito' && <CartSection />} 
      </main>
      
      <footer className="bg-slate-950 py-8 text-center border-t border-cyan-900/30 relative overflow-hidden">

        <MatrixRain />
        
        <div className="relative z-10 font-mono text-xs text-cyan-800">
          <p>ID SISTEMA: TECHFIX_2025 // ESTADO: ONLINE</p>
        </div>
      </footer>

      <CartModal />

      
      {/* Botón Chat Flotante */}
      <div className="fixed bottom-6 right-6 z-40">
        {isChatOpen && (
          <div className="absolute bottom-16 right-0 w-80 bg-slate-900 border border-cyan-500/50 flex flex-col h-96 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            <div className="bg-slate-950 p-3 border-b border-cyan-900 flex justify-between items-center">
              <span className="text-cyan-400 font-mono text-xs font-bold blinking-cursor">ASISTENTE_IA_V1</span>
              <button onClick={() => setIsChatOpen(false)}><X size={14} className="text-cyan-700" /></button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/90 font-mono">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-3 py-2 text-xs border ${
                    msg.role === 'user' 
                    ? 'border-cyan-500 text-cyan-300 bg-cyan-900/20' 
                    : 'border-green-500 text-green-400 bg-green-900/10'
                  }`}>
                    <span className="block text-[8px] opacity-50 mb-1">{msg.role === 'user' ? 'USER >>' : 'SYS >>'}</span>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                 <div className="flex justify-start">
                    <div className="px-3 py-2 text-xs border border-green-500 text-green-400 bg-green-900/10 rounded-tr-lg rounded-br-lg rounded-bl-lg">
                        <span className="animate-pulse">PROCESANDO DATOS...</span>
                    </div>
                 </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="p-3 bg-slate-950 border-t border-cyan-900 flex gap-2">
              <input type="text" value={inputMsg} onChange={(e) => setInputMsg(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="CMD..." className="flex-1 bg-slate-900 border border-cyan-900 text-cyan-400 text-xs px-3 outline-none focus:border-cyan-500 font-mono" />
              <button onClick={handleSendMessage} className="p-2 bg-cyan-900/30 border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition-colors"><Send size={14} /></button>
            </div>
          </div>
        )}
        <button onClick={() => setIsChatOpen(!isChatOpen)} className="w-14 h-14 bg-slate-900 border border-cyan-500 text-cyan-400 flex items-center justify-center hover:bg-cyan-500 hover:text-slate-950 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] relative group">
          {isChatOpen ? <X /> : <MessageCircle size={24} />}
          <div className="absolute inset-0 border border-cyan-400 rounded-full animate-ping opacity-20"></div>
        </button>
      </div>
    </div>
    
  );
  }

