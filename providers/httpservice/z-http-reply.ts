/*
 * *********************************************************
 *   author   colin
 *   company  telchina
 *   email    wanglin2046@126.com
 *   date     18-7-31 下午12:53
 * ********************************************************
 */

/**
 * Http返回数据判定接口，可以实现自定义结果判定
 */
export interface ZHttpReply {
    isSuccess: (code: number) => boolean;       // 自定义结果是否成功
    msgKey?: string;                            // 服务器返回信息字段
    codeKey?: string;                           // 服务器返回标识字段
    dataKey?: string;                           // 服务器返回标识字段
}
