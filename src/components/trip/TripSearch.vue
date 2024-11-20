<script setup>
import { ref, onMounted } from "vue"
import { listSido, listTheme } from "@/api/sido"
import { listAttraction } from "@/api/attraction"

const sidoList = ref([])
const themeList = ref([])
const attractions = ref([])

const currentPage = ref(1);
const totalPage = ref(0);
const { VITE_ARTICLE_LIST_SIZE } = import.meta.env;

const param = ref({
  pgno: currentPage.value,
  spp: VITE_ARTICLE_LIST_SIZE,
  word: "",
  area: "",
  theme: "",
});

onMounted(() => {
  getSidoList(),
  getThemeList()
});

const getSidoList = () => {
  listSido(
    ({ data }) => {
      let options = []
      options.push({ text: "전국", value: "" })
      data.forEach((sido) => {
        options.push({ text: sido.sidoName, value: sido.sidoCode })
      })
      sidoList.value = options
    },
    (err) => {
      console.log(err)
    }
  )
}
const getThemeList = () => {
  listTheme(
    ({ data }) => {
      let options = []
      options.push({ text: "선택 없음", value: "" })
      data.forEach((content) => {
        options.push({ text: content.themeName, value: content.themeId})
      })
      themeList.value = options
    },
    (err) => {
      console.log(err)
    }
  )
}

const getAttractionList = () => {
  console.log("서버에서 여행지 얻어오자!!!", param.value);
  listAttraction(
    param.value,
    ({ data }) => {
      attractions.value = data.attractions;
      currentPage.value = data.currentPage;
      totalPage.value = data.totalPageCount;
    },
    (error) => {
      console.log(error);
    }
  );
};
// const onPageChange = (val) => {
//   console.log(val + "번 페이지로 이동 준비 끝!!!");
//   currentPage.value = val;
//   param.value.pgno = val;
//   getAttractionList();
// };
</script>

<template>
  <header class="hero-section">
    <img src="https://cdn.builder.io/api/v1/image/assets/29b55af8a06640f6ab071ae22829d009/434a16b8614b52eb37d5f0125cc5e9df45bafe21e23367a7b1ad053b74d5c165?apiKey=29b55af8a06640f6ab071ae22829d009&" class="hero-background" alt="" />
    <div class="content-wrapper">
      <h1 class="hero-title">
        둘도없는 친구끼리<br />여행할때 매그네트립
      </h1>
      <section class="search-section">
        <nav class="tab-navigation">
          <ul class="tab-list">
            <li class="tab-item active">국내 여행</li>
          </ul>
          <div class="active-tab-indicator"></div>
        </nav>
        <form class="search-form">
          <div class="input-bar">
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/29b55af8a06640f6ab071ae22829d009/b9c4996508e9df80e700218c91f0943d8b46dddf92c715c022fa07150b7da06a?apiKey=29b55af8a06640f6ab071ae22829d009&" class="search-icon" alt="Search icon" />
            <label for="searchInput" class="visually-hidden">검색어를 입력하세요</label>
            <input type="text" v-model="param.word" id="searchInput" class="search-input" placeholder="검색어를 입력하세요" />
          </div>
          <div class="select-bar">
            <label for="citySelect" class="visually-hidden" >시를 선택하세요</label>
            <select id="citySelect" class="search-select" v-model="param.area">
              <option v-for="option in sidoList"
              :key="option.value"
              :value="option.value">
              {{ option.text }}
              </option>
            </select>
          </div>
          <div class="select-bar">
            <label for="themeSelect" class="visually-hidden">테마를 선택하세요</label>
            <select id="themeSelect" class="search-select" v-model="param.theme">
              <option v-for="option in themeList"
              :key="option.value"
              :value="option.value">
              {{ option.text }}
              </option>
            </select>
          </div>
          <button type="button" class="search-button" @click="getAttractionList">검색</button>
        </form>
      </section>
    </div>
  </header>
  <body class="festival-header">
      <h2 class="festival-title">
        인기<span class="festival-title-light">여행지 알려드릴게요!</span>
      </h2>
      <div class="temple-container">
      <article class="temple-card" 
      v-for="attraction in attractions"
      :key="attraction.contentId">
      <img
        loading="lazy"
        :src="attraction.firstImage1"
        class="temple-image"
        alt="이미지 없음"
      />
        <h2 class="temple-name">{{attraction.title}}</h2>
        <p class="temple-tags">{{ attraction.contentTypeName }}</p>
        <p class="temple-location">{{ attraction.sidoName }} {{ attraction.gugunName }}</p>
      </article>
  </div>
    </body>

