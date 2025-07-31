import { IsEnum, IsOptional } from 'class-validator';
import { DesafioStatus } from '../interface/desafio-status.enum';

export class UpdateDesafioDto {
  @IsOptional()
  dataHoraDesafio: Date;

  @IsOptional()
  @IsEnum(DesafioStatus, {
    message:
      'Status inválido. Status permitidos são: ACEITO, NEGADO, CANCELADO.',
  })
  status: DesafioStatus;
}
