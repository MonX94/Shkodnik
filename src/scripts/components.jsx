import React from 'react';
import ReactDOM from 'react-dom';
var content = require('./cm_cont_gen')
import { default as swal } from 'sweetalert2'
//If you are doing this website, it is better to commit suicide
AOS.init()

//Timer used for photo.
function Timer(fn, t) {
	var timerObj = setInterval(fn, t);

	this.stop = function() {
		if (timerObj) {
			clearInterval(timerObj);
			timerObj = null;
		}
		return this;
	}

	// start timer using current settings (if it's not already running)
	this.start = function() {
		if (!timerObj) {
			this.stop();
			timerObj = setInterval(fn, t);
		}
		return this;
	}

	// start with new interval, stop current interval
	this.reset = function(newT) {
		t = newT;
		return this.stop().start();
	}
}

var currentPhoto = 1; // initiating counter

var autoNextPhoto = new Timer(function() {
	if (currentPhoto === 9) {
		currentPhoto = 0 //Hack
	}
	currentPhoto++;
}, 5000)

// Carousel methods, that used for photo in main page
function nextPhoto() {
	if (currentPhoto === 9) {
		currentPhoto = 0 //Hack
	}
	currentPhoto++;
	autoNextPhoto.reset(5000)
}
function prevPhoto() {
	if (currentPhoto === 1) {
		currentPhoto = 10 //Also Hack
	}
	currentPhoto--;
	autoNextPhoto.reset(5000)
}

function ArrowUp(){
	$('html, body').animate({scrollTop : 0}, 600);
};

class Carousel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {currentPhoto: currentPhoto};
	}
	componentDidMount() {
	this.timerID = setInterval(
		() => this.tick(), 100);
	}
	componentWillUnmount() {
		clearInterval(this.timerID);
	}
	tick() {
		this.setState({
			currentPhoto: currentPhoto
		});
	}
	render() {
		return (
			<div className="container">
				<div className="left-arrow-container" />
				<div className="image-slider-wrapper">
					<img className="carouselImage" src={"../../dist/images/00" + this.state.currentPhoto + ".jpg"} />
				</div>
				<div className="right-arrow-container" />
			</div>
		);
	}
}
// If there are any goods, it simply gains them. Else, empty object is initialized
function checkCart() {
	//проверяю наличие корзины в localStorage;
	if (localStorage.getItem('cart') != null) {
		return JSON.parse(localStorage.getItem('cart'));
	}
	return {};
}

var cart = checkCart();
function lsGoodSave(goodData) {
	document.getElementById('popup').style.display = 'block';
	// Data is stringified to be saved in localStorage
	var id = goodData.id;
	if (cart[id] != undefined) {
		cart[id]++;
	}
	else {
		cart[id] = 1;
	}
	saveCartToLS();
}

function arrayFlattener(arrToConvert) {
	var newArr = [];
	for(var i = 0; i < arrToConvert.length; i++) {
		newArr = newArr.concat(arrToConvert[i]);
	}
	return newArr;
}

