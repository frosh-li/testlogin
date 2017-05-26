//共用css
var cssPathPrefix = ''; //默认值
try{cssPathPrefix = pathPrefix;}catch(e){}
document.writeln("<link href=\'" + cssPathPrefix + "assets/plugin/pace/themes/pace-theme-flash.css\' rel=\'stylesheet\' type=\'text/css\'>");
document.writeln("<link href=\'" + cssPathPrefix + "assets/global/css/font.css\' rel=\'stylesheet\' type=\'text/css\'>");
document.writeln("<link href=\'" + cssPathPrefix + "assets/plugin/font-awesome/css/font-awesome.min.css\' rel=\'stylesheet\' type=\'text/css\'>");
document.writeln("<link href=\'" + cssPathPrefix + "assets/plugin/simple-line-icons/simple-line-icons.min.css\' rel=\'stylesheet\' type=\'text/css\'>");
document.writeln("<link href=\'" + cssPathPrefix + "assets/plugin/bootstrap2/css/bootstrap.min.css\' rel=\'stylesheet\' type=\'text/css\'>");
document.writeln("<link href=\'" + cssPathPrefix + "assets/plugin/uniform/css/uniform.default.css\' rel=\'stylesheet\' type=\'text/css\'>");
document.writeln("");
document.writeln("<link href=\'" + cssPathPrefix + "assets/global/css/components-rounded.css\' id=\'style_components\' rel=\'stylesheet\' type=\'text/css\'>");
document.writeln("<link href=\'" + cssPathPrefix + "assets/global/css/layout.css\' rel=\'stylesheet\' type=\'text/css\'>");
document.writeln("<link href=\'" + cssPathPrefix + "assets/global/css/themes/default.css\' rel=\'stylesheet\' type=\'text/css\' id=\'style_color\'>");

