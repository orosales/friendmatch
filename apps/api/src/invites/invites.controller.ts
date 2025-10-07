import { Controller, Get, Post, Body } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { CreateInviteDto } from './dto/create-invite.dto';

@Controller('invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {
    console.log('InvitesController initialized');
  }

  @Get()
  async findAll() {
    console.log('GET /invites called');
    return this.invitesService.findAll();
  }

  @Post()
  async create(@Body() createInviteDto: CreateInviteDto) {
    console.log('POST /invites called with data:', createInviteDto);
    return this.invitesService.create(createInviteDto);
  }
}
