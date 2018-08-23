// import {PAYPAL_CLIENT_ID, PAYPAL_KEY} from "./key";
// const PAYPAL_KEY = require('./key');
// const KEY  = require('./key');
const PAYPAL_CLIENT_ID = 'AdgmKNuKKp1LKF5B88yunNc0yBoYgMoNYyyp8BS-MkYF0axvnbo5NuASfMD18lW4ix0gdwYLRn9rutLq';
const PAYPAL_KEY = 'EBBNFHFpAzGGbI3h92Brj6UJuRBPCzdXt9inmHt8vCrOyQ_Y4vf7OrPLY_wDI1EjjXtOnuAXqpNmbwwd';
let token;

$('.paypal').on('click', () => {
	$.ajax({
		url: 'https://api.sandbox.paypal.com/v1/oauth2/token',
		method: 'POST',
		contentType: 'application/x-www-form-urlencoded',
		data: {'grant_type': 'client_credentials'},
		headers: {
			"Authorization": "Basic " + btoa(PAYPAL_CLIENT_ID + ":" + PAYPAL_KEY)
		},
	}).done(res => {
		pay(res.token_type, res.access_token);
	}).fail(err => {
		debugger
	})
});

const pay = (type, token) => {
	const data = {
			"intent": "sale",
			"redirect_urls": {
				"return_url": "http://localhost:5000/",
				"cancel_url": "http://localhost:5000/",
			},
			"payer": {
				"payment_method": "paypal",
			},
			"transactions": [{
				"amount": {
					"total": "0.99",
					"currency": "USD",
				}
			}]
		};
		console.log(data)
		console.log(type)
		console.log(token)
		console.log('~~~~~~~~~~~~~~~~')
	$.ajax({
		url: "https://api.sandbox.paypal.com/v1/payments/payment",
		method: "POST",
		contentType: "application/json",
		headers: {
			"Authorization": `${type} ${token}`,
			"Content-Type": "application/json",
		},
		data: JSON.stringify(data),
	}).done(res => {
		console.log(res)
		const url = res.links[1].href;
		const win = window.open(url, '_blank');
		win.focus();
		getPaymentInfo(res.links[0].href);
	}).fail(err => {
		debugger
	})
}

const getPaymentInfo = (url) => (
	$.ajax({
		url: `${url}`,
		method: 'GET',
		headers: {
			"Authorization": `Bearer ${token}`,
		}
	})
);

// paymentId=PAY-5K934118SP243731MLN7QYAQ&token=EC-2XH833443V7427748&PayerID=7N7HGTGG45FMY

const executePay = (url) => (
	$.ajax({
		url: `${url}`,
	})
)