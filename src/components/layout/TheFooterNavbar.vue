<template>
  <footer class="site-footer">
    <div class="footer-container">
      <section class="footer-content">
        <div class="customer-service">
          <h2 class="section-title">고객센터</h2>
          <p class="service-hours">
            고객행복센터(전화): 오전 9시 ~ 새벽 3시 운영<br />
            카카오톡 문의: 24시간 운영
          </p>
          <div class="contact-buttons">
            <button class="contact-btn phone-btn">
              <img src="https://cdn.builder.io/api/v1/image/assets/29b55af8a06640f6ab071ae22829d009/a5d0710726ae0d753fe724a025faa75fe1aa1b929765503f08992c9555fa3744?apiKey=29b55af8a06640f6ab071ae22829d009&" alt="Phone icon" class="contact-icon" />
              <span>1670-6250</span>
            </button>
            <button class="contact-btn kakao-btn">
              <img src="https://cdn.builder.io/api/v1/image/assets/29b55af8a06640f6ab071ae22829d009/d669c5c64149aedd3b2ebe515ffb08da794a1d70622866a18db239fb385b585e?apiKey=29b55af8a06640f6ab071ae22829d009&" alt="Kakao icon" class="contact-icon" />
              <span>고객 문의</span>
            </button>
          </div>
        </div>

        <nav class="company-info">
          <h3 class="section-title">회사</h3>
          <a href="#" class="nav-link">회사소개</a>
        </nav>

        <div class="footer-links">
          <section class="services-section">
            <h3 class="section-title">서비스</h3>
            <nav class="footer-nav">
              <a href="#" class="nav-link">공지사항</a>
              <a href="#" class="nav-link">자주 묻는 질문</a>
              <a href="#" class="nav-link">기업 출장/복지 서비스 문의</a>
            </nav>
          </section>

          <section class="benefits-section">
            <h3 class="section-title">혜택</h3>
            <nav class="footer-nav">
              <a href="#" class="nav-link">엘리트 멤버십</a>
              <a href="#" class="nav-link">트립홀릭 혜택 안내</a>
              <a href="#" class="nav-link">매그네트립 상품권 조회</a>
            </nav>
          </section>

          <section class="travel-section">
            <h3 class="section-title">모든 여행</h3>
            <nav class="footer-nav">
              <a href="#" class="nav-link">국내숙소</a>
              <a href="#" class="nav-link">해외숙소</a>
              <a href="#" class="nav-link">항공</a>
              <a href="#" class="nav-link">항공+숙소</a>
              <a href="#" class="nav-link">레저·티켓</a>
              <a href="#" class="nav-link">렌터카</a>
              <a href="#" class="nav-link">공간대여</a>
            </nav>
          </section>
        </div>
      </section>

      <section class="legal-info">
        <p class="company-details">
          (주)매그네트립컴퍼니<br />
          주소 : 서울특별시 강남구 봉은사로 479, 479타워 11층 | 대표이사 : 정명훈 | 사업자등록번호 : 742-86-00224
        </p>
      </section>

      <section class="additional-info">
        <p class="legal-text">
          전자우편주소 : help@yeogi.com | 통신판매번호 : 2017-서울강남-01779 | 관광사업자 등록번호 : 제1026-24호 | 전화번호 : 1670-6250 | 호스팅서비스제공자의 상호 표시 : (주)여기어때컴퍼니<br />
          (주)매그네트립컴퍼니는 통신판매중개자로서 통신판매의 당사자가 아니며, 상품의 예약, 이용 및 환불 등과 관련한 의무와 책임은 각 판매자에게 있습니다.
        </p>
      </section>

      <div class="footer-bottom">
        <nav class="policy-links">
          <a href="#" class="policy-link">이용약관</a>
          <a href="#" class="policy-link privacy">개인정보처리방침</a>
          <a href="#" class="policy-link">소비자 분쟁해결 기준</a>
          <a href="#" class="policy-link">콘텐츠산업진흥법에 의한 표시</a>
        </nav>
        <div class="social-links">
          <img src="https://cdn.builder.io/api/v1/image/assets/29b55af8a06640f6ab071ae22829d009/3d853e0121e71222fc7e87f3bc0965bf3acc0ea443d180c1ab5fa94049d4b9eb?apiKey=29b55af8a06640f6ab071ae22829d009&" alt="Social media icon 1" class="social-icon" />
          <img src="https://cdn.builder.io/api/v1/image/assets/29b55af8a06640f6ab071ae22829d009/745665b838fd7f3108bd1fe6f9d8241958764b43e3c642204f87fea667742a94?apiKey=29b55af8a06640f6ab071ae22829d009&" alt="Social media icon 2" class="social-icon-large" />
        </div>
      </div>

      <p class="copyright">Copyright GC COMPANY Corp. All rights reserved.</p>
    </div>
  </footer>
  </template>

  <style scoped>
  .site-footer {
  background: #fafafa;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px 65px;
}

