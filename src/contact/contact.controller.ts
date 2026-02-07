import { Body, Controller, Get, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactInfoDto } from './dto/create-contactinfo.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('create')
  create(@Body() dto: CreateContactInfoDto) {
    return this.contactService.createContactCard(dto);
  }

  @Get('get-all')
  findAll() {
    return this.contactService.getContactInfo();
  }
}
