import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Navbar from './components/Navbar';
import FormularioTransacao from './components/FormularioTransacao';
import DashboardGraficos from './components/DashboardGraficos';
import { TrendingUp, TrendingDown, DollarSign, Wallet, Trash2 } from 'lucide-react';

function App() {
  const [session, setSession] = useState(null);
  const [transacoes, setTransacoes] = useState([]);
  const [resumo, setResumo] = useState({ receitas: 0, despesas: 0, saldo: 0 });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) buscarTransacoes();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) buscarTransacoes();
      else setTransacoes([]);
    });

    return () => subscription.unsubscribe();
  }, []);

  const buscarTransacoes = async () => {
    const { data } = await supabase.from('transacoes').select('*').order('data', { ascending: false });
    if (data) {
      setTransacoes(data);
      calcularTotais(data);
    }
  };

  const deletarTransacao = async (id) => {
    const confirmacao = window.confirm("Apagar esta transação?");
    if (!confirmacao) return;

    const { error } = await supabase.from('transacoes').delete().eq('id', id);
    if (error) alert(error.message);
    else buscarTransacoes();
  };

  const calcularTotais = (dados) => {
    let totalReceita = 0;
    let totalDespesa = 0;
    dados.forEach(item => {
      const valor = parseFloat(item.valor);
      if (item.tipo === 'receita') totalReceita += valor;
      else totalDespesa += valor;
    });
    setResumo({ receitas: totalReceita, despesas: totalDespesa, saldo: totalReceita - totalDespesa });
  };

  const formatarMoeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <Navbar session={session} />

      <div className="max-w-7xl mx-auto px-4">
        {!session ? (
          <div className="text-center mt-20 px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-700">Controle Financeiro</h2>
            <p className="text-gray-500 mt-2">Faça login para começar.</p>
          </div>
        ) : (
          <>
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">Resumo</h2>
            
            {/* CARDS RESPONSIVOS (Grid cols 1 no mobile, 3 no PC) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
               <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500 flex justify-between items-center">
                  <div><p className="text-gray-500 text-xs md:text-sm">Receitas</p><p className="text-xl md:text-2xl font-bold text-green-600">{formatarMoeda(resumo.receitas)}</p></div>
                  <TrendingUp className="text-green-200" size={28} />
               </div>
               <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500 flex justify-between items-center">
                  <div><p className="text-gray-500 text-xs md:text-sm">Despesas</p><p className="text-xl md:text-2xl font-bold text-red-600">{formatarMoeda(resumo.despesas)}</p></div>
                  <TrendingDown className="text-red-200" size={28} />
               </div>
               <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500 flex justify-between items-center">
                  <div><p className="text-gray-500 text-xs md:text-sm">Saldo</p><p className={`text-xl md:text-2xl font-bold ${resumo.saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{formatarMoeda(resumo.saldo)}</p></div>
                  <DollarSign className="text-blue-200" size={28} />
               </div>
            </div>

            <FormularioTransacao aoSalvar={buscarTransacoes} />

            <DashboardGraficos transacoes={transacoes} />

            {/* LISTA DE TRANSAÇÕES com Scroll Horizontal */}
            <div className="bg-white rounded-lg shadow mt-8 overflow-hidden">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-bold text-gray-700 flex items-center gap-2"><Wallet size={20} /> Histórico</h3>
              </div>
              
              <div className="overflow-x-auto"> {/* <--- Mágica aqui */}
                {transacoes.length === 0 ? <p className="p-6 text-gray-500 text-center">Sem dados.</p> : (
                  <table className="w-full text-sm text-left min-w-[500px]">
                    <thead className="text-gray-600 font-medium border-b bg-gray-50">
                      <tr>
                          <th className="px-4 py-3">Descrição</th>
                          <th className="px-4 py-3">Categ.</th>
                          <th className="px-4 py-3 text-right">Valor</th>
                          <th className="px-4 py-3 text-center">Excluir</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {transacoes.map(t => (
                        <tr key={t.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-800">{t.descricao}</td>
                          <td className="px-4 py-3"><span className="bg-gray-100 px-2 py-1 rounded text-xs whitespace-nowrap">{t.categoria}</span></td>
                          <td className={`px-4 py-3 text-right font-bold whitespace-nowrap ${t.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                            {t.tipo === 'receita' ? '+' : '-'} {formatarMoeda(t.valor)}
                          </td>
                          <td className="px-4 py-3 text-center">
                              <button onClick={() => deletarTransacao(t.id)} className="text-gray-300 hover:text-red-600 p-2">
                                  <Trash2 size={16} />
                              </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;