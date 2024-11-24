<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRegionStore } from '@/stores/regionStore';
import { createPlan } from "@/api/plan"
import { useRouter } from 'vue-router'; // Vue Router import
const router = useRouter(); // router instance 생성

const regionStore = useRegionStore();
const selectedSidoCode = ref(null);
const selectedSubRegion = ref(null);
const subRegions = ref([]);

// 현재 선택된 단계
const selectedStep = ref(1);

// 선택된 지역
const selectedRegion = ref(null);
const selectedMainRegion = ref(null);

// 지역 목록
const regions = [
  { name: '서울', value: 1 },
  { name: '부산', value: 2 },
  { name: '대구', value: 3 },
  { name: '인천', value: 4 },
  { name: '광주', value: 5 },
  { name: '대전', value: 6 },
  { name: '울산', value: 7 },
  { name: '세종', value: 8 },
  { name: '경기', value: 31 },
  { name: '강원', value: 32 },
  { name: '충북', value: 33 },
  { name: '충남', value: 34 },
  { name: '전북', value: 35 },
  { name: '전남', value: 36 },
  { name: '경북', value: 37 },
  { name: '경남', value: 38 },
  { name: '제주', value: 39 },
];
const onCreate = () => {
  const planData = {
    duration: selectedDuration.value.value, // 선택된 여행 기간
    areaCode: selectedMainRegion.value.value, // 메인 지역 코드
    sigunguCode: selectedSubRegion.value?.value || null, // 세부 지역 코드 (선택되지 않았을 경우 null)
  };

  createPlan(
    planData,
    (response) => {
      console.log("Plan created successfully:", response.data);
      router.push({ name: 'plan-making', params: { planId: response.data.planId } }); // 완료 후 TheMakingView로 이동    
      },
    (error) => {
      console.error("Failed to create plan:", error);
    }
  );
};

// 지역 선택 핸들러
const selectRegion = (region) => {
  selectedMainRegion.value = region;
  selectedRegion.value = region.value;
  
  if (region.value >= 31) {
    // 도 단위 지역인 경우 세부 지역 목록 가져오기
    subRegions.value = regionStore.getSubRegions(region.value);
    selectedSubRegion.value = null; // 세부 지역 선택 초기화
  }
};

// 세부 지역 선택 핸들러
const selectSubRegion = (subRegion) => {
  selectedSubRegion.value = subRegion;
};

// 이전 화면으로 돌아가기
const handleBackToMain = () => {
  selectedMainRegion.value = null;
  selectedRegion.value = null;
  selectedSubRegion.value = null;
};

// 선택된 여행 기간
const selectedDuration = ref(null);

const durations = [
  { value: 1, label: '당일치기' },
  { value: 2, label: '1박 2일' },
  { value: 3, label: '2박 3일' },
];

// 여행 기간 선택 핸들러
const selectDuration = (duration) => {
  selectedDuration.value = duration;
};


// 다음 단계로 전환
const handleNext = () => {
  if (selectedRegion.value >= 31 && !selectedSubRegion.value) {
    // 도 단위 지역이 선택되었지만 세부 지역이 선택되지 않은 경우
    alert('세부 지역을 선택해주세요.');
    return;
  }
  
  if (selectedRegion.value) {
    selectedStep.value += 1;
  } else {
    alert('지역을 선택하세요.');
  }
};

// 이전 단계로 돌아가기
const handleBack = () => {
  if (selectedStep.value > 1) {
    selectedStep.value -= 1;
  }
};

// 멤버 목록
// 전체 멤버 목록
const allMembers = ref([
  { name: 'Alice', email: 'alice@example.com', image: 'https://via.placeholder.com/40' },
  { name: 'Bob', email: 'bob@example.com', image: 'https://via.placeholder.com/40' },
  { name: 'Charlie', email: 'charlie@example.com', image: 'https://via.placeholder.com/40' },
  { name: 'David', email: 'david@example.com', image: 'https://via.placeholder.com/40' },
]);


