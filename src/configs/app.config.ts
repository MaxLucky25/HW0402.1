import { INestApplication } from '@nestjs/common';
import { pipesSetup } from './pipes.config';
import { setupSwagger } from './swagger.config';

export function appSetup(app: INestApplication) {
  app.enableCors();
  pipesSetup(app);
  setupSwagger(app);
}
