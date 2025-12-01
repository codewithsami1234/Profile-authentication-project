import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import connect from './database/conn.js';
import router from './router/appRouter.js';

const app = express();

/** Middleware */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by');

/** Constants */
const port = process.env.PORT || 8080;

/** File path setup */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** API routes (prefix /api) */
app.use('/api', router);

/** Serve React build files (production) */
app.use(express.static(path.join(__dirname, './client/build')));

/** Home route for API */
app.get('/api/home', (req, res) => {
  res.status(200).json("Home Get Request");
});

/** Catch-all route for React app (avoid overriding /api routes) */
app.get(/^(?!\/api).*$/, (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

/** Start server only after DB connection */
connect()
  .then(() => {
    try {
      app.listen(port, () => {
        console.log(`Server running at: http://localhost:${port}`);
      });
    } catch (error) {
      console.error('Cannot start server:', error.message);
    }
  })
  .catch(error => {
    console.error('Database connection failed:', error.message);
  });
