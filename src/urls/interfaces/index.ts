import { ICategoryEntity } from 'src/categories/interfaces';
import { Url } from 'src/urls/schemas/url.schema';

export interface IUrlEntity extends Url {
  categories: ICategoryEntity[];
}
