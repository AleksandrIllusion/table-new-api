import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  if (!process.env.JWT_SECRET) {
    // Fail fast: без секрета токены подделываются — не стартуем.
    throw new Error("JWT_SECRET is required but not set. Refusing to start.");
  }

  const app = await NestFactory.create(AppModule);

  const origins = (process.env.CORS_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  app.enableCors({
    origin: origins.length === 0 || origins.includes("*") ? true : origins,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // срезает лишние поля
      forbidNonWhitelisted: true,
      transform: true,          // приводит типы по DTO
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const port = Number(process.env.PORT) || 9001;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`API listening on :${port}`);
}
bootstrap();
