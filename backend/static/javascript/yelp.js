$(document).ready(() => {
	const today = new Date().toISOString().split('T')[0];
	const dateInput = $('#reservation input');
	dateInput.val(today);
	dateInput.attr('min', today);
});

let selected = '';

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
			selected = e.currentTarget.dataset.id;
			getRestaurantInfo(selected);
		})
	})
}

const renderTimeSelection = (selected) => {

};

const getRestaurantInfo = (selected) => {
	$.ajax({
		url: `/api/yelp/biz?id=${selected}`,
	}).done(res => {
		const restaurant = JSON.parse(res);
		console.log(restaurant);
		const date = restaurant.hours[0].open;
		const time = date.filter(d => d.day === new Date().getDay() - 1);
		if (time.length) {
			debugger
		}
		// disable closed day
		// $('#reservation input').datepicker({
		// 	// beforeShowDay: (date) => {
		// 	// 	// const str = jQuery.datepicker.formateDate('yy-mm-dd', date);
		// 	// }
		// })

	}).fail(err => {
		console.log(err);
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
	debugger
})


