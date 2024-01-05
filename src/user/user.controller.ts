import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './user.dto';
import { JwtAuthGuard } from 'src/guard/useGaurd.service';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() data: UserDto) {
    return await this.userService.register(data);
  }
  @Post('login')
  async getAllUser(@Body() data: UserDto) {
    return await this.userService.login(data);
  }
  @Post('get-single-user')
  async getSingleUser(@Body('id') id) {
    return await this.userService.getUserById(id);
  }
  @UseGuards(JwtAuthGuard)
  @Post('edit-user')
  async editUser(@Body() data: UserDto) {
    return await this.userService.updataUser(data);
  }
  @UseGuards(JwtAuthGuard)
  @Post('delete-user')
  async deleteUser(@Body('id') id: any) {
    return await this.userService.deleteUser(id);
  }
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Req() req, @Body('password') password) {
    return await this.userService.changePassword({ password, user: req.user });
  }
}
