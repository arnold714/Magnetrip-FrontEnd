import { localAxios } from "@/util/http-commons";

const local = localAxios();

function listPlan(param, success, fail){
  local.get(`/plan/list`, { params: param }).then(success).catch(fail);
}

export {listPlan};
