import { IsEmail, IsNotEmpty } from 'class-validator';

export class CriarJogadorDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly phoneNumber: string;

  @IsNotEmpty()
  readonly name: string;
}
