import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class DeleteUserDto {
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  id!: string;
}
