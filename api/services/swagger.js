const swaggerAutogen = require('swagger-autogen')();

const outputFile = 'services/swagger_output.json';
const endpointsFiles = ['routes/api/v1/books.js'];

const doc = {
	  info: {
		version: "1.0.0",
		title: "Final",
		description: "Documentation of Final API"
	  },
	  host: "localhost:8080",
	  basePath: "/api/v1",
	  schemes: ["http"],
	  consumes: ["application/json"],
	  produces: ["application/json"],
};

swaggerAutogen(outputFile, endpointsFiles, doc);