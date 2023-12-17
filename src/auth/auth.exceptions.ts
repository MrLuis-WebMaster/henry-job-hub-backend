import { HttpException, HttpStatus } from '@nestjs/common';

export class TokenException extends HttpException {
  constructor() {
    super('Token expired/invalid', HttpStatus.UNAUTHORIZED);
  }
}
