import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Navbar from './components/Navbar';
import FormularioTransacao from './components/FormularioTransacao';
import DashboardGraficos from './components/DashboardGraficos';
import { TrendingUp, TrendingDown, DollarSign, Wallet, Trash2 } from 'lucide-react'; // <--- Adicionei Trash2 aqui

function App() {
  const [session, setSession] = useState(null);
  const [transacoes, setTransacoes] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]); 
  
  const [resumo, setResumo] = useState({ receitas: 0, despesas: 0, saldo: 0 });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) carregarDados();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) carregarDados();
      else { setTransacoes([]); setOrcamentos([]); }
    });

    return () => subscription.unsubscribe();
  }, []);

  const carregarDados = async () => {
    buscarTransacoes();
    buscarOrcamentos();
  };

  const buscarTransacoes = async () => {
    const { data } = await supabase.from('transacoes').select('*').order('data', { ascending: false });
    if (data) {
      setTransacoes(data);
      calcularTotais(data);
    }
  };

  const buscarOrcamentos = async () => {
    const { data } = await supabase.from('orcamentos').select('*');
    if (data) setOrcamentos(data);
  };

  // --- NOVA FUNÇÃO DE DELETAR ---
  const deletarTransacao = async (id) => {
    // 1. Pergunta se o usuário tem certeza
    const confirmacao = window.confirm("Tem certeza que deseja apagar esta transação?");
    if (!confirmacao) return;

    // 2. Manda o comando para o Supabase
    const { error } = await supabase
      .from('transacoes')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Erro ao deletar: " + error.message);
    } else {
      // 3. Atualiza a tela
      carregarDados();
    }
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
          <div className="text-center mt-20">
            <h2 className="text-3xl font-bold text-gray-700">Bem-vindo ao Controle Financeiro</h2>
            <p className="text-gray-500 mt-2">Faça login acima para começar.</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Resumo do Mês</h2>
            
            {/* CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
               <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500 flex justify-between">
                  <div><p className="text-gray-500 text-sm">Total Receitas</p><p className="text-2xl font-bold text-green-600">{formatarMoeda(resumo.receitas)}</p></div>
                  <TrendingUp className="text-green-200" size={32} />
               </div>
               <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500 flex justify-between">
                  <div><p className="text-gray-500 text-sm">Total Despesas</p><p className="text-2xl font-bold text-red-600">{formatarMoeda(resumo.despesas)}</p></div>
                  <TrendingDown className="text-red-200" size={32} />
               </div>
               <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500 flex justify-between">
                  <div><p className="text-gray-500 text-sm">Saldo Atual</p><p className={`text-2xl font-bold ${resumo.saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{formatarMoeda(resumo.saldo)}</p></div>
                  <DollarSign className="text-blue-200" size={32} />
               </div>
            </div>

            {/* FORMULÁRIO */}
            <FormularioTransacao aoSalvar={carregarDados} />

            {/* GRÁFICOS */}
            <DashboardGraficos transacoes={transacoes} orcamentos={orcamentos} />

            {/* LISTA DE TRANSAÇÕES */}
            <div className="bg-white rounded-lg shadow overflow-hidden mt-8">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-bold text-gray-700 flex items-center gap-2"><Wallet size={20} /> Histórico de Transações</h3>
              </div>
              {transacoes.length === 0 ? <p className="p-6 text-gray-500 text-center">Sem dados.</p> : (
                <table className="w-full text-sm text-left">
                  <thead className="text-gray-600 font-medium border-b">
                    <tr>
                        <th className="px-4 py-3">Descrição</th>
                        <th className="px-4 py-3">Categ.</th>
                        <th className="px-4 py-3 text-right">Valor</th>
                        <th className="px-4 py-3 text-center">Ações</th> {/* Nova Coluna */}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {transacoes.map(t => (
                      <tr key={t.id} className="hover:bg-gray-50 group">
                        <td className="px-4 py-3">{t.descricao}</td>
                        <td className="px-4 py-3"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{t.categoria}</span></td>
                        <td className={`px-4 py-3 text-right font-bold ${t.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                          {t.tipo === 'receita' ? '+' : '-'} {formatarMoeda(t.valor)}
                        </td>
                        {/* Botão de Excluir */}
                        <td className="px-4 py-3 text-center">
                            <button 
                                onClick={() => deletarTransacao(t.id)}
                                className="text-gray-400 hover:text-red-600 transition p-1"
                                title="Excluir Transação"
                            >
                                <Trash2 size={18} />
                            </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;