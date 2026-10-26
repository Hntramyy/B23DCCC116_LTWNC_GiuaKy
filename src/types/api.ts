export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiError {
  ok: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

/** Type guard phân biệt response thành công / thất bại */
export function isApiSuccess<T>(res: ApiResponse<T>): res is ApiSuccess<T> {
  return res.ok;
}
