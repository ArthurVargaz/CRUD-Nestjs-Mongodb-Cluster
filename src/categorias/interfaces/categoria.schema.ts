import * as mongoose from 'mongoose';

export const CategoriaSchema = new mongoose.Schema(
  {
    categoria: { type: String, unique: true },
    descricao: String,
    eventos: [
      {
        nome: String,
        operacao: String,
        valor: Number,
      },
    ],
    jogadores: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Jogador',
      },
    ],
  },
  { timestamps: true, collection: 'categorias' },
);
