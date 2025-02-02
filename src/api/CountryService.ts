
import { CountryState } from "@app/types/CountryState";
import {callApi} from "./axios";
import endPoints from "./Endpoints";
import { Country } from "@app/types/Country";




export const getCountryByName = async (name: string): Promise<Country> => {
  try {
      const response = await callApi(endPoints.getCountryByName, {
        urlParams: {name}
      });
      return response;
  } catch (error) {
    throw error;
  }
};

export const listCountries = async (): Promise<Country[]> => {
  try {
      const response = await callApi(endPoints.listCountries, {});
      return response;
  } catch (error) {
    throw error;
  }
};

export const listCountryStates = async (code: string): Promise<CountryState[]> => {
  try {
      const response = await callApi(endPoints.listCountryStates, {
        urlParams: {code}
      });
      return response;
  } catch (error) {
    throw error;
  }
};
