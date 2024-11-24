<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from "vue-router";
import { KakaoMap } from 'vue3-kakao-maps';
import { getPlan,searchList } from '@/api/plan'; // API 호출 함수 가져오기
const isRegionChecked = ref(true); // 체크박스 상태 (기본값: 체크됨)
const searchQuery = ref(''); // 검색어 초기값: 빈 문자열
const selectedCategory = ref('여행지'); // 선택된 카테고리 (기본값: 여행지)
const currentPage = ref(1);
const isLoading = ref(false); // 로딩 상태를 나타내는 플래그
const route = useRoute();
const planId = route.params.planId;
console.log(planId);
const getClassByType = (type) => {
  switch (type) {
    case '관광지':
    case '문화시설':
    case '축제공연행사':
    case '여행코스':
    case '레포츠':
    case '쇼핑':
      return 'type-travel';
    case '음식점':
      return 'type-restaurant';
    case '숙박':
      return 'type-hotel';
    default:
      return 'type-default';
  }
};


// 데이터를 가져오는 함수
const plan = ref({});

const fetchPlan = (planId) => {
  console.log("서버에서 계획 얻어오자!!!", planId);
  getPlan(
    planId,
    ({ data }) => {
      plan.value = data.plan;
      fetchSearchResults();
    },
    (error) => {
      console.log(error);
    }
  );
};

// 컴포넌트가 마운트될 때 데이터를 가져옴
onMounted(() => {
  fetchPlan(planId);
});
const removePlace = (day, contentId) => {
  const targetArray =
    day === 1 ? day1Places.value : day === 2 ? day2Places.value : day3Places.value;
  const index = targetArray.findIndex((place) => place.contentId === contentId);
  if (index !== -1) {
    targetArray.splice(index, 1); // 해당 항목 제거
  }
};


// 두 번째 travel-summary의 가시성 상태를 관리
const isSecondSummaryVisible = ref(false);


// 드래그 앤 드롭을 위한 데이터 구조
const day1Places = ref([
]);

const day2Places = ref([
]);
const day3Places = ref([]); // Day 3에 대한 데이터 배열

const searchResults = ref([]);

const fetchSearchResults = (append = false) => {
  if (isLoading.value) return; // 이미 로딩 중이면 중복 요청 방지
  isLoading.value = true;

  const params = {
    query: searchQuery.value,
    category: selectedCategory.value,
    sidoCode: isRegionChecked.value ? plan.value.areaCode : null,
    gugunCode: isRegionChecked.value ? plan.value.siGunGuCode : null,
    page: currentPage.value, // 현재 페이지
    size: 20, // 한 번에 가져올 데이터 개수
  };

  console.log("서버에서 검색 결과 얻어오자!!!", params);

  searchList(
    params,
    ({ data }) => {
      if (append) {
        // 더보기 버튼을 눌렀을 때 기존 데이터에 추가
        searchResults.value.push(...data.attractions);
      } else {
        // 새로 검색했을 때 데이터 덮어쓰기
        searchResults.value = data.attractions;
      }
      isLoading.value = false;
    },
    (error) => {
      console.log(error);
      isLoading.value = false;
    }
  );
};
// 검색 버튼 클릭 시 호출되는 함수
const onSearchButtonClick = () => {
  currentPage.value = 1; // 페이지를 초기화
  fetchSearchResults(); // 검색 결과 가져오기
};
// 더보기 버튼 클릭 시 호출되는 함수
const loadMoreResults = () => {
  currentPage.value += 1; // 다음 페이지
  fetchSearchResults(true); // 기존 데이터에 추가
};

const handleDragStart = (event, place, sourceDay) => {
  const dragData = {
    place: { ...place },
    sourceDay,
  };
  event.dataTransfer.setData('application/json', JSON.stringify(dragData));
  event.dataTransfer.effectAllowed = 'move';

  event.target.addEventListener('dragend', clearDragStyles);
};

const handleDragOver = (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';

  const dropTarget = event.target.closest('.place-card') || event.target.closest('.day-section');
  clearDragStyles();

  if (dropTarget && dropTarget.classList.contains('day-section')) {
    dropTarget.classList.add('drag-over-empty');
  } else if (dropTarget) {
    const dropRect = dropTarget.getBoundingClientRect();
    const isBottomHalf = event.clientY > dropRect.top + dropRect.height / 2;

    dropTarget.classList.add(isBottomHalf ? 'drag-over-bottom' : 'drag-over-top');
  }
};

