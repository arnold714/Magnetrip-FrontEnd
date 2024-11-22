import { localAxios } from "@/util/http-commons";

const local = localAxios();

function getGoogleAuthUrl(param, success, fail){
  local.get(`/login/getGoogleAuthUrl`, { params: param }).then(success).catch(fail);
}

export {getGoogleAuthUrl};
