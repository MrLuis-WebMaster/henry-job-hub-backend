import { Sorting } from '../decorators/sorting.decorator';

export const getSort = (sort: Sorting) =>
  sort ? { [sort.property]: sort.direction } : {}; 