const handleDragLeave = (event) => {
  const target = event.target.closest('.place-card, .day-section');
  if (target) {
    target.classList.remove('drag-over-top', 'drag-over-bottom', 'drag-over-empty');
  }
};

const clearDragStyles = () => {
  document.querySelectorAll('.place-card, .day-section').forEach((element) => {
    element.classList.remove('drag-over-top', 'drag-over-bottom', 'drag-over-empty');
  });
};


const handleDrop = (event, targetDay) => {
  event.preventDefault();

  const dragData = JSON.parse(event.dataTransfer.getData('application/json'));
  const { place, sourceDay } = dragData;

  const dropTarget = event.target.closest('.place-card');
  const targetArray =
    targetDay === 1
      ? day1Places.value
      : targetDay === 2
      ? day2Places.value
      : day3Places.value; // Day 3 추가
  const sourceArray =
    sourceDay === 1
      ? day1Places.value
      : sourceDay === 2
      ? day2Places.value
      : day3Places.value; // Day 3 추가

  let dropIndex = targetArray.length; // 기본적으로 마지막에 추가

  if (dropTarget) {
    const dropRect = dropTarget.getBoundingClientRect();
    const isBottomHalf = event.clientY > dropRect.top + dropRect.height / 2;

    // 드롭한 위치의 인덱스를 계산
    dropIndex = Array.from(
      document.querySelectorAll(`.day-section[data-day="${targetDay}"] .place-card`)
    ).indexOf(dropTarget);

    if (isBottomHalf) {
      dropIndex++;
    }
  }

  // 원래 배열에서 제거
  const sourceIndex = sourceArray.findIndex((p) => p.contentId === place.contentId);
  if (sourceIndex !== -1) {
    sourceArray.splice(sourceIndex, 1);
  }

  // 타겟 배열에 추가
  targetArray.splice(Math.min(dropIndex, targetArray.length), 0, { ...place });

  // 드래그 스타일 초기화
  clearDragStyles();
};


const addPlace = () => {
  isSecondSummaryVisible.value = true;
};
</script>

<template>
  <div class="map-container">
    <!-- KakaoMap 지도 -->
    <KakaoMap
      :lat="33.450701"
      :lng="126.570667"
      :level="3"
      style="width: 100%; height: 100%;"
    />

    <!-- 지도 위에 템플릿 오버레이 -->
    <div class="summaries-container">
      <main class="first-travel-summary">
        <header class="header-container">

        </header>

        <section class="content-wrapper">
          <article class="profile-section">
            <router-link :to="{name:'trip-plan'}" class="router-link">
              <div class="back-space">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left-fill" viewBox="0 0 16 16">
                  <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
                </svg>
                매그넷 플래너
              </div>
            </router-link>
            <div class="user-info">

              <div class="user-details">
                <h2 class="username">{{plan.title}}</h2>
                <div class="rating-info">
                </div>
              </div>
            </div>
            <div class="action-buttons">
              <button class="visibility-button">공개</button>
              <button class="visibility-button">멤버 추가하기</button>
            </div>
          </article>
          <section class="trip-details">
            <div class="trip-summary">
              <span class="duration-badge">{{ plan.tripDay }}</span>
              <div class="trip-stats">
                <div class="stat-item">
                  <span class="stat-label">총 이동거리</span>
                  <span class="separator"></span>
                  <span class="stat-value">61km</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">여행지역</span>
                  <span class="separator"></span>
                  <span class="stat-value">{{ plan.sidoName }}<span v-if="plan.gugunName"> ~ {{ plan.gugunName }}</span></span>
                </div>
              </div>
            </div>
          </section>
          <section class="add-button-section">
            <button class="add-place-button" @click="addPlace">여행지 추가<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
