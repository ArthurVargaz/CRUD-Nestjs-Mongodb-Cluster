import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CriarJogadorDto } from './dtos/create-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateJogador } from './dtos/update-jogador.dto';

@Injectable()
export class JogadoresService {
  private jogadores: Jogador[] = [];

  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  async create(criaJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const { email } = criaJogadorDto;

    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    if (jogadorEncontrado) {
      throw new BadRequestException('email: ' + email + ' já cadastrado');
    } else {
      return await new this.jogadorModel(criaJogadorDto).save();
    }
  }

  async update(_id: string, updateJogadorDto: UpdateJogador): Promise<void> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec();

    if (!jogadorEncontrado) {
      throw new NotFoundException('id: ' + _id + ' não encontrado');
    }

    await this.jogadorModel
      .findOneAndUpdate({ _id }, { $set: updateJogadorDto }, { new: true })
      .exec();
  }

  async getAll(): Promise<Jogador[]> {
    return await this.jogadorModel.find().exec();
  }

  async getById(_id: string): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec();

    if (!jogadorEncontrado) {
      throw new NotFoundException("ID doesn't exist");
    }

    return jogadorEncontrado;
  }

  async delete(_id: string): Promise<void> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec();

    if (!jogadorEncontrado) {
      throw new NotFoundException("ID doesn't exist");
    }

    await this.jogadorModel.deleteOne({ _id }).exec();
  }
}
