import 'dotenv/config';
import * as express from 'express';
import * as config from 'config';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import { AppDataSource } from './utils/data-source';
import AppError from './utils/appError';
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import validateEnv from './utils/validateEnv';
import redisClient from './utils/connectRedis';
import instituteRouter from './routes/instituteRoutes';
import studentRouter from './routes/student.routes';
import teacherRouter from './routes/teacher.routes';
import courseRouter from './routes/course.routes';
import lessonRouter from './routes/lesson.routes';
import examRouter from './routes/exam.routes';
import enrollmentRouter from './routes/enrollment.routes';
import path = require('path');

const yaml = require("yamljs");
const swaggerUi = require("swagger-ui-express");
const swaggerPath = path.join(__dirname, "swagger", "swagger.yml");
const swaggerDocument = yaml.load(swaggerPath);
const helmet = require("helmet");

const OpenApiValidator = require("express-openapi-validator");
//const { verifyToken } = require('config/auth');
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100000000000, // Limit each IP to 100000000000 requests per windowMs
  validate: { xForwardedForHeader: false }
});
//import redisClient from './utils/connectRedis';
// import nodemailer from 'nodemailer';
// (async function () {
//   const credentials = await nodemailer.createTestAccount();
//   console.log(credentials);
// })();

AppDataSource.initialize()
  .then(async () => {
    console.log('Data Source has been initialized!');
    // VALIDATE ENV
    validateEnv();

    const app = express();

    // TEMPLATE ENGINE
    app.set('view engine', 'pug');
    app.set('views', `${__dirname}/views`);

    // MIDDLEWARE

    // 1. Body parser
    app.use(express.json({ limit: '10kb' }));

    // 2. Logger
    if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

    // 3. Cookie Parser
    app.use(cookieParser());

    // 4. Cors
    app.use(
      cors({
        origin: config.get<string>('origin'),
        credentials: true,
      })
    );

    // Dynamically set the base URL based on environment
    const port = config.get<number>('port');
    const baseUrl = process.env.BASEURL || `http://localhost:${port}`;  // Local development URL
    // Replace the placeholder with the correct base URL
    swaggerDocument.servers[0].url = baseUrl;
    // OpenAPI Documentation
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // HEALTH CHECKER (before OpenAPI validator)
    app.get('/api/edtech', async (_, res: express.Response) => {
      const message = await redisClient.get('try');

      res.status(200).json({
        status: 'success',
        message,
      });
    });

    // OpenAPI Validator Middleware
    app.use(
      OpenApiValidator.middleware({
        apiSpec: swaggerPath,
        validateRequests: true, // Validate request body, params, query
        validateResponses: false, // Validate responses before sending
      })
    );

    // ROUTES
    app.use('/api/auth', authRouter);
    app.use('/api/users', userRouter);
    app.use('/api/v1/institutes', instituteRouter);
    app.use('/api/v1/students', studentRouter);
    app.use('/api/v1/teachers', teacherRouter);
    app.use('/api/v1/courses', courseRouter);
    app.use('/api/v1/lessons', lessonRouter);
    app.use('/api/v1/exams', examRouter);
    app.use('/api/v1/enrollments', enrollmentRouter);

    // UNHANDLED ROUTE
    app.all('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
      next(new AppError(404, `Route ${req.originalUrl} not found`));
    });

    // GLOBAL ERROR HANDLER
    app.use(
      (error: AppError, req: express.Request, res: express.Response, next: express.NextFunction) => {
        error.status = error.status || 'error';
        error.statusCode = error.statusCode || 500;

        res.status(error.statusCode).json({
          status: error.status,
          message: error.message,
        });
      }
    );


    app.listen(port);

    console.log(`Server started on port: ${port}`);
  })
  .catch((error) => console.log('couldnot start app:', error));