// 검색된 멤버 목록
const filteredMembers = ref([]);

// 입력된 검색어
const searchQuery = ref('');
// 검색 결과 표시 여부
const showResults = ref(false);

// 검색어 업데이트 및 필터링
const updateSearch = () => {
  if (!searchQuery.value.trim()) {
    filteredMembers.value = [];
    showResults.value = false;
    return;
  }

  // 이메일 기반 필터링
  filteredMembers.value = allMembers.value.filter((member) =>
    member.email.toLowerCase().startsWith(searchQuery.value.toLowerCase())
  );
  showResults.value = true; // 검색 결과 표시
};

// 모달 외부 클릭 감지
const handleOutsideClick = (event) => {
  const searchWrapper = document.querySelector('.search-wrapper');
  if (!searchWrapper.contains(event.target)) {
    showResults.value = false; // 검색 결과 숨기기
  }
};

onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
});


// 초대된 멤버 목록
const invitedMembers = ref([]);

// 멤버 초대 핸들러
const inviteMember = (member) => {
  if (!invitedMembers.value.includes(member)) {
    invitedMembers.value.push(member); // 중복 방지 후 추가
  }
};
// 멤버 삭제 핸들러
const removeMember = (email) => {
  invitedMembers.value = invitedMembers.value.filter((member) => member.email !== email);
};

</script>

<template>
    <div class="background">
      <div
        class="modal-container"
        v-if="selectedStep === 1"
        :class="{ slideOut: selectedStep !== 1 }"
      >
        <!-- Step Number -->
        <nav class="navigation" role="navigation">
          <ul class="step-list">
            <li class="step-item" v-for="step in 3" :key="step">
              <span
                class="step-number"
                :class="{ active: step === selectedStep }"
              >
                {{ step.toString().padStart(2, '0') }}
              </span>
            </li>
          </ul>
        </nav>
  
        <!-- Step 1 Content -->
        <header class="travel-header">
          <section class="content-section">
            <p class="subtitle">이번 여행, 어디로 떠나볼까요?</p>
            <h1 class="title">
              <span class="title-bold">
                {{ selectedMainRegion && selectedMainRegion.value >= 31 
                  ? `${selectedMainRegion.name}의 세부 지역을` 
                  : '여행을 떠나고 싶은 지역을' }}
              </span>
              <span class="title-light">선택해 주세요.</span>
            </h1>
          </section>
        </header>
  
        <section v-if="!selectedMainRegion || selectedMainRegion.value < 31" class="regions-container">
            <div
                v-for="region in regions"
                :key="region.value"
                class="region-button"
                :class="{ selected: selectedRegion === region.value }"
                @click="selectRegion(region)"
            >
                {{ region.name }}
            </div>
            </section>

            <section v-else class="subregions-container"> <!-- 클래스 변경 -->
            <div
                v-for="subRegion in subRegions"
                :key="subRegion.value"
                class=" sub-region-button"
                :class="{ selected: selectedSubRegion === subRegion }"
                @click="selectSubRegion(subRegion)"
            >
                {{ subRegion.name }}
            </div>
            </section>

        <footer class="modal-footer">
          <button 
            v-if="selectedMainRegion && selectedMainRegion.value >= 31" 
            class="previous-button" 
            @click="handleBackToMain"
          >
            이전
          </button>
          <button 
            class="next-button" 
            @click="handleNext"
          >
            다음
          </button>
        </footer>
      </div>
  
      <div
        class="modal-container"
        v-if="selectedStep === 2"
        :class="{ slideIn: selectedStep === 2 }"
      >
        <!-- Step Number -->
        <nav class="navigation" role="navigation">
          <ul class="step-list">
            <li class="step-item" v-for="step in 3" :key="step">
              <span
                class="step-number"
                :class="{ active: step === selectedStep }"
              >
                {{ step.toString().padStart(2, '0') }}
              </span>
            </li>
          </ul>
        </nav>
  
        <!-- Step 2 Content -->
        <header class="travel-header">
          <section class="content-section">
            <p class="subtitle">이번 여행 얼마나 다녀오실건가요?</p>
            <h1 class="title">
              <span class="title-bold">여행 기간을</span>
              <span class="title-light">선택해 주세요.</span>
            </h1>
          </section>
        </header>
        <section class="durations-container">
            <div
                v-for="duration in durations"
                :key="duration.value"
                class="duration-button"
                :class="{ selected: selectedDuration?.value === duration.value }"
                @click="selectDuration(duration)"
            >
                {{ duration.label }}
            </div>
        </section>

        <footer class="modal-footer">
            <button class="previous-button" @click="handleBack">이전</button>
            <button 
                class="next-button" 
                @click="handleNext"
                :disabled="!selectedDuration"
            >
                다음
            </button>
        </footer>
      </div>
      <div
  class="modal-container"
  v-if="selectedStep === 3"
  :class="{ slideIn: selectedStep === 3 }"
