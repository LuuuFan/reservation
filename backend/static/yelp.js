$(document).ready(() => {
});


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
		const bizDiv = document.createElement('div');
		$(bizDiv).attr('href', biz.url);
		$(bizDiv).attr('target', '_blank');
		$(bizDiv).addClass('biz-individual');
		const bizImgContainer = document.createElement('div');
		$(bizImgContainer).addClass('img-container');
		const bizImg = document.createElement('img');
		$(bizImg).attr('src', biz.image_url);
		$(bizImgContainer).append(bizImg);
		const bizName = document.createElement('p');
		bizName.innerHTML = biz.name;
		$(bizDiv).append(bizImgContainer);
		$(bizDiv).append(bizName);
		$('.restaurant-list').append(bizDiv);
	})
}

$('form').submit((e) => {
	e.preventDefault();
	const zipcode = $('form input:text').val();
	getRestaurantFromYelp(zipcode);
})


