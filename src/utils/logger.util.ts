import env from "@config/env.config";

class logger_util {
  constructor() {
    this.shouldLog = env.nodeEnv === "development";
    this.log = this.log.bind(this);
    this.error = this.error.bind(this);
    this.warn = this.warn.bind(this);
    this.info = this.info.bind(this);
  }
  shouldLog: boolean;
  log(...args: any[]) {
    if (this.shouldLog) {
      console.log(...args);
    }
  }
  error(...args: any[]) {
    if (this.shouldLog) {
      console.error(...args);
    }
  }
  warn(...args: any[]) {
    if (this.shouldLog) {
      console.warn(...args);
    }
  }
  info(...args: any[]) {
    if (this.shouldLog) {
      console.info(...args);
    }
  }
}

export default new logger_util();