>
  <!-- Step Number -->
  <nav class="navigation" role="navigation">
    <ul class="step-list">
      <li class="step-item" v-for="step in 3" :key="step">
        <span
          class="step-number"
          :class="{ active: step === selectedStep }"
        >
          {{ step.toString().padStart(2, '0') }}
        </span>
      </li>
    </ul>
  </nav>

  <!-- Step 3 Content -->
  <header class="travel-header">
        <section class="content-section">
          <p class="subtitle">같이 여행할 친구를 초대하세요!</p>
          <h1 class="title">
            <span class="title-bold">이메일로 친구를 검색하세요:</span>
          </h1>
        </section>
      </header>

      <section class="invite-container">
        <div class="search-wrapper">
            <input
            type="text"
            class="search-input"
            v-model="searchQuery"
            @input="updateSearch"
            placeholder="ex) arnold714@gmail.com"
            />
            <!-- 검색 결과 -->
            <ul v-if="showResults && filteredMembers.length" class="search-results">
            <li v-for="member in filteredMembers" :key="member.email" class="search-item">
                <img :src="member.image" alt="profile image" class="member-image" />
                <div class="member-info">
                <span class="member-name">{{ member.name }}</span>
                <span class="member-email">{{ member.email }}</span>
                </div>
                <button class="invite-button" @click="inviteMember(member)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-square" viewBox="0 0 16 16">
                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                </svg>
                </button>
            </li>
            </ul>
        </div>
        </section>



      <section v-if="invitedMembers.length" class="invited-members">
        <h3>초대된 멤버:</h3>
        <ul>
        <li v-for="member in invitedMembers" :key="member.email" class="invited-item">
            <img :src="member.image" alt="profile image" class="member-image" />
            <div class="member-info">
            <span class="member-name">{{ member.name }}</span>
            <span class="member-email">{{ member.email }}</span>
            </div>
            <button class="remove-button" @click="removeMember(member.email)">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-x-square"
                viewBox="0 0 16 16"
                >
                <path
                    d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"
                />
                <path
                    d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"
                />
                </svg>
            </button>
        </li>
        </ul>
    </section>
    <footer class="modal-footer">
        <button class="previous-button" @click="handleBack">이전</button>
        <button class="next-button" @click="onCreate">완료</button>
    </footer>
    </div>

    </div>
  </template>
  
  <style scoped>
  /* 세부 지역 버튼 스타일 */
