import express from 'express';
import session from 'express-session';
import passport from 'passport';
import './auth/googleStrategy';
import router from './routes/graphRoutes';
import { logger } from './logger/logs';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { metricsRouter } from './monitoring/metrics';
import { ingestRoutes } from './routes/ingestRoutes';
import dotenv from 'dotenv';
import {getGremlinClient} from './db/gremlinClient';
import { startKafkaConsumer, kafkaConsumer } from './kafka/kafkaConsumer';

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
startKafkaConsumer().catch(err => {
  console.error('❌ Failed to start Kafka consumer:', err);
});
app.listen(port, () => logger.info(`Server started on port ${port}`));

async function shutdown() {
    console.log('Gracefully shutting down...');
    try {
      await getGremlinClient().close();
      console.log('Gremlin client closed.');

      await kafkaConsumer.disconnect();
      console.log('Kafka consumer disconnected.');
    } catch (err) {
      console.error('Error during shutdown:', err);
    } finally {
      process.exit();
    }
  }
  
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  

export default app;