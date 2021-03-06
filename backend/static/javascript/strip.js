const STRIPE_API_KEY = 'pk_test_ROdkyhs5rFVG8xeBkE0X66QJ';

const stripe = Stripe(STRIPE_API_KEY);
const elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
// (Note that this demo uses a wider set of styles than the guide below.)
const style = {
  base: {
    color: '#32325d',
    lineHeight: '18px',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '14px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};

const card = elements.create('card', {style: style});
card.mount('#card-element');

// Handle real-time validation errors from the card Element.
card.addEventListener('change', (event) => {
  const displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

// Handle form submission.
const form = document.getElementById('payment-form');
form.addEventListener('submit', (event) => {
  event.preventDefault();

  stripe.createToken(card).then((result)=>  {
    if (result.error) {
      // Inform the user if there was an error.
      const errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
      // Send the token to your server.
      stripeTokenHandler(result.token);
    }
  });
});

const stripeTokenHandler = (token) => {
  // const hiddenInput = document.createElement('input');
  // hiddenInput.setAttribute('type', 'hidden');
  // hiddenInput.setAttribute('name', 'stripeToken');
  // hiddenInput.setAttribute('value', token.id);
  // form.appendChild(hiddenInput);
  const amount = document.querySelector('.amount strong').textContent * 1;
  console.log(token)
  const data = {
  	amount: amount,
  	token: token.id,
  }
  submitPayment(data)
  	.then(res => {
  		debugger
  	}).catch(err=>{
  		debugger
  	})
}

const submitPayment = (data) => (
	$.ajax({
		url: '/api/stripe/pay',
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(data),
	})
);

