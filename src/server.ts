import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import routes from './routes'; // Import the central index.ts file from the routes folder

dotenv.config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Order Management API', version: '1.0.0' },
    servers: [{ url: 'http://localhost:5000' }]
  },
  apis: ['./src/routes/*.ts']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Use all routes from the central index.ts file
app.use('/api', routes);

app.listen(5000, () => console.log('Server running on port 5000'));