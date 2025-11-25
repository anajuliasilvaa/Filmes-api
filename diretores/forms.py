from django import forms
from .models import Diretor

class DiretorForm(forms.ModelForm):
    class Meta:
        model = Diretor
        fields = ['nome', 'data_nascimento', 'biografia', 'foto']
        widgets = {
            'data_nascimento': forms.DateInput(attrs={'type': 'date'}),
            'biografia': forms.Textarea(attrs={'rows': 4}),
        }
        