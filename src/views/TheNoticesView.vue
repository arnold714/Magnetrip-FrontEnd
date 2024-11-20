<script setup></script>


<template>
  <main class="notice-board">
    <header class="notice-header">
      <h1 class="notice-title">공지사항</h1>
      <p class="notice-subtitle">매그네트-립 업데이트 정보 등 다양한 소식을 알려드립니다.</p>
    </header>
  
    <RouterView></RouterView>
  
 
  </main>
  </template>
  
  
  
  <style scoped>
  .notice-board {
    margin: 42px auto;
    width: 792px;
    max-width: 100%;
    font-family: Inter, sans-serif;
  }
  
  .notice-header {
    margin-bottom: 26px;
  }
  
  .notice-title {
    color: #333;
    font-size: 23px;
    font-weight: 700;
  }
  
  .notice-subtitle {
    color: #999;
    font-size: 15px;
    line-height: 2;
    margin-top: 13px;
  }
  
  .notice-list {
    background: #fff;
    width: 100%;
  }
  
  .notice-item {
    display: flex;
    justify-content: space-between;
    padding: 24px 0;
    gap: 20px;
    cursor: pointer;
  }
  
  .notice-content {
    display: flex;
    gap: 18px;
  }
  
  .notice-tag {
    border-radius: 2px;
    font-size: 8px;
    font-weight: 700;
    padding: 3px 4px;
    background: #ffebeb;
    color: #f45858;
  }
  
  .notice-heading {
    color: #333;
    font-size: 15px;
    font-weight: 600;
    line-height: 2;
  }
  
  .notice-date {
    color: #c2c2c2;
    font-size: 12px;
    line-height: 2;
    margin: auto 0;
  }
  
  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-top: 40px;
  }
  
  .page-list {
    display: flex;
    gap: 20px;
    list-style: none;
    padding: 0;
  }
  
  .page-btn {
    border: none;
    background: none;
    font-size: 12px;
    font-weight: 600;
    color: #000;
    width: 32px;
    height: 32px;
    cursor: pointer;
  }
  
  .page-btn.active {
    border-radius: 500px;
    background: #1273e4;
    color: #fff;
  }
  
  .nav-btn {
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
  }
  
  .nav-icon {
    width: 16px;
    height: 16px;
    object-fit: contain;
  }
  
  @media (max-width: 991px) {
    .notice-board {
      margin-top: 40px;
    }
    
    .notice-list {
      max-width: 100%;
    }
    
    .notice-item {
      max-width: 100%;
    }
  }
  </style>