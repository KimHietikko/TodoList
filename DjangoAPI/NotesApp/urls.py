from django.conf.urls import url
from NotesApp import views

urlpatterns=[
    url(r'^note$',views.noteApi),
    url(r'^note/([0-9]+)$',views.noteApi),
    url(r'^note/dragAndDrop$', views.dragAndDrop)
]