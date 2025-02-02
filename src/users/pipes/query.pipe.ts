import { PipeTransform, BadRequestException } from '@nestjs/common';

export class QueryParamsPipe implements PipeTransform {
  transform(value: any) {
    const { ageFrom, ageTo, age } = value;

    if (ageFrom) {
      value.ageFrom = Number(ageFrom);
      if (isNaN(value.ageFrom)) {
        throw new BadRequestException('ageFrom must be a number');
      }
    }

    if (ageTo) {
      value.ageTo = Number(ageTo);
      if (isNaN(value.ageTo)) {
        throw new BadRequestException('ageTo must be a number');
      }
    }

    if (age) {
      value.age = Number(age);
      if (isNaN(value.age)) {
        throw new BadRequestException('age must be a number');
      }
    }

    return value;
  }
}
