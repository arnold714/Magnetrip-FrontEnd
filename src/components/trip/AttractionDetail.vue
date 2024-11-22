<script setup>
import { ref, onMounted } from "vue";
import { getAttractionDetail } from "@/api/attraction";
import keyTranslations from "@/util/keyTranslations.js";

// 상태 선언
const attractionDetail = ref({});
const attractionIntro = ref([]);
const attractionImages = ref([]);
const currentIndex = ref(0);
const props = defineProps(["contentId","mapX", "mapY", "title"]);
const showAllIntro = ref(false); // "더보기" 상태 관리

onMounted(() => {
  fetchAttractionDetail();
});

// 세부 정보 필터링 함수
const filterIntroData = (introItem) => {
  return Object.entries(introItem)
    .filter(
      ([key, value]) =>
        keyTranslations[key] && // keyTranslations에 매핑된 키만 포함
        value !== null &&
        value.trim() !== "" && value !=="0"// null 또는 빈 값 제외
    )
    .map(([key, value]) => {
      // value 값 처리
      let processedValue = value;

      if (value === "1") {
        processedValue = "가능";
      } else if (key === "eventenddate" || key === "eventstartdate") {
        const year = value.substring(0, 4); // 년
        const month = value.substring(4, 6); // 월
        const day = value.substring(6, 8); // 일
        processedValue = `${year}년 ${month}월 ${day}일`;
      } else {
        // <br>을 공백으로 대체
        processedValue = value.replace(/<br\s*\/?>/gi, " ");
      }

      return {
        key,
        label: keyTranslations[key],
        value: processedValue,
      };
    });
};



