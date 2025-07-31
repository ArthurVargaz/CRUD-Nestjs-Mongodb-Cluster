import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Desafio, Partida } from './interface/desafio.interface';
import { DesafiosService } from './desafios.service';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { UpdateDesafioDto } from './dtos/update-desafio.dto';
import { AddDesafioPartidaDto } from './dtos/add-desafio-partida.dto';

@Controller('api/v1/desafios')
export class DesafiosController {
  constructor(private readonly desafiosService: DesafiosService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarDesafio(
    @Body() criarDesafioDto: CriarDesafioDto,
  ): Promise<Desafio> {
    return await this.desafiosService.create(criarDesafioDto);
  }

  @Get('/:_id')
  async getDesafioId(@Param('_id') _id: string): Promise<Desafio[]> {
    return await this.desafiosService.getDesafioByIdJogador(_id);
  }

  @Get()
  async getAllDesafios(): Promise<Desafio[]> {
    return await this.desafiosService.getAllDesafios();
  }

  @Put('/:idDesafio')
  @UsePipes(ValidationPipe)
  async updateDesafio(
    @Param('idDesafio') _idDesafio: string,
    @Body() updateDesafio: UpdateDesafioDto,
  ): Promise<void> {
    return await this.desafiosService.updateDesafio(_idDesafio, updateDesafio);
  }

  @Delete('/:idDesafio')
  async deleteDesafio(@Param('idDesafio') _idDesafio: string): Promise<void> {
    return this.desafiosService.delete(_idDesafio);
  }

  @Post('/partida/:_idDesafio')
  @UsePipes(ValidationPipe)
  async addPartida(
    @Param('_idDesafio') _idDesafio: string,
    @Body() addPartidaDto: AddDesafioPartidaDto,
  ): Promise<Partida> {
    return await this.desafiosService.addPartida(_idDesafio, addPartidaDto);
  }
}
