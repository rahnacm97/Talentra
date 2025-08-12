export interface ILogger {
  error(message: string, error?: unknown): void;
  info(message: string, meta?: unknown): void;
}