</svg></button>
          </section>
          <section
              class="day-section"
              data-day="1"
              @dragover="handleDragOver"
              @dragleave="handleDragLeave"
              @drop="(event) => handleDrop(event, 1)"
              v-if="plan.tripDay === '당일치기' || plan.tripDay === '1박 2일' || plan.tripDay === '2박 3일'"
            >
              <h2 class="day-title">Day 1</h2>
              <article
                v-for="place in day1Places"
                :key="place.contentId"
                class="place-card"
                draggable="true"
                @dragstart="handleDragStart($event, place, 1)"
              >
                <img
                  :src="place.firstImage1"
                  :alt="place.title"
                  class="place-image"
                  loading="lazy"
                />
                <div class="place-info">
                  <span
                    :class="['place-type', getClassByType(place.contentTypeName)]"
                  >
                    {{ place.contentTypeName }}
                  </span>
                  <h3 class="place-name">{{ place.title }}</h3>
                  <address class="place-address">{{ place.addr1 }}</address>
                </div>
                <button
                  class="delete-button"
                  @click="removePlace(1, place.contentId)"
                  aria-label="Delete place"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                  </svg>
                </button>
              </article>

            </section>

            <section
        class="day-section"
        data-day="2"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        @drop="(event) => handleDrop(event, 2)"
        v-if="plan.tripDay === '1박 2일' || plan.tripDay === '2박 3일'"

      >
        <h2 class="day-title">Day 2</h2>
        <article
                v-for="place in day2Places"
                :key="place.contentId"
                class="place-card"
                draggable="true"
                @dragstart="handleDragStart($event, place, 2)"
              >
                <img
                  :src="place.firstImage1"
                  :alt="place.title"
                  class="place-image"
                  loading="lazy"
                />
                <div class="place-info">
                  <span
                    :class="['place-type', getClassByType(place.contentTypeName)]"
                  >
                    {{ place.contentTypeName }}
                  </span>
                  <h3 class="place-name">{{ place.title }}</h3>
                  <address class="place-address">{{ place.addr1 }}</address>
                </div>
                <button
                  class="delete-button"
                  @click="removePlace(2, place.contentId)"
                  aria-label="Delete place"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                  </svg>
                </button>
              </article>
      </section>
      <section
  class="day-section"
  data-day="3"
  @dragover="handleDragOver"
  @dragleave="handleDragLeave"
  @drop="(event) => handleDrop(event, 3)"
  v-if="plan.tripDay === '2박 3일'"
>
  <h2 class="day-title">Day 3</h2>
  <article
                v-for="place in day3Places"
                :key="place.contentId"
                class="place-card"
                draggable="true"
                @dragstart="handleDragStart($event, place, 3)"
              >
                <img
                  :src="place.firstImage1"
                  :alt="place.title"
                  class="place-image"
                  loading="lazy"
                />
                <div class="place-info">
                  <span
                    :class="['place-type', getClassByType(place.contentTypeName)]"
                  >
                    {{ place.contentTypeName }}
                  </span>
                  <h3 class="place-name">{{ place.title }}</h3>
                  <address class="place-address">{{ place.addr1 }}</address>
                </div>
                <button
                  class="delete-button"
                  @click="removePlace(3, place.contentId)"
                  aria-label="Delete place"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                  </svg>
                </button>
              </article>
</section>

      </section>
      </main>

      <main class="second-travel-summary" v-show="isSecondSummaryVisible">
        <section class="content-wrapper">
          <div class="back-space second-summary-header">
            <div class="tabs-container">
              <button class="tab-button">검색결과</button>
              <button class="tab-button">나의 좋아요</button>
            </div>
            <button class="close-button" @click="isSecondSummaryVisible = false">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" stroke="currentColor" stroke-width="2" class="bi bi-x-lg" viewBox="0 0 16 16">
                <path d="M2.146 2.146a.5.5 0 0 1 .708 0L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 1 1-.708-.708L7.293 8 2.146 2.854a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          </div>

          <section class="trip-details-second">
            <div class="search-container">
              <input
                type="text"
                class="search-input"
                placeholder="여행지를 검색하세요..."
                v-model="searchQuery"
              />
              <button class="search-icon-button" @click="onSearchButtonClick">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                </svg>
              </button>
            </div>

            <div class="radio-container">
              <label class="radio-label">
                <input type="radio" name="category" value="여행지" v-model="selectedCategory" />
                <span>여행지</span>
              </label>
              <label class="radio-label">
                <input type="radio" name="category" value="음식점" v-model="selectedCategory" />
                <span>음식점</span>
              </label>
              <label class="radio-label">
                <input type="radio" name="category" value="숙박" v-model="selectedCategory" />
                <span>숙박</span>
              </label>
            </div>

            <!-- 체크박스 추가 -->
            <div class="checkbox-container">
              <label class="checkbox-label">
                <input type="checkbox" v-model="isRegionChecked" checked />
                <span>{{ plan.sidoName }}<span v-if="plan.gugunName"> ~ {{ plan.gugunName }}</span>에서 검색</span>
              </label>
            </div>
          </section>


          <section class="day-section">
            <article v-for="place in searchResults" 
                     :key="place.contentId"
                     class="place-card"
                     draggable="true"
                     @dragstart="handleDragStart($event, place, 0)">
              <img
                :src="place.firstImage1"
                :alt="place.title"
                class="place-image"
                loading="lazy"
              />
              <div class="place-info">
                <span 
                    :class="['place-type', getClassByType(place.contentTypeName)]"
                  >
                    {{ place.contentTypeName }}
                  </span>                <h3 class="place-name">{{ place.title }}</h3>
                <address class="place-address">{{ place.addr1 }}</address>
              </div>
            </article>
            <hr class="divider" />
            <!-- 더보기 버튼 -->
            <button v-if="!isLoading" class="load-more-button" @click="loadMoreResults">더보기</button>
            <div v-else class="loading-indicator">로딩 중...</div>
          </section>
      </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.delete-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: auto;
  display: flex;
  align-items: center;
  color: #333; 
  transition: color 0.3s ease;
}

