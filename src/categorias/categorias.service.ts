import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Categoria } from './interfaces/categoria.interface';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { AtualizarCategoriaDto } from './dtos/update-categoria.dto';
import { JogadoresService } from '../jogadores/jogadores.service';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
    private readonly jogadorService: JogadoresService,
  ) {}

  async create(criarCategoriaDto: CriarCategoriaDto): Promise<Categoria> {
    const { categoria } = criarCategoriaDto;

    const categoriaEncontrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    if (categoriaEncontrada) {
      throw new BadRequestException(
        'Categoria: ' + categoria + ' já cadastrada',
      );
    }
    const categoriaCriada = new this.categoriaModel(criarCategoriaDto);
    return await categoriaCriada.save();
  }

  async getAll(): Promise<Array<Categoria>> {
    return await this.categoriaModel.find().populate('jogadores').exec();
  }

  async getOne(categoria: string): Promise<Categoria> {
    const categoriaEncontrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    if (!categoriaEncontrada) {
      throw new NotFoundException('Categoria não existe');
    }

    return categoriaEncontrada;
  }

  async update(
    atualizarCategoriaDto: AtualizarCategoriaDto,
    categoria: string,
  ): Promise<void> {
    const categoriaEncontrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    if (!categoriaEncontrada) {
      throw new NotFoundException('Categoria não existe');
    }

    await this.categoriaModel
      .findOneAndUpdate({ categoria }, { $set: atualizarCategoriaDto })
      .exec();
  }

  async addJogadorCat(params: {
    categoria: string;
    idJogador: string;
  }): Promise<void> {
    const categoria = params['categoria'];
    const idJogador = params['idJogador'];

    const categoriaEncontrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    const jogadorJaCadastradoCat = await this.categoriaModel
      .find({ categoria })
      .where('jogadores')
      .in([idJogador])
      .exec();

    if (!categoriaEncontrada) {
      throw new NotFoundException('Categoria não existe');
    }

    if (!(await this.jogadorService.getById(idJogador))) {
      throw new NotFoundException('Jogador não existe');
    }

    if (jogadorJaCadastradoCat.length > 0) {
      throw new BadRequestException('Jogador já se encontra nesta categoria');
    }

    categoriaEncontrada.jogadores.push(idJogador);

    await this.categoriaModel
      .findOneAndUpdate({ categoria }, { $set: categoriaEncontrada })
      .exec();
  }

  async delete(categoria: string): Promise<void> {
    const categoriaEncontrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    if (!categoriaEncontrada) {
      throw new NotFoundException('Categoria não existe');
    }
    await this.categoriaModel.deleteOne({ categoriaEncontrada }).exec();
  }

  async consultarCatPeloId(idJogador: string): Promise<Categoria> {
    const categoriaEncontrada = await this.categoriaModel
      .findOne({ jogadores: idJogador })
      .exec();

    if (!categoriaEncontrada) {
      throw new NotFoundException(
        `O jogador com ID ${idJogador} não está associado a nenhuma categoria.`,
      );
    }

    return categoriaEncontrada;
  }
}
