import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Coffee, 
  Info, 
  Clock, 
  MapPin, 
  Phone, 
  Instagram, 
  Facebook, 
  Globe,
  Star,
  ChevronDown,
  Navigation,
  Utensils,
  Sparkles,
  MessageCircle,
  Menu as MenuIcon,
  X
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { chat, type Message } from './services/gemini';
import { cn } from './lib/utils';

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: "Hey there! Welcome to Another Sip Cafe. I'm SipBot, your virtual barista. Are you stopping by for a quick coffee, a sit-down breakfast, or maybe just catching up with a friend? I'd love to help you plan your visit!"
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chat(messages, userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: "I'm sorry, I'm having a little trouble connecting right now. Could you try saying that again? Alternatively, you can give us a call at (901) 724-6296!" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-coffee-50 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-coffee-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-coffee-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-coffee-200">
              <Coffee className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-coffee-950 leading-tight">SipBot</h1>
              <p className="text-xs text-coffee-500 font-medium tracking-wide uppercase">Another Sip Cafe</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className={cn(
                "p-2 rounded-full transition-colors",
                showInfo ? "bg-coffee-100 text-coffee-700" : "hover:bg-coffee-100 text-coffee-500"
              )}
            >
              <Info className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className={cn(
                "p-2 rounded-full transition-colors",
                showMenu ? "bg-coffee-100 text-coffee-700" : "hover:bg-coffee-100 text-coffee-500"
              )}
            >
              {showMenu ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col gap-4">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-0 bg-white rounded-3xl shadow-xl shadow-coffee-100/50 border border-coffee-100 overflow-hidden">
          {/* Chat Window */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "flex w-full",
                  msg.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "max-w-[85%] rounded-2xl p-4 shadow-sm",
                  msg.role === 'user' 
                    ? "bg-coffee-600 text-white rounded-tr-none" 
                    : "bg-coffee-100 text-coffee-900 rounded-tl-none border border-coffee-200"
                )}>
                  <div className="markdown-body text-sm md:text-base leading-relaxed space-y-2">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-coffee-100 rounded-2xl rounded-tl-none p-4 border border-coffee-200 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-coffee-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-coffee-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-coffee-400 rounded-full animate-bounce"></div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-coffee-50/50 border-t border-coffee-100">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me about our coffee, menu, or location..."
                className="flex-1 bg-white border border-coffee-200 rounded-full px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-500 transition-all shadow-sm"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-coffee-600 text-white p-3 rounded-full hover:bg-coffee-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-coffee-200"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <p className="text-[10px] text-center mt-3 text-coffee-400 font-medium italic">
              "Your neighborhood escape in downtown Memphis."
            </p>
          </div>
        </div>

        {/* Quick Info & Menu Overlay (Mobile/Desktop toggles) */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 shadow-xl border border-coffee-100 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                <h3 className="font-display font-bold text-lg flex items-center gap-2 text-coffee-900">
                  <Clock className="w-5 h-5 text-coffee-500" /> Opening Hours
                </h3>
                <div className="space-y-2 text-sm text-coffee-700">
                  <div className="flex justify-between">
                    <span>Mon – Sat</span>
                    <span className="font-semibold">6:00 AM – 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-semibold">6:00 AM – 2:00 PM</span>
                  </div>
                </div>
                
                <h3 className="font-display font-bold text-lg flex items-center gap-2 text-coffee-900 pt-2">
                  <MapPin className="w-5 h-5 text-coffee-500" /> Location
                </h3>
                <p className="text-sm text-coffee-700 leading-relaxed">
                  164 Union Ave, Memphis, TN 38103<br />
                  <span className="text-coffee-500 text-xs italic">Inside Canopy by Hilton, Downtown Memphis</span>
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-display font-bold text-lg flex items-center gap-2 text-coffee-900">
                  <Navigation className="w-5 h-5 text-coffee-500" /> Getting Here
                </h3>
                <p className="text-sm text-coffee-700">
                  Walking distance from Beale Street and Tom Lee Park. Park at the hotel or find street parking nearby.
                </p>

                <h3 className="font-display font-bold text-lg flex items-center gap-2 text-coffee-900 pt-2">
                  <Sparkles className="w-5 h-5 text-coffee-500" /> Stay Connected
                </h3>
                <div className="flex gap-4">
                  <a href="https://instagram.com/anothersipcafe" target="_blank" rel="noreferrer" className="bg-coffee-100 p-2 rounded-lg text-coffee-600 hover:bg-coffee-600 hover:text-white transition-all">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="https://facebook.com/anothersipcafe" target="_blank" rel="noreferrer" className="bg-coffee-100 p-2 rounded-lg text-coffee-600 hover:bg-coffee-600 hover:text-white transition-all">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="https://anothersipcafe.com" target="_blank" rel="noreferrer" className="bg-coffee-100 p-2 rounded-lg text-coffee-600 hover:bg-coffee-600 hover:text-white transition-all">
                    <Globe className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-6 shadow-xl border border-coffee-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-2xl text-coffee-900 flex items-center gap-3">
                  <Utensils className="w-6 h-6 text-coffee-500" /> Menu Highlights
                </h2>
                <div className="bg-coffee-100 px-3 py-1 rounded-full text-xs font-bold text-coffee-600 uppercase tracking-tighter">
                  Price Range: $1 – $10
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-coffee-500 font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Coffee className="w-4 h-4" /> Espresso & Coffee
                  </h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex justify-between border-b border-coffee-50 pb-2">
                      <span className="font-medium">Honey Latte</span>
                      <span className="text-coffee-400">Favorite</span>
                    </li>
                    <li className="flex justify-between border-b border-coffee-50 pb-2">
                      <span className="font-medium">Specialty Lattes</span>
                      <span className="text-coffee-400 italic">Iced Mocha...</span>
                    </li>
                    <li className="flex justify-between border-b border-coffee-50 pb-2">
                      <span className="font-medium font-bold text-coffee-800">Around-the-World Brew</span>
                      <span className="text-coffee-600">NEW</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-coffee-500 font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Utensils className="w-4 h-4" /> Fresh Eats
                  </h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex justify-between border-b border-coffee-50 pb-2">
                      <span className="font-medium">Blueberry Scones</span>
                      <span className="text-coffee-400">Fresh</span>
                    </li>
                    <li className="flex justify-between border-b border-coffee-50 pb-2">
                      <span className="font-medium">Bacon & Cheese Croissant</span>
                      <span className="text-coffee-400">Savory</span>
                    </li>
                    <li className="flex justify-between border-b border-coffee-50 pb-2">
                      <span className="font-medium">Overnight Oats</span>
                      <span className="text-coffee-400">Healthy</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-4 bg-coffee-50 rounded-2xl flex items-start gap-4">
                <Star className="w-6 h-6 text-coffee-400 shrink-0 mt-1" />
                <p className="text-sm italic text-coffee-600">
                  "The hot tea is the best I've had in Memphis — would recommend." — Lisa W.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer / CTA Section */}
      <footer className="mt-auto px-4 py-8 bg-coffee-950 text-white">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Coffee className="w-5 h-5 text-coffee-400" />
                <h4 className="font-display font-bold text-lg">Another Sip</h4>
              </div>
              <p className="text-sm text-coffee-300 leading-relaxed">
                A cozy downtown hideaway serving specialty coffee and fresh food right in the heart of Memphis.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-display font-bold text-lg">Contact Us</h4>
              <ul className="text-sm text-coffee-300 space-y-2">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" /> (901) 724-6296
                </li>
                <li className="flex items-center gap-2">
                  <Globe className="w-4 h-4" /> anothersipcafe.com
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-display font-bold text-lg">Visit Us</h4>
              <p className="text-sm text-coffee-300">
                164 Union Ave<br />
                Memphis, TN 38103
              </p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-coffee-400 transition-colors uppercase text-[10px] font-bold tracking-widest">Instagram</a>
                <a href="#" className="hover:text-coffee-400 transition-colors uppercase text-[10px] font-bold tracking-widest">Facebook</a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-medium text-coffee-500 tracking-widest uppercase">
            <p>© {new Date().getFullYear()} Another Sip Cafe. All Rights Reserved.</p>
            <div className="flex gap-8">
              <span>Downtown Memphis</span>
              <span>Locally Roasted</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
