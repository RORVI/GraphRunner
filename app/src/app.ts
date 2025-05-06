import express from 'express';
import session from 'express-session';
import passport from 'passport';
import './auth/googleStrategy';
import router from './routes/graphRoutes';
import { logger } from './logger';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { metricsRouter } from './monitoring/metrics';
import { ingestRoutes } from './routes/ingestRoutes';
import dotenv from 'dotenv';
import gremlinClient from './db/gremlinCLient';

dotenv.config();

const app = express();
const port = process.env.APP_PORT || 3030;

app.use(express.json());
app.use(metricsRouter);
app.use('/', ingestRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(session({ secret: process.env.SESSION_SECRET || 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api', router);
app.listen(port, () => logger.info(`Server started on port ${port}`));

async function shutdown() {
    console.log('Gracefully shutting down...');
    try {
      await gremlinClient.close();
      console.log('Gremlin client closed.');
    } catch (err) {
      console.error('Error during shutdown:', err);
    } finally {
      process.exit();
    }
  }
  
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  

export default app;