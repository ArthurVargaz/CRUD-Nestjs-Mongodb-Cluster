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
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { CategoriasService } from './categorias.service';
import { Categoria } from './interfaces/categoria.interface';
import { AtualizarCategoriaDto } from './dtos/update-categoria.dto';

@Controller('api/v1/categorias')
export class CategoriasController {
  constructor(private readonly categoriaService: CategoriasService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarCategoria(
    @Body() criarCategoriaDto: CriarCategoriaDto,
  ): Promise<Categoria> {
    return await this.categoriaService.create(criarCategoriaDto);
  }

  @Get()
  async getAll(): Promise<Array<Categoria>> {
    return await this.categoriaService.getAll();
  }

  @Get('/:categoria')
  async getOne(@Param('categoria') categoria: string): Promise<Categoria> {
    return await this.categoriaService.getOne(categoria);
  }

  @Get('/jogador/:idJogador')
  async getCatId(@Param('idJogador') idJogador: string): Promise<Categoria> {
    return await this.categoriaService.consultarCatPeloId(idJogador);
  }

  @Put('/:categoria')
  @UsePipes(ValidationPipe)
  async update(
    @Body() atualizarCategoriaDto: AtualizarCategoriaDto,
    @Param('categoria') categoria: string,
  ): Promise<void> {
    return await this.categoriaService.update(atualizarCategoriaDto, categoria);
  }

  @Post('/:categoria/jogadores/:idJogador')
  async addJogadorCategoria(
    @Param() params: { categoria: string; idJogador: string },
  ): Promise<void> {
    return await this.categoriaService.addJogadorCat(params);
  }

  @Delete('/:categoria')
  async delete(@Param('categoria') categoria: string): Promise<void> {
    return await this.categoriaService.delete(categoria);
  }
}
