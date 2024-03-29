<template>
  <div class="comment-container">
    <div class="comment-title">
      <svg-icon icon-class="comment" class="icon"/>
      <span>评论</span>
    </div>
    <CommentInput @reloadComment="reloadComment()"/>
    <!--评论内容区-->
    <div class="comment-area" v-if="commentCount > 0">
      <div class="comment-title">{{ commentCount }} 评论</div>
      <!-- 评论列表 -->
      <div
          class="comment-item"
          v-for="(item, index) of commentList"
          :key="item.id"
      >
        <!--头像-->
        <img class="comment-avatar" :src="item.avatar" alt=""/>
        <!--右侧-->
        <div class="comment-meta">
          <!-- 用户信息 -->
          <div class="comment-user">
            <span>{{ item.nickname }}</span>
            <span class="blogger-tag" v-if="item.userId == 2">博主</span>
          </div>
          <!-- 评论信息 -->
          <div class="comment-info">
            <!-- 楼层 -->
            <span style="margin-right:10px">{{ commentCount - index }}楼</span>
            <!-- 发表时间 -->
            <span style="margin-right:10px">{{ item.createTime }}</span>
            <!-- 回复 -->
            <span class="reply-btn" @click="replyComment(index, item)">
              回复
            </span>
          </div>
          <!-- 评论内容 -->
          <p v-html="item.commentContent" class="comment-content"></p>

          <!-- 回复人 -->
          <div
              class="reply-item"
              v-for="reply of item.replyList"
              :key="reply.id"
          >
            <!-- 头像 -->
            <img class="comment-avatar" :src="reply.avatar" alt=""/>
            <div class="reply-meta">
              <!-- 用户信息 -->
              <div class="comment-user">
                <span>{{ item.nickname }}</span>
                <span class="blogger-tag" v-if="item.userId == 2">博主</span>
              </div>
              <!-- 回复信息 -->
              <div class="comment-info">
                <!-- 发表时间 -->
                <span style="margin-right:10px">
                  {{ reply.createTime }}
                </span>
                <!-- 回复 -->
                <span class="reply-btn" @click="replyComment(index, reply)">
                  回复
                </span>
              </div>
              <!-- 回复内容 -->
              <p class="comment-content">
                <!-- 回复用户名 -->
                <template v-if="reply.replyUserId != null && reply.replyUserId !== item.userId">
                  <span>@{{ reply.replyNickname }}，</span>
                </template>
                <span v-html="reply.commentContent"/>
              </p>
            </div>
          </div>
          <!-- 回复数量 -->
          <div
              style="font-size:0.75rem;color:#6d757a;margin-bottom:12px"
              v-show="item.replyCount > 3"
              :ref="(el) => getCheckRef(el, index)"
          >
            共
            <b>{{ item.replyCount }}</b>
            条回复，
            <span
                style="color:#00a1d6; cursor:pointer"
                @click="checkReplies(index, item)"
            >
              点击查看
            </span>
          </div>
          <!-- 回复分页 -->
          <div
              class="mb-3"
              style="font-size:0.75rem;color:#222;display:none;margin-bottom:12px"
              :ref="(el) => getPagingRef(el, index)"
          >
            <span style="padding-right:10px">
              共{{ Math.ceil(item.replyCount / 5) }}页
            </span>
            <paging
                :ref="(el) => getPageRef(el, index)"
                :totalPage="Math.ceil(item.replyCount / 5)"
                :index="index"
                :commentId="item.id"
                @changeReplyCurrent="changeReplyCurrent"
            />
          </div>
          <!-- 回复框 -->
          <ReplyInput :ref="(el) => getReplyRef(el, index)" @reloadReply="reloadReply"/>
        </div>
      </div>
      <!-- 加载按钮 -->
      <div class="load-wrapper">
        <button class="k-btn k-btn-primary" v-if="commentCount > commentList.length" @click="listComment()">加载更多...</button>
      </div>
      <div v-if="commentCount <= commentList.length" style="padding:1.25rem;text-align:center">
        已经到底了~
      </div>
    </div>
    <!-- 没有评论提示 -->
    <div v-else style="padding:1.25rem;text-align:center">
      来发评论吧~
    </div>
  </div>
</template>

<script setup lang="ts">

import SvgIcon from "@/components/general/icon/SvgIcon.vue";
import CommentInput from "@/components/content/comment/components/CommentInput.vue";
import {onMounted, provide, ref} from "vue";
import api from "@/api";
import Paging from "@/components/general/page/Paging.vue";
import ReplyInput from "@/components/content/comment/components/ReplyInput.vue";
import type {CommentResp, ReplyResp} from "@/d.ts/api/blog/comment";

const props = defineProps(["commentType", "topicId"]);

provide("commentType", props.commentType);
provide("topicId", props.topicId);

//refs
const checkRef = ref<any>(new Map());
const pagingRef = ref<any>(new Map());
const pageRef = ref<any>(new Map());
const replyRef = ref<any>(new Map());

