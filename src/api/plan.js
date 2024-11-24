import { localAxios } from "@/util/http-commons";

const local = localAxios();

function listPlan(param, success, fail){
  local.get(`/plan/list`, { params: param }).then(success).catch(fail);
}

// 여행 플랜 생성 요청
function createPlan(planData, success, fail) {
  local.post(`/plan/create`, planData).then(success).catch(fail);
}


function getPlan(planId, success, fail) {
  local.get(`/plan/get/${planId}`).then(success).catch(fail);
}
  
function searchList(param, success, fail) {
  local.get(`/trip/searchlist`, { params: param }).then(success).catch(fail);
}

export {listPlan,createPlan, getPlan, searchList};
