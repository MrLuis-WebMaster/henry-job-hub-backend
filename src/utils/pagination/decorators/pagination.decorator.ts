import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { PaginationOptions } from '../interface/pagination.interface';

export const PaginationParams = createParamDecorator(
  (_data, exec: ExecutionContext): PaginationOptions => {
    const req: Request = exec.switchToHttp().getRequest();
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    return { page, pageSize };
  },
);
