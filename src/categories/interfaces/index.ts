import { Url } from 'src/urls/schemas/url.schema';
import { Category } from '../schemas/category.schema';

export interface ICategoryEntity extends Omit<Category, 'urls'> {
  urls: Url[];
}