.delete-button:hover {
  color: #111; 
}

.delete-button svg {
  width: 20px;
  height: 20px;
}

.load-more-button {
  display: block;
  width: 100%;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #09aa70;
  border: 1px solid #09aa70;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  margin: 10px 0;
}

.load-more-button:hover {
  background-color: #f0f0f0;
}

.loading-indicator {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin: 10px 0;
}

.checkbox-container {
  margin-top: 16px;
  margin-left: 27px;
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  accent-color: #09aa70; /* 체크박스 색상 */
  width: 16px;
  height: 16px;
}

.day-section.drag-over-empty {
  border: 2px dashed #09aa70;
  background-color: rgba(9, 170, 112, 0.1);
}

.place-card.drag-over-top {
  border-top: 2px solid #09aa70;
}

.place-card.drag-over-bottom {
  border-bottom: 2px solid #09aa70;
}


.day-section {
  min-height: 100px;
  padding: 20px;
  transition: background-color 0.3s, border 0.3s;
  border: 2px solid transparent;
}

.day-section.drag-over {
  border: 2px dashed #09aa70;
  background-color: rgba(9, 170, 112, 0.1);
}

.place-card {
  cursor: move;
  transition: opacity 0.3s;
}

.place-card:hover {
  opacity: 0.8;
}


.radio-container {
  display: flex;
  justify-content: space-around;
  margin-top: 16px;
}

/* 라디오 버튼과 텍스트 레이블 정렬 */
.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  cursor: pointer;
}

/* 기본 라디오 버튼 스타일 */
.radio-label input[type="radio"] {
  accent-color: #09aa70; /* 라디오 버튼의 체크 색상 */
  width: 16px;
  height: 16px;
  cursor: pointer;
}
.search-container {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  width: 100%; /* 부모 컨테이너와 같은 너비 */
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.search-input {
  flex: 1; /* 입력 필드가 남은 공간을 채움 */
  padding: 8px 12px;
  border: none;
  font-size: 14px;
  outline: none;
}

.search-icon-button {
  color: black;
  border: none;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  background: none;
}


.search-icon-button svg {
  vertical-align: middle;
}
.router-link {
  text-decoration: none; /* 밑줄 제거 */
  color: inherit; /* 부모 요소의 텍스트 색상 상속 */
}

.router-link:hover {
  color: inherit; /* 호버 시에도 부모 색상 유지 */
}

.second-summary-header {
  display: flex;
  justify-content: space-between; /* 좌우 정렬 */
  align-items: center; /* 아이템 세로 정렬 */
  font-size: 20px;
  font-weight: 600;
  padding: 10px 20px;
}
.second-summary-header {
  display: flex;
  justify-content: space-between; /* 닫기 버튼과 탭을 양 끝에 배치 */
  align-items: center;
  padding: 10px 20px;
}

/* 탭 버튼 스타일 */
.tabs-container {
  display: flex;
  gap: 10px; /* 탭 간격 */
}

.tab-button {
  padding: 4px 7px; /* 버튼 크기 확대 */
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 6px; /* 약간 둥글게 */
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px; /* 글씨 크기 증가 */
  cursor: pointer;
  color: #333;
  transition: background-color 0.3s ease, color 0.3s ease;
  width: 140px; /* 버튼 너비 확대 */
  text-align: center; /* 텍스트 정렬 */
}

.tab-button:hover {
  background-color: #333;
  color: white;
}

/* 닫기 버튼 스타일 */
.close-button {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #666;
  transition: color 0.3s ease;
  margin-left: auto; /* 오른쪽 정렬 */
}

.close-button:hover {
  color: #000;
}

.close-button svg {
  vertical-align: middle;
}


.add-button-section {
  margin: 16px 0;
  display: flex;
  justify-content: center;
}

.add-place-button {
  display: inline-flex; /* 버튼 내부 아이템을 플렉스로 정렬 */
  align-items: center; /* 텍스트와 아이콘을 같은 높이에 정렬 */
  gap: 8px; /* 텍스트와 아이콘 사이 간격 */
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #09aa70;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 400;
  transition: background-color 0.3s ease;
}

.add-place-button:hover {
  background-color: #087e58;
}

.add-place-button svg {
  vertical-align: middle; /* 추가적으로 아이콘의 세로 정렬을 텍스트에 맞춤 */
}


/* 전체 화면을 차지하는 지도 */
.map-container {
  position: relative;
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
}

/* 템플릿 오버레이 설정 */
.map-container {
  position: relative;
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
}

.summaries-container {
  display: flex; /* 가로 배치 */
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  height: 100%;
}

.first-travel-summary {
  width: 400px;
  background-color: rgba(255, 255, 255, 0.9);
  overflow-y: auto;
  height: 100%;
  border-right: 1px solid #ddd;
  position: relative;
}
.second-travel-summary {
  width: 400px;
  background-color: rgba(255, 255, 255, 0.9);
  overflow-y: auto;
  height: 100%;
  border-right: 1px solid #ddd;
  position: relative;
}
.second {
  border-right: none; /* 두 번째 summary의 구분선 제거 */
}

/* 화살표 버튼 스타일 */
.arrow-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: #09aa70;
  color: white;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 50%;
}

