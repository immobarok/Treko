import { Place } from './place.entity';

export class Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  order: number;
  isActive: boolean;
  places?: Place[];
  createdAt: Date;
  updatedAt: Date;
}
