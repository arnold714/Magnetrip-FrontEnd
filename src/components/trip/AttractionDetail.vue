<script setup>
import { ref, onMounted } from "vue";
import { getAttractionDetail } from "@/api/attraction";

const attractionDetail = ref({});
const attractionIntro = ref({});
const attractionImages = ref([]);
const currentIndex = ref(0);
const props = defineProps(["contentId"]);

onMounted(() => {
  fetchAttractionDetail();
});

const fetchAttractionDetail = () => {
  getAttractionDetail(
    props.contentId,
    ({ data }) => {
      const detailCommon = JSON.parse(data.detailCommon);
      const detailIntro = JSON.parse(data.detailIntro);
      const detailImg = JSON.parse(data.detailImg);

      const commonItem = detailCommon.response.body.items.item[0];
      attractionDetail.value = {
        title: commonItem.title || "정보 없음",
        overview: commonItem.overview || "정보 없음",
        address: commonItem.addr1 || "정보 없음",
        tel: commonItem.tel || "정보 없음",
        homepage: commonItem.homepage || "#",
      };

      const introItem = detailIntro.response.body.items.item[0];
      attractionIntro.value = {
        useTime: introItem.usetime || "정보 없음",
        restDate: introItem.restdate || "정보 없음",
        infoCenter: introItem.infocenter || "정보 없음",
        parking: introItem.parking || "정보 없음",
      };

      attractionImages.value = detailImg.response.body.items.item.map((img) => ({
        url: img.originimgurl,
        name: img.imgname || "이미지 없음",
      }));
    },
    (error) => {
      console.error("Error fetching detail:", error);
    }
  );
};

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % attractionImages.value.length;
};

const prevSlide = () => {
  currentIndex.value =
    (currentIndex.value - 1 + attractionImages.value.length) %
    attractionImages.value.length;
};
</script>


<template>
  <main class="travel-spot">
    <header class="spot-header">
      <h1 class="title">{{ attractionDetail.title }}</h1>
    </header>

    <section class="spot-gallery">
      <div class="slider-container">
        <div class="slider">
          <img
            v-for="(image, index) in attractionImages"
            :key="index"
            :src="image.url"
            :alt="image.name"
            class="slider-image"
            v-bind:style="{ transform: `translateX(-${currentIndex * 100}%)` }"
          />
        </div>
        <button class="prev-button" @click="prevSlide">〈</button>
        <button class="next-button" @click="nextSlide">〉</button>
        <div class="image-counter">
          {{ currentIndex + 1 }} / {{ attractionImages.length }}
        </div>
      </div>
    </section>

    <section class="spot-details">
      <h2 class="section-title">상세정보</h2>
      <p class="detail-text">{{ attractionDetail.overview }}</p>
      <p><strong>주소:</strong> {{ attractionDetail.address }}</p>
      <p><strong>전화번호:</strong> {{ attractionDetail.tel }}</p>
      <a :href="attractionDetail.homepage" target="_blank" class="homepage-link">
        공식 홈페이지
      </a>
    </section>
  </main>
</template>


<style scoped>
.travel-spot {
  max-width: 800px;
  margin: 0 auto;
}

.title {
  text-align: center;
  font-size: 24px;
  margin: 20px 0;
}

.spot-gallery {
  position: relative;
  margin-top: 10px; /* 간격을 줄였습니다 */
}

.slider-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 400px;
}

.slider {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.slider-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.prev-button,
.next-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%; /* 동그란 버튼 */
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
}

.prev-button {
  left: 10px;
}

.next-button {
  right: 10px;
}

.image-counter {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
}

.spot-details {
  margin-top: 20px; /* 간격 조정 */
}

.section-title {
  font-size: 20px;
  margin-bottom: 10px;
}

.detail-text {
  font-size: 16px;
  line-height: 1.6;
}
</style>
