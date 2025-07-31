import { Document, Types } from 'mongoose';
import { Jogador } from '../../jogadores/interfaces/jogador.interface';
export interface Categoria extends Document {
  readonly categoria: string;
  descricao: string;
  eventos: Array<Evento>;
  jogadores: (Types.ObjectId | Jogador | string)[];
}

export interface Evento {
  nome: string;
  operacao: string;
  valor: number;
}
