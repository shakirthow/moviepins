from common import *
import pprint


class NewCircle (messages.Message):
	user_email = messages.StringField(1)
	name = messages.StringField(2)
	items = messages.StringField(3, repeated=True)

class AddCircleItem(messages.Message):
	email = messages.StringField(1)
	name = messages.StringField(2)
	item = messages.StringField(3)

class FetchCircleItems(messages.Message):
	name = messages.StringField(1)
	email = messages.StringField(2)


@moviepins.api_class(resource_name='circle', path='circle')

class Circle(remote.Service):
		@endpoints.method(NewCircle, Response,
											path='add', http_method='GET',
											name='add')
		def add(self, request):
			circleArr = CirclesModel.circleQuery(request.name).fetch(1)
			if circleArr:
				if circleArr[0].user_email == request.user_email:
					return Response(resp = 'There is a circle in this name')
			else:
				circle = CirclesModel(
				user_email = request.user_email,
				name = request.name,
				items = request.items,
				)
				circle.put();
				return  Response(resp = 'Circle Saved')



		@endpoints.method(AddCircleItem, Response,
											path='update', http_method='GET',
											name='update')
		def update(self, request):
			circleArr = CirclesModel.circleQuery(request.name).fetch(1)
			if circleArr:
				if circleArr[0].items:
					circleArr[0].items = (circleArr[0].items).append(request.item)
					circleArr[0].put()
				else:
					circleArr[0].items = [request.item]
					circleArr[0].put()
				return Response(resp = 'Updated circle '+ str(request.name))
			else:
				return Response(resp = 'No circle found with name'+ str(request.name))



		@endpoints.method(FetchCircleItems, Response,
											path='fetch', http_method='GET',
											name='fetch')
		def fetch(self, request):
			circleArr = CirclesModel.circleQuery(request.name).fetch(1)
			if circleArr:
				return Response(resp = json.dumps(circleArr[0].items))
			else:
				return Response(resp = 'No circle found with name '+ str(request.name))