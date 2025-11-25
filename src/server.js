import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swaggerDocument = YAML.load(join(__dirname, '../docs/openapi.yaml'));
import authRoutes from './routes/authRoutes.js';
import listRoutes from './routes/listRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import userRoutes from './routes/userRoutes.js';
import listShareRoutes from './routes/listShareRoutes.js';


const app = express();
// const swaggerDocument = YAML.load('./docs/openapi.yaml');
const specs = YAML.load('./public/bundled.yaml');

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/lists', listRoutes);
app.use('/categories', categoryRoutes);
app.use('/items', itemRoutes);
app.use('/users', userRoutes);
app.use('/shares', listShareRoutes);

// 404
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

//Error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


