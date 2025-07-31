import { IsNotEmpty } from 'class-validator';

export class UpdateJogador {
  @IsNotEmpty()
  readonly phoneNumber: string;

  @IsNotEmpty()
  readonly name: string;
}
