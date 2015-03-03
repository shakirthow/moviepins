from common import *
import pprint


class FindMovies(messages.Message):
  title = messages.StringField(1)
  release_year = messages.StringField(2)
  locations = messages.StringField(3)
  production_company = messages.StringField(4)
  director = messages.StringField(5)
  actor_1 = messages.StringField(6)
  actor_2 = messages.StringField(7)
  actor_3 = messages.StringField(8)


class GetMovies(messages.Message):
  title = messages.StringField(1)
  locations = messages.StringField(2)
  production_company = messages.StringField(3)
  director = messages.StringField(4)
  actor_1 = messages.StringField(5)
  actor_2 = messages.StringField(6)
  actor_3 = messages.StringField(7)
  year = messages.IntegerField(8)

class MovieDetails(messages.Message):
  title = messages.StringField(1)
  director = messages.StringField(2)

class Response(messages.Message):
  resp = messages.StringField(1)

@moviepins.api_class(resource_name='movies', path='movies')

class Movies(remote.Service):
    @endpoints.method(FindMovies, Response,
                      path='find', http_method='GET',
                      name='find')
    def find(self, request):


      base_str = "https://data.sfgov.org/resource/yitu-d5am.json?"
      params = {}
      if request.title:
        params['title'] = request.title
      if request.release_year:
        params["release_year"]=request.release_year
      if request.locations:
        params["locations"]=request.locations
      if request.production_company:
        params["production_company"]=request.production_company
      if request.director:
        params["director"]=request.director
      if request.actor_1:
        params["actor_1"]=request.actor_1
      if request.actor_2:
        params["actor_2"]=request.actor_2
      if request.actor_3:
        params["actor_3"]=request.actor_3


      params_encoded = urllib.urlencode(params)
      resp, content = httplib2.Http().request(base_str+params_encoded+"&$$app_token="+SODA_APP_TOKEN)
      return  Response(resp = str(content))

    

    @endpoints.method(GetMovies, Response,
                      path='details', http_method='GET',
                      name='details')
    def details(self, request):
      params = {}
      params['q'] = request.title
      params['page_limit'] = 2
      params_encoded = urllib.urlencode(params)
     
      resp, content = httplib2.Http().request('http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey='+TOMATO_KEY+'&'+params_encoded)
      pprint.pprint("******************************")
      pprint.pprint(resp.status)
      if resp.status == 200:
        con_obj = json.loads(content)
        for movie in con_obj[u'movies']:
          if movie[u'year'] == request.year:
            return  Response(resp = json.dumps(movie))
      else:
        Response(resp = 'bad request')









    @endpoints.method(GetMovies, Response,
                      path='search', http_method='GET',
                      name='search')
    def search(self, request):
      base_str = "https://data.sfgov.org/resource/yitu-d5am.json?&"
      resp, content = httplib2.Http().request(base_str+"$$app_token="+SODA_APP_TOKEN)
      return  Response(resp = content.encode('ascii', 'replace'))