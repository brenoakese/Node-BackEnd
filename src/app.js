import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/evenRoutes.js'; 
import familiaRoutes from './routes/familiaRoutes.js';
import materiaRoutes from './routes/materiaRoutes.js';
import tarefaRoutes from './routes/tarefaRoutes.js';

const app = express();

// Configuração de CORS mais específica
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:8081',
    'http://localhost:19006',
    'exp://localhost:19000',
    'exp://localhost:19006',
    // Adicione outras origens conforme necessário
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Middleware para parsing de JSON
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', req.body);
  }
  next();
});

// Rotas
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', eventRoutes); 
app.use('/api', familiaRoutes);
app.use('/api', materiaRoutes);
app.use('/api', tarefaRoutes);


// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Rota para testar conexão com banco
app.get('/api/test-db', async (req, res) => {
  try {
    const db = await import('./config/db.js');
    await db.default.query('SELECT NOW()');
    res.json({
      status: 'OK',
      message: 'Database connected successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Middleware de tratamento de erro 404
app.use('*', (req, res) => {
  console.log(`❌ Rota não encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.originalUrl,
    method: req.method,
    availableRoutes: {
      auth: [
        'POST /api/auth/register',
        'POST /api/auth/login'
      ],
      users: [
        'GET /api/users',
        'GET /api/users/me',
        'GET /api/users/:id',
        'DELETE /api/users/:id'
      ],
      familias: [
        'POST /api/familias',
        'POST /api/familias/join',
        'GET /api/familias/me'
      ],
      events: [
        'POST /api/events',
        'GET /api/events',
        'GET /api/events/:id',
        'PUT /api/events/:id',
        'PUT /api/events/:id/status',
        'DELETE /api/events/:id'
      ],
      materias: [
        'POST /api/materias',
        'GET /api/materias/me',
        'GET /api/materias/usuario/:usuarioId',
        'GET /api/materias/:id',
        'PUT /api/materias/:id',
        'DELETE /api/materias/:id',
        'POST /api/materias/dependente/:usuarioId'
      ],
      tarefas: [
        'POST /api/tarefas',
        'GET /api/tarefas',
        'GET /api/tarefas/:id',
        'PUT /api/tarefas/:id/status',
        'DELETE /api/tarefas/:id'
      ],
      health: [
        'GET /api/health',
        'GET /api/test-db'
      ]
    }
  });
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  console.error('Erro não tratado:', error);
  res.status(500).json({
    error: 'Erro interno do servidor',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
});

export default app;