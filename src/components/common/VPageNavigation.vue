<script setup>
import { computed } from "vue";

const props = defineProps({ currentPage: Number, totalPage: Number });
const emit = defineEmits(["pageChange"]);

const navigationSize = parseInt(import.meta.env.VITE_ARTICLE_NAVIGATION_SIZE);

const startPage = computed(() => {
  return parseInt((props.currentPage - 1) / navigationSize) * navigationSize + 1;
});

const endPage = computed(() => {
  let lastPage =
    parseInt((props.currentPage - 1) / navigationSize) * navigationSize + navigationSize;
  return props.totalPage < lastPage ? props.totalPage : lastPage;
});

const endRange = computed(() => {
  return parseInt((props.totalPage - 1) / navigationSize) * navigationSize < props.currentPage;
});

function range(start, end) {
  const list = [];
  for (let i = start; i <= end; i++) list.push(i);
  return list;
  //   return Array(end - start + 1)
  //     .fill()
  //     .map((val, i) => start + i);
}

function onPageChange(pg) {
  console.log(pg + "로 이동!!!");
  emit("pageChange", pg);
}
</script>

<template>
  <div class="pagination-container">
    <ul class="pagination">
      <li class="page-item">
        <a class="page-link" @click="onPageChange(startPage == 1 ? 1 : startPage - 1)">&lt;</a>
      </li>
      <template v-for="pg in range(startPage, endPage)" :key="pg">
        <li :class="currentPage === pg ? 'page-item active' : 'page-item'">
          <a class="page-link" @click="onPageChange(pg)">{{ pg }}</a>
        </li>
      </template>
      <li class="page-item">
        <a class="page-link" @click="onPageChange(endRange ? totalPage : endPage + 1)">&gt;</a>
      </li>
    </ul>
  </div>
</template>


<style scoped>
a {
  cursor: pointer;
}
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 10px; /* 페이지 간 간격 */
}

.page-item {
  border: none; /* 버튼 테두리 제거 */
}

.page-link {
  color: black; /* 기본 텍스트 색상 */
  background: none; /* 버튼 배경 제거 */
  border: none; /* 버튼 테두리 제거 */
  text-decoration: none; /* 밑줄 제거 */
  padding: 0.375rem 0.75rem; /* 부트스트랩 기본 여백 유지 */
  transition: color 0.3s; /* 텍스트 색상 변경 시 부드러운 전환 */
  cursor: pointer;
}

.page-item.active .page-link {
  color: #1273e4; /* 현재 페이지 텍스트를 파란색으로 표시 */
  font-weight: bold; /* 현재 페이지 강조 */
}

.page-link:hover {
  color: #1273e4; /* 호버 시 글씨 색상만 파란색으로 변경 */
}

.page-item.disabled .page-link {
  color: #dcdcdc; /* 비활성화된 버튼은 흐리게 표시 */
  cursor: not-allowed;
}



</style>
