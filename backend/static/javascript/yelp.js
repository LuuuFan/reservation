$(document).ready(() => {
	const today = new Date().toISOString().split('T')[0];
	const dateInput = $('#date');
	dateInput.val(today);
	dateInput.attr('min', today);
});

let selected = '';
let restaurant = {};

const getRestaurantFromYelp = (zipcode) => {
	$.ajax({
		url: `/api/yelp?location=${zipcode}`,
	}).done((res)=>{
		const businesses = JSON.parse(res).businesses;
		renderRestaurant(businesses);
	}).fail((err)=>{
		console.log(err);
	})
}

const renderRestaurant = (businesses) => {
	$('.restaurant-list').empty();
	businesses.forEach(biz => {
		// const link = document.createElement('a');
		// $(link).attr('href', biz.url);
		// $(link).attr('target', '_blank');
		const bizDiv = document.createElement('div');
		$(bizDiv).addClass('biz-individual');
		$(bizDiv).attr('data-alias', biz.alias);
		$(bizDiv).attr('data-id', biz.id);
		const bizImgContainer = document.createElement('div');
		$(bizImgContainer).addClass('img-container');
		const bizImg = document.createElement('img');
		$(bizImg).attr('src', biz.image_url);
		$(bizImgContainer).append(bizImg);
		const bizName = document.createElement('p');
		bizName.innerHTML = biz.name;
		$(bizDiv).append(bizImgContainer);
		$(bizDiv).append(bizName);
		// $(link).append(bizDiv);
		// $('.restaurant-list').append(link);
		$('.restaurant-list').append(bizDiv);
		$(bizDiv).on('click', (e) => {
			if ($('.selected')) $('.selected').removeClass('selected');
			$(e.currentTarget).addClass('selected');
			selected = e.currentTarget.dataset.id;
			getRestaurantInfo(selected);
		})
	})
}

const getRestaurantInfo = (selected) => {
	$.ajax({
		url: `/api/yelp/biz?id=${selected}`,
	}).done(res => {
		restaurant = JSON.parse(res);
		renderTimeSelection(getTime());
	}).fail(err => {
		console.log(err);
	})
};

const getTime = () => {
	const openDates = restaurant.hours[0].open;
	const day = new Date($('#reservation input[type="date"]').val()).getDay();
	const time = openDates.filter(d => d.day === new Date().getDay() - 1);
	const arr = [];
	if (time.length) {
		time.forEach(t => {
			arr.push(t.start);
			while(arr[arr.length - 1] !== t.end){
				const lastEl = arr[arr.length - 1];
				const hour = lastEl.slice(0, 2) * 1;
				lastEl.slice(2) === '00' ? arr.push(`${hour < 10 ? `0${hour}` : hour}30`) : arr.push(`${hour + 1 < 10 ? `0${hour + 1}` : hour + 1}00`)
			}
		});
	}
	return arr;
	// disable closed day
	// $('#reservation input').datepicker({
	// 	// beforeShowDay: (date) => {
	// 	// 	// const str = jQuery.datepicker.formateDate('yy-mm-dd', date);
	// 	// }
	// })
}


const renderTimeSelection = (arr) => {
	$('#time').empty();
	arr.forEach(t => {
		const option = document.createElement('option');
		$(option).attr('value', t);
		option.innerHTML = `${t.slice(0, 2) > 12 ? t.slice(0, 2) * 1 - 12 : t.slice(0, 2) * 1}: ${t.slice(2)} ${t.slice(0, 2) >= 12 ? 'pm' : 'am'}`;
		$('#reservation #time').append(option);		
	})
};

$('#yelp form').submit((e) => {
	e.preventDefault();
	const zipcode = $('form input:text').val();
	const regex = /^\d{5}(?:[-\s]\d{4})?$/;
	if (regex.test(zipcode)) {
		$('.alert').remove();
		getRestaurantFromYelp(zipcode);
	} else {
		const alert = document.createElement('div');
		$(alert).addClass('alert');
		alert.innerHTML = 'Please input valid zipcode';
		$('#yelp').append(alert);
	}
})

$('#reservation form').submit((e) => {
	e.preventDefault();
	// get content from yelp tried to get available time slot, failed;
	// findTable(restaurant.alias, $('#date').val(), $('#time').val(), $('#covers').val())
	const url = `https://www.yelp.com/reservations/${restaurant.alias}?date=${$('#date').val()}&time=${$('#time').val()}&covers=${$('#covers').val()}&source=yelp_biz`
	const win = window.open(url, '_blank');
	win.focus();
})

const findTable = (alias, date, time, covers) => {
	$.ajax({
		url: `/api/yelp/book?alias=${alias}&date=${date}&time=${time}&covers=${covers}`
	}).done((res)=>{
		const html = document.createElement('html');
		html.innerHTML = res;
		const body = html.querySelector('body')
		html.onload = () => {
			debugger
		}
		body.onload = () => {
			debugger
		}
	}).fail(err => {console.log(err)})
}


$('#date').on('change', (e)=>{
	renderTimeSelection(getTime());
})