import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingCart, 
  Cpu, 
  Smartphone, 
  MessageCircle, 
  X, 
  Send, 
  Menu, 
  Monitor, 
  Wifi, 
  ChevronRight,
  Instagram,
  Facebook,
  Linkedin,
  Trash2,
  Shield,
  Video,
  Lock,
  Bell,
  Search,
  Zap,
  Activity,
  Terminal
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

/**
 * HOOK PERSONALIZADO: Efecto de Escritura (Typewriter)
 */
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

/**
 * COMPONENTE VISUAL: Cursor Parpadeante
 */
const BlinkingCursor = () => (
  <span className="animate-pulse text-cyan-500 inline-block ml-1 font-bold">_</span>
);

/**
 * COMPONENTE VISUAL: Lluvia Matrix
 */
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

/**
 * DATOS DE SERVICIOS
 */
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

/**
 * CATALOGO DE PRODUCTOS
 */
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

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price);
};

// Componente decorativo de Circuito
const CircuitBorder = ({ children, className = "" }) => (
  <div className={`relative p-[1px] group ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
    {/* Esquinas Circuito */}
    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400"></div>
    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400"></div>
    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400"></div>
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400"></div>
    {children}
  </div>
);

export default function PublicApp() {
  const [activeSection, setActiveSection] = useState('home');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('Todos');
  
  const [isTyping, setIsTyping] = useState(false);

  const categories = ['Todos', ...new Set(PRODUCTS.map(p => p.category))];
  
  const filteredProducts = categoryFilter === 'Todos' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === categoryFilter);

  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: 'SYSTEM ONLINE... Bienvenido. Soy TECHFIX_AI, conectado al mainframe. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const getTotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    const message = `// NEW ORDER DETECTED //%0A${cart.map(i => `> ${i.name} [x${i.quantity}]`).join('%0A')}%0A------------------%0ATOTAL: ${formatPrice(getTotal())}`;
    window.open(`https://wa.me/5491100000000?text=${message}`, '_blank');
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
    TUS OBJETIVOS: Vender productos de nuestro INVENTARIO, ofrecer SERVICIOS técnicos y SOLUCIONES DE SEGURIDAD.
    Responder con estilo técnico, futurista y breve.
    INVENTARIO ACTUAL: ${productContext}
    SERVICIOS: ${serviceContext}
    SEGURIDAD: ${securityContext}`;

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
            <button className="relative p-2 text-cyan-500 hover:text-white transition-colors border border-cyan-900/50 hover:border-cyan-500 bg-slate-900/50 rounded" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-slate-950 bg-green-500 border border-slate-950">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </button>
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-cyan-500"><Menu className="w-6 h-6" /></button>
            </div>
          </div>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-cyan-900 pb-4 px-4 font-mono">
          {['Home', 'Servicios', 'Seguridad', 'Tienda', 'Contacto'].map((item) => (
            <button key={item} onClick={() => { setActiveSection(item.toLowerCase()); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-3 text-sm text-cyan-500 hover:bg-cyan-900/20 border-l-2 border-transparent hover:border-cyan-500 mt-1">
              {`> ${item.toUpperCase()}`}
            </button>
          ))}
        </div>
      )}
    </nav>
  );

  const Hero = () => {
    // Animación secuencial de escritura (EN INGLÉS - Solicitud de excepción)
    const title1 = useTypewriter("TECH", 150, 200);
    const title2 = useTypewriter("FIX", 150, 900); // Empieza cuando TECH termina
    const subtitle = useTypewriter("SOLUTIONS", 100, 1600); // Empieza después del logo
    
    // Líneas de comando (EN INGLÉS - Solicitud de excepción)
    const line1 = useTypewriter("> Initializing hardware repair protocols...", 40, 2700);
    const line2 = useTypewriter("> Loading security modules...", 40, 4500);
    const line3 = useTypewriter("> System upgrade ready.", 40, 6000);

    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 pt-16">
        <MatrixRain />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center justify-center">
          {/* LOGO GIGANTE CENTRALIZADO */}
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

  const StoreSection = () => (
    <section className="py-24 bg-slate-950 px-4 min-h-screen border-t border-cyan-900/30 relative">
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-cyan-900/10 to-transparent"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-cyan-900/50 pb-6">
          <div>
            {/* HARDWARE_STORE MANTENIDO EN INGLÉS - Solicitud de excepción */}
            <h2 className="text-3xl font-mono font-bold text-white mb-2 flex items-center gap-3"><Terminal className="text-cyan-500" /> HARDWARE_STORE</h2>
            <p className="text-cyan-600 font-mono text-xs">/root/products/catalog</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-3 py-1 font-mono text-xs border ${categoryFilter === cat ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-900 text-cyan-500 border-cyan-900 hover:border-cyan-500'}`}>
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
                <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 grayscale group-hover:grayscale-0" />
                <span className={`absolute top-2 right-2 text-[10px] font-mono font-bold px-2 py-0.5 border ${product.category === 'Seguridad' ? 'bg-green-950/80 text-green-400 border-green-500' : 'bg-cyan-950/80 text-cyan-400 border-cyan-500'}`}>
                  {product.category.toUpperCase()}
                </span>
              </div>
              <div className="p-4 border-t border-cyan-900/30">
                <h3 className="text-white font-mono font-bold text-sm mb-2 truncate">{product.name}</h3>
                <p className="text-slate-500 text-xs mb-4 h-8 overflow-hidden font-mono leading-tight">{product.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-mono font-bold text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">{formatPrice(product.price)}</span>
                  <button onClick={() => addToCart(product)} className="p-2 bg-cyan-950 border border-cyan-600 text-cyan-400 hover:bg-cyan-400 hover:text-slate-950 transition-colors"><ShoppingCart size={16} /></button>
                </div>
              </div>
            </CircuitBorder>
          ))}
        </div>
      </div>
    </section>
  );

  const ServicesSection = () => (
    <section className="py-20 bg-slate-950 px-4 relative border-t border-cyan-900/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-900/50 -z-10"></div>
          <span className="bg-slate-950 px-4 text-2xl font-mono font-bold text-white border border-cyan-900 inline-block py-2">SERVICIOS_PRINCIPALES</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service) => (
            <div key={service.id} className="relative group bg-slate-900 p-6 border border-cyan-900/50 hover:border-cyan-500 transition-all overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity"><Zap className="text-cyan-500 w-16 h-16 -mr-4 -mt-4" /></div>
              <div className="w-12 h-12 bg-slate-950 border border-cyan-800 rounded flex items-center justify-center text-cyan-400 mb-4 shadow-[0_0_10px_rgba(6,182,212,0.2)]">{service.icon}</div>
              <h3 className="text-lg font-mono font-bold text-white mb-2">{service.title}</h3>
              <p className="text-cyan-700 text-xs font-mono">{service.desc}</p>
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const SecuritySection = () => (
    <section className="py-20 bg-slate-950 px-4 relative overflow-hidden border-t border-green-900/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-900/10 via-slate-950 to-slate-950"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="text-left border-l-4 border-green-500 pl-4">
             <div className="flex items-center gap-2 text-green-500 mb-1 font-mono text-xs tracking-widest animate-pulse"><Shield size={14} /><span>PROTOCOLOS DE DEFENSA ACTIVOS</span></div>
            <h2 className="text-3xl font-mono font-bold text-white">SOLUCIONES_DE_SEGURIDAD</h2>
          </div>
          <button onClick={() => setActiveSection('tienda')} className="px-6 py-2 border border-green-600 text-green-500 hover:bg-green-500 hover:text-slate-950 font-mono text-xs transition-colors">VER_CATÁLOGO {'>'}</button>
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

  const ContactSection = () => (
    <section className="py-20 bg-slate-950 px-4 border-t border-slate-900 relative">
      <div className="max-w-3xl mx-auto">
        <div className="bg-slate-900 border border-cyan-900/50 p-1 relative">
          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-500"></div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-500"></div>
          <div className="bg-slate-950 p-8 border border-cyan-900/30">
             <h2 className="text-2xl font-mono font-bold text-white mb-6 text-center text-glitch">ESTABLECER_CONEXIÓN</h2>
             <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Paquete de datos enviado."); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="ID_USUARIO" className="bg-slate-900 border-b border-cyan-900 text-cyan-400 w-full px-4 py-3 outline-none focus:border-cyan-500 font-mono text-sm placeholder-cyan-900" />
                <input type="text" placeholder="FRECUENCIA_COMMS (Teléfono)" className="bg-slate-900 border-b border-cyan-900 text-cyan-400 w-full px-4 py-3 outline-none focus:border-cyan-500 font-mono text-sm placeholder-cyan-900" />
              </div>
              <textarea placeholder="INGRESAR_DATOS..." rows="4" className="bg-slate-900 border-b border-cyan-900 text-cyan-400 w-full px-4 py-3 outline-none focus:border-cyan-500 font-mono text-sm placeholder-cyan-900 resize-none"></textarea>
              <button className="w-full bg-cyan-900/20 border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 font-mono font-bold py-3 transition-all tracking-widest">TRANSMITIR</button>
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
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><span className="text-cyan-500">{'>'}</span> CARRITO_ACTUAL</h2>
            <button onClick={() => setIsCartOpen(false)} className="text-cyan-500 hover:text-white"><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-cyan-900"><Terminal size={48} className="mb-4 opacity-50" /><p>SIN DATOS</p></div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-4 bg-slate-950 p-3 border border-cyan-900/30">
                  <div className="w-16 h-16 bg-slate-900 border border-cyan-900 shrink-0"><img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80" /></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-cyan-300 font-bold text-xs truncate">{item.name}</h4>
                    <p className="text-white font-bold text-sm">{formatPrice(item.price)}</p>
                    <div className="flex items-center justify-between mt-2"><span className="text-cyan-700 text-xs">CANT: {item.quantity}</span><button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-400"><Trash2 size={14} /></button></div>
                  </div>
                </div>
              ))
            )}
          </div>
          {cart.length > 0 && (
            <div className="pt-6 border-t border-cyan-900/50 mt-auto">
              <div className="flex justify-between items-end mb-4"><span className="text-cyan-700 text-xs">TOTAL</span><span className="text-2xl font-bold text-cyan-400">{formatPrice(getTotal())}</span></div>
              <button onClick={handleCheckout} className="w-full bg-green-600 hover:bg-green-500 text-slate-950 font-bold py-4 flex items-center justify-center gap-2 transition-all">EJECUTAR_ORDEN <MessageCircle size={20} /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      <Navbar />
      <main>
        {activeSection === 'home' && (
          <>
            <Hero />
            <ServicesSection />
            <SecuritySection />
            <StoreSection />
            <ContactSection />
          </>
        )}
        {activeSection === 'servicios' && <ServicesSection />}
        {activeSection === 'seguridad' && <SecuritySection />}
        {activeSection === 'tienda' && <StoreSection />}
        {activeSection === 'contacto' && <ContactSection />}
      </main>
      <footer className="bg-slate-950 py-8 text-center border-t border-cyan-900/30 relative">
        <MatrixRain />
        <div className="relative z-10 font-mono text-xs text-cyan-800"><p>ID SISTEMA: TECHFIX_2025 // ESTADO: ONLINE</p></div>
      </footer>
      <CartModal />
      <div className="fixed bottom-6 right-6 z-40">
        {isChatOpen && (
          <div className="absolute bottom-16 right-0 w-80 bg-slate-900 border border-cyan-500/50 flex flex-col h-96 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            <div className="bg-slate-950 p-3 border-b border-cyan-900 flex justify-between items-center"><span className="text-cyan-400 font-mono text-xs font-bold blinking-cursor">ASISTENTE_IA_V1</span><button onClick={() => setIsChatOpen(false)}><X size={14} className="text-cyan-700" /></button></div>
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/90 font-mono">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-3 py-2 text-xs border ${msg.role === 'user' ? 'border-cyan-500 text-cyan-300 bg-cyan-900/20' : 'border-green-500 text-green-400 bg-green-900/10'}`}>
                    <span className="block text-[8px] opacity-50 mb-1">{msg.role === 'user' ? 'USER >>' : 'SYS >>'}</span>{msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (<div className="flex justify-start"><div className="px-3 py-2 text-xs border border-green-500 text-green-400 bg-green-900/10 rounded-tr-lg rounded-br-lg rounded-bl-lg"><span className="animate-pulse">PROCESANDO DATOS...</span></div></div>)}
              <div ref={chatEndRef} />
            </div>
            <div className="p-3 bg-slate-950 border-t border-cyan-900 flex gap-2">
              <input type="text" value={inputMsg} onChange={(e) => setInputMsg(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="CMD..." className="flex-1 bg-slate-900 border border-cyan-900 text-cyan-400 text-xs px-3 outline-none focus:border-cyan-500 font-mono" />
              <button onClick={handleSendMessage} className="p-2 bg-cyan-900/30 border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition-colors"><Send size={14} /></button>
            </div>
          </div>
        )}
        <button onClick={() => setIsChatOpen(!isChatOpen)} className="w-14 h-14 bg-slate-900 border border-cyan-500 text-cyan-400 flex items-center justify-center hover:bg-cyan-500 hover:text-slate-950 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] relative group">
          {isChatOpen ? <X /> : <MessageCircle size={24} />}<div className="absolute inset-0 border border-cyan-400 rounded-full animate-ping opacity-20"></div>
        </button>
      </div>
    </div>
  );
}