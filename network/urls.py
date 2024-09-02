from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("post", views.index, name="post"),
    path("feed", views.index, name="feed"),
    path("followings", views.followings , name="followings"),
    path("u/<str:username>", views.profile, name="profile"),
    # path("u/<str:username>/get-user-details", views.user_details, name="user_details"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register")
]
