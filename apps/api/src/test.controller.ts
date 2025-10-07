import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Get()
  getTest() {
    return { message: 'GET test working' };
  }

  @Post()
  postTest() {
    return { message: 'POST test working' };
  }
}
