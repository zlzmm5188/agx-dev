import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, ErrorMessage } from '../dto/api-response.dto';

/**
 * 业务异常
 */
export class BusinessException extends HttpException {
  private readonly errorCode: number;

  constructor(code: number, message?: string) {
    const msg = message || ErrorMessage[code] || '未知错误';
    super({ code, msg, data: null }, HttpStatus.OK);
    this.errorCode = code;
  }

  getErrorCode(): number {
    return this.errorCode;
  }

  static paramError(message?: string): BusinessException {
    return new BusinessException(ErrorCode.PARAM_ERROR, message);
  }

  static unauthorized(message?: string): BusinessException {
    return new BusinessException(ErrorCode.UNAUTHORIZED, message);
  }

  static userNotFound(): BusinessException {
    return new BusinessException(ErrorCode.USER_NOT_FOUND);
  }

  static passwordError(): BusinessException {
    return new BusinessException(ErrorCode.PASSWORD_ERROR);
  }

  static userExists(): BusinessException {
    return new BusinessException(ErrorCode.USER_EXISTS);
  }

  static inviteCodeInvalid(): BusinessException {
    return new BusinessException(ErrorCode.INVITE_CODE_INVALID);
  }

  static adminNotFound(): BusinessException {
    return new BusinessException(ErrorCode.ADMIN_NOT_FOUND);
  }

  static adminPasswordError(): BusinessException {
    return new BusinessException(ErrorCode.ADMIN_PASSWORD_ERROR);
  }

  static currencyExists(): BusinessException {
    return new BusinessException(ErrorCode.CURRENCY_EXISTS);
  }

  static currencyNotFound(): BusinessException {
    return new BusinessException(ErrorCode.CURRENCY_NOT_FOUND);
  }
}
