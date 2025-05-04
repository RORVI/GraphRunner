import express from 'express';
import session from 'express-session';
import passport from 'passport';
import './auth/googleStrategy';
import router from './routes/graphRoutes';
import { logger } from './logger';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { metricsRouter } from './monitoring/metrics';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.APP_PORT || 3030;

app.use(express.json());
app.use(metricsRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(session({ secret: process.env.SESSION_SECRET || 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api', router);
app.listen(port, () => logger.info(`Server started on port ${port}`));

export default app;