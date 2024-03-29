<template>
  <div class="page-article">
    <page-cover
        title="✍️行有余力 , 写点笔记!"
        subtitle="生活不止有代码,别忘了还有诗和远方"
        bg="https://cdn.koicode.cn/system-image/48380973b3514d2ca84472bf697088d7.jpg"
    ></page-cover>

    <main>
      <div class="left-container">
        <!--分类-->
        <div class="category-wrapper blog-card card t-shadow">
          <div class="category-header">
            <div class="web-info-title">
              <svg-icon icon-class="category" class="icon"/>
              分类
            </div>
            <div>
              {{ categoryCount }}
            </div>
          </div>
          <div class="category-content">
            <div
                class="category-item"
                :class="{'active': item.id === categoryQueryId}"
                v-for="item of categoryList.filter(i => i.articleCount > 0)"
                @click="selectCategory(item.id)">
              <div class="category-name">
                {{ item?.categoryName }}
              </div>
              <div class="category-count">
                {{ item?.articleCount }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-container">
        <Wait :show="show" height="400px">
          <ArticleList :articleListData="articleListData"/>
        </Wait>
        <Pagination
            :total="total"
            :page-size="pageSize"
            :current="pageNo"
            :hide-on-single-page="false"
            :show-total="true"
            @pageChange="pageChange"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">

import api from "@/api";
import {onBeforeMount, ref, watch} from "vue";
import {Wait} from "@/components/popup";
import ArticleList from "@/components/content/article/ArticleList.vue";
import Pagination from "@/components/general/page/Pagination.vue";
import {useRouter} from "vue-router";
import PageCover from "@/components/general/page-cover/PageCover.vue";
import type {CategoryResp} from "@/d.ts/api/blog/category";
import SvgIcon from "@/components/general/icon/SvgIcon.vue";

const router = useRouter();

let categoryCount = ref(0);
let categoryList = ref<Array<CategoryResp>>([]);
let articleListData = ref([]);
let show = ref(true);
let pageNo = ref(1);
let pageSize = ref(8);
let total = ref(0);
const categoryQueryId = ref<number | null>(null);

onBeforeMount(() => {
  pageNo.value = router.currentRoute.value.query.page ? Number(router.currentRoute.value.query.page) : 1;
  listCategories();
  pageHomeArticle();
})

const listCategories = async () => {
  await api.listCategories().then(({data}) => {
    categoryList.value = data.list;
    categoryCount.value = data.total;
  });
}

const pageHomeArticle = async () => {
  await api.pageHomeArticle({
    pageNo: pageNo.value,
    pageSize: pageSize.value,
    categoryId: categoryQueryId.value
  }).then(({data}) => {
    total.value = data.total;
    articleListData.value = data.list;
    show.value = false;
  });
}

const selectCategory = (id: number) => {
  if (categoryQueryId.value === id) {
    categoryQueryId.value = null;
  } else {
    categoryQueryId.value = id;
  }
}

const pageChange = (target: number) => {
  router.push({
    path: "/article",
    query: {
      page: target
    }
  });
  pageNo.value = target;
  // 展示加载动画
  show.value = true;
}

watch(
    () => categoryQueryId.value,
    () => {
      pageHomeArticle();
    }
)

watch(
    () => pageNo.value,
    () => {
      pageHomeArticle();
    }
)

</script>

<style scoped lang="scss">
@import "@/assets/scss/index.scss";

.page-article {

  main {
    max-width: 1200px;
    display: flex;
    align-items: flex-start;
    position: relative;
    z-index: 9;
    margin: -80px auto auto;
  }

  .left-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 80px;

    .blog-card {
      line-height: 2;
      padding: 1.25rem 1.5rem;
      margin-right: 1.25rem;
      margin-bottom: 1.5rem;
    }

    .category-wrapper {
      width: 100%;
      display: flex;
      flex-direction: column;

      .category-header {
        display: flex;
        justify-content: space-between;
      }

      .category-content {
        margin-top: 10px;

        .category-item {
          height: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: 0.5s;

          &:hover {
            color: $white;
            background: rgb(73, 177, 245);
            padding: 0 5%;
          }

          &.active {
            color: $white;
            background: rgb(255, 144, 66);
            padding: 0 5%;
          }
        }
      }

    }
  }

  .right-container {
    flex: 3;
    padding: 0 1.25rem 1.5rem;
    display: flex;
    flex-direction: column;
  }
}
</style>