.sub-region-button {
  width: 90px;
  height: 50px;
  border-radius: 15px; /* 라운딩 처리 */
  background-color: #f5f5f5;
  color: #333;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

/* 세부 지역 버튼 호버 효과 */
.sub-region-button:hover {
  border-color: #ccc;
  background-color: #e8e8e8; /* 호버 시 밝은 색으로 변경 */
}

/* 세부 지역 버튼 선택 시 스타일 */
.sub-region-button.selected {
  background-color: #547DF1;
  color: white;
}

  /* 초대 완료된 멤버 섹션 */
.invited-members {
  margin-top: 20px;
  padding: 10px;
  border-top: 1px solid #ccc;
}

.invited-members h3 {
  margin-bottom: 10px;
  font-size: 18px;
  color: #333;
}

.invited-members ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.invited-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.invited-item:last-child {
  border-bottom: none;
}

.member-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.member-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.member-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.member-email {
  font-size: 14px;
  color: #555;
}

/* 삭제 버튼 스타일 */
.remove-button {
  background-color: transparent; /* 버튼 배경 제거 */
  border: none; /* 테두리 제거 */
  cursor: pointer; /* 클릭 가능한 포인터 표시 */
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.remove-button:hover {
  transform: scale(1.1); /* 호버 시 크기 확대 */
}

.remove-button svg {
  fill: #ff4d4d; /* 기본 색상 */
  width: 20px; /* 아이콘 크기 */
  height: 20px;
}

.remove-button:hover svg {
  fill: #cc0000; /* 호버 시 색상 변경 */
}



  /* 검색 래퍼 스타일 */
.search-wrapper {
  position: relative;
  width: 100%;
}

/* 검색 입력창 스타일 */
.search-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
}

/* 검색 결과 리스트 스타일 */
.search-results {
  position: absolute;
  top: calc(100% + 5px); /* 검색창 바로 아래 */
  left: 0;
  width: 100%;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  z-index: 1000; /* 다른 요소보다 위에 표시 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px; /* 최대 높이 설정 */
  overflow-y: auto; /* 결과가 많을 경우 스크롤 */
}

/* 검색 결과 항목 스타일 */
.search-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.search-item:last-child {
  border-bottom: none;
}

/* 멤버 프로필 이미지 */
.member-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

/* 멤버 정보 */
.member-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.member-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.member-email {
  font-size: 14px;
  color: #555;
}

/* 초대 버튼 스타일 */
.invite-button {
  background-color: transparent; /* 버튼 배경 제거 */
  border: none; /* 테두리 제거 */
  cursor: pointer; /* 클릭 가능한 포인터 표시 */
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.invite-button:hover {
  transform: scale(1.1); /* 호버 시 크기 확대 */
}

.invite-button svg {
  fill: #333; /* 기본 색상 */
  width: 20px; /* 아이콘 크기 */
  height: 20px;
}

.invite-button:hover svg {
  fill: #111; /* 호버 시 색상 변경 */
}


 /* 여행 기간 버튼 컨테이너 */
.durations-container {
  display: flex; /* Flexbox 사용 */
  flex-wrap: wrap; /* 버튼이 화면을 벗어나면 줄바꿈 */
  justify-content: center; /* 가로 가운데 정렬 */
  align-items: center; /* 세로 가운데 정렬 */
  height: 80%; /* 화면에서 약간 위로 위치 */
  margin-top: -10%; /* 더 위로 올리기 */
}

/* 여행 기간 버튼 스타일 */
.duration-button {
  width: 90px;
  height: 90px;
  border: 2px solid transparent; /* 기본 테두리는 보이지 않음 */
  border-radius: 50%; /* 동그랗게 만듦 */
  background-color: white;
  color: #333;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 15px; /* 버튼 간격 증가 */
  transition: all 0.3s;
}

.duration-button:hover {
  border-color: #ccc; /* 호버 시 테두리 표시 */
}

.duration-button.selected {
  background-color: #547DF1; /* 선택된 버튼 배경 파란색 */
  color: white; /* 선택된 버튼 텍스트 흰색 */
  font-weight: bold;
}


  .navigation {
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    justify-content: flex-end;
  }
  
  .step-list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  .step-item {
    padding: 0 10px;
    font-size: 16px;
  }
  
  .step-number {
    font-size: 14px;
    font-weight: bold;
    color: #ccc; /* 기본 색상 */
    transition: color 0.3s;
  }
  
  .step-number.active {
    color: #333; /* 활성 상태 색상 */
  }
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between; /* 이전 버튼은 왼쪽, 다음 버튼은 오른쪽 */
  align-items: center;
  padding: 20px 0;
  width: 100%;
}

.modal-footer button {
  min-width: 100px;
}

/* 추가적인 스타일 설정 */
.previous-button {
  margin-right: auto; /* 이전 버튼은 왼쪽 끝으로 */
}

.next-button {
  margin-left: auto; /* 다음 버튼은 오른쪽 끝으로 */
}


/* 기존 버튼 스타일 유지 */
.previous-button {
  background-color: white;
  color: #333;
  border: 2px solid #333;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}

.next-button {
  background-color: #333;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

/* 버튼이 하나만 있을 때 오른쪽 정렬 */
.modal-footer.single-button {
  justify-content: flex-end;
}

/* 애니메이션 */
.slideOut {
  transform: translateY(-100%);
  opacity: 0;
}

.slideIn {
  transform: translateY(0);
  opacity: 1;
}

/* 기타 스타일은 동일 */
.next-button {
  background-color: #333;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('@/assets/Background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
}

/* 모달 컨테이너 */
.modal-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 700px;
  height: 650px;
  max-width: 90%;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 10;
  padding: 50px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* travel-header 내부 스타일 */
.travel-header {
  width: 100%;
}

.image-section {
  position: relative;
  width: 100%;
}
.navigation {
  position: absolute;
  top: 0; /* 맨 위로 이동 */
  right: 20px; /* 오른쪽 여백 */
  display: flex;
  justify-content: flex-end;
  padding: 10px 0; /* 위아래 약간의 간격 추가 */
}


.step-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.step-item {
  padding: 0 15px;
  font-size: 15px;
  color: #333;
  font-weight: 900;
}

.step-number {
  display: block;
  padding: 6px 0;
}

.content-section {
  margin-top: 20px;
  text-align: center;
}

.subtitle {
  font-size: 18px;
  color: #666;
  font-weight: 300;
  letter-spacing: -0.6px;
  line-height: 21px;
  margin: 0;
}

.title {
  margin: 8px 0 0;
  color: #333;
  letter-spacing: -2.5px;
  line-height: 38px;
  font-size: 24px;
}

.title-bold {
  display: block;
  font-weight: 900;
}

.title-light {
  display: block;
  font-weight: 350;
}

/* 기본 지역 버튼 컨테이너 */
.regions-container {
  display: grid;
  grid-template-columns: repeat(6, 1fr); /* 한 줄에 6개 */
  gap: 10px; /* 버튼 간격 */
  margin-top: 20px;
}

/* 세부 지역 버튼 컨테이너 */
.subregions-container {
  display: grid; /* Grid 레이아웃 사용 */
  grid-template-columns: repeat(6, 1fr); /* 한 줄에 6개 */
  gap: 10px; /* 버튼 간격 */
  padding: 10px; /* 컨테이너 여백 */
  margin-top: 20px;
  justify-content: center; /* 전체 가운데 정렬 */
  align-items: start; /* 위쪽 정렬 */
}



/* 지역 버튼 스타일 */
.region-button {
  width: 90px;
  height: 90px;
  border: 2px solid transparent; /* 기본 테두리는 보이지 않음 */
  border-radius: 50%;
  background-color: white;
  color: #333;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.region-button:hover {
  border-color: #ccc; /* 호버 시 테두리 표시 */
}

.region-button.selected {
  background-color: #547DF1; /* 선택된 버튼 배경 파란색 */
  color: white; /* 선택된 버튼 텍스트 흰색 */
  font-weight: bold;
}

.next-button {
  background-color: #333;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.next-button:hover {
  background-color: #333; /* 호버 시 더 어두운 파란색 */
}
</style>
