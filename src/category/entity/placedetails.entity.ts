import { CustomerExperience, SeasonalInfo } from './customerexperience.entity';

export class PlaceDetails {
  id: string;
  placeId: string;
  popular_places?: any;
  customer_experiences?: CustomerExperience[];
  seasonal_info?: SeasonalInfo[];
}
