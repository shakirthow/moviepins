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
  year = messages.IntegerField(2)

class MovieDetails(messages.Message):
  title = messages.StringField(1)
  director = messages.StringField(2)

class SearchMovies(messages.Message):
  q = messages.StringField(1)

@moviepins.api_class(resource_name='movies', path='movies')

class Movies(remote.Service):
    @endpoints.method(FindMovies, Response,
                      path='find', http_method='GET',
                      name='find')
    def find(self, request):

      try:
        base_str = "https://data.sfgov.org/resource/yitu-d5am.json?"
        params = {}

        if request.title:
          params['title'] = request.title.encode('utf8')
        if request.release_year:
          params["release_year"]=request.release_year.encode('utf8')
        if request.locations:
          params["locations"]=request.locations.encode('utf8')
        if request.production_company:
          params["production_company"]=request.production_company.encode('utf8')
        if request.director:
          params["director"]=request.director.encode('utf8')
        if request.actor_1:
          params["actor_1"]=request.actor_1.encode('utf8')
        if request.actor_2:
          params["actor_2"]=request.actor_2.encode('utf8')
        if request.actor_3:
          params["actor_3"]=request.actor_3.encode('utf8')


        params_encoded = urllib.urlencode(params)
        resp, content = httplib2.Http().request(base_str+params_encoded+"&$$app_token="+SODA_APP_TOKEN)
        return  Response(resp = content.decode(encoding='utf-8',errors='ignore'))
      except:
        message = 'Error with querry params'
        raise endpoints.BadRequestException(message)

    

    # @endpoints.method(GetMovies, Response,
    #                   path='details', http_method='GET',
    #                   name='details')
    # def details(self, request):
    #   params = {}
    #   params['q'] = request.title
    #   params_encoded = urllib.urlencode(params)
    #   r, content = httplib2.Http().request('http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey='+TOMATO_KEY+'&'+params_encoded)

    #   if r.status == 200:
    #     con_obj = json.loads(content)
    #     # pprint.pprint(con_obj)
    #     for movie in con_obj[u'movies']:
    #       print int(movie[u'year'])
    #       if request.year == int(movie[u'year']):
    #         return  Response(resp = json.dumps(movie))
    #   elif r.status == 403:
    #     Response(resp = 'TOMATO_KEY has exceded free quota')
    #   else:
    #     Response(resp = 'Bad Request')
    #   return Response(resp = 'Sorry, We details for this movie got lost... somewhere with those VHS disks')


    @endpoints.method(SearchMovies, Response,
                      path='search', http_method='GET',
                      name='search')
    def search(self, request):
      try:
        base_str = "https://data.sfgov.org/resource/yitu-d5am?$"+urllib.urlencode({'q':request.q})+"&$limit=10"
        resp, content = httplib2.Http().request(base_str)#+"$$app_token="+SODA_APP_TOKEN
        return  Response(resp = content.decode(encoding='utf-8',errors='ignore'))
      except:
        message = 'Error with querry params'
        raise endpoints.BadRequestException(message)



    @endpoints.method(SearchMovies, Response,
                      path='browse', http_method='GET',
                      name='browse')
    def browse(self, request):
      try:
        params = urllib.urlencode({
          '$select':request.q+',count('+request.q+')',
          '$group': request.q
          })
        base_str = "https://data.sfgov.org/resource/yitu-d5am?"+params
        resp, content = httplib2.Http().request(base_str)#+"$$app_token="+SODA_APP_TOKEN
        return  Response(resp = content.decode(encoding='utf-8',errors='ignore'))
      except:
        message = 'Error with querry params'
        raise endpoints.BadRequestException(message)
























