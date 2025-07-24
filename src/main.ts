import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './configs/swagger.config';
import { appSetup } from './configs/app.config';

const PORT = process.env.PORT || 3003;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  appSetup(app);
  if (process.env.NODE_ENV !== 'production') {
    setupSwagger(app);
  }

  await app.listen(PORT, '0.0.0.0');
  console.log(`Application is running on port ${PORT}`);
}
bootstrap();
