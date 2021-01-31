import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { initSwagger } from './app.swagger';
import { AppConfig } from './configs/app.config';
import { generateTypeormConfigFile } from './scripts';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('Bootstrap');
  const config = app.get(ConfigService);
  const port = parseInt(AppConfig.PORT,10);

  app.disable('x-powered-by');
  app.disable('etag');
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  
  initSwagger(app);
  generateTypeormConfigFile(config);

  await app.listen(port);
  logger.log(`Server is running at ${await app.getUrl()}`);
}

bootstrap();
