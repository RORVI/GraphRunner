import express from 'express';
import session from 'express-session';
import passport from 'passport';
import './auth/googleStrategy';
import router from './routes/graphRoutes';
import { logger } from './logger';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

const app = express();

app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(session({ secret: process.env.SESSION_SECRET || 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api', router);
app.listen(3000, () => logger.info('Server started on port 3000'));

export default app;