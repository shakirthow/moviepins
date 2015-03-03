from common import *
import pprint


class NewUser(messages.Message):
  first_name = messages.StringField(1)
  last_name = messages.StringField(2)
  email = messages.StringField(3)
  password = messages.StringField(4)


class LoginUser(messages.Message):
  email = messages.StringField(1)
  password = messages.StringField(2)


class Response(messages.Message):
  resp = messages.StringField(1)

@moviepins.api_class(resource_name='user', path='user')

class User(remote.Service):
    @endpoints.method(NewUser, Response,
                      path='newUser', http_method='GET',
                      name='newUser')
    def newUser(self, request):
      
      hashed_password = hashlib.sha256(request.password + SALT).hexdigest()
      user = UserModel(
        first_name = request.first_name,
        last_name = request.last_name,
        email = request.email,
        password = hashed_password
        )
      user.put();
      return  Response(resp = 'sucess')

    

    @endpoints.method(LoginUser, Response,
                      path='login', http_method='GET',
                      name='login')
    def login(self, request):
      userArr = UserModel.userQuery(request.email).fetch(1)
      if userArr:
          password_hash = userArr[0].password
          user_id = userArr[0].email
          hashed_password = hashlib.sha256(request.password + SALT).hexdigest()
          if password_hash == hashed_password:
              return  Response(resp = 'good')
          else:
            return Response(resp = 'wrong password')
      else:
          return  Response(resp = 'no user found')

          