.footer-container {
  width: 1200px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0 auto; /* 중앙 정렬 */
}

.footer-content {
  display: flex;
  justify-content: space-between; /* 섹션 간 동일한 간격 */
  width: 100%;
  gap: 40px; /* 섹션 간 여유 간격 */
  flex-wrap: nowrap; /* 줄바꿈 방지 */
}


.footer-nav,
.customer-service {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 21px;
}

.section-title {
  color: #707070;
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 10px; /* 제목과 내용 간 여백 */
}

.service-hours {
  color: #999;
  font-size: 13px;
  line-height: 20px;
}

.contact-buttons {
  display: flex;
  margin-top: 20px;
  gap: 8px;
}

.contact-btn {
  border-radius: 10px;
  background: #fff;
  display: flex;
  gap: 9px;
  padding: 14px 15px;
  border: 2px solid #ebebeb;
  color: #333;
  font-size: 15px;
  align-items: center;
  cursor: pointer;
  flex: 1;
}

.contact-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.footer-links {
  display: flex;
  gap: 20px;
  flex-grow: 1;
}

.footer-nav {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.nav-link {
  color: #999;
  font: 600 13px Inter, sans-serif;
  text-decoration: none;
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
}

.legal-info {
  display: flex;
  margin-top: 19px;
  gap: 7px;
  color: #999;
  flex-wrap: wrap;
  font: 11px Inter, sans-serif;
}

.company-details {
  line-height: 16px;
  flex-grow: 1;
}

.business-info-link {
  font-weight: 600;
  color: #999;
  text-decoration: none;
  margin-top: 16px;
}

.legal-text {
  color: #999;
  font: 400 11px/16px Inter, sans-serif;
  margin-top: 18px;
}

.footer-bottom {
  display: flex;
  margin-top: 18px;
  width: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
}

.policy-links {
  display: flex;
  gap: 17px;
  color: #999;
  font: 600 13px Inter, sans-serif;
}

.policy-link {
  color: #999;
  text-decoration: none;
}

.policy-link.privacy {
  color: #333;
}

.social-links {
  display: flex;
  gap: 8px;
  align-items: center;
}

.social-icon {
  width: 32px;
  height: 23px;
  object-fit: contain;
}

.social-icon-large {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.copyright {
  color: #999;
  margin-top: 36px;
  font: 400 11px/1 Inter, sans-serif;
}

@media (max-width: 991px) {
  .site-footer {
    padding: 0 20px;
  }

  .footer-content {
    flex-wrap: wrap; /* 화면이 작아질 때 줄바꿈 허용 */
  }

  .footer-links {
    flex-direction: column; /* 작은 화면에서는 열로 배치 */
  }

  .contact-btn {
    white-space: normal; /* 텍스트 줄바꿈 허용 */
  }

  .legal-info,
  .legal-text,
  .footer-bottom,
  .policy-links {
    max-width: 100%;
  }
}

  </style>
