import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { LogIn, UserPlus, LogOut } from 'lucide-react';

export default function Navbar({ session }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert('Erro: ' + error.message);
    else alert('Verifique seu email!');
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="bg-white shadow-md p-4 mb-6">
      {/* MUDANÇA AQUI: flex-col no mobile, md:flex-row no computador */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Lado Esquerdo: Logo */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-start">
          <div className="bg-blue-600 p-2 rounded-lg">
            <span className="text-white font-bold text-xl">CF</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Controle Financeiro</h1>
            <p className="text-xs text-gray-500">Gerencie suas despesas</p>
          </div>
        </div>

        {/* Lado Direito: Login */}
        <div className="w-full md:w-auto">
          {session ? (
            <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
              <span className="text-gray-700 text-sm text-center">Olá, <b>{session.user.email}</b></span>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium border border-red-100 px-3 py-1 rounded-full bg-red-50"
              >
                <LogOut size={18} /> Sair
              </button>
            </div>
          ) : (
            <form className="flex flex-col md:flex-row items-center gap-2 w-full">
              <input
                type="email"
                placeholder="Email"
                className="border rounded px-3 py-2 text-sm w-full md:w-auto focus:outline-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Senha"
                className="border rounded px-3 py-2 text-sm w-full md:w-auto focus:outline-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex gap-2 w-full md:w-auto">
                <button 
                    onClick={handleLogin} 
                    disabled={loading}
                    className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 flex-1 flex justify-center items-center gap-1"
                >
                    <LogIn size={16} /> Entrar
                </button>
                <button 
                    onClick={handleRegister}
                    disabled={loading}
                    className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 flex-1 flex justify-center items-center gap-1"
                >
                    <UserPlus size={16} /> Criar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </nav>
  );
}