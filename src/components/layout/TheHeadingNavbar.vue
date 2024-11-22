<script setup>

import { getGoogleAuthUrl } from "@/api/login";
</script>

<template>
  <header class="site-header">
    <div class="header-container">
      <a href="/" class="logo-link">
        <img src="/src/assets/logo.png" alt="Site Logo" class="logo-image" />
      </a>
      <nav class="main-nav">
        <ul class="nav-list">
          <li>
            <router-link :to="{ name: 'trip' }" class="nav-link" :class="{ active: currentPath === '/' }">홈</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'trip-search' }" class="nav-link" :class="{ active: currentPath === '/trip-search' }">검색</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'trip-plan' }" class="nav-link" :class="{ active: currentPath === '/trip-plan' }">여행계획</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'trip-info' }" class="nav-link" :class="{ active: currentPath === '/trip-info' }">여행정보</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'notices' }" class="nav-link">공지사항</router-link>
          </li>
        </ul>
      </nav>
      <div class="header-actions">
        <!-- 조건부 렌더링: 로그인 정보가 있으면 프로필 이미지, 없으면 로그인 버튼 -->
        <template v-if="isLoggedIn">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/29b55af8a06640f6ab071ae22829d009/d54aa2e393e27c931928554cf8f08feec9daf80cd3b9b96996a84f40bae1244a?apiKey=29b55af8a06640f6ab071ae22829d009&"
            alt="User Profile"
            class="profile-image"
          />
        </template>
        <template v-else>
          <button @click="openLoginModal" class="login-button">로그인</button>
        </template>
      </div>
    </div>
    <!-- 로그인 모달 -->
    <div v-if="showLoginModal" class="login-modal">
  <div class="login-modal-content">
    <h1><img src="/src/assets/logo.png" alt="Site Logo" class="logo-image" /></h1>
    <p>로그인/회원가입</p>
    <img src="/src/assets/googlelogin.png" alt="Google Login" />
    <img src="/src/assets/naverlogin.png" alt="Naver Login" />
    <button class="terms-button">이용약관 보기</button>
    <p class="contact-info">
      매그네트립 관련 문의
    </p>
    <p>parnold714@gmail.com / 010-5144-9338</p>
    <button @click="closeLoginModal" class="close-button">닫기</button>
  </div>
</div>

  </header>
</template>

<script>
export default {
  data() {
    return {
      currentPath: window.location.pathname,
      isLoggedIn: false, // 로그인 여부를 판단
      showLoginModal: false, // 로그인 모달 표시 여부
    };
  },
  methods: {
    openLoginModal() {
      this.showLoginModal = true; // 로그인 모달 열기
    },
    closeLoginModal() {
      this.showLoginModal = false; // 로그인 모달 닫기
    },
  },
};
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 360px 0px;
  height: 90px;
}

.logo-link {
  flex-shrink: 0;
}

.main-nav {
  flex-grow: 1;
  display: flex;
  justify-content: center;
}

.nav-list {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 16px;
}

.nav-list li {
  padding: 0 35px;
}

.nav-link {
  text-decoration: none;
  color: gray;
  font-weight: bold;
  font-size: 20px;
}

.nav-link.active {
  color: black;
}

.header-actions {
  flex-shrink: 0;
}

.logo-image {
  height: 40px;
}

.profile-image {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  object-fit: cover;
}

/* 로그인 버튼 스타일 */
.login-button {
  background-color: white;
  color: black;
  border: 1.5px solid #ddd;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
}

.login-button:hover {
  background-color:rgb(212, 208, 208);
}

/* 로그인 모달 스타일 */
.login-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.login-modal-content {
  background-color: white;
  width: 400px; /* 모달의 너비 */
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-modal-content h1 {
  font-size: 24px;
  margin-bottom: 10px;
  margin: 0 auto 10px; /* 수평으로 가운데 정렬 */
  width: 55%;
  text-align: center; /* 텍스트를 가운데 정렬 */
}

.login-modal-content img {
  width: 100%; /* 이미지가 모달 너비에 맞게 조정 */
  height: auto; /* 비율 유지 */
  margin-bottom: 10px; /* 이미지 간 간격 */
}

.login-modal-content p {
  margin-bottom: 20px;
  font-size: 14px;
}

.social-login {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
}

.social-login.naver {
  background-color: #03c75a;
  color: white;
}

.social-login.google {
  background-color: #f4f4f4;
  color: black;
}

.terms-button {
  background-color: transparent;
  border: none;
  color: #007bff;
  font-size: 14px;
  cursor: pointer;
  margin-top: 10px;
}

.terms-button:hover {
  text-decoration: underline;
}

.contact-info {
  font-size: 12px;
  color: gray;
  margin-top: 20px;
}

.close-button {
  background-color: #f4f4f4;
  border: none;
  color: black;
  padding: 10px 20px;
  margin-top: 10px;
  border-radius: 5px;
  cursor: pointer;
}

</style>
