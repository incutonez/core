import { Body, Controller, Post, Get, UsePipes } from '@nestjs/common';
import { ValidationPipe } from 'src/ValidationPipe';
import { AppService } from './app.service';
import { UserModel } from 'shared-ts/dist/models/UserModel';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('user')
  getUser() {
    return UserModel.create();
  }

  @Post('user')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createUser(@Body() user: UserModel) {
    return user;
  }
}
