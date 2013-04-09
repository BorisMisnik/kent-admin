$(document).ready(function() {

    var swfVersionStr = "10.1.0";
    var xiSwfUrlStr = "/swf/playerProductInstall.swf";
    var flashvars = {};
    var params = {};
    params.quality = "high";
    params.bgcolor = "#ffffff";
    params.allowscriptaccess = "sameDomain";
    params.allowfullscreen = "true";
    params.wmode="transparent"
    var attributes = {};
    attributes.id = "RothmansWebCam";
    attributes.name = "RothmansWebCam";
    attributes.align = "middle";

    swfobject.embedSWF(
        "/swf/rothmansWebCam.swf", "flashContent",
        "610", "425",
        swfVersionStr, xiSwfUrlStr,
        flashvars, params, attributes
    );
    
    swfobject.createCSS("#flashContent", "display:block;text-align:left;");
    
    $("#webcambtn").click(function(){
		
		$(".popup-wrap").fadeIn();    
		$("#webcam_popup").fadeIn();    
		$(".popup_reg").fadeOut();
			    
    });
    
    $(".popup__close").click(function(){
		$("#webcam_popup").fadeOut();
		$(".popup-wrap").fadeOut();
		$(".popup_reg").fadeIn();	    
    });
    

});

function putWebcamPhoto( photoBase64 ) {
    $("#fileWebcamPhoto").val(photoBase64);
    $("#webcam_popup").fadeOut();
    $(".popup-wrap").fadeOut();
    $(".popup_reg").fadeIn();
    $("#photoPreview").attr("src", "data:image/jpeg;base64,"+photoBase64);
}

function _fakeJpeg() {
    putWebcamPhoto( '' );
}

