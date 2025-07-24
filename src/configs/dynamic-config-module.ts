import { ConfigModule } from '@nestjs/config';
import defaultsConfig from './defaults.config';

// You must import this const in the head of you app.modules.
export const configModule = ConfigModule.forRoot({
  envFilePath: [
    process.env.ENV_FILE_PATH?.trim() || '',
    '.env.production.${process.env.NODE_ENV}.local',
    '.env.production.${process.env.NODE_ENV}', // after this if it needs
    '.env.production.production', // first use this data
  ],
  isGlobal: true,
  load: [defaultsConfig],
});