/* 왼쪽 화살표 버튼 */
.arrow-button.left {
  left: -15px;
}

/* 오른쪽 화살표 버튼 */
.arrow-button.right {
  right: -15px;
}

.first-travel-summary:last-child {
  border-right: none; /* 마지막 summary의 구분선을 제거 */
}


/* 기존 템플릿 스타일 유지 */
.header-container {
  background: #fff;
  box-shadow: 5px 0 30px rgba(98, 99, 100, 0.3);
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 25px;
  font-weight: 500;
}

.header-image {
  width: 100%;
  object-fit: contain;
}


.navigation-tabs {
  display: flex;
  justify-content: space-between;
  padding: 20px 44px 0 20px;
  font-size: 17px;
  letter-spacing: -0.6px;
}

.tab-group {
  display: flex;
  gap: 16px;
}

.active-tab {
  display: flex;
  flex-direction: column;
}

.tab-title {
  color: #000;
  font-weight: 700;
  font-size: 17px;
  margin: 0;
}

.active-indicator {
  background: #000;
  height: 3px;
  margin-top: 16px;
}

.tab-button {
  border: 1px solid #fff;
  border-radius: 50px;
  color: #666;
  font-weight: 350;
  background: none;
  padding: 0;
  cursor: pointer;
  font-size: 17px;
}

.secondary-tabs {
  display: flex;
  gap: 39px;
}

.content-wrapper {
  border-top: 1px solid #e5e6e8;
}

.profile-section {
  background: #09aa70;
  padding: 18px 20px;
  color: #fff;
}

.user-info {
  display: flex;
  justify-content: space-between;
  margin-top: 9px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -1px;
  margin: 0;
}

.rating-info {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-top: 9px;
  font-size: 16px;
}

.rating-icon {
  width: 15px;
}

.separator {
  width: 1px;
  height: 12px;
  background: #fff;
}

.course-info {
  display: flex;
  flex-direction: column;
}

.course-title {
  font-size: 22px;
  font-weight: 300;
  letter-spacing: -1px;
  margin: 0;
}

.participant-count {
  font-size: 16px;
  margin-top: 11px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}
.back-space {
  display: flex;
  align-items: center; /* 아이콘과 텍스트를 같은 높이에 정렬 */
  font-size: 20px;
  font-weight: 500;
  gap: 8px; /* 아이콘과 텍스트 사이의 간격 조정 */
}

.bi-caret-left-fill {
  display: inline-block;
  vertical-align: middle; /* 아이콘의 세로 정렬을 텍스트와 맞춤 */
}
.visibility-button {
  border: 1px solid #fff;
  border-radius: 50px;
  color: #fff;
  padding: 7px 10px;
  font-size: 13px;
  font-weight: 350;
  background: none;
}

