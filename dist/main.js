"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    if (!process.env.JWT_SECRET) {
        // Fail fast: без секрета токены подделываются — не стартуем.
        throw new Error("JWT_SECRET is required but not set. Refusing to start.");
    }
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const origins = (process.env.CORS_ORIGINS ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    app.enableCors({
        origin: origins.length === 0 || origins.includes("*") ? true : origins,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true, // срезает лишние поля
        forbidNonWhitelisted: true,
        transform: true, // приводит типы по DTO
        transformOptions: { enableImplicitConversion: true },
    }));
    const port = Number(process.env.PORT) || 9001;
    await app.listen(port);
    // eslint-disable-next-line no-console
    console.log(`API listening on :${port}`);
}
bootstrap();
