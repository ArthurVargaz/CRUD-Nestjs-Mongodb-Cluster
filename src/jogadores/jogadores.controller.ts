import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/create-jogador.dto';
import { JogadoresService } from './jogadores.service';
import { Jogador } from './interfaces/jogador.interface';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}

  @Post()
  createJogador(@Body() createJogadorDto: CriarJogadorDto) {
    return this.jogadoresService.create(createJogadorDto);
  }

  @Get()
  async getAll(@Query('email') email: string): Promise<Jogador | Jogador[]> {
    if (email) {
      return await this.jogadoresService.getByEmail(email);
    } else {
      return await this.jogadoresService.getAll();
    }
  }

  @Delete()
  async delete(@Query('email') email: string): Promise<any> {
    return this.jogadoresService.delete(email);
  }
}
