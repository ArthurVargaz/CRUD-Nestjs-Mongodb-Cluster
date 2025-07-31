import {
  BadRequestException,
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
import { CriarJogadorDto } from './dtos/create-jogador.dto';
import { JogadoresService } from './jogadores.service';
import { Jogador } from './interfaces/jogador.interface';
import { ValidacaoParametrosPipe } from '../common/pipes/validacao-parametros.pipe';
import { UpdateJogador } from './dtos/update-jogador.dto';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createJogador(@Body() createJogadorDto: CriarJogadorDto): Promise<Jogador> {
    return this.jogadoresService.create(createJogadorDto);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updateJogador(
    @Body() updateJogadorDto: UpdateJogador,
    @Param('_id', ValidacaoParametrosPipe) _id: string,
  ): Promise<void> {
    return await this.jogadoresService.update(_id, updateJogadorDto);
  }

  @Get()
  async getAll(): Promise<Jogador[]> {
    return await this.jogadoresService.getAll();
  }

  @Get('/:_id')
  async getById(
    @Param('_id', ValidacaoParametrosPipe) _id: string,
  ): Promise<Jogador> {
    if (!_id) {
      throw new BadRequestException('Email not valid');
    }
    return await this.jogadoresService.getById(_id);
  }

  @Delete('/:_id')
  async delete(
    @Param('_id', ValidacaoParametrosPipe) _id: string,
  ): Promise<void> {
    return this.jogadoresService.delete(_id);
  }
}
