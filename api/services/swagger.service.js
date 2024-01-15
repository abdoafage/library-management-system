import swaggerAutogen from "swagger-autogen";

const setUpSwaggerUi = () => {
  const outputFile = "./swagger.json";
  const endpointsFiles = ["../index.js"];

  const config = {
    info: {
      title: "Blog API Documentation",
      description: "Documentation",
    },
    // tags: [{ name: "First", description: "Operations related to First" }],
    // tags: [{ name: "Second", description: "Operations related to Second" }],
    consumes: ["application/json"],
    produces: ["application/json"],
    host: "localhost:3000",
    schemes: ["http", "https"],
  };

  swaggerAutogen(outputFile, endpointsFiles, config, { recursive: true });
};

setUpSwaggerUi();
