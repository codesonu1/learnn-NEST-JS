/* eslint-disable prettier/prettier */
import { Injectable, Req, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) { }

  async register(data: UserDto): Promise<UserEntity | any> {
    const userExist = await this.userRepo.findOne({ where: { phn: data.phn } });
    if (userExist) {
      return { msg: 'this user already register' };
    } else {
      const hash = await bcrypt.hash(data.password, 12);
      console.log(data);
      const { email, username, phn } = data;
      const user = this.userRepo.create({
        email,
        password: hash,
        username,
        phn,
      });
      return {
        data: await this.userRepo.save(user),
        msg: 'User Register successfully',
      };
    }
  }

  async login(data: UserDto): Promise<UserEntity | any> {
    const isUser = await this.userRepo.findOne({
      where: { username: data.username },
    });
    if (!isUser) return 'User doesnot found in the database!';
    if (isUser) {
      const validPass = await bcrypt.compare(data.password, isUser.password);
      if (!validPass) return 'invalid credentials!';
      if (validPass) {
        const token = jwt.sign({ id: isUser.id }, process.env.SECERET_KEY);
        return { msg: 'user login successfully', token };
      }
    }
  }
  async getUserById(id): Promise<UserEntity | any> {
    if (!id) return { msg: 'Id cannot be null', success: false };
    const userFound = await this.userRepo.findOne({ where: { id: id } });
    if (!userFound) {
      return { msg: 'Id doesnot found in the database', success: false };
    } else {
      return userFound;
    }
  }
  async updataUser(data: UserDto): Promise<UserEntity | any> {
    const isUser = await this.userRepo.findOne({ where: { id: data.id } });
    isUser.username = data.username || isUser.username;
    isUser.email = data.email || isUser.email;
    isUser.phn = data.phn || isUser.phn;
    await this.userRepo.save(isUser);
    return {
      msg: 'user update successfully!',
    };
  }
  async deleteUser(id): Promise<UserEntity | any> {
    const isUser = await this.userRepo.findOne({ where: { id: id } });
    if (!isUser) return { msg: 'Id doesnot match in database' };
    await this.userRepo.delete(id);
    return { msg: 'user delete successfully' };
  }
  async changePassword(payload): Promise<UserEntity | any> {
    const isUser = await this.userRepo.findOne({ where: { id: payload.id } });
    if (!isUser) return { msg: 'user not found in database!' }
    if (isUser) {
      const hashPassword = await bcrypt.hash(payload.password, 12)
      isUser.password = hashPassword
      await this.userRepo.save(isUser)
      return { msg: 'password update successfully!' }
    }
  }
}
