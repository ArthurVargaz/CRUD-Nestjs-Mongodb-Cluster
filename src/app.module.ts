import { Module } from '@nestjs/common';
import { JogadoresModule } from './jogadores/jogadores.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(String(process.env.MONGODB_URI)),
    JogadoresModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
