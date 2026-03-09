import { LookupType } from './LookupType';

export interface LookupDto {
  id?: number;
  type: LookupType;
  key: string;
  valueEn: string;
  valueAr: string;
  order?: number;
  active?: boolean;
  updatedAt?: string; // ISO 8601 string representation of LocalDateTime
  createdAt?: string; // ISO 8601 string representation of LocalDateTime
  createdById?: number;
  updatedById?: number;
}
