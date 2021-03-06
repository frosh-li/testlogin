var support_bank = {}
support_bank["zsyh"] = "01";
support_bank["jsyh"] = "02,03";
support_bank["gsyh"] = "01";
support_bank["zgyh"] = "02";
support_bank["jtyh"] = "02";
support_bank["nyyh"] = "01,02,03";
support_bank["yzyh"] = "02,03";
support_bank["xyyh"] = "01,02";
support_bank["msyh"] = "02";
support_bank["zxyh"] = "01";
support_bank["hxyh"] = "02";
support_bank["pfyh"] = "03";
support_bank["gdyh"] = "01,02";
support_bank["qlyh"] = "03";
support_bank["gxbbwyh"] = "03";

var bank_name = {}
bank_name["zsyh"] = "招商银行";
bank_name["jsyh"] = "建设银行";
bank_name["gsyh"] = "工商银行";
bank_name["zgyh"] = "中国银行";
bank_name["jtyh"] = "交通银行";
bank_name["nyyh"] = "农业银行";
bank_name["yzyh"] = "邮政银行";
bank_name["xyyh"] = "兴业银行";
bank_name["msyh"] = "民生银行";
bank_name["zxyh"] = "中信银行";
bank_name["hxyh"] = "华夏银行";
bank_name["pfyh"] = "浦发银行";
bank_name["gdyh"] = "光大银行";
bank_name["qlyh"] = "齐鲁银行";
bank_name["gxbbwyh"] = "广西北部湾";

var password_match = {}
password_match["zsyh"] = "招商银行";
password_match["jsyh"] = "建设银行";
password_match["gsyh"] = "工商银行";
password_match["zgyh"] = "/^.{6,20}$/";
password_match["jtyh"] = "交通银行";
password_match["nyyh"] = "/^[0-9a-zA-Z_]{4,60}$/";
password_match["yzyh"] = "邮政银行";
password_match["xyyh"] = "兴业银行";
password_match["msyh"] = "民生银行";
password_match["zxyh"] = "中信银行";
password_match["hxyh"] = "华夏银行";
password_match["pfyh"] = "浦发银行";
password_match["gdyh"] = "光大银行";
password_match["qlyh"] = "齐鲁银行";
password_match["gxbbwyh"] = "广西北部湾";

var user_match = {}


var error_map = {};
error_map["00000"] = "成功";
error_map["10001"] = "登录流程问题";
error_map["10003"] = "获取验证码图片失败";
error_map["10004"] = "验证码错误";
error_map["10005"] = "用户名或者密码错误";
error_map["40002"] = "流水下载失败,请重试";
error_map["40003"] = "密码错误次数已超限";
error_map["40004"] = "该客户只能以用户名登录";
error_map["40005"] = "密码过于简单";
error_map["40006"] = "登录密码已连续输错";
error_map["40008"] = "手机动态密码已过期";
error_map["40009"] = "登录密码连续输错";
error_map["40010"] = "登录密码连续输错";
error_map["40011"] = "密码输入错误次数过多";
error_map["40012"] = "登录密码连续输错";
error_map["40013"] = "客户已冻结";
error_map["40014"] = "该用户为新注册用户";
error_map["40015"] = "未设置网上银行登录密码";
error_map["40016"] = "请登录网银进行身份认证";
error_map["40017"] = "您输入的卡号与实际不符";
error_map["40018"] = "暂不支持该银行";
error_map["40019"] = "无此交易的权限";
error_map["40020"] = "密码过于简单";
error_map["40021"] = "未注册我行网银";
error_map["40022"] = "暂不支持令牌动态密码登录";
error_map["40023"] = "无效登陆请求";
error_map["40024"] = "请不要重复提交";
error_map["40025"] = "服务过载,请稍后再试";
error_map["40026"] = "卡号格式格式问题";
error_map["40027"] = "用户名格式问题";
error_map["40028"] = "密码格式问题";
error_map["40029"] = "验证码格式问题";
error_map["40030"] = "部分下载成功";
error_map["90000"] = "网站未知错误,请重试";
error_map["40031"] = "不支持的登陆类型";
error_map["40032"] = "该网银账户没有绑定借记卡";
error_map["40033"] = "身份证号错误";
error_map["40034"] = "登录成功账户,卡号是无效账号,无法抓取.";

