from backend import app
from backend.key import YELP_API_KEY
from pdb import set_trace as bp
# uncomplete library
# from yelp.client import Client
from flask import request
import json
import requests


@app.route('/api/opentable')
def opentable():
	return ''

@app.route('/api/yelp')
def yelp():
	# initialize client
	# client = Client(YELP_API_KEY)
	# business_response = client.business.get_by_id('yelp-san-francisco')
	# print business_response.json()
	# response = client.business.get_by_location('94404')
	api_url_base = 'https://api.yelp.com/v3/businesses/search?term=restaurant&'
	location = request.args.get('location')
	url = api_url_base + 'location=' + location
	headers = {
		'Content-Type': 'application/json',
		'Authorization': 'Bearer %s' % YELP_API_KEY,
	}
	response = requests.get(url, headers=headers)
	if response.status_code == 200:
		return response.content, 200
	else:
		return {'error': 'Cannot get restaurant information, try again later'}