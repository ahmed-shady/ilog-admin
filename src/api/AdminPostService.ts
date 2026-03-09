import { callApi } from "./axios";
import endPoints from "./Endpoints";
import { CreateAdminPostRequest } from "@app/types/CreateAdminPostRequest";
import { AdminPostDto } from "@app/types/AdminPostDto";
import AdminPostsFilterDto from "@app/types/AdminPostsFilterDto";
import { PageResponse } from "@app/types/PageResponse";

export const createAdminPost = async (request: CreateAdminPostRequest): Promise<AdminPostDto> => {
  try {
    const response = await callApi(endPoints.createAdminPost, {
      data: request
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteAdminPost = async (id: number): Promise<void> => {
  try {
    await callApi(endPoints.deleteAdminPost, {urlParams: {id}});
  } catch (error) {
    throw error;
  }
};

export const searchAdminPosts = async (
  filter: AdminPostsFilterDto,
  page: number = 0,
  size: number = 15
): Promise<PageResponse<AdminPostDto>> => {
  try {
    const response = await callApi(endPoints.searchAdminPosts, {
      data: filter,
      params: {
        page,
        size,
        sort: 'createdAt,desc'
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};