function saveCartToLS() {
	//  Сохраняю в Local Storage
	localStorage.setItem('cart', JSON.stringify(cart));
}
function GoodsInCart() {
	if (localStorage.getItem('cart') !== null) {
		var goods = arrayFlattener(content)
		var cartData = {};
		for (var key in cart) {
			for (var i = 0; i < goods.length; i++) {
				if (goods[i].id == key) {
					var goodString = JSON.stringify(goods[i]);
					cartData[goodString] = cart[key];
				}
			}
		}
		return [Object.keys(cartData), Object.values(cartData)];
	} else {
		return false;
	}
}
function sendMail() {
	swal({
		title: 'Спасибо за покупку!',
		type: 'success',
		html: $('<div>')
			.addClass('some-class')
			.text('Для уточнения формы оплаты и доставки наш менеджер свяжется с Вами в ближайшее время.'),
		animation: false,
		customClass: 'animated tada'
	})
}
class GoodInCart extends React.Component {
	constructor(props) {
		super(props)
		self = this;
		self.state = {total_amount: 0}
		if (self.props.data[0] != undefined) {
			self.props.data[0].map(function(currentValue, index) {
				var item_amount = JSON.parse(localStorage.getItem('cart'))[JSON.parse(currentValue).id];
				var total_amount = item_amount * JSON.parse(currentValue).price;
				self.state = {total_amount: self.state.total_amount + total_amount}
			})
		}
	}
	checkSum() {
		self = this;
		if (self.props.data[0] != undefined) {
			self.props.data[0].map(function(currentValue, index) {
				var item_amount = JSON.parse(localStorage.getItem('cart'))[JSON.parse(currentValue).id];
				var total_amount = item_amount * JSON.parse(currentValue).price;
				self.state = {total_amount: self.state.total_amount + total_amount}
			})
		}
	}
	render() {
		var empty_message;
		empty_message = <div className="empty_cart">Корзина пуста!</div>
		return (
			<div id="cart_goods_wrapper">
				{this.props.data[0] != undefined ? this.props.data[0].map(function(currentValue, index) { /* Your code won't render, if it returns undefined */
						currentValue = JSON.parse(currentValue);
						var item_amount = JSON.parse(localStorage.getItem('cart'))[currentValue.id];
						return <GoodInCartReal key={index} currentValue={currentValue} item_amount={item_amount}/>
					}) : empty_message}
				{this.props.data[0] != undefined ? <div className="cart_summary">Итого: {this.state.total_amount} грн.</div> : ''}
			</div>
		)
	}
}
class GoodInCartReal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			amount: this.props.item_amount,
			display: 'block'
		}
	}
	render() {
		var currentValue = this.props.currentValue;
		var item_amount = this.props.item_amount;
		return (<div className="cart_good" style={{display: this.state.display}}>
			<div className="cart_good_image_block">
				<img className="cart_good_image" src={currentValue.image}/>
			</div>
			<div className="cart_good_not_image">
				<div className="cart_good_block_1">
					<div className="cart_good_title">{currentValue.name}</div>
					<div className="cart_good_id">{currentValue.id}</div>
					<div className="cart_good_desc">{currentValue.description}</div>
					<div className="cart_good_price">{"Цена: " + currentValue.price + " грн."}</div>
				</div>
				<div className="cart_good_block_2">
					<div className="cart_good_amount">
						<div className="cart_good_amount_title">Кол-во:</div>
						<div className="cart_good_count">
							<img className="cart_good_arrow" src="../../dist/images/play-button-up.png" onClick={() => {
								this.setState({amount: this.state.amount + 1});
								var cart = JSON.parse(localStorage.getItem('cart'));
								cart[currentValue.id]++;
								var cart = JSON.stringify(cart);
								localStorage.setItem('cart', cart)
								location.reload()
							}}/>
							<div className="cart_good_count_text">{this.state.amount}</div>
							<img className="cart_good_arrow" src="../../dist/images/play-button-down.png" onClick={() => {
								this.setState({amount: this.state.amount - 1});
								var cart = JSON.parse(localStorage.getItem('cart'));
								if (this.state.amount >= 2) {
									cart[currentValue.id]--;
									var cart = JSON.stringify(cart);
									localStorage.setItem('cart', cart)
								} else {
									cart[currentValue.id] = undefined;
									var cart = JSON.stringify(cart);
									localStorage.setItem('cart', cart)
									if (Object.keys(cart).length <= 1) {
										localStorage.removeItem('cart')
									}
									this.setState({display: 'none'})
								}
								location.reload()
								}}/>
						</div>
					</div>
					<div className="cart_good_total_title">Сумма:
						<div className="cart_good_total"> {currentValue.price * this.state.amount} грн.</div>
					</div>
				</div>
			</div>
		</div>
		)
	}
}
class GoodInCartPage extends GoodInCartReal {
	render() {
		var currentValue = this.props.currentValue;
		var item_amount = this.props.item_amount;
		return (
		<div className="cart_good_unique" style={{display: this.state.display}}>
			<div className="cart_good_image_block_unique">
				<img className="cart_good_image_unique" src={currentValue.image}/>
			</div>
			<div className="cart_good_not_image">
				<div className="cart_good_id_unique">{currentValue.id}</div>
				<div className="cart_good_name_unique">{currentValue.name}</div>
				<div className="cart_count_and_total">
					<div className="cart_good_count">
						{this.state.amount} шт.
					</div>
					<div className="cart_good_total"> {currentValue.price * this.state.amount} грн.</div>
				</div>
			</div>
		</div>
		)
	}
}
var Good = function(props) {
	return (
		<div className="good">
			<a href={props.imageUrl} data-lightbox={props.Name} data-title={props.Name}><img className="good_photo" src={props.imageUrl}/></a>
			<p className="good_name">{props.Name + " " + props.id}</p>
			<div className="good_desc">
				{props.Desc}
			</div>
			<div className="good_buy_and_price">
			<div className="good_price">{props.Price + " грн"}
			</div>
			<div className="good_buy" onClick={() => {
				lsGoodSave(props);
				if (/cart$/.test(window.location.href)) {
					location.reload(true);
				} else {
					document.location.assign(document.location.href + "#cart");
					location.reload(true);
				};
			}}>
				<img className="buy_cart" src="../../dist/images/cart.svg" width="40%" height="100%"/>
				<div className="buy_text">
					Купить
				</div>
			</div>
			</div>
		</div>
	)
}
// class GoodInCart extends React.Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {amount: JSON.parse(localStorage.getItem('cart'))[this.props.id]}
// 	}
// 	upgradeAmount() {
// 		this.setState({amount: this.state.amount + 1})
// 		cart = JSON.parse(localStorage.getItem('cart'))
// 		cart[this.props.id] += 1;
// 		localStorage.setItem('cart', JSON.stringify(cart))
// 	}
// 	render() {
// 		// We get good id in props
// 		// Amount of bought goods lies in cart[id] (cart = {..., id: amount, ...})
// 		return (
// 			<div className="good">
// 				<a href={this.props.imageUrl} data-lightbox={this.props.Name} data-title={this.props.Name}><img className="good_photo" src={this.props.imageUrl}/></a>
// 				<p className="good_name">{this.props.Name}</p>
// 				<div className="good_price">{this.props.Price * this.state.amount + " UAH"}
// 				</div>
// 				<div className="good_buy">
// 					<img className="buy_cart" onClick={() => {this.upgradeAmount()}} src="../../dist/images/cart.png" width="40%" height="100%"/>
// 					<div className="buy_text" onClick={() => {this.upgradeAmount()}}>
// 						Купить ({this.state.amount})
// 					</div>
// 				</div>
// 			</div>
// 		)
// 	}
// }
function SidebarFilterBoys() {
	return (
		<div className="sidebar_filter">
			<div className="categories_title">Возрастные категории</div>
			<div className="filter_space first">
				<img src="../../dist/images/age_boys_0-1.jpg"/>
				<a className="age_text" href="#zeroto1"> от 0 до 1 года</a>
			</div>
			<div className="filter_space second">
				<img src="../../dist/images/age_boys_2-5.jpg"/>
				<a className="age_text" href="#twoto5"> от 2 до 5 лет</a>
			</div>
			<div className="filter_space third">
				<img src="../../dist/images/age_boys_6-9.jpg"/>
				<a className="age_text" href="#sixto9"> от 6 до 9 лет</a>
			</div>
			<div className="filter_space fourth">
				<img src="../../dist/images/age_boys_10-15.jpg" height="100%"/>
				<a className="age_text" href="#tento15"> от 10 до 15 лет</a>
			</div>
		</div>
	)
}
function SidebarFilterGirls() {
	return (
		<div className="sidebar_filter">
			<div className="categories_title">Возрастные категории</div>
			<div className="filter_space first">
				<img src="../../dist/images/age_girls_0-1.jpg"/>
				<a className="age_text" href="#zeroto1"> от 0 до 1 года</a>
			</div>
			<div className="filter_space second">
				<img src="../../dist/images/age_girls_2-5.jpg"/>
				<a className="age_text" href="#twoto5"> от 2 до 5 лет</a>
			</div>
			<div className="filter_space third">
				<img src="../../dist/images/age_girls_6-9.jpg"/>
				<a className="age_text" href="#sixto9"> от 6 до 9 лет</a>
			</div>
			<div className="filter_space fourth">
				<img src="../../dist/images/age_girls_10-15.jpg" height="100%"/>
				<a className="age_text" href="#tento15"> от 10 до 15 лет</a>
			</div>
		</div>
	)
}
module.exports = {
	cart: cart,
	GoodsBodyBoys(props) {
		return (
			<div id="goods_body">
				<div id="loadout">
					<a href="javascript:(function(){s=document.createElement('script');s.setAttribute('type','text/javascript');s.setAttribute('src','https://sliza.ru/core/cross_parser.php?r='+Math.random()+'&t=script');document.body.appendChild(s);})();">
						<img src="../../dist/images/Выгрузить.png" height="229" width="45" />
					</a>
				</div>
				<SidebarFilterBoys />
				<div id="goods_container">
					<div className="heading" id="zeroto1">От 0 до 1 года</div>
					<div className="size_table_wrapper"><img src="../../dist/images/Table1.jpg" className="size_table"/></div>
						{props.data[0].map((good, i) => {
							return <Good key={i} imageUrl={good.image} Name={good.name} Price={good.price} Desc={good.description} id={good.id} />
						})}
					<div className="heading" id="twoto5">От 2 до 5 лет</div>
					<div className="size_table_wrapper"><img src="../../dist/images/Table2.jpg" className="size_table"/></div>
						{props.data[1].map((good, i) => {
							return <Good key={i} imageUrl={good.image} Name={good.name} Price={good.price} Desc={good.description} id={good.id} />
						})}
					<div className="heading" id="sixto9">От 6 до 9 лет</div>
					<div className="size_table_wrapper"><img src="../../dist/images/Table3.jpg" className="size_table"/></div>
						{props.data[2].map((good, i) => {
							return <Good key={i} imageUrl={good.image} Name={good.name} Price={good.price} Desc={good.description} id={good.id} />
						})}
					<div className="heading" id="tento15">От 10 до 15 лет</div>
					<div className="size_table_wrapper"><img src="../../dist/images/Table4.jpg" className="size_table"/></div>
						{props.data[3].map((good, i) => {
							return <Good key={i} imageUrl={good.image} Name={good.name} Price={good.price} Desc={good.description} id={good.id} />
						})}
				</div>
			</div>
		)
	},
	GoodsBodyGirls(props) {
		return (
			<div id="goods_body">
				<div id="loadout">
					<a href="javascript:(function(){s=document.createElement('script');s.setAttribute('type','text/javascript');s.setAttribute('src','https://sliza.ru/core/cross_parser.php?r='+Math.random()+'&t=script');document.body.appendChild(s);})();">
						<img src="../../dist/images/Выгрузить.png" height="229" width="45" />
					</a>
				</div>
				<SidebarFilterGirls />
				<div id="goods_container">
					<div className="heading" id="zeroto1">Возраст от 0 до 1 года</div>
					<div className="size_table_wrapper"><img src="../../dist/images/Table1.jpg" className="size_table"/></div>
						{props.data[0].map((good, i) => {
							return <Good key={i} imageUrl={good.image} Name={good.name} Price={good.price} Desc={good.description} id={good.id} />
						})}
					<div className="heading" id="twoto5">Возраст от 2 до 5 лет</div>
					<div className="size_table_wrapper"><img src="../../dist/images/Table2.jpg" className="size_table"/></div>
						{props.data[1].map((good, i) => {
							return <Good key={i} imageUrl={good.image} Name={good.name} Price={good.price} Desc={good.description} id={good.id} />
						})}
					<div className="heading" id="sixto9">Возраст от 6 до 9 лет</div>
					<div className="size_table_wrapper"><img src="../../dist/images/Table3.jpg" className="size_table"/></div>
						{props.data[2].map((good, i) => {
							return <Good key={i} imageUrl={good.image} Name={good.name} Price={good.price} Desc={good.description} id={good.id} />
						})}
					<div className="heading" id="tento15">Возраст от 10 до 15 лет</div>
					<div className="size_table_wrapper"><img src="../../dist/images/Table4.jpg" className="size_table"/></div>
						{props.data[3].map((good, i) => {
							return <Good key={i} imageUrl={good.image} Name={good.name} Price={good.price} Desc={good.description} id={good.id} />
						})}
				</div>
			</div>
		)
	},
	Header() {
		return (
			<header>
				<div>
					<a href="index.html"><img id="header_logo" src="./dist/images/Logo.png" alt="Фото нет"/></a>
				</div>
				<div className="navbar">
					<ul className="navbar_item_father">
						<li className="navbar_item"><div className="navbar_link_wrap"><a className="navbar_link" href="/">Главная</a></div></li>
						<li className="navbar_item"><div className="navbar_link_wrap"><a className="navbar_link" href="/boys">Акции</a></div></li>
						<li className="navbar_item">
							<div className="navbar_link_wrap">Товары</div>
							<ul><li className="boys_dropdown"><a href="/boys">Для мальчиков</a></li><li className="girls_dropdown"><a href="/girls">Для девочек</a></li></ul></li>
						<li className="navbar_item"><div className="navbar_link_wrap"><a className="navbar_link  cart_link" href="#cart" onClick={() => {location.reload()}}>Корзина</a></div></li>
						<li className="navbar_item"><div className="navbar_link_wrap"><a className="navbar_link" href="/boys">Контакты</a></div></li>
					</ul>
				</div>
			</header>
		) // Шапка сайта
	},
	Cart(props) {
		return (
			<div id="overlay">
			<div id="popup">
				<div className="popup_undercover">
					<div className="popup_title">ВАШ ЗАКАЗ</div>
					<div id="popup_center">
					<GoodInCart data={GoodsInCart()}/>
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
						<div className="popup_button" onClick={() => {
							window.location.href = "http://127.0.0.1/cart"
						}}>Оформить заказ</div>
					</div>
				</div>
			</div>
			</div>
		)
	},
	MainPageAside() {
		//+38 (097) 559 15 55
		//+38 (063) 653 30 78
		//Ещё Viber: это предыдущий номер
		return (
			<aside>
				<nav>
					<img data-aos="fade-right" data-aos-anchor="#welcome" data-aos-anchor-placement="top-top" id="goto_top_arrow" onClick={() => ArrowUp()} src="../../dist/images/upload.png" />
					<div className="nav_link_container"><a className="nav_link" href="#welcome"> Добро пожаловать</a></div>
					<div className="nav_link_container"><a className="nav_link" href="#history"> Условия работы с нами</a></div>
					<div className="nav_link_container"><a className="nav_link" href="#feedbacks"> Оплата и доставка</a></div>
					<div className="nav_link_container"><a className="nav_link" href="#leave_feedback"> Оставить свой отзыв</a></div>
					<Carousel />
				</nav>
			</aside>
		); //Колонка сбоку на главной
	},
	MainPageArticle() {
		return (
			<article>
				<img id="train" src="../../dist/images/train.png" />
				<h1 id="welcome" data-aos="fade-right" data-aos-anchor-placement="top-center" data-aos-once="true" className="heading">Shkodnik - магазин детских товаров</h1>
				<p data-aos="zoom-out-up" data-aos-anchor="#welcome" data-aos-anchor-placement="top-center" data-aos-once="true">
				<b>Добро пожаловать!</b> У нас Вы можете купить качественную детскую одежду по лучшим ценам.
Наш интернет магазин тесно сотрудничает с турецкими, китайскими и украинскими производителями. Предлагаем широкий ассортимент стильной и яркой одежды для детей. Повседневные и торжественные наряды на любой случай. Очень удобная и качественная одежда придется по вкусу Вашим маленьким принцессам и джентльменам.
Мы стараемся обеспечить высокий уровень обслуживания. Индивидуальный подход к каждому клиенту - для нас это не просто слова!
				</p>
				<p data-aos="zoom-out-up" data-aos-anchor="#welcome" data-aos-anchor-placement="top-center" data-aos-once="true">
Shkodnik способен сделать многое для клиента, так как
клиент - это основа любого бизнеса, потому что он, и только он платит нам деньги. Именно поэтому мы уделяем большое внимание Вашим потребностям, и работаем на Вас!
Мы постоянно учимся на своих ошибках и постепенно приобретаем опыт, благодаря общению с Вами, поэтому, мы максимально продуктивны в первую очередь при активном сотрудничестве со своими клиентами, ведь в таких условиях, Мы осознаём, что надо Вам, и что можем мы.</p>
<h2 id="history" data-aos="fade-left" data-aos-anchor="#history_last_paragraph" data-aos-anchor-placement="top-center" data-aos-once="true" className="heading">Условия работы с нами</h2>
<p data-aos="zoom-out-down" data-aos-anchor="#history_last_paragraph" data-aos-anchor-placement="top-center" data-aos-once="true">
				<b>Для Украины:</b><br />
1. <a href="https://ru.wikipedia.org/wiki/%D0%9F%D1%80%D1%8F%D0%BC%D0%B0%D1%8F_%D0%BF%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BA%D0%B0">Дропшипперы</a> - отправка клиенту от 1 ед. + 10грн к цене на сайте.<br />
<img style={{margin:20}} src="../../dist/images/drop.png" height="500" width="1000" /><br/>
2. <a href="https://ru.wikipedia.org/wiki/%D0%9E%D0%BF%D1%82%D0%BE%D0%B2%D0%B0%D1%8F_%D1%82%D0%BE%D1%80%D0%B3%D0%BE%D0%B2%D0%BB%D1%8F">Оптовики</a> - опт от 3 ед. разного товара.<br />
<img style={{margin:20}} src="../../dist/images/dropshipping.jpg" height="343" width="680" /><br/>
3. <a href="https://ru.wikipedia.org/wiki/%D0%A1%D0%BE%D0%B2%D0%BC%D0%B5%D1%81%D1%82%D0%BD%D0%B0%D1%8F_%D0%BF%D0%BE%D0%BA%D1%83%D0%BF%D0%BA%D0%B0">СП</a> - 
 закупка от 5 ед любой модели.
 Цена оптовая (-15% от цены на сайте).
<img style={{margin: 10}} src="../../dist/images/sp.jpg" height="531" width="704" /><br />
Как стать <a href="https://ru.wikipedia.org/wiki/%D0%A1%D0%BE%D0%B2%D0%BC%D0%B5%D1%81%D1%82%D0%BD%D0%B0%D1%8F_%D0%BF%D0%BE%D0%BA%D1%83%D0%BF%D0%BA%D0%B0">СП</a> -
 создать закупку в соц. сетях, загрузив наш товар, при этом указав наши оптовые цены.<br /><br />
<b>Для России и стран СНГ :</b><br />
1. Есть опт и розница - опт от 7 ед разного товара.<br /><br />
</p>
<div id="feedbacks" data-aos="fade-right" data-aos-anchor="#feedbacks" data-aos-anchor-placement="top-center" data-aos-once="true" className="heading">Оплата и доставка</div>
<p data-aos="zoom-out-up" data-aos-anchor="#feedbacks" data-aos-anchor-placement="top-center" data-aos-once="true">
<b>Способы оплаты:</b><br /><br />
<b>Украина:</b><br />
- на карту Приватбанка<br /><br />
</p>
<p data-aos="zoom-out-up" data-aos-anchor="#feedbacks" data-aos-anchor-placement="top-center" data-aos-once="true">
1. Перевод средств на карту Приват Банка через Приват24.<br />
Для оплаты Вам необходимо:<br />
- Войти в Ваш аккаунт <a href="https://www.privat24.ua">Приват 24</a><br />
- Перейти на вкладку «Все услуги»<br />
- Выбрать «Перевод на карту Приват Банка»<br />
- Выбрать Вашу карту, с которой Вы хотите сделать перевод денежных средств<br />
- В поле «На карту» ввести номер карты из письма, которое было выслано на Ваш e-mail после оформления заказа<br />
- В поле «Сумма» ввести сумму из письма, которое было выслано на Ваш e-mail после оформления заказаНажать кнопку «В корзину» и «Подтвердить»<br />
 Внимание ― комиссия банка составляет 0.5% от суммы заказа, включена в счёт заказа!
</p>
<p data-aos="zoom-out-up" data-aos-anchor="#feedbacks" data-aos-anchor-placement="top-center" data-aos-once="true">
2. Пополнение в Терминале на карту Приватбанка.<br />
Для оплаты Вам необходимо:<br />
- Выбрать пункт «Банковские операции»<br />
- Затем пункт «Пополнение карты по номеру»<br />
- Ввести номер карты из письма, которое было выслано на Ваш e-mail после оформления заказа<br />
- Нажать «Далее» и внести сумму из письма, которое было выслано на Ваш e-mail после оформления заказа. Затем нажать кнопку «Оплатить»<br />
Внимание ― комиссия банка составляет 0.5% от суммы заказа, включена в счёт заказа!
</p>
<p data-aos="zoom-out-up" data-aos-anchor="#feedbacks" data-aos-anchor-placement="top-center" data-aos-once="true">
Внимание? если Вы используете Терминал не Приват Банка, а любой другой терминал тогда учитывайте дополнительную комиссию!<br />
 Пополнение карты Приватбанка с любых карт через сайт Приват Банка.<br />
</p>
<p data-aos="zoom-out-up" data-aos-anchor="#feedbacks" data-aos-anchor-placement="top-center" data-aos-once="true">
3. Пополнение карты Приватбанка с любых карт через сайт Приват Банка.<br />
Для оплаты Вам необходимо:<br />
- Перейти на <a href="https://sendmoney.privatbank.ua/ru/">Сайт Приват Банка</a><br />
- Ввести данные Вашей карты в поле «Номер карты отправителя»<br />
- Ввести номер карты из письма, которое было выслано на Ваш e-mail после оформления заказа в поле «Номер карты получателя»<br />
- В поле «Сумма перевода» ввести из письма, которое было выслано на Ваш e-mail после оформления заказа и нажмите кнопку «Отправить деньги»<br />
- В поле «Номер телефона» Ввести Ваш номер телефона и нажать кнопку «Получить СМС-пароль», в поле «ОТП-пароль» ввести пароль из СМС и «Подтвердить платёж»<br />
Внимание ― комиссия банка составляет 0.5% от суммы заказа, включена в счёт заказа!
</p>
<p data-aos="zoom-out-up" data-aos-anchor="#feedbacks" data-aos-anchor-placement="top-center" data-aos-once="true">
4. Пополнение карты Приват Банка через Кассу в отделении Банка.<br />
Для оплаты Вам необходимо:<br />
- Подойти в Кассу любого отделения Банка<br />
- У Кассира пополнить карту из письма, которое было выслано на Ваш e-mail после оформления заказа<br />
Внимание ― комиссия банка составляет 0.5% от суммы заказа, включена в счёт заказа!<br />
Внимание - если Вы оплачиваете в Кассе НЕ Приват Банка, а в любом другом Банке, тогда учитывайте дополнительную комиссию!<br />
Видеоинструкции ПриватБанка<br /><br />

1. <a href="https://www.youtube.com/watch?v=DxCxoxG3OJo">Перевод средств на карту Приват Банка через Приват24</a><br />
2. <a href="https://www.youtube.com/watch?v=cp8Fn7cz6EQ">Пополнение в Терминале на карту Приватбанка</a><br />
3. <a href="https://www.youtube.com/watch?v=x4oGjWvT2nc">Пополнение карты Приватбанка с любых карт через сайт Приват Банка</a><br />
</p>
<p data-aos="zoom-out-up" data-aos-anchor="#feedbacks" data-aos-anchor-placement="top-center" data-aos-once="true">
<b>Россия и страны СНГ :</b><br />
- на карту Сбербанка:<br />
</p>
<p data-aos="zoom-out-up" data-aos-anchor="#feedbacks" data-aos-anchor-placement="top-center" data-aos-once="true">
Онл@йн оплата с сайта<br />
<br />
Оплата через <a href="https://online.sberbank.ru">Сбербанк Онл@йн</a><br />
Лимит при оплате через "Сбербанк Онлайн" составляет 100 000 Российских рублей в сутки. Повысить лимит платежа до 500 000 рублей можно подтвердив платеж в контактном центре Сбербанка. Для этого позвоните по номеру горячей линии Сбербанка: 8 (800) 555 5550. При проведении оплаты фильтр "Регион оплаты" должен быть настроен на "Все регионы"!
</p>
<p data-aos="zoom-out-up" data-aos-anchor="#feedbacks" data-aos-anchor-placement="top-center" data-aos-once="true">
{/*- перевод (Western Union, MoneyGram).<br />*/}
</p>
<p data-aos="zoom-out-up" data-aos-anchor="#feedbacks" data-aos-anchor-placement="top-center" data-aos-once="true">
<b>Способы доставки:</b><br /><br />
<b>Украина:</b><br />
- <a href="https://novaposhta.ua/">Новая Почта</a> <br />
- <a href="https://intime.ua/">Ин Тайм </a><br />
- <a href="www.delivery-auto.com/">Деливери</a><br />
- <a href="ukrposhta.ua/">Укрпочта</a><br /><br/>
<b>Россия и страны СНГ :</b><br />
- Курьером до Белгорода<br />
- Поезд<br />
- Автобус<br />
Стоимость услуги курьера 100 грн. за 1 кг. - примерно 250 руб.<br />
Далее: <br />
- <a href="https://pecom.ru/">ПЭК </a><br />
- <a href="https://www.dellin.ru/">Деловые Линии</a><br />
- <a href="http://www.cse.ru/">Курьер-сервис Экспресс</a><br />
- <a href="https://www.baikalsr.ru/">Байкал Сервис </a><br />
- <a href="https://www.jde.ru/">ЖелДорЭкспедиция </a><br />
- <a href="https://www.pochta.ru/">Почта России </a><br />
- <a href="https://tk-kit.ru/">КИТ </a><br />
- <a href="https://ukrposhta.ua/">Укрпочта </a><br />
</p>
<div id="leave_feedback" data-aos="fade-right" data-aos-anchor-placement="top-center" data-aos-once="true" className="heading">Оставить свой отзыв</div>
<p>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur malesuada dolor nec justo bibendum, non cursus justo pulvinar. Cras rutrum, sapien vel vehicula euismod, dui massa vestibulum nisi, ut bibendum ante purus non nisl. Donec eget elementum lacus, eu rhoncus augue. Pellentesque vehicula, ligula eu porta consequat, ipsum orci finibus velit, eget suscipit enim elit rutrum lorem. Nunc sed suscipit velit, quis eleifend risus. Quisque in nibh eu ipsum sollicitudin posuere at eu nisi. Maecenas rhoncus ex est, nec suscipit sem ultrices et. Vestibulum eget viverra nibh, eget vulputate ante. Suspendisse pulvinar condimentum pulvinar. In magna ex, dapibus a dolor et, tincidunt consequat nibh. Maecenas iaculis dui eu tortor pulvinar dapibus. Donec id magna gravida, pellentesque augue at, ullamcorper diam. Fusce sed volutpat dolor.
</p>
</article>
		);
	},
	CartPage() {
		var goods = GoodsInCart()
		var empty_message = <div className="empty_cart">Корзина пуста!</div>
		var total_price = 0
		if (goods[0] != undefined) {
			goods[0].map(function(currentValue, index) {
				var item_amount = JSON.parse(localStorage.getItem('cart'))[JSON.parse(currentValue).id];
				var total_amount = item_amount * JSON.parse(currentValue).price;
				total_price += total_amount
			})
		}
		return (
			<div className="cart_wrap">
				<div className="cart_title">
					Оформление заказа
				</div>
				<div className="cart_contact_block">
					<div className="cart_title">Личные данные</div>
					<div className="cart_line">
						<span className="cart_line_text">Имя и фамилия</span>
						<input type="text" className="cart_input" required/>
					</div>
					<div className="cart_line">
						<span className="cart_line_text">Город</span>
						<input type="text" className="cart_input" required/>
					</div>
					<div className="cart_line">
						<span className="cart_line_text">Номер телефона</span>
						<input type="text" className="cart_input" required/>
					</div>
					<div className="cart_line">
						<span className="cart_line_text">Электронная почта</span>
						<input type="text" className="cart_input"/>
					</div>
					<div className="cart_continue_wrap"><button className="cart_continue" onClick={() => {sendMail()}}>Далее</button></div>
				</div>
				<div className="cart_cart_block">
					<div className="cart_good_collection">
					{goods[0] != undefined ? goods[0].map(function(currentValue, index) { /* Your code won't render, if it returns undefined */
						currentValue = JSON.parse(currentValue);
						var item_amount = JSON.parse(localStorage.getItem('cart'))[currentValue.id];
						return <GoodInCartPage key={index} currentValue={currentValue} item_amount={item_amount}/>
					}) : empty_message
					}
					{goods[0] != undefined ? <div className="cart_good_total_unique">Итого: {total_price} грн.</div> : ''}
					</div>
				</div>
			</div>
		)
	},
	Footer() {
		return (
			<div id="footer">
				<div id="footer_logo_container">
					<img id="footer_logo" src="../../dist/images/LogoInverted.png"></img>
				</div>
				<div id="social_button_container">
					<div id="social-title">Мы в соцсетях:</div>
					<div id="social-icons">
						<div className="social_icon"><a className="facebook" href="https://www.facebook.com/profile.php?id=100017146211197"> f </a></div>
						<div className="social_icon"><a className="twitter" href="#"> t </a></div>
						<div className="social_icon"><a className="vk" href="https://vk.com/club144641571"> v </a></div>
						<div className="social_icon"><a className="uzhas" href="#"> o </a></div>
					</div>
				</div>
				<div id="copyright">
					Ⓒ  Shkodnik Inc. 2017 <br />
						Made By Roman Kurgan
				</div>
			</div>
		)
	}
}
// CartBody(props) {
// 	cart = JSON.parse(localStorage.getItem('cart'));
// 	var currentItem = JSON.parse(localStorage.getItem('currentItem'));
// 	if (cart == null) {
// 		return <div id="cart_body"><div id="empty_cart">Товаров в корзине нет!</div></div>;
// 	} else {
// 		return (
// 			<div id="goods_body">
// 				<GoodInCart imageUrl={currentItem.imageUrl} Name={currentItem.Name} Price={currentItem.Price} Tags={currentItem.Tags} Desc={currentItem.Desc} id={currentItem.id} />
// 			</div>
// 		);
// 	}
// }
