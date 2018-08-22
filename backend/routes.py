from flask import render_template, url_for, redirect, request
from backend import app
from backend.key import YELP_API_KEY
from pdb import set_trace as bp
# uncomplete library
# from yelp.client import Client
import json
import requests


headers = {
	'Content-Type': 'application/json',
	'Authorization': 'Bearer %s' % YELP_API_KEY,
}

@app.route('/')
def home():
	return render_template('index.html')

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
	api_url_base = 'https://api.yelp.com/v3/businesses/search?term=restaurant&attributes=reservation&'
	location = request.args.get('location')
	url = api_url_base + 'location=' + location
	response = requests.get(url, headers=headers)
	if response.status_code == 200:
		return response.content, 200
	else:
		return {'error': 'Cannot get restaurant information, try again later'}

@app.route('/api/yelp/biz')
def biz():
	api_url_base = 'https://api.yelp.com/v3/businesses/'
	id = request.args.get('id')
	url = api_url_base + id
	response = requests.get(url, headers=headers)
	if response.status_code == 200:
		return response.content, 200
	else:
		return 'something wrong'
		

@app.route('/api/yelp/book')
def book():
	api_url_base = 'https://www.yelp.com/reservations/'
	alias = request.args.get('alias')
	date = request.args.get('date')
	time = request.args.get('time')
	covers = request.args.get('covers')
	url = '{}{}?date={}&time={}&covers={}&source=yelp_biz'.format(api_url_base, alias, date, time, covers)
	print(url)
	response = requests.get(url)
	if response.status_code == 200:
		return response.content, 200
	else:
		return 'failed'

@app.route('/api/stripe/pay')
def pay():
	
	return 'testing'
