$(window).on('load', function () {
	var $preloader = $('#page-preloader'),
		$spinner   = $preloader.find('.spinner');
	$spinner.fadeOut();
	$preloader.delay(350).fadeOut('slow');
	if (/#cart/g.test(window.location.href)) {
		document.getElementById('overlay').style.display = "flex";
		var url = window.location.href; // get the current url of page into variable
		if (url.indexOf('?') > -1) { // url has a '?'
			if(url.indexOf('reloaded') < 0) { // url does not have the text 'reloaded'
				 url = url + "&reloaded=true"; // add the word 'reloaded' to url
				 window.location = url; // "reload" the page
			} // https://stackoverflow.com/questions/33949631/how-to-reload-page-once-only-without-repeating-loading
		}
	}
	$(document).ready(function() {
		if (document.getElementById('popup').scrollHeight > $(window).height()) {
			$("#popup_center").css('overflow-y', 'scroll')
			$("#popup_center").css('height', '800px')
		}
	})
});
// Preloder, nothing useful to say for me