let commentList = ref<Array<CommentResp>>([]);
let commentCount = ref(0);
const pageNo = ref(0);

const listComment = async () => {
  pageNo.value++;
  await api.listComment({
    pageNo: pageNo.value,
    pageSize: 10,
    commentType: props.commentType,
    topicId: props.topicId
  }).then(({ data }) => {
    commentList.value.push(...data.list);
    commentCount.value = data.total;
  })
}

const reloadComment = async () => {
  await api.listComment({
    pageNo: pageNo.value,
    pageSize: 10,
    commentType: props.commentType,
    topicId: props.topicId
  }).then(({ data }) => {
    commentList.value = data.list;
    commentCount.value = data.total;
  })
}

const replyComment = (index: number, item: CommentResp | ReplyResp) => {
  replyRef.value.forEach((item: any) => {
    item.$el.style.display = "none";
  });
  // 通过dom对组件暴露的值传值
  replyRef.value.get(index).commentContent = "";
  replyRef.value.get(index).nickname = item.nickname;
  replyRef.value.get(index).replyUserId = item.userId;
  replyRef.value.get(index).parentId = commentList.value[index].id;
  replyRef.value.get(index).chooseEmoji = false;
  replyRef.value.get(index).index = index;
  replyRef.value.get(index).$el.style.display = "block";
  // 定位到回复框
  replyRef.value.get(index).focusTextarea();
}

const checkReplies = (index: number, item: CommentResp) => {
  api.pageCommentReply({
    pageNo: 1,
    pageSize: 5,
    commentId: item.id
  }).then(({data}) => {
    checkRef.value.get(index).style.display = "none";
    item.replyList = data;
    //超过1页才显示分页
    if (Math.ceil(item.replyCount / 5) > 1) {
      pagingRef.value.get(index).style.display = "flex";
    }
  })
}

const reloadReply = (index: number) => {
  api.pageCommentReply({
    pageNo: pageRef.value.get(index).current,
    pageSize: 5,
    commentId: commentList.value[index].id
  }).then(({ data }) => {
    commentList.value[index].replyCount++;
    //回复大于5条展示分页
    if (commentList.value[index].replyCount > 5) {
      pagingRef.value.get(index).style.display = "flex";
    }
    checkRef.value.get(index).style.display = "none";
    replyRef.value.get(index).$el.style.display = "none";
    commentList.value[index].replyList = data;
  })
}

const changeReplyCurrent = (current: number, index: number, commentId: number) => {
  api.pageCommentReply({
    pageNo: current,
    pageSize: 5,
    commentId: commentId
  }).then(({data}) => {
    commentList.value[index].replyList = data;
  })
}

onMounted(() => {
  listComment();
})

const getCheckRef = (el: any, index: number) => {
  if (el) {
    checkRef.value.set(index, el);
  }
};
const getPagingRef = (el: any, index: number) => {
  if (el) {
    pagingRef.value.set(index, el);
  }
};
const getPageRef = (el: any, index: number) => {
  if (el) {
    pageRef.value.set(index, el);
  }
};
const getReplyRef = (el: any, index: number) => {
  if (el) {
    replyRef.value.set(index, el);
  }
};

</script>

<style scoped lang="scss">
@import "@/assets/scss/index.scss";

.comment-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 30px 0;

  .comment-title {
    display: flex;
    align-items: center;
    font-size: 1.25rem;
    font-weight: bold;
    line-height: 40px;
    margin-bottom: 10px;

    .icon {
      width: 1.25rem;
      height: 1.25rem;
      margin-right: 8px;
    }
  }

  .comment-area {
    .comment-item {
      display: flex;
      padding-top: 23px;
      box-sizing: content-box;

      .comment-avatar {
        width: 40px;
        height: 40px;
        background-size: 100% 100%;
        border-radius: 50%;
      }

      .comment-meta {
        width: 100%;
        margin-left: 0.7rem;
        border-bottom: 1px solid rgba(144, 147, 153, .31);

        .comment-user {
          font-size: 14px;
          line-height: 1.75;

          .comment-nickname {
            text-decoration: none;
            color: #1abc9c !important;
            font-weight: 500;
          }

          .blogger-tag {
            background: #ffa51e;
            font-size: 12px;
            display: inline-block;
            border-radius: 2px;
            color: #fff;
            padding: 0 5px;
            margin-left: 6px;
          }
        }

        .comment-info {
          line-height: 1.75;
          font-size: 0.75rem;
          color: #b3b3b3;

          .reply-btn {
            cursor: pointer;
            float: right;
            color: #ef2f11;
          }
        }

        .comment-content {
          font-size: 0.875rem;
          line-height: 1.75;
          padding-bottom: 0.625rem;
        }

        .reply-item {
          display: flex;

          .reply-meta {
            margin-left: 0.8rem;
            width: 100%;
          }
        }
      }
    }
    .load-wrapper {
      margin-top: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

</style>