<script setup>
import { ref, onMounted } from "vue";
import { getAttractionDetail } from "@/api/attraction";

const attractionDetail = ref({});
const props = defineProps(["contentId"]);

onMounted(() => {
  fetchAttractionDetail();
});

const fetchAttractionDetail = () => {
  getAttractionDetail(
    props.contentId,
    ({ data }) => {
      attractionDetail.value = data;
    },
    (error) => {
      console.error("Error fetching detail:", error);
    }
  );
};
</script>

<template>
  <div class="detail-container">
    <h1>{{ attractionDetail.title }}</h1>
    <img :src="attractionDetail.firstImage" alt="이미지 없음" />
    <p>{{ attractionDetail.overview }}</p>
    <p><strong>주소:</strong> {{ attractionDetail.addr1 }}</p>
    <p><strong>전화번호:</strong> {{ attractionDetail.tel }}</p>
    <a :href="attractionDetail.homepage" target="_blank">공식 홈페이지</a>
  </div>
</template>

<style scoped>
.detail-container {
  padding: 20px;
  max-width: 800px;
  margin: auto;
}

img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}
</style>
