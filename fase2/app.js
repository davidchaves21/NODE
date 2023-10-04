const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path'); // Importe o módulo path

const app = express();

// Conectar ao banco de dados MongoDB local
mongoose.connect('mongodb://localhost:27017/formulario_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Definir o modelo de dados para a coleção "formularios"
const Formulario = mongoose.model('formularios', {
  pergunta1: String,
  pergunta2: String,
  pergunta3: String,
  pergunta4: String,
  pergunta5: String
});

// Configurar middleware para processar dados JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar a view engine para EJS
app.set('view engine', 'ejs');

// Configurar o middleware para servir arquivos estáticos
app.use(express.static('public'));

// Rota para a página inicial
app.get('/', (req, res) => {
  res.render('index');
});

// Rota para exibir o formulário
app.get('/formulario', (req, res) => {
  res.render('formulario');
});

// Rota para processar o envio do formulário
app.post('/formulario', async (req, res) => {
  try {
    const {
      pergunta1,
      pergunta2,
      pergunta3,
      pergunta4,
      pergunta5
    } = req.body;

    // Validar respostas (máximo de 255 caracteres)
    if (
      pergunta1.length > 255 ||
      pergunta2.length > 255 ||
      pergunta3.length > 255 ||
      pergunta4.length > 255 ||
      pergunta5.length > 255
    ) {
      return res
        .status(400)
        .send('As respostas não podem ter mais de 255 caracteres.');
    }

    // Salvar os dados no MongoDB
    await Formulario.create({
      pergunta1,
      pergunta2,
      pergunta3,
      pergunta4,
      pergunta5
    });

    // Redirecionar o usuário para a página de sucesso após o envio bem-sucedido
    res.redirect('/sucesso');
  } catch (error) {
    console.error(error);
    res.status(500).send('Ocorreu um erro ao salvar os dados.');
  }
});

// Rota para a página de sucesso
app.get('/sucesso', (req, res) => {
  res.render('sucesso'); // Renderize a página sucesso.ejs
});

// Iniciar o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
