import { Module } from '@nestjs/common';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriaSchema } from './interfaces/categoria.schema';
import { JogadoresModule } from '../jogadores/jogadores.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: CategoriaSchema, name: 'Categoria' }]),
    JogadoresModule,
  ],
  controllers: [CategoriasController],
  providers: [CategoriasService],
  exports: [CategoriasService],
})
export class CategoriasModule {}
