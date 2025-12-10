import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

export default function DashboardGraficos({ transacoes }) {
  
  const categoriasUnicas = [...new Set(transacoes.map(t => t.categoria))];

  const dadosGrafico = categoriasUnicas.map(cat => {
    const totalReceita = transacoes
      .filter(t => t.categoria === cat && t.tipo === 'receita')
      .reduce((acc, curr) => acc + parseFloat(curr.valor), 0);

    const totalDespesa = transacoes
      .filter(t => t.categoria === cat && t.tipo === 'despesa')
      .reduce((acc, curr) => acc + parseFloat(curr.valor), 0);

    return { name: cat, Receita: totalReceita, Despesa: totalDespesa };
  });

  const dadosFinais = dadosGrafico.filter(item => item.Receita > 0 || item.Despesa > 0);
  const formatarMoeda = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      
      {/* GRÁFICO - Ajuste de altura responsiva (h-64 mobile, h-96 desktop) */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow h-64 md:h-96">
        <h3 className="text-lg font-bold text-gray-700 mb-4">📊 Entradas vs Saídas</h3>
        
        {dadosFinais.length > 0 ? (
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={dadosFinais}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{fontSize: 10}} interval={0} />
              <YAxis tick={{fontSize: 10}} width={30} /> {/* Menos espaço no eixo Y */}
              <Tooltip formatter={(value) => formatarMoeda(value)} />
              <Legend wrapperStyle={{fontSize: '12px'}} />
              <Bar dataKey="Receita" fill="#22c55e" name="Receitas" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Despesa" fill="#ef4444" name="Despesas" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            Adicione transações para ver o gráfico.
          </div>
        )}
      </div>

      {/* TABELA - Ajuste de overflow para scroll lateral */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow overflow-hidden">
        <h3 className="text-lg font-bold text-gray-700 mb-4">📝 Resumo por Categoria</h3>
        <div className="overflow-x-auto"> {/* Scroll lateral se precisar */}
          <table className="w-full text-sm text-left min-w-[300px]">
            <thead className="text-gray-500 border-b bg-white">
              <tr>
                <th className="py-2 pr-2">Categoria</th>
                <th className="py-2 text-right">Entrou</th>
                <th className="py-2 text-right">Saiu</th>
                <th className="py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {dadosFinais.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 font-medium text-xs md:text-sm">{item.name}</td>
                  <td className="py-3 text-right text-green-600 font-medium text-xs md:text-sm">
                    {item.Receita > 0 ? formatarMoeda(item.Receita) : '-'}
                  </td>
                  <td className="py-3 text-right text-red-600 font-medium text-xs md:text-sm">
                    {item.Despesa > 0 ? formatarMoeda(item.Despesa) : '-'}
                  </td>
                  <td className="py-3 flex justify-center">
                    {item.Receita > item.Despesa ? (
                        <ArrowUpCircle className="text-green-500" size={16} />
                    ) : (
                        <ArrowDownCircle className="text-red-500" size={16} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}