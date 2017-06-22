import React from 'react'
import ReactDOM from 'react-dom'
import components from './components.jsx'

var Header = components.Header;
var Footer = components.Footer;
var Cart = components.Cart;
var CartPage = components.CartPage;

class App extends React.Component {
	render() {
		return (
		<div id="wrapper">
			<Cart />
			<Header />
			<div id="CartWrapper">
			<CartPage />
			</div>
			<Footer />
		</div>
		)
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('root')
)