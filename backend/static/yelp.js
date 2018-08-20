$(document).ready(() => {
});


const getRestaurantFromYelp = (zipcode) => {
	$.ajax({
		url: `/api/yelp?location=${zipcode}`,
	}).done((res)=>{
		renderRestaurant(res.businesses);
	}).fail((err)=>{

	})
}

const renderRestaurant = (businesses) => {
	businesses.forEach(biz => {
		const bizDiv = document.createElement('div');
		const bizName = document.createElement('p');
		
	})
}

$('form').submit((e) => {
	e.preventDefault();
	const zipcode = $('from input:text').val();
	getRestaurantFromYelp(zipcode);
})


