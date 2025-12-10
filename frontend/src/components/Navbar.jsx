import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { LogIn, UserPlus, LogOut } from 'lucide-react'; // Ícones

export default function Navbar({ session }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Função de Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    setLoading(false);
  };

  // Função de Registro
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert('Erro ao registrar: ' + error.message);
    else alert('Verifique seu email para confirmar o cadastro!');
    setLoading(false);
  };

  // Função de Sair
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="bg-white shadow-md p-4 mb-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Lado Esquerdo: Logo e Título */}
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <span className="text-white font-bold text-xl">CF</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Controle Financeiro</h1>
            <p className="text-xs text-gray-500">Gerencie suas despesas e orçamento</p>
          </div>
        </div>

        {/* Lado Direito: Login ou Info do Usuário */}
        <div>
          {session ? (
            // Se estiver logado: Mostra email e botão sair
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Olá, <b>{session.user.email}</b></span>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium"
              >
                <LogOut size={18} /> Sair
              </button>
            </div>
          ) : (
            // Se NÃO estiver logado: Mostra formulário na barra
            <form className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Email"
                className="border rounded px-2 py-1 text-sm focus:outline-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Senha"
                className="border rounded px-2 py-1 text-sm focus:outline-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                onClick={handleLogin} 
                disabled={loading}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center gap-1"
              >
                <LogIn size={16} /> Entrar
              </button>
              <button 
                onClick={handleRegister}
                disabled={loading}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center gap-1"
              >
                <UserPlus size={16} /> Criar Conta
              </button>
            </form>
          )}
        </div>
      </div>
    </nav>
  );
}