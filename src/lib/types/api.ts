export type ApiResponse<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  error: string;
  message: string;
};

export type PaginatedResponse<T> = {
  success: true;
  data: T[];
  pagination: {
    next_cursor: string | null;
    has_more: boolean;
  };
};
