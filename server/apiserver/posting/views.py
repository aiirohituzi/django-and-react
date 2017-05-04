from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

from posting.models import Posting
from posting.serializers import PostingSerializer
from posting.serializers import UserSerializer

from django.contrib.auth.models import User
from rest_framework.reverse import reverse
from rest_framework import viewsets

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

from posting.forms import PostForm
import json

from django.contrib.auth import models
from django.utils.functional import SimpleLazyObject

# Create your views here.
class PostingViewSet(viewsets.ModelViewSet):  
    queryset = Posting.objects.all().order_by('-id')
    serializer_class = PostingSerializer

    def perform_create(self, serializer):
            serializer.save(owner=self.request.user)


class UserViewSet(viewsets.ReadOnlyModelViewSet): 
    queryset = User.objects.all()
    serializer_class = UserSerializer


@api_view(('GET',))
def api_root(request, format=None):  
    return Response({
        'users': reverse('user-list', request=request, format=format),
        'posting': reverse('posting-list', request=request, format=format)
    })

@csrf_exempt
def uploadPost(request):
    form = PostForm(request.POST)

    row = models.User.objects.get(username=request.POST['user'])
    # print(row.username)
    if form.is_valid():
        obj = form.save(commit=False)      # true일 경우 바로 데이터베이스에 적용, 현재 유저정보가 담기지 않았기에 not null 제약조건에 걸려 작업이 실패하므로 false
        obj.owner_id = row.id
        obj.save()      # obj.save(commit=True) 와 동일
        print("Post success")
    else:
        print("Post error")
    # print(request.POST['user'])
    # print(type(request.user))
    return HttpResponse(json.dumps(request.POST))