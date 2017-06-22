import React from 'react'
import ReactDOM from 'react-dom'
import components from './components.jsx'

var Header = components.Header;
var MainPageAside = components.MainPageAside;
var MainPageArticle = components.MainPageArticle;
var Footer = components.Footer;
var Cart = components.Cart;

class App extends React.Component {
	render() {
		return (
		<div id="wrapper">
			<Cart />
			<Header />
			<div id="MainPageWrapper">
				<MainPageAside />
				<MainPageArticle />
			</div>
			<Footer />
		</div>
		)
	}
}
$(document).ready(function() {
	document.getElementById("train").style.left = '2000px';
	$("nav").find("a").click(function(e) {
		e.preventDefault();
		var section = $(this).attr("href");
		$("html, body").animate({scrollTop: $(section).offset().top
		}, 'slow');
	});

	$(window).on('resize', function() {
		if($(window).height() < 700) {
			$("[data-aos-anchor]").attr("data-aos-anchor", "")
			$("[data-aos-anchor-placement]").attr("data-aos-anchor-placement", "top-bottom")
		} else {
			$("[data-aos-anchor-placement]").attr("data-aos-anchor-placement", "top-center")
			$("#goto_top_arrow").attr("data-aos-anchor-placement", "top-top")
			$("#goto_top_arrow").attr("data-aos-anchor", "#welcome")
		}
	})
});
ReactDOM.render(
	<App />,
	document.getElementById('root')
)
$('a.cart_link').click(function(e) {
	$("#popup").css('display', 'block');
})