from django import forms
from .models import Filme
from diretores.models import Diretor

class FilmeForm(forms.ModelForm):
    class Meta:
        model = Filme
        fields = '__all__'
        widgets = {
            'sinopse': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 5,
                'placeholder': 'Digite a sinopse do filme...'
            }),
            'titulo': forms.TextInput(attrs={'class': 'form-control'}),
            'ano_publicacao': forms.NumberInput(attrs={'class': 'form-control'}),
            'duracao': forms.NumberInput(attrs={'class': 'form-control'}),
            'diretores': forms.SelectMultiple(attrs={'class': 'form-control'}),
             'generos': forms.CheckboxSelectMultiple(),  
        }