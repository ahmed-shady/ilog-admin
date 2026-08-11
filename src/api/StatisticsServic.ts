import { CountryState } from "@app/types/CountryState";
import { callApi } from "./axios";
import endPoints from "./Endpoints";
import { Country } from "@app/types/Country";
import ApplicationStats from "@app/types/ApplicationStats";
import DoctorTypeEnum from "@app/types/DoctorTypeEnum";

export const doctorsStatisticsPerCountry = async (): Promise<Country[]> => {
  try {
    const response = await callApi(endPoints.doctorsStatisticsPerCountry, {});
    return response;
  } catch (error) {
    throw error;
  }
};

export const doctorsStatisticsPerCountryState = async (
  countryName: string,
): Promise<CountryState[]> => {
  try {
    const response = await callApi(endPoints.doctorsStatisticsPerCountryState, {
      params: { country: countryName },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getApplicationStats = async (): Promise<ApplicationStats> => {
  try {
    const response = await callApi(endPoints.getApplicationStats, {});
    return response;
  } catch (error) {
    throw error;
  }
};

export interface AgeGroupStat {
  ageGroup: string;
  count: number;
}

export interface CountryAgeDistribution {
  country: string;
  ageGroups: AgeGroupStat[];
}

export const getDoctorsAgeDistribution = async (
  _countries: string[],
): Promise<CountryAgeDistribution[]> => {
  // Mocked response — returns static data for Egypt without calling the API.
  return _countries.map((c) => ({
    country: c,
    ageGroups: [
      { ageGroup: "20-30", count: 320 },
      { ageGroup: "30-40", count: 540 },
      { ageGroup: "40-50", count: 410 },
      { ageGroup: "50+", count: 230 },
    ],
  }));
};

export interface SpecialityDistribution {
  speciality: string;
  count: number;
}

interface SpecialityStatItem {
  speciality: { id: number; name: string };
  doctorsCount: number;
}

export const getDoctorsSpecialityDistribution = async (
  specialityIds: number[],
  countries: string[],
  types: DoctorTypeEnum[],
): Promise<SpecialityDistribution[]> => {
  const body: Record<string, unknown> = {};
  if (specialityIds.length) body.specialitiesIds = specialityIds;
  if (countries.length) body.countries = countries;
  if (types.length) body.types = types;

  const response: SpecialityStatItem[] = await callApi(
    endPoints.doctorsStatisticsPerSpeciality,
    { data: body },
  );
  return response.map((item) => ({
    speciality: item.speciality.name,
    count: item.doctorsCount,
  }));
};
