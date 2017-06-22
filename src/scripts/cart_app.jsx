import React from 'react';
import ReactDOM from 'react-dom';

function checkCart() {
	//проверяю наличие корзины в localStorage;
	if (localStorage.getItem('cart') != null) {
		return JSON.parse(localStorage.getItem('cart'));
	}
	return null;
}

var cart = checkCart()

class cartApp extends React.Component {
	constructor() {
		super()
		self = this;
		this.state = {
			total_cost: 0
		}
		for (var key in cart) {
			this.state.key = cart.key;
		}
		if (self.props.data[0] != undefined) {
			self.props.data[0].map(function(currentValue, index) {
				var item_amount = JSON.parse(localStorage.getItem('cart'))[JSON.parse(currentValue).id];
				var total_amount = item_amount * JSON.parse(currentValue).price;
				self.state = {total_amount: self.state.total_amount + total_amount}
			})
		}
	}
	total_cost: this.state.total_cost,
	Update() {
		self = this;
		if (self.props.data[0] != undefined) {
			self.props.data[0].map(function(currentValue, index) {
				var item_amount = JSON.parse(localStorage.getItem('cart'))[JSON.parse(currentValue).id];
				var total_cost = item_amount * JSON.parse(currentValue).price;
				self.state = {total_cost: self.state.total_cost + total_cost}
			})
		}
	}

	AddGood(item) {
		this.setState({[item[id]]: this.state.item[id] + 1});
		var cart = JSON.parse(localStorage.getItem('cart'));
		cart[item.id]++;
		var cart = JSON.stringify(cart);
		localStorage.setItem('cart', cart)
		Update()
	}

	RemoveGood(item) {
		var cart = JSON.parse(localStorage.getItem('cart'));
		if (this.state.item[id] >= 2) {
			cart[item.id]--;
			var cart = JSON.stringify(cart);
			localStorage.setItem('cart', cart)
		} else {
			cart[item.id] = undefined;
			var cart = JSON.stringify(cart);
			localStorage.setItem('cart', cart)
			if (Object.keys(cart).length <= 1) {
				localStorage.removeItem('cart')
			}
			this.setState({[item[id]]: 'none'})
		}
		Update()
	}

	render() {
		return (
			<div id="overlay">
			<div id="popup">
				<div className="popup_undercover">
					<div className="popup_title">ВАШ ЗАКАЗ</div>
					<div className="popup_center">
					<GoodInCart total_amount={this.state.total_amount} AddGood={this.AddGood} RemoveGood={this.RemoveGood} data={GoodsInCart()}/>
					</div>
					<div className="popup_buttons">
						<div className="popup_button" onClick={() => {
						if (window.location.href == "http://127.0.0.1/boys#cart" || window.location.href == "http://127.0.0.1/girls#cart") {
							window.location.href = window.location.href.replace("#cart", "");
						} else {
							window.location.href = "http://127.0.0.1/boys"
						}}}>Вернуться к покупкам</div>
						<div className="popup_button" onClick={() => {
							localStorage.clear()
							location.reload(true)
						}}>Очистить корзину</div>
						<div className="popup_button">Оформить заказ</div>
					</div>
				</div>
			</div>
			</div>
		)
	}
}

module.exports = cartApp;