var locationHref = window.location.href;
var webDockURL = locationHref.substring(0, (locationHref.lastIndexOf('/') + 1));
console.log("webDockURL: " + webDockURL);

var openapiURL   = webDockURL + "api/proxy/openapi";
var visualapiURL = webDockURL + "api/proxy/visualapi";

var captchaURL   = webDockURL + "api/proxy/captcha";
var ocrURL       = webDockURL + "api/proxy/ocrapi";