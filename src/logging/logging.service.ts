import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

const logLevelEnv = process.env.LOG_LEVEL || 'info';
const maxSize = process.env.LOG_MAX_SIZE || '1k';

const levels: Record<string, number> = {
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
};

@Injectable()
export class LoggingService implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: logLevelEnv,
      levels,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
        }),
      ),
      transports: [
        new winston.transports.DailyRotateFile({
          filename: 'logs/app-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize,
          zippedArchive: false,
        }),
        new winston.transports.DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          level: 'error',
          maxSize,
          zippedArchive: false,
        }),
        new winston.transports.Console(),
      ],
    });
  }

  log(message: string, ...optionalParams: any[]) {
    if (levels[logLevelEnv] >= 2)
      this.logger.log('log', message, ...optionalParams);
  }
  error(message: string, ...optionalParams: any[]) {
    if (levels[logLevelEnv] >= 0)
      this.logger.log('error', message, ...optionalParams);
  }
  warn(message: string, ...optionalParams: any[]) {
    if (levels[logLevelEnv] >= 1)
      this.logger.log('warn', message, ...optionalParams);
  }
  debug(message: string, ...optionalParams: any[]) {
    if (levels[logLevelEnv] >= 4)
      this.logger.log('debug', message, ...optionalParams);
  }
  verbose(message: string, ...optionalParams: any[]) {
    if (levels[logLevelEnv] >= 3)
      this.logger.log('verbose', message, ...optionalParams);
  }
}
