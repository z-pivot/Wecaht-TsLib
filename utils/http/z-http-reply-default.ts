/*
 * *********************************************************
 *   author   colin
 *   company  telchina
 *   email    wanglin2046@126.com
 *   date     18-7-31 下午12:53
 * ********************************************************
 */

import { ZHttpReply } from './z-http-reply';

/**
 * 默认的返回码判断，
 */
export class ZHttpReplyDefault implements ZHttpReply {
    msgKey = 'msg';                                 // 服务器返回信息字段
    codeKey = 'code';                               // 服务器返回标识字段
    dataKey = 'data';                               // 服务器返回标识字段
    isSuccess = (code: number) => code == 200;      // 自定义结果是否成功
}
