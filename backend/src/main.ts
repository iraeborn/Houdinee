import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const dotenv = require('dotenv');

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app
    .listen(process.env.SERVER_PORT)
    .then(() => {
      console.log(`Server running on PORT:${process.env.SERVER_PORT}`);
    })
    .catch((error) => {
      console.error(`Failed to start server: ${error}`);
    });
}
bootstrap();
