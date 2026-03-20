import chalk from "chalk";

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogMeta {
  [key: string]: unknown;
}

const colors: Record<LogLevel, (msg: string) => string> = {
  debug: chalk.green,
  info: chalk.blue,
  warn: chalk.yellow,
  error: chalk.red,
};

export class Logger {
  private context?: string;
  constructor(context?: string) {
    this.context = context;
  }

  /**
   *
   * @param message - message to log
   * @param meta - data to log exm. { email: test@example.com }
   */
  private log(level: LogLevel, message: string, meta?: LogMeta) {
    const timestamp = new Date().toISOString();

    const logObject = {
      timestamp,
      level,
      context: this.context,
      message,
      ...meta,
    };
    console.log(colors[level](JSON.stringify(logObject, null, 2)));
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

  child(context: string) {
    return new Logger(context);
  }
}

const logger = new Logger();
export default logger;
