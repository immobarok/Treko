export class CustomerExperience {
  id: string;
  customerName?: string;
  image: string;
  description: string;
  rating?: number;
  visitDate?: Date;
  placeDetailsId: string;
  createdAt: Date;
}

export class SeasonalInfo {
  id: string;
  season: string;
  weather_celsius: string;
  weather_fahrenheit: string;
  highlights: string[];
  perfect_for: string[];
  image?: string;
  order: number;
  placeDetailsId: string;
  createdAt: Date;
  updatedAt: Date;
}
