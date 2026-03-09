
import { LookupDto } from "@app/types/LookupDto";
import {callApi} from "./axios";
import endPoints from "./Endpoints";

import { LookupType } from "@app/types/LookupType";


export const getLookups = async (type: LookupType, activeOnly=true): Promise<LookupDto[]> => {
  try {
      const response = await callApi(endPoints.fetchLookups, {
        params: {type, activeOnly}
      });
      return response;
  } catch (error) {
    throw error;
  }
};

