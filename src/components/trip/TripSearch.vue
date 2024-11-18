<script setup>
import { ref, onMounted } from "vue"
import { listSido } from "@/api/map"

import VKakaoMap from "@/components/common/VKakaoMap.vue"
const { VITE_OPEN_API_SERVICE_KEY } = import.meta.env

const sidoList = ref([])

onMounted(() => {
  getSidoList()
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
            <li class="tab-item active">국내 숙소</li>
          </ul>
          <div class="active-tab-indicator"></div>
        </nav>
        <form class="search-form">
          <div class="input-bar">
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/29b55af8a06640f6ab071ae22829d009/b9c4996508e9df80e700218c91f0943d8b46dddf92c715c022fa07150b7da06a?apiKey=29b55af8a06640f6ab071ae22829d009&" class="search-icon" alt="Search icon" />
            <label for="searchInput" class="visually-hidden">검색어를 입력하세요</label>
            <input type="text" id="searchInput" class="search-input" placeholder="검색어를 입력하세요" />
          </div>
          <div class="select-bar">
            <label for="citySelect" class="visually-hidden" >시를 선택하세요</label>
            <select id="citySelect" class="search-select" v-model="key">
              <option v-for="option in sidoList"
              :key="option.value"
              :value="option.value">
              {{ option.text }}
              </option>
            </select>
          </div>
          <div class="select-bar">
            <label for="themeSelect" class="visually-hidden">테마를 선택하세요</label>
            <select id="themeSelect" class="search-select">
              <option value="" disabled selected>테마를 선택하세요</option>
              <option value="nature">자연</option>
              <option value="city">도시</option>
              <option value="history">역사</option>
            </select>
          </div>
          <button type="submit" class="search-button">검색</button>
        </form>
      </section>
    </div>
  </header>

</template>

<style scoped>
.hero-section {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 464px;
  padding: 121px 80px 70px;
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
  width: 1200px;
  max-width: 100%;
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
