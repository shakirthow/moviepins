from google.appengine.ext import ndb

class UserModel(ndb.Model):
  password  = ndb.StringProperty()
  email = ndb.StringProperty()
  first_name =  ndb.StringProperty()
  last_name =  ndb.StringProperty()
  visited_spots = ndb.StringProperty(repeated=True);

  @classmethod
  def userQuery(cls, email):
    return cls.query(cls.email == email)


class CirclesModel(ndb.Model):
  name  = ndb.StringProperty()
  items = ndb.StringProperty(repeated=True);
  user_email =  ndb.StringProperty()

  @classmethod
  def circleQuery(cls, name):
    return cls.query(cls.name == name)