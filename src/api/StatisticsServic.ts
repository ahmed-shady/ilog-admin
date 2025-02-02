import { CountryState } from "@app/types/CountryState";
import { callApi } from "./axios";
import endPoints from "./Endpoints";
import { Country } from "@app/types/Country";
import ApplicationStats from "@app/types/ApplicationStats";


export const doctorsStatisticsPerCountry = async (): Promise<Country[]> => {
  try {
      const response = await callApi(endPoints.doctorsStatisticsPerCountry, {});
      return response;
  } catch (error) {
    throw error;
  }
};


export const doctorsStatisticsPerCountryState = async (countryName: string): Promise<CountryState[]> => {
  try {
      const response = await callApi(endPoints.doctorsStatisticsPerCountryState, {
        params: {country: countryName}
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