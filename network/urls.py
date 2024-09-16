from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("post", views.index, name="post"),
    path('allposts', views.allposts, name="allposts"), 
    path("feed", views.index, name="feed"),
    path("followings", views.followings , name="followings"),
    path("post/edit/", views.edit_post, name="edit_post" ), 
    path("u/<str:username>/", views.profile, name="profile"),
    # path("u/<str:username>/get-user-details", views.user_details, name="user_details"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register")
]
