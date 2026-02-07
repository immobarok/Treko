import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactInfoDto } from './dto/create-contactinfo.dto';
import { UpdateContactInfoDto } from './dto/update-contact.dto';
import { CreateContactDto } from './dto/create-contact.dto';

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

  @Patch('update/:id')
  update(@Body() data: UpdateContactInfoDto, @Param('id') id: string) {
    return this.contactService.updateContactInfo(id, data);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.contactService.deleteContactInfo(id);
  }

  @Post('send-message')
  sendMessage(@Body() data: CreateContactDto) {
    return this.contactService.sendContactMessage(data);
  }
}
