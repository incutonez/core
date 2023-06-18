import { Body, Controller, Post, Get } from '@nestjs/common';
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
  createUser(@Body() user: UserModel) {
    console.log('here', user);
    return user;
  }
}
