import type {CommonResult, PageInterface} from "@/d.ts/api";


export declare interface ArticleInterface {
    pageHomeArticle: (req: ArticlePageReq) => Promise<CommonResult>;
    getArticleDetail: (id: number) => Promise<CommonResult>;
}

interface ArticlePageReq extends PageInterface {
    categoryId: number;
}