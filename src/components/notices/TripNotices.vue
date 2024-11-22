<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { listArticle } from "@/api/notices.js";

import VSelect from "@/components/common/VSelect.vue";
import TripNoticesItem from "@/components/notices/item/TripNoticesItem.vue";
import VPageNavigation from "@/components/common/VPageNavigation.vue";

const router = useRouter();

const selectOption = ref([
  { text: "검색조건", value: "" },
  { text: "글번호", value: "notices_no" },
  { text: "제목", value: "subject" },

]);

const articles = ref([]);
const currentPage = ref(1);
const totalPage = ref(0);
const { VITE_ARTICLE_LIST_SIZE } = import.meta.env;
const param = ref({
  pgno: currentPage.value,
  spp: VITE_ARTICLE_LIST_SIZE,
  key: "",
  word: "",
});

onMounted(() => {
  getArticleList();
});

const changeKey = (val) => {
  console.log("BoarList에서 선택한 조건 : " + val);
  param.value.key = val;
};

const getArticleList = () => {
  console.log("서버에서 글목록 얻어오자!!!", param.value);
  listArticle(
    param.value,
    ({ data }) => {
      articles.value = data.articles;
      currentPage.value = data.currentPage;
      totalPage.value = data.totalPageCount;
    },
    (error) => {
      console.log(error);
    }
  );
};

const onPageChange = (val) => {
  console.log(val + "번 페이지로 이동 준비 끝!!!");
  currentPage.value = val;
  param.value.pgno = val;
  getArticleList();
};

const moveWrite = () => {
  router.push({ name: "article-write" });
};
</script>

<template>
  <div class="container">
    <div class="notice-board">


      <ul class="notice-list">
        <li v-for="article in articles" :key="article.noticesNo" class="notice-item">
          <div class="notice-content">
            <!-- contentType에 따라 내용 표시 -->
            <span class="content-type">[{{ article.contentType }}]</span>

            <!-- 제목 -->
            <a :href="'/notices/view/' + article.noticesNo" class="notice-title">{{ article.subject }}</a>
          </div>
          <!-- 작성일 -->
          <div class="notice-date">{{ article.registerTime }}</div>
        </li>
      </ul>

      <VPageNavigation
        :current-page="currentPage"
        :total-page="totalPage"
        @pageChange="onPageChange"
      />
    </div>
  </div>
</template>


<style scoped>
.notice-board {
  margin: 42px auto;
  width: 792px; /* 전체 컨테이너 너비 */
  max-width: 100%;
  font-family: Inter, sans-serif;
  position: relative;
}

.notice-header {
  margin-bottom: 26px;
  text-align: left; /* 왼쪽 정렬 */
  padding: 0 20px; /* 리스트와 동일한 패딩 추가 */
}

.notice-title {
  color: #333;
  font-size: 23px;
  font-weight: 700;
}

.notice-subtitle {
  color: #999;
  font-size: 15px;
  line-height: 2;
  margin-top: 13px;
}

.notice-list {
  background: #fff;
  width: 100%;
  margin: 0; /* 기본 마진 제거 */
  padding: 0 20px; /* 헤더와 동일한 패딩 적용 */
  text-align: left; /* 헤더와 정렬 일치 */
}

.notice-item {
  display: flex;
  justify-content: space-between;
  padding: 24px 0;
  gap: 20px;
  cursor: pointer;
  border-bottom: 1px solid #ddd; /* 구분선을 추가 */
}

.notice-content {
  display: flex;
  align-items: center; /* 수직 정렬 */
  gap: 18px;
  flex: 1; /* 부모 공간에 맞게 확장 */
}

.content-type {
  font-size: 13px;
  font-weight: bold;
  color: #1273e4;
  margin-right: 10px;
  min-width: 60px; /* content-type의 너비를 고정 */
  text-align: center; /* 텍스트 가운데 정렬 */
}

.notice-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  text-decoration: none;
  flex: 1; /* 제목이 flex로 남은 공간을 차지 */
}

.notice-title:hover {
  text-decoration: underline;
}

.notice-date {
  color: #c2c2c2;
  font-size: 12px;
  margin: auto 0;
  text-align: right; /* 날짜는 오른쪽 정렬 */
  min-width: 120px; /* 날짜 칸의 최소 너비 고정 */
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
}

.page-list {
  display: flex;
  gap: 20px;
  list-style: none;
  padding: 0;
}

.page-btn {
  border: none;
  background: none;
  font-size: 12px;
  font-weight: 600;
  color: #000;
  width: 32px;
  height: 32px;
  cursor: pointer;
}

.page-btn.active {
  border-radius: 500px;
  background: #1273e4;
  color: #fff;
}

.nav-btn {
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
}

.nav-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

@media (max-width: 991px) {
  .notice-board {
    margin-top: 40px;
  }

  .notice-list {
    max-width: 100%;
  }

  .notice-item {
    max-width: 100%;
  }
}
</style>
