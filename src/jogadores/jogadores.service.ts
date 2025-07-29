import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/create-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {
  private jogadores: Jogador[] = [];

  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  private readonly logger = new Logger(JogadoresService.name);

  async create(criaJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const { email } = criaJogadorDto;

    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    if (jogadorEncontrado) {
      return await this.atualizar(criaJogadorDto);
    } else {
      const jogadorCriado = new this.jogadorModel(criaJogadorDto);

      return await jogadorCriado.save();
    }
  }

  async getAll(): Promise<Jogador[]> {
    return await this.jogadorModel.find().exec();
  }

  async getByEmail(email: string): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    if (!jogadorEncontrado) {
      throw new NotFoundException("User doesn't exist");
    }

    return jogadorEncontrado;
  }

  async delete(email: string): Promise<any> {
    await this.jogadorModel.deleteOne({ email }).exec();
  }

  private async atualizar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const jogadorAtualizado = await this.jogadorModel
      .findOneAndUpdate(
        { email: criarJogadorDto.email },
        { $set: criarJogadorDto },
        { new: true },
      )
      .exec();

    if (!jogadorAtualizado) {
      throw new Error('Jogador não encontrado para atualização.');
    }

    return jogadorAtualizado;
  }
}
