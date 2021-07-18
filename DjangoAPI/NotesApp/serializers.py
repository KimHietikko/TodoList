from rest_framework import serializers
from NotesApp.models import Notes

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notes
        fields = ('id',
                  'text',
                  'index')