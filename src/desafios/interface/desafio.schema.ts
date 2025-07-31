import mongoose from 'mongoose';
import { DesafioStatus } from './desafio-status.enum';

export const DesafioSchema = new mongoose.Schema(
  {
    dataHoraDesafio: Date,
    status: { type: String, enum: Object.values(DesafioStatus) },
    dataHoraSolicitacao: Date,
    dataHoraResposta: Date,
    solicitante: { type: mongoose.Schema.Types.ObjectId, ref: 'Jogador' },
    categoria: String,
    jogadores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Jogador' }],
    partida: { type: mongoose.Schema.Types.ObjectId, ref: 'Partida' },
  },
  { timestamps: true, collection: 'desafios' },
);
