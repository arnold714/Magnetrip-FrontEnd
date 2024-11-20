<template>
  <header class="site-header">
    <div class="header-container">
      <a href="/" class="logo-link">
        <img src="/src/assets/logo.png" alt="Site Logo" class="logo-image" />
      </a>
      <nav class="main-nav">
        <ul class="nav-list">
          <li><router-link :to="{name:'trip'}" class="nav-link" :class="{ active: currentPath === '/' }">홈</router-link></li>
          <li><router-link :to="{name:'trip-search'}" class="nav-link" :class="{ active: currentPath === '/trip-search' }">검색</router-link></li>
          <li><router-link :to="{name:'trip-course'}" class="nav-link" :class="{ active: currentPath === '/trip-course' }">여행코스</router-link></li>
          <li><router-link :to="{name:'trip-info'}" class="nav-link" :class="{ active: currentPath === '/trip-info' }">여행정보</router-link></li>
          <li><router-link :to="{name:'notices'}" class="nav-link" >공지사항</router-link></li>
        </ul>
      </nav>
      <div class="header-actions">
        <img src="https://cdn.builder.io/api/v1/image/assets/29b55af8a06640f6ab071ae22829d009/d54aa2e393e27c931928554cf8f08feec9daf80cd3b9b96996a84f40bae1244a?apiKey=29b55af8a06640f6ab071ae22829d009&" alt="User Profile" class="profile-image" />
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      currentPath: window.location.pathname
    };
  }
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
</style>
