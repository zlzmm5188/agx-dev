/**
 * 统一响应格式
 */
export class ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T | null;

  constructor(code: number, msg: string, data: T | null = null) {
    this.code = code;
    this.msg = msg;
    this.data = data;
  }

  static success<T>(data: T, msg = 'ok'): ApiResponse<T> {
    return new ApiResponse(0, msg, data);
  }

  static error(code: number, msg: string): ApiResponse<null> {
    return new ApiResponse(code, msg, null);
  }
}

/**
 * 错误码枚举
 */
export enum ErrorCode {
  SUCCESS = 0,
  // 通用错误
  PARAM_ERROR = 1001,
  UNAUTHORIZED = 1002,
  TOKEN_EXPIRED = 1003,
  NO_PERMISSION = 1004,
  // 用户错误
  USER_NOT_FOUND = 2001,
  PASSWORD_ERROR = 2002,
  USER_EXISTS = 2003,
  CAPTCHA_ERROR = 2004,
  CAPTCHA_EXPIRED = 2005,
  INVITE_CODE_INVALID = 2006,
  // 管理员错误
  ADMIN_NOT_FOUND = 5001,
  ADMIN_PASSWORD_ERROR = 5002,
  CURRENCY_EXISTS = 5003,
  CURRENCY_NOT_FOUND = 5004,
}

/**
 * 错误码消息映射
 */
export const ErrorMessage: Record<number, string> = {
  [ErrorCode.SUCCESS]: 'ok',
  [ErrorCode.PARAM_ERROR]: '参数错误',
  [ErrorCode.UNAUTHORIZED]: '未登录',
  [ErrorCode.TOKEN_EXPIRED]: 'Token 过期',
  [ErrorCode.NO_PERMISSION]: '无权限',
  [ErrorCode.USER_NOT_FOUND]: '用户不存在',
  [ErrorCode.PASSWORD_ERROR]: '密码错误',
  [ErrorCode.USER_EXISTS]: '账号已存在',
  [ErrorCode.CAPTCHA_ERROR]: '验证码错误',
  [ErrorCode.CAPTCHA_EXPIRED]: '验证码已过期',
  [ErrorCode.INVITE_CODE_INVALID]: '邀请码无效',
  [ErrorCode.ADMIN_NOT_FOUND]: '管理员不存在',
  [ErrorCode.ADMIN_PASSWORD_ERROR]: '管理员密码错误',
  [ErrorCode.CURRENCY_EXISTS]: '币种代码已存在',
  [ErrorCode.CURRENCY_NOT_FOUND]: '币种不存在',
};
