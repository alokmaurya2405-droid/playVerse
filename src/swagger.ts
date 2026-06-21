import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Gaming Platform Auth API',
    description: 'Production-grade authentication engine providing unified login (Email/Username) and age-gated registration.',
    version: '1.0.0'
  },
  host: 'localhost:8080',
  schemes: ['http'],
  definitions: {
    SignupInput: {
      email: "player1@example.com",
      username: "GamerX",
      password: "StrongPassword123!",
      dob: "2010-06-15"
    },
    LoginInput: {
      identifier: "GamerX",
      password: "StrongPassword123!"
    }
  }
};

const outputFile = './src/swagger-output.json'; // Keep it targeting inside src/
const endpointsFiles = ['./src/app.ts'];

// Generate docs first, then programmatically boot the app
swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc).then(() => {
    console.log('Swagger-autogen: Success');
    // Dynamically import and run app.ts so it stays in the same process loop
    import('./app'); 
});