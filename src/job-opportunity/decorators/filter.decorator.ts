import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

export interface Filtering {
  property: string;
  rule: string;
  value: string;
}

export enum FilterRule {
  EQUALS = 'eq',
  RANGE = 'range',
  ISNULL = 'isnull',
}

export const FilteringParams = createParamDecorator(
  (data, exec: ExecutionContext): Filtering[] => {
    const req: Request = exec.switchToHttp().getRequest();
    let filters = req.query.filter as string[];
    const search = req.query.search as string;
    if (!filters && !search) return null;
    if (filters) filters = Array.isArray(filters) ? filters : [filters];
    if (search) filters = [...(filters ?? []), `search:${search}`];

    if (typeof data != 'object')
      throw new BadRequestException('Invalid filter parameter');

    filters.forEach((filter) => {
      if (
        !filter.match(
          /^[a-zA-Z0-9_]+:(eq|range):[a-zA-Z0-9_,áéíóúÁÉÍÓÚüÜ ]+$/,
        ) &&
        !filter.match(/^[a-zA-Z0-9_]+:(isnull|isnotnull)$/) &&
        !filter.match(/^search:.*/)
      ) {
        throw new BadRequestException('Invalid filter parameter');
      }
    });

    const filterValues = filters.map((filter) => {
      const [property, rule, value] = filter.split(':');
      if (property == 'search') return { property, rule, value: rule };

      if (!data.includes(property))
        throw new BadRequestException(`Invalid filter property: ${property}`);
      if (!Object.values(FilterRule).includes(rule as FilterRule))
        throw new BadRequestException(`Invalid filter rule: ${rule}`);

      return { property, rule, value };
    });

    return filterValues;
  },
);
