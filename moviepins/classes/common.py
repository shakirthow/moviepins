import endpoints
from protorpc import messages
from protorpc import message_types
from protorpc import remote
import httplib2
import hashlib
import json
import urllib
# cmd_subfolder = os.path.realpath(os.path.abspath(os.path.join(os.path.split(inspect.getfile(inspect.currentframe() ))[0],"apiClass")))
# if cmd_subfolder not in sys.path:
#    sys.path.insert(0, cmd_subfolder)



from operator import attrgetter

import pprint



SODA_APP_TOKEN = 'CI8NkwQLjR5fbNjRwUrtbZz52'
SALT = 'U2ltYmE0UHJlc2lkZW50'
TOMATO_KEY = 'wefqm3hwnmjmvje8v4nmbsdv'
MOVIEDB_KEY= '7bfb5aa6abb2c2a47d4bba0e1ff36ccc'
UBER_SERV_TOK = '4ErmvJdtVQXx2I6XpdAPSL_AI_kgq2DeigkFHnub'

moviepins = endpoints.api(name='moviepins', version='v1.0', description='API for managing Users and related medical data')

class Response(messages.Message):
  resp = messages.StringField(1)