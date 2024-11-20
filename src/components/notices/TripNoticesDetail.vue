<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { detailArticle, deleteArticle } from "@/api/notices";

const route = useRoute();
const router = useRouter();

const { noticesNo } = route.params;
const article = ref({});

onMounted(() => {
  getArticle();
});

const getArticle = () => {
  console.log(noticesNo + "번글 얻으러 가자!!!");
  detailArticle(
    noticesNo,
    ({ data }) => {
      article.value = data;
    },
    (error) => {
      console.log(error);
    }
  );
};

function moveList() {
  router.push({ name: "article-list" });
}

function moveModify() {
  router.push({ name: "article-modify", params: { noticesNo } });
}

function onDeleteArticle() {
  console.log(noticesNo + "번글 삭제하러 가자!!!");
  deleteArticle(
    noticesNo,
    (response) => {
      if (response.status == 200) moveList();
    },
    (error) => {
      console.log(error);
    }
  );
}
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <h2 class="my-3 py-3 shadow-sm bg-light text-center">
          <mark class="sky">공지사항</mark>
        </h2>
      </div>
      <div class="col-lg-10 text-start">
        <div class="row my-2">
          <h2 class="text-secondary px-5">
            {{ article.noticesNo }}. {{ article.subject }}
          </h2>
        </div>
        <div class="row">
          <div class="col-md-8">
            <div class="clearfix align-content-center">
              <img
                class="avatar me-2 float-md-start bg-light p-2"
                src="https://raw.githubusercontent.com/twbs/icons/main/icons/person-fill.svg"
                alt="Author"
              />
            
            </div>
          </div>
          <div class="col-md-4 align-self-center text-end">
            댓글: 17
          </div>
        </div>
        <div class="divider mb-3"></div>
        <!-- Render Content with HTML -->
        <div class="text-secondary" v-html="article.content"></div>
        <div class="divider mt-3 mb-3"></div>
        <div class="d-flex justify-content-end">
          <button type="button" class="btn btn-outline-primary mb-3" @click="moveList">
            글목록
          </button>
          <button type="button" class="btn btn-outline-success mb-3 ms-1" @click="moveModify">
            글수정
          </button>
          <button type="button" class="btn btn-outline-danger mb-3 ms-1" @click="onDeleteArticle">
            글삭제
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 900px;
  margin: auto;
}

.divider {
  border-top: 1px solid #ccc;
  margin: 15px 0;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 10px 0;
}
</style>
