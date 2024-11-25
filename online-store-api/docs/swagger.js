import swaggerJsdoc from 'swagger-jsdoc';

// Swagger настройки
const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Online Store API',
        version: '1.0.0',
        description: 'API для взаимодействия с базой данных Online Store',
      },
    },
    apis: ['./online-store-api/routes/*.js'], // Пути к файлам с описанием Swagger
  };
  const swaggerDocs = swaggerJsdoc(swaggerOptions);

  export default swaggerDocs;