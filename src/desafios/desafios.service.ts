import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { Desafio, Partida } from './interface/desafio.interface';
import { JogadoresService } from '../jogadores/jogadores.service';
import { CategoriasService } from '../categorias/categorias.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DesafioStatus } from './interface/desafio-status.enum';
import { UpdateDesafioDto } from './dtos/update-desafio.dto';
import { AddDesafioPartidaDto } from './dtos/add-desafio-partida.dto';
@Injectable()
export class DesafiosService {
  constructor(
    @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
    @InjectModel('Partida') private readonly partidaModel: Model<Partida>,
    private readonly jogadorService: JogadoresService,
    private readonly categoriasService: CategoriasService,
  ) {}

  async create(criarDesafioDto: CriarDesafioDto): Promise<Desafio> {
    const { solicitante } = criarDesafioDto;

    const getAllJogadores = await this.jogadorService.getAll();

    criarDesafioDto.jogadores.map((jogadorDto) => {
      const jogadorFilter = getAllJogadores.filter(
        (jogador) => jogador._id == jogadorDto._id,
      );

      if (jogadorFilter.length == 0) {
        throw new BadRequestException(
          'O id ${jogadorDto._id} não é um jogador',
        );
      }
    });

    const solicitanteJogaPartida = criarDesafioDto.jogadores.filter(
      (jogador) => jogador._id == solicitante,
    );

    if (solicitanteJogaPartida.length == 0) {
      throw new BadRequestException(
        'O solicitante deve ser um jogador da partida',
      );
    }

    if (!solicitante || typeof solicitante !== 'string') {
      throw new BadRequestException(
        'O ID do solicitante é obrigatório e deve ser uma string válida.',
      );
    }

    const catSolicitante =
      await this.categoriasService.consultarCatPeloId(solicitante);

    const desafioCriado = new this.desafioModel(criarDesafioDto);
    desafioCriado.categoria = catSolicitante.categoria;
    desafioCriado.dataHoraSolicitacao = new Date();
    desafioCriado.status = DesafioStatus.PENDENTE;
    return await desafioCriado.save();
  }

  async getAllDesafios(): Promise<Desafio[]> {
    return this.desafioModel
      .find()
      .populate('solicitante')
      .populate('jogadores')
      .populate('partida')
      .exec();
  }

  async getDesafioByIdJogador(_id: string): Promise<Desafio[]> {
    await this.jogadorService.getById(_id);

    const consultarDesafioJogador = await this.desafioModel
      .find({ jogadores: _id })
      .populate('solicitante')
      .populate('jogadores')
      .populate('partida')
      .exec();

    if (consultarDesafioJogador.length == 0) {
      throw new NotFoundException('O jogador não tem nenhum desafio');
    }

    return consultarDesafioJogador;
  }

  async updateDesafio(
    _idDesafio: string,
    updateDesafio: UpdateDesafioDto,
  ): Promise<void> {
    const desafioExiste = await this.desafioModel.findById(_idDesafio).exec();

    if (!desafioExiste) {
      throw new NotFoundException('O DESAFIO NÃO EXISTE');
    }

    if (updateDesafio.status) {
      desafioExiste.dataHoraResposta = new Date();
    }

    await this.desafioModel
      .findOneAndUpdate(
        { _id: _idDesafio },
        { $set: updateDesafio },
        { new: true },
      )
      .exec();
  }

  async delete(_idDesafio: string): Promise<void> {
    const desafioExiste = await this.desafioModel.findById(_idDesafio).exec();

    if (!desafioExiste) {
      throw new NotFoundException('O DESAFIO NÃO EXISTE');
    }

    await this.desafioModel.findOneAndUpdate(
      { _id: _idDesafio },
      { $set: { status: DesafioStatus.CANCELADO } },
      { new: true },
    );
  }

  async addPartida(
    _idDesafio: string,
    addPartidaDto: AddDesafioPartidaDto,
  ): Promise<Partida> {
    const desafioExiste = await this.desafioModel.findById(_idDesafio).exec();

    if (!desafioExiste) {
      throw new NotFoundException('O DESAFIO NÃO EXISTE');
    }

    const jogadorFilter = desafioExiste.jogadores.filter(
      (jogador) => jogador._id == addPartidaDto.def,
    );

    if (jogadorFilter.length == 0) {
      throw new BadRequestException(
        'O JOGADOR VENCEDOR NAO FAZ PARTE DO DESAFIO',
      );
    }

    const partidaCriada = new this.partidaModel(addPartidaDto);

    partidaCriada.categoria = desafioExiste.categoria;
    partidaCriada.jogadores = desafioExiste.jogadores;
    const resultado = await partidaCriada.save();
    desafioExiste.status = DesafioStatus.REALIZADO;
    desafioExiste.partida = resultado;

    try {
      await this.desafioModel
        .findOneAndUpdate({ _id: _idDesafio }, { $set: desafioExiste })
        .exec();
    } catch (error) {
      await this.partidaModel.deleteOne({ _id: resultado._id }).exec();
      throw new InternalServerErrorException(error);
    }

    return resultado;
  }
}
