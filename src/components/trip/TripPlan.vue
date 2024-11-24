<script setup>
import { ref, onMounted } from "vue"
import { listPlan } from "@/api/plan"
import VPageNavigation from "@/components/common/VPageNavigation.vue";

const plans = ref([])

const currentPage = ref(1);
const totalPage = ref(0);
const { VITE_ARTICLE_LIST_SIZE } = import.meta.env;

const param = ref({
  pgno: currentPage.value,
  spp: VITE_ARTICLE_LIST_SIZE,
});

onMounted(() => {
  getPlanList()
});

const getPlanList = () => {
  console.log("서버에서 여행지 얻어오자!!!", param.value);
  listPlan(
    param.value,
    ({ data }) => {
      plans.value = data.plans;
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
  getPlanList();
};

</script>

<template>
  <section class="hero-section">
    <img
      loading="lazy"
      src="@/assets/background.png"
      class="hero-background"
      alt="Background Image"
    />
    <main class="hero-content">
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/29b55af8a06640f6ab071ae22829d009/c1c323767df9a3f68658578898f1e6ae1faee56bab60ca41aef87df53e9325e8?apiKey=29b55af8a06640f6ab071ae22829d009&"
        class="hero-overlay"
        alt="Hero Overlay"
      />
      <article class="logo-container">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/29b55af8a06640f6ab071ae22829d009/d3e71c3a2a735342a806d850094903039ca30d6aca389766bd4a77f43ffaa40d?apiKey=29b55af8a06640f6ab071ae22829d009&"
          class="logo-primary"
          alt="Company Logo"
        />
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/29b55af8a06640f6ab071ae22829d009/46801a5a1b0864b759f4aa497d01b37758a3637e8dccedc86bfc1f6b26765b90?apiKey=29b55af8a06640f6ab071ae22829d009&"
          class="logo-secondary"
          alt="Company Name"
        />
      </article>
      <router-link :to="{name: 'trip-newplan'}">
        <button class="create-course-btn" tabindex="0">
          <span>코스만들기</span>
        </button>
      </router-link>
    </main>
  </section>
  <section class="regional-courses">
    <h2 class="regional-title">나의 여행계획</h2>
    <nav class="navigation-menu">
      <button class="nav-item" tabindex="0">전체</button>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/29b55af8a06640f6ab071ae22829d009/275459b6c70c8a85b10f37f09d142c666f9d4269eb3a3c97772c4614449c2ff6?apiKey=29b55af8a06640f6ab071ae22829d009&"
        class="nav-icon"
        alt=""
      />
      <button class="nav-item" tabindex="0">전체</button>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/29b55af8a06640f6ab071ae22829d009/0809d58beb2088a045f70ec59bb882576be2231529a21c26d0420617e6d78ac5?apiKey=29b55af8a06640f6ab071ae22829d009&"
        class="nav-icon"
        alt=""
      />
    </nav>
  </section>
      <div class="travel-container">
          <article class="travel-card"
          v-for="plan in plans"
          :key="plan.planId">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/29b55af8a06640f6ab071ae22829d009/641ce23ee1c93442f86af4460c3fb34ecb5a7a821ed9f8cbed9763ecf963df70?apiKey=29b55af8a06640f6ab071ae22829d009&"
              class="destination-image"
              alt="이미지 없음"
            />
            <section class="travel-details">
              <span class="duration-badge">{{plan.tripDay}}</span>
              <h2 class="destination-title">{{ plan.title }}</h2>
              <p class="location-text">{{plan.sidoName}} {{plan.gugunName}}</p>
              <p class="travel-date">생성일: {{ plan.createdAt }}</p>
            </section>
          </article>
      </div>
    <div class="pagination-wrapper">
      <VPageNavigation
        :current-page="currentPage"
        :total-page="totalPage"
        @pageChange="onPageChange"
      ></VPageNavigation>
    </div>
</template>

<style scoped>
.pagination-wrapper{
  padding-bottom: 30px;
}
.travel-date {
  font: 300 14px/1.5 'Noto Sans KR', sans-serif; /* 글씨체와 크기 설정 */
  color: #888; /* 날짜 텍스트 색상 */
  margin-top: 5px; /* 제목과의 간격 */
}

  .travel-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4개의 열 생성 */
  gap: 20px; /* 카드 간격 */
  padding: 50px 360px 20px 360px; /* 전체 컨테이너 패딩 */
}

.travel-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: #fff; /* 카드 배경 */
  border-radius: 8px; /* 카드 모서리 둥글게 */
  overflow: hidden; /* 내부 내용 잘림 방지 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 카드 그림자 */
  height: 100%; /* 카드의 높이를 부모에 맞춤 */
}

.travel-details {
  padding: 15px; /* 카드 내부 텍스트 패딩 */
  width: 100%; /* 카드 내부에서 너비를 전체로 설정 */
}

.duration-badge {
  display: inline-block;
  background: #567ff2;
  color: #fff;
  padding: 6px 12px;
  border-radius: 4px;
  font: 350 15px/1.5 'Noto Sans KR', sans-serif;
}

.destination-title {
  margin: 10px 0 5px;
  font: 700 18px/1 'Noto Sans KR', sans-serif;
}

.location-text {
  font: 300 16px/1 'Noto Sans KR', sans-serif;
  color: #666;
}

