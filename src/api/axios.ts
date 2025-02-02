import EndpointConfig from "@app/types/EndpointConfig";
import axios from "axios";
import { toast } from "react-toastify";

export const BASE_URL = "https://ilog-app.com/api";
export const DIRECT_BASE_URL = "https://direct.ilog-app.com";


// // Add a request interceptor
// axios.interceptors.request.use(function (config) {
//     console.log("base url is " + config.url);
//     console.log(config);
//     // Do something before request is sent
//     return config;
//   }, function (error) {
//     // Do something with request error
//     return Promise.reject(error);
//   });

// export default axios;


export const callApi = (endpoint: EndpointConfig, config: any, checkCb?: any): any => {

  let finalUrl = endpoint.url;

  for(let urlParam in config.urlParams){
    finalUrl = finalUrl?.replace(`{${urlParam}}`, config.urlParams[urlParam]);
  }
  return axios.request({
    method: endpoint.method,
    url: finalUrl,
    baseURL: BASE_URL,
    timeout: 25000,
    headers: constructHeaders(endpoint),
    ...config

  }).then((response) => {
    checkCb && checkCb(response?.data);
    if(endpoint?.success?.toast){
      toast.success(endpoint?.success?.defaultMessage || "Success!");
    }
    return response.data;

  }).catch((error) => {
    console.log(error);
    
    if(endpoint?.error?.toast){
      toast.error(error?.response?.data?.message || error.message|| endpoint?.error?.defaultMessage || "Network Error!");
    }

    throw error;
  });
  


}

const constructHeaders = (endPoint: EndpointConfig) => {
  if(!endPoint.public){
    return {"Authorization": `Bearer ${localStorage.getItem("token")}`}
  }
  return {};
}
