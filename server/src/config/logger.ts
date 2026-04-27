import chalk from "chalk";

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogMeta {
  [key: string]: unknown;
}

interface SerializedError {
  name: string;
  message: string;
  stack?: string;
  code?: string;
  statusCode?: number;
  [key: string]: unknown;
}

const levelColors: Record<LogLevel, (msg: string) => string> = {
  debug: chalk.green,
  info: chalk.blue,
  warn: chalk.yellow,
  error: chalk.red,
};

function isError(value: unknown): value is Error {
  return value instanceof Error;
}
// ? Format error to be consistent for loggin
function serializeError(err: Error): SerializedError {
  const serialized: SerializedError = {
    name: err.name,
    message: err.message,
    stack: err.stack,
  };

  const errorWithExtras = err as Error & Record<string, unknown>;

  if (typeof errorWithExtras.code === "string") {
    serialized.code = errorWithExtras.code;
  }

  if (typeof errorWithExtras.statusCode === "number") {
    serialized.statusCode = errorWithExtras.statusCode;
  }

  for (const key of Object.keys(errorWithExtras)) {
    if (!(key in serialized)) {
      serialized[key] = errorWithExtras[key];
    }
  }

  return serialized;
}

export class Logger {
  constructor(private context?: string) {
    this.context = context;
  }
  private formatConsoleLog(
    timestamp: string,
    level: LogLevel,
    message: string,
    meta?: LogMeta,
    error?: SerializedError,
  ) {
    const levelLabel = levelColors[level](level.toUpperCase().padEnd(5));
    const timeLabel = chalk.gray(timestamp);
    const contextLabel = this.context ? chalk.magenta(`[${this.context}]`) : "";

    console.log(`${timeLabel} ${levelLabel} ${contextLabel} ${message}`);

    if (meta && Object.keys(meta).length > 0) {
      console.log(chalk.gray(JSON.stringify({ meta }, null, 2)));
    }

    if (error) {
      console.log(
        chalk.red(
          JSON.stringify(
            {
              error,
            },
            null,
            2,
          ),
        ),
      );
    }
  }

  private formatJsonLog(
    timestamp: string,
    level: LogLevel,
    message: string,
    meta?: LogMeta,
    error?: SerializedError,
  ) {
    const payload = {
      timestamp,
      level,
      context: this.context,
      message,
      meta,
      error,
    };

    console.log(JSON.stringify(payload));
  }

  /**
   * @param message - message to log
   * @param meta - data to log exm. { email: test@example.com }
   */
  private log(level: LogLevel, message: string, meta?: LogMeta) {
    if (process.env.LOGS === "false") return;
    const timestamp = new Date().toISOString();

    let error: SerializedError | undefined;
    let cleanedMeta = meta;

    if (meta?.err && isError(meta.err)) {
      error = serializeError(meta.err);
      const { err, ...rest } = meta;
      cleanedMeta = rest;
    }

    if (process.env.NODE_ENV === "production") {
      this.formatJsonLog(timestamp, level, message, cleanedMeta, error);
      return;
    }

    this.formatConsoleLog(timestamp, level, message, cleanedMeta, error);
  }

  debug(message: string, meta?: LogMeta) {
    this.log("debug", message, meta);
  }

  info(message: string, meta?: LogMeta) {
    this.log("info", message, meta);
  }

  warn(message: string, meta?: LogMeta) {
    this.log("warn", message, meta);
  }

  error(message: string, meta?: LogMeta) {
    this.log("error", message, meta);
  }
}

const logger = new Logger();
export default logger;
