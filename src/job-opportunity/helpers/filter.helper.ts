import { Filtering } from '../decorators/filter.decorator';
import { FilterRule } from '../decorators/filter.decorator';

export const getFilters = (filters: Filtering[]): any => {
  let filterObject = {};
  if (!filters) return {};

  filters.forEach((filter) => {
    if (!filter.rule) return;

    if (filter.property == 'search') {
      filterObject = {
        ...filterObject,
        $or: [
          { career: { $regex: filter.value, $options: 'i' } },
          { position: { $regex: filter.value, $options: 'i' } },
          { company: { $regex: filter.value, $options: 'i' } },
          { country: { $regex: filter.value, $options: 'i' } },
        ],
      };
    }

    if (filter.property == 'user') {
      filterObject = {
        ...filterObject,
        [filter.property]: filter.value,
      };
      return;
    }

    if (filter.property == 'createdAt') {
      filterObject = {
        ...filterObject,
        $expr: {
          $eq: [{ $year: `$${filter.property}` }, filter.value],
        },
      };
      return;
    }

    if (filter.rule == FilterRule.EQUALS) {
      filterObject = {
        ...filterObject,
        [filter.property]: {
          $regex: filter.value,
          $options: 'i',
        },
      };
    }

    if (filter.rule == FilterRule.RANGE) {
      // eslint-disable-next-line prefer-const
      let [minRange, maxRange]: number[] = filter?.value
        ?.split(',')
        .map(Number);

      if (!maxRange) maxRange = minRange;

      filterObject =
        minRange < 5
          ? {
              ...filterObject,
              $or: [
                {
                  $and: [
                    { experience: { $size: 2 } },
                    {
                      'experience.0': { $lte: minRange },
                    },
                    {
                      'experience.1': { $gte: maxRange },
                    },
                  ],
                },
                {
                  $and: [
                    { experience: { $size: 1 } },
                    { 'experience.0': { $lte: maxRange } },
                    { 'experience.0': { $gte: minRange } },
                  ],
                },
              ],
            }
          : {
              ...filterObject,
              $or: [
                { 'experience.0': { $gte: minRange } },
                { 'experience.1': { $gte: minRange } },
              ],
            };
    }

    if (filter.rule == FilterRule.ISNULL) {
      filterObject = {
        ...filterObject,
        [filter.property]: null,
      };
    }
  });

  return filterObject;
};
