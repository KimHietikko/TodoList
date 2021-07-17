from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse

from NotesApp.models import Notes
from NotesApp.serializers import NoteSerializer

# Create your views here.

@csrf_exempt
def noteApi(request,id=0):
    if request.method=='GET':
        notes = Notes.objects.all()
        notes_serializer = NoteSerializer(notes, many=True)
        return JsonResponse(notes_serializer.data, safe=False)

    elif request.method=='POST':
        note_data=JSONParser().parse(request)
        note_serializer = NoteSerializer(data=note_data)
        if note_serializer.is_valid():
            note_serializer.save()
            return JsonResponse("Added Successfully!!" , safe=False)
        return JsonResponse("Failed to Add.",safe=False)

    elif request.method=='PUT':
        note_data = JSONParser().parse(request)
        note=Notes.objects.get(id=note_data['id'])
        note_serializer=NoteSerializer(note,data=note_data)
        if note_serializer.is_valid():
            note_serializer.save()
            return JsonResponse("Updated Successfully!!", safe=False)
        return JsonResponse("Failed to Update.", safe=False)

    elif request.method=='DELETE':
        note=Notes.objects.get(id=id)
        note.delete()
        return JsonResponse("Deleted Successfully!!", safe=False)

@csrf_exempt
def dragAndDrop(request):
    Notes.objects.all().delete()
    note_data=JSONParser().parse(request)
    note_serializer = NoteSerializer(data=note_data, many=True)
    if note_serializer.is_valid():
        note_serializer.save()
        return JsonResponse("Added Successfully!!" , safe=False)
    return JsonResponse("Failed to Add.",safe=False)