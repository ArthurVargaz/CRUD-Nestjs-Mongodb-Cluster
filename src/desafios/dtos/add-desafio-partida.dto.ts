import { IsNotEmpty } from 'class-validator';
import { Jogador } from '../../jogadores/interfaces/jogador.interface';
import { Resultado } from '../interface/desafio.interface';

export class AddDesafioPartidaDto {
  @IsNotEmpty()
  def: Jogador;

  @IsNotEmpty()
  resultado: Array<Resultado>;
}
