
Show_message = function(msg, type) {
	$("#message_box_text").html(msg);
	$("#message_box").fadeIn(500);
	setTimeout(function() {
		$("#message_box").fadeOut(1000);
	}, 4000);
}
