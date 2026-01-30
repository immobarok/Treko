import { Trip } from 'src/generated/prisma/client';
import { PlaceDetails } from './placedetails.entity';

export class Place {
  id: string;
  name: string;
  slug: string;
  image: string;
  bannerImage?: string;
  shortDesc?: string;
  capital?: string;
  currency?: string;
  language?: string;
  timezone?: string;
  visaRequired: boolean;
  restrictions?: string;
  categoryId: string;
  order: number;
  isFeatured: boolean;
  details?: PlaceDetails;
  trips?: Trip[];
  createdAt: Date;
  updatedAt: Date;
}