</template>

<style scoped>
.temple-container {
  display: flex;
  flex-wrap: wrap;
  gap: 55px; /* 요소 간의 간격 */
  padding: 0 360px;
  margin: 20px 0;
  justify-content: flex-start; /* 양 끝에 요소 배치 */
  box-sizing: border-box;
}

.temple-card {
  width: 250px; /* 고정 너비 */
  height: 350px; /* 고정 높이 */
  border-radius: 5px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(149, 157, 165, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between; /* 상하 균등 정렬 */
  overflow: hidden; /* 내용이 넘칠 경우 숨김 */
  text-align: center;
}


.temple-image {
  width: 100%; /* 카드의 너비에 맞춤 */
  height: 200px; /* 고정된 높이 설정 */
  object-fit: cover; /* 이미지를 비율 유지하며 카드에 맞게 자름 */
  object-position: center; /* 중앙 기준으로 잘라냄 */
  border-top-left-radius: 5px; /* 카드의 둥근 모서리에 맞춤 */
  border-top-right-radius: 5px; /* 카드의 둥근 모서리에 맞춤 */
  overflow: hidden; /* 초과 이미지를 숨김 */
}


.temple-name {
  color: #333;
  font-size: 18px;
  font-weight: 700;
  line-height: 1; /* 줄 간격 조정 */
  margin: 0; /* 위아래 여백 완전히 제거 */
}

.temple-tags {
  font-size: 14px;
  font-weight: 300;
  line-height: 1; /* 줄 간격 조정 */
  margin: 0; /* 위아래 여백 완전히 제거 */
}


.festival-header {
  margin: 0;
  padding: 0;
}

.festival-title {
  color: #000;
  font: 900 28x/1.1 'Noto Sans KR', sans-serif;
  margin: 48px 360px;
}

.festival-title-light {
  font-weight: 350;
}
.hero-section {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 464px;
  padding: 121px 0px 70px;
  font-family: Inter, sans-serif;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content-wrapper {
  padding: 0px 360px 0px;
  position: relative;
  width: 100%;
}

.hero-title {
  color: #fff;
  font-size: 30px;
  font-weight: 700;
  line-height: 44px;
  margin: 0 0 40px;
}

.search-section {
  border-radius: 16px;
  background-color: #fff;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
  padding: 0 20px 14px;
  font-size: 15px;
}

.tab-navigation {
  padding: 27px 80px 1px 0;
}

.tab-list {
  display: flex;
  list-style: none;
  margin: 0 0 0 16px;
  padding: 0;
  gap: 20px;
}

.tab-item {
  color: #707070;
  font-weight: 500;
  cursor: pointer;
}

.tab-item.active {
  color: #1273e4;
  font-weight: 700;
}

.active-tab-indicator {
  background-color: #1273e4;
  width: 91px;
  height: 2px;
  margin-top: 25px;
}

.search-form {
  display: flex;
  margin-top: 20px;
  gap: 12px;
  color: #333;
  font-weight: 600;
  flex-wrap: wrap;
}

.input-bar {
  display: flex;
  align-items: center;
  border-radius: 8px;
  background-color: #f5f5f5;
  padding: 14px;
  flex: 2;
}

.search-input {
  border: none;
  background: transparent;
  color: #333;
  font-size: 15px;
  font-weight: 400;
  width: 100%;
  outline: none;
}

.select-bar {
  display: flex;
  align-items: center;
  border-radius: 8px;
  background-color: #f5f5f5;
  padding: 14px;
  flex: 1;
}

.search-select {
  border: none;
  background: transparent;
  color: #333;
  font-size: 15px;
  font-weight: 400;
  width: 100%;
}

.search-button {
  border-radius: 10px;
  background-color: #1273e4;
  color: #fff;
  font-weight: 600;
  padding: 17px 47px;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 991px) {
  .hero-section {
    padding: 100px 20px 0;
  }

  .tab-navigation {
    padding-right: 20px;
  }

  .tab-list {
    margin-left: 10px;
  }

  .search-button {
    padding: 17px 20px;
  }
}
</style>
