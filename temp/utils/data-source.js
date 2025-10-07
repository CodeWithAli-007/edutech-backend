"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.AppDataSource = void 0;
require("dotenv/config");
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var config = require("config");
// Fallback to environment variables if config fails
var postgresConfig;
try {
    postgresConfig = config.get('postgresConfig');
}
catch (error) {
    // Fallback to environment variables
    postgresConfig = {
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT || '5432'),
        username: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'password',
        database: process.env.POSTGRES_DB || 'edtechDB'
    };
}
exports.AppDataSource = new typeorm_1.DataSource(__assign(__assign({}, postgresConfig), { type: 'postgres', synchronize: false, logging: true, 
    //migrationsRun: true, // Automatically run migrations on every application launch
    entities: ['src/entities/**/*.entity{.ts,.js}'], migrations: ['src/migrations/**/*{.ts,.js}'], subscribers: ['src/subscribers/**/*{.ts,.js}'] }));
// DataSource initialization is handled in app.ts
// This prevents double initialization