@media (max-width: 991px) {
  .travel-container {
    grid-template-columns: repeat(2, 1fr); /* 작은 화면에서 두 열로 배치 */
  }
}

@media (max-width: 576px) {
  .travel-container {
    grid-template-columns: 1fr; /* 모바일에서 한 열로 배치 */
  }
}


.travel-card {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
}

.travel-details {
  width: 100%;
}

.duration-badge {
  display: inline-block;
  background: #567FF2;
  color: #FFF;
  margin: 15px 0 0;
  padding: 6px 12px;
  border-radius: 4px;
  font: 350 15px/2 'Noto Sans KR', sans-serif;
  letter-spacing: -0.6px;
  text-align: center;
}
.destination-image {
  width: 100%; /* 카드의 너비에 맞춤 */
  height: 200px; /* 고정된 높이 설정 */
  object-fit: cover; /* 이미지를 비율 유지하며 카드에 맞게 자름 */
  object-position: center; /* 중앙 기준으로 잘라냄 */
  border-top-left-radius: 5px; /* 카드의 둥근 모서리에 맞춤 */
  border-top-right-radius: 5px; /* 카드의 둥근 모서리에 맞춤 */
  overflow: hidden; /* 초과 이미지를 숨김 */
}
.destination-title {
  color: #333;
  margin: 16px 0 0;
  font: 700 18px/1 'Noto Sans KR', sans-serif;
  letter-spacing: -0.6px;
}

.location-text {
  color: #666;
  margin: 11px 0 0;
  font: 300 16px/1 'Noto Sans KR', sans-serif;
  letter-spacing: -0.5px;
}

@media (max-width: 991px) {
  .travel-card {
    margin-top: 20px;
  }

  .destination-image {
    padding: 100px 0 0 20px;
  }

  .duration-badge {
    white-space: normal;
  }
}
.regional-courses {
  display: flex;
  width: 100%;
  gap: 20px;
  font-family: Noto Sans KR, sans-serif;
  flex-wrap: wrap;
  padding: 20px 360px 20px 360px;
  justify-content: space-between;
}

@media (max-width: 991px) {
  .regional-courses {
    max-width: 100%;
  }
}

.regional-title {
  color: #333;
  font: 900 28px/1 Noto Sans KR, sans-serif;
  letter-spacing: -1.5px;
  margin: 0;
}

.navigation-menu {
  display: flex;
  gap: 24px;
  margin: auto 0;
}

@media (max-width: 991px) {
  .navigation-menu {
    white-space: initial;
  }
}

.nav-item {
  font: 700 15px/1.4 Noto Sans KR, sans-serif;
  color: #000;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.nav-item:focus {
  outline: 2px solid #000;
  outline-offset: 2px;
}

.nav-icon {
  aspect-ratio: 1.67;
  object-fit: contain;
  object-position: center;
  width: 10px;
  margin: auto 0;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
.hero-section {
  position: relative; /* To position child elements relative to this container */
  min-height: 640px; /* Same as content's minimum height */
  width: 100%;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh; /* Covers the entire viewport height */
  width: 100%;
  object-fit: cover;
  z-index: -1; /* Ensures it's the bottom-most layer */
}

.hero-content {
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 640px;
  width: 1284px;
  max-width: 100%;
  overflow: hidden;
  padding: 97px 65px 213px;
  margin: 0 auto; /* Centers the content horizontally */
  z-index: 1; /* Places content above the background */
}

.hero-overlay {
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: center;
  z-index: 0; /* Overlay above the background but below content */
}

.logo-container {
  position: relative;
  align-self: flex-end;
  display: flex;
  width: 158px;
  max-width: 100%;
  flex-direction: column;
}

.logo-primary {
  aspect-ratio: 1.9;
  object-fit: contain;
  object-position: center;
  width: 100%;
}

.logo-secondary {
  aspect-ratio: 4.05;
  object-fit: contain;
  object-position: center;
  width: 100%;
  margin-top: 6px;
}

.create-course-btn {
  position: relative;
  border-radius: 50px;
  background-color: rgb(65, 108, 230);
  align-self: flex-start;
  display: flex;
  align-items: center; /* 버튼 내 텍스트를 세로 중앙 정렬 */
  justify-content: center; /* 버튼 내 텍스트를 가로 중앙 정렬 */
  overflow: hidden;
  color: rgb(255, 255, 255);
  white-space: nowrap;
  letter-spacing: -1px;
  margin: 146px 0 -43px; /* 필요에 따라 조정 가능 */
  width: 200px; /* 가로 크기 */
  height: 56px; /* 세로 크기 */
  font: 350 21px/3 'Noto Sans KR', sans-serif;
  border: none;
  cursor: pointer;
}

.create-course-btn:hover {
  background-color: rgb(55, 98, 220);
}

.create-course-btn:focus {
  outline: 2px solid rgb(255, 255, 255);
  outline-offset: 2px;
}
.arrow-icon {
  aspect-ratio: 1.5;
  object-fit: contain;
  object-position: center;
  width: 24px;
  align-self: flex-start;
}

@media (max-width: 991px) {
  .hero-section {
    padding: 0 20px;
  }

  .hero-content {
    padding: 0 20px 100px;
  }

  .create-course-btn {
    white-space: initial;
    margin: 40px 0 10px;
    padding: 0 20px;
  }
}
</style>
