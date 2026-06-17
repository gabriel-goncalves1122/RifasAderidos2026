export class AppError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly original?: unknown;

  constructor(code: string, message: string, status: number, original?: unknown) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.original = original;
  }
}