// 데이터 가져오기
const fetchAttractionDetail = () => {
  getAttractionDetail(
    props.contentId,
    ({ data }) => {
      const detailCommon = JSON.parse(data.detailCommon);
      const detailIntro = JSON.parse(data.detailIntro);
      const detailImg = JSON.parse(data.detailImg);

      // 공통 데이터
      const commonItem = detailCommon.response.body.items.item[0];
      attractionDetail.value = {
        title: commonItem.title || "정보 없음",
        firstImage: commonItem.firstimage || "",
        overview: commonItem.overview || "정보 없음",
        address: commonItem.addr1 || "정보 없음",
        tel: commonItem.tel || "정보 없음",
        homepage: commonItem.homepage || "#",
        mapX: commonItem.mapx,
        mapY: commonItem.mapy,
      };

      // intro 데이터 필터링
      const introItem = detailIntro.response.body.items.item[0];
      attractionIntro.value = filterIntroData(introItem);

      // 이미지 데이터
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

// "더보기" 상태 토글
const toggleShowAllIntro = () => {
  showAllIntro.value = !showAllIntro.value;
};
const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % attractionImages.value.length;
  const slider = document.querySelector(".slider");
  slider.style.transform = `translateX(-${currentIndex.value * 100}%)`;
};

const prevSlide = () => {
  currentIndex.value =
    (currentIndex.value - 1 + attractionImages.value.length) %
    attractionImages.value.length;
  const slider = document.querySelector(".slider");
  slider.style.transform = `translateX(-${currentIndex.value * 100}%)`;
};


let map; // 카카오 맵 객체
let marker; // 마커 객체

onMounted(() => {
  if (window.kakao && window.kakao.maps) {
    initMap();
  } else {
    // 카카오 맵 스크립트 로드
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${
      import.meta.env.VITE_KAKAO_MAP_SERVICE_KEY
    }`;
    script.onload = () => kakao.maps.load(() => initMap());
    document.head.appendChild(script);
  }
});

const initMap = () => {
  const container = document.getElementById("map"); // map-container와 연결
  const options = {
    center: new kakao.maps.LatLng(props.mapY, props.mapX), // mapX, mapY를 기준으로 지도 중앙 설정
    level: 3, // 지도 확대 레벨
  };
  map = new kakao.maps.Map(container, options);

  // 마커 생성 및 지도에 추가
  marker = new kakao.maps.Marker({
    position: new kakao.maps.LatLng(props.mapY, props.mapX), // 마커 위치 설정
    map: map, // 마커를 표시할 지도
    title: props.title || "위치", // 마커 제목
  });

  // 지도에 마커를 추가
  marker.setMap(map);
};

</script>

<template>
  <main class="travel-spot">
    <!-- 기존 코드 -->
    <header class="spot-header">
      <h1 class="title">{{ attractionDetail.title }}</h1>
    </header>

    <section class="gallery-section">
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

    <!-- 상세 정보 -->
    <section class="spot-details">
      <h2 class="section-title">상세정보</h2>
      <p class="detail-text">{{ attractionDetail.overview }}</p>
      <p><strong>주소:</strong> {{ attractionDetail.address }}</p>
      <p><strong>전화번호:</strong> {{ attractionDetail.tel }}</p>
      <a :href="attractionDetail.homepage" target="_blank" class="homepage-link">공식 홈페이지</a>

      <!-- 지도 -->
      <div class="map-container">
         <!-- 카카오맵을 표시할 div -->
        <div id="map"></div>
      </div>

      <!-- 세부정보 -->
      <section class="spot-details">
      <h2 class="section-title">세부정보</h2>
      <ul>
        <!-- 최대 10개까지만 표시 -->
        <li
          v-for="(item, index) in attractionIntro.slice(0, showAllIntro ? attractionIntro.length : 10)"
          :key="index"
        >
          <strong>{{ item.label }}:</strong> {{ item.value }}
        </li>
      </ul>
      <!-- 더보기 버튼 -->
      <button v-if="attractionIntro.length > 10" @click="toggleShowAllIntro">
        {{ showAllIntro ? "접기" : "더보기" }}
      </button>
    </section>
    </section>
  </main>
</template>

  
  <style scoped>
  .travel-spot {
    max-width: 800px;
    margin: auto auto; /* 가운데 정렬 */
    
    display: flex;
    flex-direction: column;
  }
  
  /* 기존 스타일 유지 */
  .spot-header {
    width: 100%;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: Noto Sans KR, sans-serif;
    color: #666;
    font-weight: 350;
    line-height: 1.4;
  }
  #map {
  width: 100%;
  height: 500px; /* 지도의 높이를 조정 */
}

.map-container {
  margin-top: 20px;
}

  
  
  .location-info {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
  }
  
  .category-wrapper {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .category-icon {
    width: 26px;
    aspect-ratio: 1.08;
    object-fit: contain;
  }
  
  .bookmark-icon {
    width: 25px;
    aspect-ratio: 0.71;
    object-fit: contain;
  }
  
  .title {
  font-size: 33px;
  font-weight: bold;
  margin-bottom: 10px;
  margin-top: 100px;
  text-align: center;
}
  
  .spot-location {
    font-size: 16px;
    text-align: center;
    margin: 17px 0 0;
  }
  
  .spot-description {
    font-size: 28px;
    color: #333;
    font-weight: 700;
    text-align: center;
    letter-spacing: -1px;
    margin: 34px 0 0;
    padding: 5px 16px;
    max-width: 344px;
  }
  
  .engagement-stats {
    margin-top: 50px;
    width: 100%;
    padding: 0 20px;
    font-family: Noto Sans KR, sans-serif;
  }
  
  .stats-container {
    display: flex;
    gap: 55px;
    font-size: 15px;
    color: #666;
    font-weight: 300;
  }
  
  .views-count {
    display: flex;
    align-items: center;
    gap: 11px;
  }
  
  .views-icon {
    width: 21px;
    aspect-ratio: 1.1;
    object-fit: contain;
  }
  /* 사진하고 헤더 간격 */
  .spot-gallery {
    position: relative;
    min-height: 600px;
    margin-top: 60px;
    overflow: hidden;
    margin-left : 60px;
    text-align: center;
  }
  
  .gallery-image {
    position: absolute;
    inset: 0;
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
  
  .image-counter {
    position: absolute;
    top: 30px;
    right: 30px;
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    padding: 10px 19px;
    border-radius: 50px;
    font-size: 16px;
  }
  
  .gallery-nav {
    position: absolute;
    bottom: 294px;
    right: 30px;
    width: 40px;
    aspect-ratio: 1;
    object-fit: contain;
  }
  
  .divider {
    width: 100%;
    aspect-ratio: 4.81;
    object-fit: contain;
    margin-top: 20px;
  }
  
  .spot-details {
    margin-top: 10px;
    width: 100%;
    padding: 0 20px;
  }
  
  .section-title {
    color: #333;
    font: 900 24px/1 Noto Sans KR, sans-serif;
    letter-spacing: -1px;
    padding: 38px 0 15px;
  }
  /* 상세정보와 상세 글 사이 간격 */
  .detail-text {
    color: #333;
    font: 350 18px/31px Noto Sans KR, sans-serif;
    letter-spacing: -1px;
    margin-top: 40px;
  }
  
  .map-container {
    margin-top: 70px;
    border: 1px solid #e6e6e6;
    position: relative;
    min-height: 298px;
  }
  
  .map {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .map-controls {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    display: flex;
    flex-wrap: wrap;
  }
  
  .control-icon {
    width: 62px;
    aspect-ratio: 0.32;
    object-fit: contain;
  }
  
  .zoom-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 9px;
  }
  
  .zoom-icon {
    width: 30px;
    aspect-ratio: 0.65;
    object-fit: contain;
  }
  
  .map-scale {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    font: 700 9px/2 Inter, sans-serif;
    color: #000;
  }
  
  .scale-icon {
    width: 62px;
    aspect-ratio: 0.57;
    object-fit: contain;
  }
  
  .scale-info {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .scale-line {
    width: 32px;
    aspect-ratio: 3.19;
    object-fit: contain;
  }
  
  .contact-info {
    margin-top: 44px;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: space-between;
    font: 700 15px Noto Sans KR, sans-serif;
  }
  
  .info-group {
    display: flex;
    flex-direction: column;
    color: #333;
    line-height: 1.4;
  }
  
  .address-title {
    margin-top: 59px;
  }
  
  .info-content {
    display: flex;
    flex-direction: column;
    color: #666;
    font-weight: 350;
  }
  
  .contact-details {
    line-height: 21px;
  }
  
  .address-details {
    margin-top: 35px;
    line-height: 1.4;
  }
  
  .website-hours {
    display: flex;
    flex-direction: column;
    font-weight: 350;
    line-height: 1.4;
  }
  
  .website-group {
    display: flex;
    gap: 5px;
    margin-bottom: 5px;
  }
  
  .website-label {
    color: #666;
  }
  
  .website-link {
    color: #333;
    text-decoration: none;
  }
  
  .templestay {
    display: flex;
    flex-direction: column;
  }
  
  .unit {
    color: #333;
    margin-top: 11px;
  }
  
  .hours-info {
    color: #666;
    line-height: 21px;
    margin-top: 17px;
  }
  .slider-container {
  position: relative;
  overflow: hidden; /* 컨테이너를 넘어가는 이미지를 숨김 */
  width: 100%;
  height: 700px; /* 이미지 높이를 더 크게 설정 */
}

.gallery-section {
  position: relative;
  margin: 20px 0;
}

.slider {
  display: flex;
  transition: transform 0.5s ease-in-out;
  width: 100%;
}

.slider-image {
  min-width: 100%; /* 각 이미지를 슬라이더 컨테이너의 너비에 맞춤 */
  height: 700px; /* 슬라이더 높이에 맞게 이미지 크기 조정 */
  object-fit: cover; /* 이미지 비율을 유지하며 컨테이너에 맞춤 */
}

.prev-button,
.next-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  font-size: 24px;
  padding: 10px;
  cursor: pointer;
  z-index: 2;
}

.prev-button {
  left: 10px;
}

.next-button {
  right: 10px;
}


  @media (max-width: 991px) {
    .spot-header,
    .spot-details{
      margin-bottom: 500px;
    }
    .engagement-stats {
      max-width: 100%;
    }
  
    .spot-gallery {
      margin-top: 40px;
      padding: 0 20px 100px;
    }
  
    .gallery-nav {
      margin: 40px 2px 10px 0;
    }
  
    .divider,
    .map-container {
      max-width: 100%;
    }
  
    .map-container {
      margin-top: 40px;
    }
  
    .detail-text {
      margin: 40px 4px 0 0;
    }
  
    .address-title {
      margin-top: 40px;
    }
  
    .section-title,
    .image-counter {
      padding-right: 20px;
    }
  }

  button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

</style>