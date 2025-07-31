import { Module } from '@nestjs/common';
import { DesafiosController } from './desafios.controller';
import { DesafiosService } from './desafios.service';
import { DesafioSchema } from './interface/desafio.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadoresModule } from '../jogadores/jogadores.module';
import { CategoriasModule } from '../categorias/categorias.module';
import { PartidaSchema } from './interface/partida.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { schema: DesafioSchema, name: 'Desafio' },
      { schema: PartidaSchema, name: 'Partida' },
    ]),
    JogadoresModule,
    CategoriasModule,
  ],
  controllers: [DesafiosController],
  providers: [DesafiosService],
})
export class DesafiosModule {}
