document.writeln("<div id=\'form\' class=\'form-body\' style=\'margin-bottom:20px;\'>");
document.writeln("	<div class=\'form-group\' id=\'div_userName\'>");
document.writeln("		<label class=\'control-label\'>真实姓名</label>");
document.writeln("		<input type=\'text\' id=\'txt_userName\' class=\'form-control\' placeholder=\'请输入真实姓名\'>");
document.writeln("	</div>");
document.writeln("	");
document.writeln("	<div class=\'form-group\' id=\'div_cardId\'>");
document.writeln("		<label class=\'control-label\'>身份证号</label>");
document.writeln("		<input type=\'text\' id=\'txt_cardId\' class=\'form-control\' placeholder=\'请输入身份证号\'>");
document.writeln("	</div>");
document.writeln("	");
document.writeln("	<div class=\'form-group\'>");
document.writeln("		<label class=\'control-label\'>手机号码</label>");
document.writeln("		<input type=\'tel\' id=\'txt_mobile\' class=\'form-control\' placeholder=\'请输入手机号码\'>");
document.writeln("	</div>");
document.writeln("	");
document.writeln("	<div class=\'form-group\' id=\'div_password_website\' style=\'display:none\'>");
document.writeln("		<label class=\'control-label\'>网站密码</label>");
document.writeln("		<div class=\'input-icon right\'>");
document.writeln("			<i id=\'i_see_password_website\' class=\'glyphicon glyphicon-eye-open\'></i>");
document.writeln("			<input type=\'password\' id=\'txt_password_website\' class=\'form-control\' placeholder=\'请输入网站密码\'>");
document.writeln("		</div>");
document.writeln("	</div>");
document.writeln("	");
document.writeln("	<div class=\'form-group\' id=\'div_password_service\' style=\'display:none\'>");
document.writeln("		<label class=\'control-label\'>服务密码</label>");
document.writeln("		<div class=\'input-icon right\'>");
document.writeln("			<i id=\'i_see_password_service\' class=\'glyphicon glyphicon-eye-open\'></i>");
document.writeln("			<input type=\'password\' id=\'txt_password_service\' class=\'form-control\' placeholder=\'请输入服务密码\'>");
document.writeln("		</div>");
document.writeln("	</div>");
document.writeln("	");
document.writeln("	<div class=\'form-group\' id=\'div_captcha\' style=\'display: none\'>");
document.writeln("		<label class=\'control-label\'>图片验证码</label>");
document.writeln("		<div class=\'input-group\'>");
document.writeln("			<input type=\'text\' id=\'txt_captcha\' class=\'form-control\' placeholder=\'请输入图片验证码\'>");
document.writeln("			<span class=\'input-group-addon\' style=\'padding: 0px\'>");
document.writeln("				<img id=\'img_captcha\' alt=\'验证码\' style=\'height:32px\'>");
document.writeln("			</span>");
document.writeln("		</div>");
document.writeln("	</div>");
document.writeln("	<div class=\'form-group\' id=\'div_login_sms_code\' style=\'display: none\'>");
document.writeln("		<label class=\'control-label\'>手机验证码</label>");
document.writeln("		<div class=\'input-group\'>");
document.writeln("			<input type=\'text\' id=\'txt_login_sms_code\' class=\'form-control\' placeholder=\'请输入手机短信验证码\'>");
document.writeln("			<span class=\'input-group-addon\' style=\'padding: 0px\'>");
document.writeln("				<button type=\'button\' class=\'btn default\' id=\'btn_login_sms_code\'  style=\'height:32px\'>获取验证码</button>");
document.writeln("			</span>");
document.writeln("		</div>");
document.writeln("	</div>");
document.writeln("	");
document.writeln("	<button class=\'btn btn-style btn-block margin-top-20 ladda-button\' id=\'btn_login\' data-style=\'expand-left\'>确定</button>");
document.writeln("	<div class=\'form-group form-md-checkboxes has-tone\' style=\'margin-top:20px\'>");
document.writeln("		<div class=\'md-checkbox-inline\'>");
document.writeln("			<i class=\'glyphicon glyphicon-info-sign tone\'></i>");
document.writeln("			<label class=\'tone\'>已授权该平台获悉我的运营商使用情况，平台会严格遵守个人隐私保密协议。</label>");
document.writeln("		</div>");
document.writeln("	</div>");

document.writeln("</div>");