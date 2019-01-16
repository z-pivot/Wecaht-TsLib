"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var z_http_service_1 = require("../../providers/httpservice/z-http.service");
Page({
    data: {
        username: '',
        password: ''
    },
    setUserName: function (e) {
        console.log(e.detail.value);
        this.setData({
            username: e.detail.value
        });
    },
    setPassword: function (e) {
        console.log(e.detail.value);
        this.setData({
            password: e.detail.value
        });
    },
    forgetPwd: function () {
        wx.showModal({
            title: '提示',
            content: '这是一个模态弹窗',
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定');
                }
                else if (res.cancel) {
                    console.log('用户点击取消');
                }
            }
        });
    },
    submit: function () {
        var http = new z_http_service_1.ZHttpService();
        http.get('http://apicloud.mob.com/v1/weather/query?key=2978a390aaaed&city=%E6%B5%8E%E5%8D%97', {
            loadingMsg: '正在加载……',
            isHideToastError: true,
            zreply: {
                isSuccess: function (code) { return code == 200; },
                msgKey: 'errMsg',
                codeKey: 'statusCode',
                dataKey: 'data',
            }
        }, {
            success: function (data) {
                console.log(data);
                wx.showToast({
                    title: '请求成功',
                });
            },
            error: function (errMsg) {
                wx.showToast({
                    title: '请求失败:' + errMsg,
                    icon: 'none'
                });
            }
        });
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsb2dpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZFQUF1RTtBQUV2RSxJQUFJLENBQUM7SUFJRCxJQUFJLEVBQUU7UUFDRixRQUFRLEVBQUUsRUFBRTtRQUNaLFFBQVEsRUFBRSxFQUFFO0tBQ2Y7SUFDRCxXQUFXLFlBQUMsQ0FBTTtRQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUUzQixJQUFJLENBQUMsT0FBTyxDQUFDO1lBQ1QsUUFBUSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSztTQUMzQixDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0QsV0FBVyxZQUFDLENBQU07UUFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7UUFFM0IsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUNULFFBQVEsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUs7U0FDM0IsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUNELFNBQVM7UUFDTCxFQUFFLENBQUMsU0FBUyxDQUFDO1lBQ1QsS0FBSyxFQUFFLElBQUk7WUFDWCxPQUFPLEVBQUUsVUFBVTtZQUNuQixPQUFPLFlBQUMsR0FBRztnQkFDUCxJQUFJLEdBQUcsQ0FBQyxPQUFPLEVBQUU7b0JBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtpQkFDeEI7cUJBQU0sSUFBSSxHQUFHLENBQUMsTUFBTSxFQUFFO29CQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO2lCQUN4QjtZQUNMLENBQUM7U0FDSixDQUFDLENBQUE7SUFDTixDQUFDO0lBQ0QsTUFBTTtRQUNGLElBQUksSUFBSSxHQUFHLElBQUksNkJBQVksRUFBRSxDQUFDO1FBQzlCLElBQUksQ0FBQyxHQUFHLENBQUMsb0ZBQW9GLEVBQ3pGO1lBQ0ksVUFBVSxFQUFFLFFBQVE7WUFDcEIsZ0JBQWdCLEVBQUUsSUFBSTtZQUN0QixNQUFNLEVBQUU7Z0JBQ0osU0FBUyxFQUFFLFVBQUMsSUFBWSxJQUFLLE9BQUEsSUFBSSxJQUFJLEdBQUcsRUFBWCxDQUFXO2dCQUN4QyxNQUFNLEVBQUUsUUFBUTtnQkFDaEIsT0FBTyxFQUFFLFlBQVk7Z0JBQ3JCLE9BQU8sRUFBRSxNQUFNO2FBQ2xCO1NBQ0osRUFDRDtZQUNJLE9BQU8sRUFBRSxVQUFDLElBQVM7Z0JBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbEIsRUFBRSxDQUFDLFNBQVMsQ0FBQztvQkFDVCxLQUFLLEVBQUUsTUFBTTtpQkFDaEIsQ0FBQyxDQUFBO1lBQ04sQ0FBQztZQUNELEtBQUssRUFBRSxVQUFDLE1BQVc7Z0JBQ2YsRUFBRSxDQUFDLFNBQVMsQ0FBQztvQkFDVCxLQUFLLEVBQUUsT0FBTyxHQUFHLE1BQU07b0JBQ3ZCLElBQUksRUFBRSxNQUFNO2lCQUNmLENBQUMsQ0FBQTtZQUNOLENBQUM7U0FDSixDQUFDLENBQUM7SUFDWCxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtaSHR0cFNlcnZpY2V9IGZyb20gJy4uLy4uL3Byb3ZpZGVycy9odHRwc2VydmljZS96LWh0dHAuc2VydmljZSdcblxuUGFnZSh7XG4gICAgLyoqXG4gICAgICog6aG16Z2i55qE5Yid5aeL5pWw5o2uXG4gICAgICovXG4gICAgZGF0YToge1xuICAgICAgICB1c2VybmFtZTogJycsXG4gICAgICAgIHBhc3N3b3JkOiAnJ1xuICAgIH0sXG4gICAgc2V0VXNlck5hbWUoZTogYW55KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUuZGV0YWlsLnZhbHVlKVxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgICB1c2VybmFtZTogZS5kZXRhaWwudmFsdWVcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBzZXRQYXNzd29yZChlOiBhbnkpIHtcbiAgICAgICAgY29uc29sZS5sb2coZS5kZXRhaWwudmFsdWUpXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgICAgIHBhc3N3b3JkOiBlLmRldGFpbC52YWx1ZVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGZvcmdldFB3ZCgpIHtcbiAgICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcbiAgICAgICAgICAgIGNvbnRlbnQ6ICfov5nmmK/kuIDkuKrmqKHmgIHlvLnnqpcnLFxuICAgICAgICAgICAgc3VjY2VzcyhyZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzLmNvbmZpcm0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+eUqOaIt+eCueWHu+ehruWumicpXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXMuY2FuY2VsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfnlKjmiLfngrnlh7vlj5bmtognKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LFxuICAgIHN1Ym1pdCgpIHtcbiAgICAgICAgbGV0IGh0dHAgPSBuZXcgWkh0dHBTZXJ2aWNlKCk7XG4gICAgICAgIGh0dHAuZ2V0KCdodHRwOi8vYXBpY2xvdWQubW9iLmNvbS92MS93ZWF0aGVyL3F1ZXJ5P2tleT0yOTc4YTM5MGFhYWVkJmNpdHk9JUU2JUI1JThFJUU1JThEJTk3JyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsb2FkaW5nTXNnOiAn5q2j5Zyo5Yqg6L294oCm4oCmJyxcbiAgICAgICAgICAgICAgICBpc0hpZGVUb2FzdEVycm9yOiB0cnVlLFxuICAgICAgICAgICAgICAgIHpyZXBseToge1xuICAgICAgICAgICAgICAgICAgICBpc1N1Y2Nlc3M6IChjb2RlOiBudW1iZXIpID0+IGNvZGUgPT0gMjAwLFxuICAgICAgICAgICAgICAgICAgICBtc2dLZXk6ICdlcnJNc2cnLFxuICAgICAgICAgICAgICAgICAgICBjb2RlS2V5OiAnc3RhdHVzQ29kZScsXG4gICAgICAgICAgICAgICAgICAgIGRhdGFLZXk6ICdkYXRhJyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IChkYXRhOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+ivt+axguaIkOWKnycsXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogKGVyck1zZzogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+ivt+axguWksei0pTonICsgZXJyTXNnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ25vbmUnXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgfSxcbn0pOyJdfQ==