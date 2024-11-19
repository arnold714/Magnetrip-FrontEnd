import { localAxios } from "@/util/http-commons";

const local = localAxios();

function listSido(success, fail) {
  local.get(`/map/sido`).then(success).catch(fail);
}
function listTheme(success, fail) {
  local.get(`/map/theme`).then(success).catch(fail);
}
export { listSido, listTheme };
