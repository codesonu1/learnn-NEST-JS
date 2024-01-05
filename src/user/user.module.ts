import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { useGardModule } from 'src/guard/useGaurd.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), useGardModule],
  controllers: [UserController],
  providers: [UserService],
})
export class Usermodule {}
