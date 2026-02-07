import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/context/prisma.service';
import { CreateContactInfoDto } from './dto/create-contactinfo.dto';

@Injectable()
export class ContactService {
  private logger = new Logger(ContactService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createContactCard(dto: CreateContactInfoDto) {
    try {
      return await this.prisma.contactSection.create({
        data: {
          offices: {
            create: dto.offices.map((office) => ({
              title: office.title,
              contact: office.contact,
              addressLine1: office.addressLine1,
              addressLine2: office.addressLine2,
            })),
          },
        },
        include: {
          offices: true,
        },
      });
    } catch (error) {
      this.logger.error('Failed to create contact card', error);
      throw error;
    }
  }

  async getContactInfo() {
    try {
      return await this.prisma.contactSection.findFirst({
        include: {
          offices: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      this.logger.error('Failed to get contact info', error);
      throw error;
    }
  }
}
