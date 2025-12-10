// backend/index.js
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();

// Configuração para aceitar JSON e permitir acesso do Frontend
app.use(express.json());
app.use(cors());

// Conexão com Supabase (Configuraremos as chaves depois)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Rota de Teste (Para vermos se está online)
app.get('/', (req, res) => {
    res.json({ message: 'API do Gerenciador Financeiro rodando!' });
});

// Rota para buscar transações (Exemplo inicial)
app.get('/api/transacoes', async (req, res) => {
    // Busca dados da tabela 'transacoes' no Supabase
    const { data, error } = await supabase
        .from('transacoes')
        .select('*');

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Porta padrão ou 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

// Exportar o app é CRUCIAL para a Vercel funcionar
module.exports = app;