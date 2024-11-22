<script setup >
import { ref, onMounted ,computed} from "vue";
import { getAttractionDetail } from "@/api/attraction";
import keyTranslations from "@/util/keyTranslations.js";
import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps';
// 상태 선언
const attractionDetail = ref({});
const attractionIntro = ref([]);
const attractionImages = ref([]);
const currentIndex = ref(0);
const props = defineProps(["contentId","mapX", "mapY", "title"]);
const showAllIntro = ref(false); // "더보기" 상태 관리
const visibleRef = ref(false);

const mouseOverKakaoMapMarker = ()=> {
visibleRef.value = true;
};


const mouseOutKakaoMapMarker = () => {
visibleRef.value = false;
};
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
const coordinate = computed(() => ({
  lat: parseFloat(attractionDetail.value.mapY) || props.mapY || 37.566826, // 기본값으로 서울의 위도 설정
  lng: parseFloat(attractionDetail.value.mapX) || props.mapX || 126.9786567, // 기본값으로 서울의 경도 설정
}));
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
const likeCount = ref(0); // 좋아요 카운트
const isLiked = ref(false); // 좋아요 상태
const viewCount = ref(0); // 조회수 예시 숫자

// 좋아요 버튼 클릭 시 호출되는 함수
const toggleLike = () => {
  if (isLiked.value) {
    likeCount.value -= 1; // 좋아요 취소
  } else {
    likeCount.value += 1; // 좋아요 증가
  }
  isLiked.value = !isLiked.value; // 상태 토글
};

const newComment = ref(""); // 새 댓글 입력 값
const comments = ref([]); // 댓글 리스트

// 댓글 등록 함수
const addComment = () => {
  if (newComment.value.trim()) {
    comments.value.push({
      text: newComment.value,
      date: new Date().toLocaleString(), // 현재 시간
    });
    newComment.value = ""; // 입력창 초기화
  }
};

</script>

<template>
  <main class="travel-spot">
    <!-- 기존 코드 -->
    <header class="spot-header">
      <h1 class="title">{{ attractionDetail.title }}</h1>
    </header>
    <div class="like-view-container">
    <button class="like-button" @click="toggleLike">
      <span class="like-icon" :class="{ liked: isLiked }">❤️</span>
    </button>
    <span class="like-count">{{ likeCount }}</span>
    <span class="view-count"><strong>조회수: {{ viewCount }}</strong></span>
  </div>
    <div class="section-dividertitle"></div>
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
      <div class="section-divider"></div>
      <p class="detail-text">{{ attractionDetail.overview }}</p>
      <p><strong>주소:</strong> {{ attractionDetail.address }}</p>
      <p><strong>전화번호:</strong> {{ attractionDetail.tel }}</p>
      <!-- <a :href="attractionDetail.homepage">공식 홈페이지</a> -->
    
      <!-- 지도 -->
      <div class="map-container">
         <!-- 카카오맵을 표시할 div -->
         <KakaoMap :lat="coordinate.lat" :lng="coordinate.lng" :draggable="true" :width="'50rem'" :height="'25rem'">
            <KakaoMapMarker :lat="coordinate.lat" :lng="coordinate.lng" :clickable="true" 
            :infoWindow="{ content: attractionDetail.title, visible: visibleRef }" 
            @mouseOverKakaoMapMarker="mouseOverKakaoMapMarker"
            @mouseOutKakaoMapMarker="mouseOutKakaoMapMarker"
            :image="{imageSrc: 'https://cdn.icon-icons.com/icons2/317/PNG/512/map-marker-icon_34392.png',
            imageWidth: 50,imageHeight: 50,imageOption: {}}"></KakaoMapMarker>
        </KakaoMap>
      </div>

      <!-- 세부정보 -->
      <div class="info-container">
      <section class="spot-details">
      <ul>
        <!-- 최대 10개까지만 표시 -->
        <li
          v-for="(item, index) in attractionIntro.slice(0, showAllIntro ? attractionIntro.length : 5)"
          :key="index"
        >
          <strong>{{ item.label }}:</strong> {{ item.value }}
        </li>
      </ul>
      <!-- 더보기 버튼 -->
      <button v-if="attractionIntro.length > 5" @click="toggleShowAllIntro" class="toggle-button">
        {{ showAllIntro ? "닫기-" : "더보기+" }}
      </button>
    </section>
     </div>
    </section>
    <!-- 댓글 창  -->
    <section class="comment-section">
      <h2 class="comment-title">댓글</h2>
      <textarea
        v-model="newComment"
        placeholder="소중한 댓글을 남겨주세요."
        class="comment-input"
      ></textarea>
      <button @click="addComment" class="comment-button">등록</button>
      <!-- 댓글 정보 가져오는 div -->
      <div v-if="comments.length > 0" class="comment-list">
        <div
          class="comment-item"
          v-for="(comment, index) in comments"
          :key="index"
        >
          <p class="comment-text">{{ comment.text }}</p>
          <small class="comment-date">{{ comment.date }}</small>
        </div>
      </div>
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
  font-style: italic;
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

  .toggle-button {
  background-color: white; /* 배경색 흰색 */
  color: black; /* 글자색 검정 */
  border: 1px solid white; /* 버튼 테두리 추가 */
  border-radius: 5px; /* 모서리를 약간 둥글게 설정 */
  padding: 10px 15px; /* 버튼 안쪽 여백 */
  cursor: pointer; /* 마우스를 올리면 클릭 가능 표시 */
  font-size: 16px; /* 글자 크기 */
  font-weight: bold; /* 글자 굵게 */
  transition: all 0.3s ease; /* 애니메이션 효과 */
}
.section-divider {
  width: 100%;
  height: 4px; /* 굵기 */
  background-color: #333; /* 선 색상 */
  margin: 20px 0; /* 위아래 여백 */
}
.section-dividertitle{
  width: 100%;
  height: 4px; /* 굵기 */
  background-color: #333; /* 선 색상 */
  margin: 50px 0; /* 위아래 여백 */
}

.info-container li {
  margin-bottom: 8px;
  line-height: 2.6;
  
}

.info-container li strong {
  color: #333;
}
.like-view-container {
  position: absolute; /* 위치를 절대값으로 설정 */
  margin-top : 190px; /* section-divider-title 위로 이동 */
  margin-left: 555px;
  left: 0; /* 왼쪽 끝으로 배치 */
  display: flex;
  align-items: center;
  gap: 10px; /* 하트와 텍스트 사이 간격 */
}

.section-dividertitle {
  position: relative; /* 자식 요소(.like-view-container)의 기준 위치 설정 */
  width: 100%;
  height: 4px;
  background-color: #333;
  margin: 90px 0;
}

.like-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.like-icon {
  font-size: 24px;
  color: #ccc;
  transition: color 0.3s ease;
}

.like-icon.liked {
  color: red;
}

.like-count {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.view-count {
  font-size: 16px;
  color: #666;
}

/* 댓글 css */
.comment-section {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
}

.comment-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.comment-input {
  width: 100%;
  height: 80px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: none;
  font-size: 14px;
  margin-bottom: 10px;
}

.comment-button {
  display: block;
  background-color: navy;
  color: white;
  margin-left: 685px;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
}

.comment-button:hover {
  background-color: #0056b3;
}

.comment-list {
  margin-top: 20px;
}

.comment-item {
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
}

.comment-text {
  font-size: 14px;
  color: #333;
}

.comment-date {
  font-size: 12px;
  color: #888;
}

/* 버튼 호버 효과 */
/* .toggle-button:hover {
  background-color: black; 
  color: white; 
} */

</style>