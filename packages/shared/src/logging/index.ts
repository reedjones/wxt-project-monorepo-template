/**
 * Simple structured logger for browser extensions.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  context?: Record<string, unknown>;
}

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export class Logger {
  private readonly prefix: string;
  private minLevel: LogLevel;

  constructor(prefix: string, minLevel: LogLevel = 'info') {
    this.prefix = prefix;
    this.minLevel = minLevel;
  }

  setLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[this.minLevel];
  }

  private format(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
    return { level, message, timestamp: Date.now(), context };
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog('debug')) return;
    console.debug(`[${this.prefix}]`, message, context ?? '');
  }

  info(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog('info')) return;
    console.info(`[${this.prefix}]`, message, context ?? '');
  }

  warn(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog('warn')) return;
    console.warn(`[${this.prefix}]`, message, context ?? '');
  }

  error(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog('error')) return;
    console.error(`[${this.prefix}]`, message, context ?? '');
  }

  /** Create a child logger with a sub-prefix */
  child(subPrefix: string): Logger {
    return new Logger(`${this.prefix}:${subPrefix}`, this.minLevel);
  }
}

/** Default root logger instance */
export const logger = new Logger('ext');
