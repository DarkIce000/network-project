from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.db.models import Q
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.core import serializers

from .models import User, Post
import json

@login_required(login_url="login")
def index(request):

    loggedin_user = User.objects.get(username=request.user)
    # handle the posting 
    user_followings_posts = Post.objects.filter(Q(user__in=loggedin_user.followings.all()) | Q(user=loggedin_user)).order_by("-timestamp")
    if request.method == "POST":
        data  = json.loads(request.body)
        new_post = Post(user=loggedin_user, post_text=data['postText'])
        new_post.save()
        return JsonResponse([ post.serialize() for post in user_followings_posts ], safe=False)

    
    # handle like or unlike 
    if request.method == "PUT":
        data  = json.loads(request.body)
        post_id = data['postId']
        get_post = get_object_or_404(Post, id=post_id)

        if (loggedin_user in get_post.like_users.all()):
            get_post.like_users.remove(loggedin_user)
        else:
            get_post.like_users.add(loggedin_user)

        get_post.save()
        
        return JsonResponse([ get_post.serialize()], safe=False)

    # get followings post for the feed to the logged in user
    if  request.method == "FEED":
        # gettng all post
        return JsonResponse([ post.serialize() for post in user_followings_posts ], safe=False)
    
    return render(request, "network/index.html", {
        "loggedin_user" : loggedin_user
    })

@login_required(login_url="login")
def profile(request, username):
    try: 
        loggedin_user = User.objects.get(username=request.user)
    except:
        return HttpResponse('Something Went Wrong in loggedin user')
    
    try:
        profile_user = User.objects.get(username=username)
    except: 
        return HttpResponse('Something Went Wrong in profile user')

    # follow or unfollow 
    if request.method == "PUT":
        if (profile_user in loggedin_user.followings.all()):
            loggedin_user.followings.remove(profile_user)
        else: 
            loggedin_user.followings.add(profile_user)
        loggedin_user.save()

        # logged in user profile information
        return JsonResponse([loggedin_user.serialize()], safe=False)

    # user post
    if request.method == "FEED":
        posts = Post.objects.filter(user=profile_user)
        return JsonResponse([post.serialize() for post in posts ], safe=False)

    return render(request, "network/profile.html", {
        "loggedin_user": loggedin_user, 
        "profile_user": profile_user
    })

@login_required(login_url="login")
def followings(request):
    loggedin_user = User.objects.get(username=request.user)
    return render(request, "network/followings.html", {
        "followings": loggedin_user.followings.all()
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password      = request.POST["password"]
        confirmation  = request.POST["confirmation"]

        try: 
            profile_img  = request.FILES['profile-image']
        except:
            profile_img = None

        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })
        
        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password, profile_img=profile_img)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
