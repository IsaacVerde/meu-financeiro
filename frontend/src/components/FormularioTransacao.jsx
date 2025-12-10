import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { PlusCircle } from 'lucide-react';

export default function FormularioTransacao({ aoSalvar }) {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState('despesa'); // Começa como despesa
  const [categoria, setCategoria] = useState('');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('pago');

  // --- LISTAS DE CATEGORIAS INTELIGENTES ---
  const categoriasReceita = [
    'Salário',
    'Freelance / Extra',
    'Investimentos',
    'Vendas',
    'Presente',
    'Outras Receitas'
  ];

  const categoriasDespesa = [
    'Moradia',      // Aluguel, Condomínio
    'Alimentação',  // Mercado, Ifood
    'Transporte',   // Uber, Gasolina, Ônibus
    'Lazer',        // Cinema, Viagem
    'Saúde',        // Farmácia, Plano
    'Educação',     // Faculdade, Cursos
    'Contas',       // Luz, Água, Internet
    'Outras Despesas'
  ];

  // Quando mudar o TIPO (Receita <-> Despesa), limpamos a categoria selecionada
  // para evitar bugs (ex: salvar "Salário" como "Despesa")
  useEffect(() => {
    setCategoria(''); 
  }, [tipo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!descricao || !valor || !categoria) return alert("Preencha todos os campos!");

    const { error } = await supabase.from('transacoes').insert({
      descricao,
      valor: parseFloat(valor),
      tipo,
      categoria,
      data,
      status
    });

    if (error) {
      alert('Erro ao salvar: ' + error.message);
    } else {
      setDescricao('');
      setValor('');
      setCategoria(''); // Limpa a categoria também
      if (aoSalvar) aoSalvar();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
        <PlusCircle size={20} className="text-blue-600"/> Nova Transação
      </h3>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Descrição */}
        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700">Nome da Transação</label>
          <input 
            type="text" 
            placeholder={tipo === 'receita' ? "Ex: Salário Mensal" : "Ex: Conta de Luz"}
            className="w-full border rounded p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
            value={descricao} onChange={e => setDescricao(e.target.value)}
          />
        </div>

        {/* Valor */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Valor (R$)</label>
          <input 
            type="number" 
            step="0.01" 
            placeholder="0.00" 
            className="w-full border rounded p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
            value={valor} onChange={e => setValor(e.target.value)}
          />
        </div>

        {/* Tipo (Muda as opções de baixo) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo</label>
          <select 
            className="w-full border rounded p-2 mt-1 bg-white cursor-pointer"
            value={tipo} onChange={e => setTipo(e.target.value)}
          >
            <option value="despesa">Despesa (Saída)</option>
            <option value="receita">Receita (Entrada)</option>
          </select>
        </div>

        {/* Categoria (Dinâmica) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Categoria</label>
          <select 
            className="w-full border rounded p-2 mt-1 bg-white cursor-pointer"
            value={categoria} onChange={e => setCategoria(e.target.value)}
          >
            <option value="">Selecione...</option>
            
            {/* Lógica: Se for Receita mostra lista A, se for Despesa mostra lista B */}
            {tipo === 'receita' 
              ? categoriasReceita.map(cat => <option key={cat} value={cat}>{cat}</option>)
              : categoriasDespesa.map(cat => <option key={cat} value={cat}>{cat}</option>)
            }

          </select>
        </div>

        {/* Data */}
        <div>
            <label className="block text-sm font-medium text-gray-700">Data</label>
            <input 
                type="date" 
                className="w-full border rounded p-2 mt-1"
                value={data} onChange={e => setData(e.target.value)}
            />
        </div>

        {/* Status */}
        <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select 
                className="w-full border rounded p-2 mt-1 bg-white"
                value={status} onChange={e => setStatus(e.target.value)}
            >
                <option value="pago">{tipo === 'receita' ? 'Recebido' : 'Pago'}</option>
                <option value="pendente">Pendente</option>
            </select>
        </div>

        {/* Botão Salvar */}
        <div className="col-span-2 mt-2">
            <button 
                type="submit" 
                className={`w-full font-bold py-2 px-4 rounded transition text-white ${
                  tipo === 'receita' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
            >
                {tipo === 'receita' ? '+ Adicionar Entrada' : '- Adicionar Saída'}
            </button>
        </div>

      </form>
    </div>
  );
}