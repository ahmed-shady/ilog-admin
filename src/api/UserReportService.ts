
import {callApi} from "./axios";
import endPoints from "./Endpoints";
import { UserReportFilterDto } from "@app/types/UserReportFilterDto";
import { PageResponse } from "@app/types/PageResponse";
import { UserReportDto } from "@app/types/UserReportDto";


export const searchUserReports = async (filterDto: UserReportFilterDto, page: number, size: number): Promise<PageResponse<UserReportDto>> => {
  try {
      const response = await callApi(endPoints.getUserReports, {
        data: filterDto,
        params: {page, size}
      });
      return response;
  } catch (error) {
    throw error;
  }
};

