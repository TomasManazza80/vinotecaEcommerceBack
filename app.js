// BACK/app.js (versión ES Modules - Exporta 'app')

import dotenv from 'dotenv';
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

// Rutas
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import productRouter from './routes/product.js';
import reparacionesRouter from './routes/reparacionesRoutes.js';
import paymentRouter from './routes/paymentRoutes.js';
import productBought from './routes/productBoughtRoute.js';
import recaudationRouter from './routes/recaudationRoutes.js';
import pagoCaja from './routes/pagoCajaRoutes.js';
import recaudacionFinalRouter from './routes/recaudacionFinalRoutes.js';
import costosEnvioRouter from './routes/costosEnvioRoutes.js';
import costoTargetasRouter from './routes/costoTargetasRoutes.js';
import globalSettingsRouter from './routes/costosGlobalesRoutes.js';



// Vexor: CORRECCIÓN FINAL DE IMPORTACIÓN
// Esto resuelve: TypeError: Vexor is not a constructor
import vexorModule from 'vexor'; 

// La clase Vexor se extrae con una lógica de respaldo: 
// 1. Intentamos acceder a .Vexor (como en el ejemplo CommonJS) 
// 2. Si no es .Vexor, asumimos que la clase es la exportación por defecto (vexorModule).
const Vexor = vexorModule.Vexor || vexorModule.default || vexorModule;

dotenv.config();

// Para ES Modules (equivalente a __dirname)
// Nota: path.dirname(new URL(import.meta.url).pathname) requiere el protocolo 'file://'
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();

// Instancia Vexor
const vexorInstance = new Vexor({
  publishableKey: process.env.VEXOR_PUBLISHABLE_KEY,
  projectId: process.env.VEXOR_PROJECT_ID,
  apiKey: process.env.VEXOR_API_KEY,
});

// Settings
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Rutas
app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', productRouter);
app.use('/payment', paymentRouter);
app.use('/boughtProduct', productBought);
app.use('/recaudation', recaudationRouter);
app.use('/reparaciones', reparacionesRouter);
app.use('/pagoCaja', pagoCaja);
app.use('/recaudacionFinal', recaudacionFinalRouter);
app.use('/costosEnvio', costosEnvioRouter);
app.use('/costoTargetas', costoTargetasRouter);
app.use('/globalSettings', globalSettingsRouter);

// Catch 404
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

// Exporta la aplicación para que el script 'www.js' pueda importarla y arrancar el servidor.
export default app;