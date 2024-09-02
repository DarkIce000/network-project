from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    profile_img = models.ImageField(upload_to="profile/", null=True, blank=True)
    followings = models.ManyToManyField("self", null=True, blank=True)

    def serialize(self):
        return{
            "id": self.pk,
            "email": self.email,
            "username": self.username, 
            "picture": self.profile_img.url if self.profile_img else None,
            "followings":  [following.username for following in self.followings.all()],
        }


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="post")
    # image = models.ImageField(upload_to="postsImages/", blank=True, null=True)
    post_text = models.CharField(max_length=2000, null=False, blank=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    like_users = models.ManyToManyField(User, related_name="liked_posts")

    def serialize(self):
        return {
            "id" : self.id,
            "user" : self.user.username, 
            "postText":self.post_text,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "likeUsers" : [user.username for user in self.like_users.all()],
            "likeCount": self.like_users.all().count()
        } 