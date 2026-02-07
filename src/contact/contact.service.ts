import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/context/prisma.service';
import { CreateContactInfoDto } from './dto/create-contactinfo.dto';
import { UpdateContactInfoDto } from './dto/update-contact.dto';
import { CreateContactDto } from './dto/create-contact.dto';

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
      const contact = await this.prisma.contactSection.findFirst({
        include: {
          offices: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      if (!contact) {
        throw new NotFoundException('Contact info not found');
      }
      return contact;
    } catch (error) {
      this.logger.error('Failed to get contact info', error);
      throw error;
    }
  }

  async updateContactInfo(id: string, data: UpdateContactInfoDto) {
    try {
      return await this.prisma.contactSection.update({
        where: { id },
        data: {
          offices: {
            create: data.offices?.map((office) => ({
              title: office.title,
              contact: office.contact,
              addressLine1: office.addressLine1,
              addressLine2: office.addressLine2,
            })),
          },
        },
      });
    } catch (error) {
      this.logger.error('Failed to update contact info', error);
      throw error;
    }
  }

  async deleteContactInfo(id: string) {
    try {
      return await this.prisma.contactSection.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error('Failed to delete contact info', error);
      throw error;
    }
  }

  async sendContactMessage(data: CreateContactDto) {
    try {
      return await this.prisma.contactMessage.create({
        data: {
          name: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          message: data.message ?? '',
          destination: data.destination,
          agreeToPolicy: data.agreeToPolicy,
        },
      });
    } catch (error) {
      this.logger.error('Failed to send contact message', error);
      throw error;
    }
  }
}
