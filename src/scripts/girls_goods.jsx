import React from 'react'
import ReactDOM from 'react-dom'
import components from './components.jsx'
import data from './content_girls';

var Header = components.Header;
var Footer = components.Footer;
var GoodsBodyGirls = components.GoodsBodyGirls;
var Cart = components.Cart;

class Goods extends React.Component {
	render() {
		return (
		<div>
		<Cart />
		<div id="wrapper">
			<Header />
			<GoodsBodyGirls data={this.props.data} />
			<Footer />
		</div>
		</div>
		)
	}
}
$(".age_text").click(function(e) {
	e.preventDefault();
	var section = $(this).attr("href");
	$("html, body").animate({scrollTop: $(section).offset().top
	}, 'slow');
})
ReactDOM.render(
	<Goods data={data}/>,
	document.getElementById('root')
);
$('a.cart_link').click(function(e) {
	$("#popup").css('display', 'block');
})