"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const typeOrmConfig = () => ({
    type: "postgres",
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    autoLoadEntities: true,
    synchronize: false, // схемой управляют миграции в db/, не TypeORM
    ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
});
exports.typeOrmConfig = typeOrmConfig;
