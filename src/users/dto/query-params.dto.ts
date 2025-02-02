import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class QueryParamsDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  take: number = 30;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  page: number = 1;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  ageFrom?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  ageTo?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  age?: number;
}