.profile-button {
  width: 35px;
  height: 35px;
  border-radius: 35px;
  padding: 0;
  border: none;
  overflow: hidden;
}

.profile-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.trip-details {
  background: #fff;
  border-radius: 5px;
  padding: 20px 32px 20px 15px;
  margin-top: 21px;
}
.trip-details-second {
  background: #fff;
  border-radius: 5px;
  padding: 20px 32px 20px 15px;
}
.trip-summary {
  display: flex;
  gap: 18px;
}

.duration-badge {
  background: #09aa70;
  color: #fff;
  border-radius: 63px;
  width: 63px;
  height: 63px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 350;
}

.trip-stats {
  font-size: 16px;
  letter-spacing: -0.8px;
}

.stat-item {
  display: flex;
  gap: 10px;
  margin-bottom: 8px;
}

.stat-label {
  font-weight: 700;
  color: #000;
}

.stat-value {
  color: #333;
  font-weight: 300;
}

.total-places {
  color: #333;
  font-weight: 300;
  margin: 8px 0 0;
}

.tag-container {
  display: flex;
  gap: 5px;
  margin-top: 19px;
  justify-content: center;
}

.tag {
  background: #eef0f2;
  border-radius: 50px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
  font-size: 15px;
  font-weight: 350;
}

.tag-icon {
  width: 19px;
}

.rating-section {
  background: #f0f1f4;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px;
  padding: 12px 20px;
}

.rating-prompt {
  color: #666;
  font-size: 14px;
  font-weight: 300;
  margin: 0;
}

.rating-stars {
  width: 132px;
}

.day-section {
  padding: 0 20px;
  margin-top: 32px;
}

.day-title {
  color: #333;
  font-size: 19px;
  font-weight: 900;
  letter-spacing: -0.8px;
  margin: 0;
}
.back-button {
  margin-right: 10px;
  background: none;
  border: none;
  font-size: 25px;
  color: #000;
  cursor: pointer;
}
.save-course-button {
  color: #767676;
  font-size: 16px;
  font-weight: 350;
  letter-spacing: -0.5px;
  background: none;
  border: none;
  cursor: pointer;
}

.day-summary-image {
  width: 100%;
  margin-top: 10px;
}

.place-card {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 10px 0px;
}

.place-number {
  color: #333;
  font-size: 20px;
  font-weight: 350;
  letter-spacing: -0.8px;
}
.place-image {
  width: 80px; /* 고정 너비 */
  height: 80px; /* 고정 높이 */
  min-width: 80px; /* 최소 너비 */
  min-height: 80px; /* 최소 높이 */
  border-radius: 50%; /* 둥근 이미지 유지 */
  object-fit: cover; /* 이미지를 잘라내면서 고정된 크기에 맞춤 */
  object-position: center; /* 이미지의 중앙을 기준으로 잘라냄 */
  background-color: #f0f0f0; /* 빈 공간에 색상 추가 (필요에 따라 수정 가능) */
}



.place-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.place-type {
  background: #14a4b0;
  color: #fff;
  padding: 4px 7px; /* 텍스트 주변 여백 */
  font-size: 14px;
  font-weight: 350;
  display: inline-block; /* 텍스트 길이에 맞게 배경 설정 */
  border-radius: 4px; /* 둥근 모서리 */
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
  max-width: fit-content; /* 부모 요소에 영향 받지 않도록 너비 조정 */
}


.place-name {
  color: #333;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.8px;
  margin: 0;
}

.place-address {
  color: #767676;
  font-size: 14px;
  font-weight: 300;
  font-style: normal;
}

.divider {
  border: none;
  height: 1px;
  background: #f4f3f3;
  margin: 9px 0;
}

.place-type-indicator {
  display: flex;
  gap: 15px;
  align-items: center;
  margin: 10px 0 0 30px;
}

.type-icon {
  width: 80px;
  border-radius: 80px;
}

.type-label {
  background: #14a4b0;
  color: #fff;
  padding: 4px 7px;
  font-size: 14px;
  font-weight: 350;
}
.type-travel {
  background-color: #14a4b0; /* 여행지 색상 */
}

.type-restaurant {
  background-color: #ff7f50; /* 음식점 색상 */
}

.type-hotel {
  background-color: #8a2be2; /* 숙박 색상 */
}

.type-default {
  background-color: #ccc; /* 기본 색상 */
}

</style>
