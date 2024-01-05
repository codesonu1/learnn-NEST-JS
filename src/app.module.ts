import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeormConfig from './config/mysql.config';
import { dataSource } from './database/data-source';
import { Usermodule } from './user/user.module';

@Module({
  imports: [
    Usermodule,
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        dataSource.initialize();
        return typeormConfig;
      },
    }),
  ],
})
export class AppModule { }
