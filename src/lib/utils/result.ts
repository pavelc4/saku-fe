export type AppError = {
  message: string;
  code?: string;
  status?: number;
};

export type Result<T> = [T, null] | [null, AppError];
