import type {ApiCommentInterface} from "@/d.ts/api/blog/comment";
import {get, post} from "@/utils/request";

export const apiCommentInterface: ApiCommentInterface = {
    listComment: async (req) => {
        return await get("/blog/comment/list", req);
    },
    pageCommentReply: async(req) => {
        return await get("/blog/comment/reply/page", req);
    },
    insertComment: async (req) => {
        return await post("/blog/comment/add", req);
    }

}