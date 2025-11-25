from django import forms
from .models import ListaFavoritos 
from filmes.models import Filme 

class ListaFavoritosForm(forms.ModelForm):
    class Meta:
        model = ListaFavoritos

        fields = ['nome', 'filmes'] 
        widgets = {
            'filmes': forms.SelectMultiple(attrs={'class': 'form-control'}) 
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['filmes'].queryset = Filme.objects.all().order_by('titulo')