import { localAxios } from "@/util/http-commons";

const local = localAxios();

function listAttraction(param, success, fail){
  local.get(`/trip/list`, { params: param }).then(success).catch(fail);
}

export {listAttraction};
