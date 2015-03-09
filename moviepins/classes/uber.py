from common import *


class GeoPoints (messages.Message):
	start_latitude = messages.StringField(1)
	start_longitude = messages.StringField(2)
	end_latitude = messages.StringField(3)
	end_longitude = messages.StringField(4)


BASE_URL = 'https://api.uber.com/v1'

@moviepins.api_class(resource_name='uber', path='uber')

class Uber(remote.Service):
	@endpoints.method(GeoPoints, Response,
		path='estimate', http_method='GET',
		name='estimate')
	def fetch(self, request):
		parameters = {
		'server_token': UBER_SERV_TOK,
		'start_latitude': request.start_latitude,
		'start_longitude': request.start_longitude,
		'end_latitude':request.end_latitude,
		'end_longitude': request.end_longitude
		}
		resp, content = httplib2.Http().request(BASE_URL +'/estimates/price?'+urllib.urlencode(parameters))
		content_obj = json.loads(content)

		if resp.status == 200:
			cheapest = min((x for x in content_obj[u'prices'] if x[u'low_estimate'] != None), key=lambda y: y['low_estimate'])
			return  Response(resp = json.dumps(cheapest).decode(encoding='utf-8',errors='ignore'))
		else:
			message = 'Uber estimates were not found'
			raise endpoints.NotFoundException(message)

