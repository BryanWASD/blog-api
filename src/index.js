import express from 'express';
const app = express();
import routes from './routes/index.js';
import { connectDB } from './config/db.js'
import { PORT } from '../src/config/config.js';
import cors from 'cors';
connectDB();

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(express.json());

app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal');
});
