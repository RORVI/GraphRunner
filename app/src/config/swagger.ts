import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'JanusGraph API',
      version: '1.0.0',
      description: 'Express API to interact with JanusGraph via Gremlin',
    },
    servers: [
      {
        url: 'http://localhost:3000/docs',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // auto-generates docs from JSDoc comments
};

export const swaggerSpec = swaggerJsdoc(options);
