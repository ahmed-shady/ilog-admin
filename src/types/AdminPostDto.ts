import { Country } from './Country';
import Speciality from './Speciality';
import { StoredFile } from './StoredFile';

export interface AdminPostDto {
  id: number;
  type: string;
  content: string;
  countries: Country[];
  specialities: Speciality[];
  files: StoredFile[];
  shareSetting?: string;
  reactionsCount: number;
  commentsCount: number;
  updatedAt: string;
  createdAt: string;
}
