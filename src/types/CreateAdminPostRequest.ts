export interface CreateAdminPostRequest {
  content: string;
  type: string;
  countriesIds: number[];
  specialitiesIds: number[];
  filesIds: number[];
}
