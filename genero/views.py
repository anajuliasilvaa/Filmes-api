from django.shortcuts import render

from django.shortcuts import render, redirect, get_object_or_404
from .models import Genero
from .forms import GeneroForm

def listar_generos(request):
    generos = Genero.objects.all()
    return render(request, 'genero/listar.html', {'generos': generos})

def criar_genero(request):
    if request.method == 'POST':
        form = GeneroForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('listar_generos')
    else:
        form = GeneroForm()
    return render(request, 'genero/form.html', {'form': form})

def editar_genero(request, pk):
    genero = get_object_or_404(Genero, pk=pk)
    if request.method == 'POST':
        form = GeneroForm(request.POST, instance=genero)
        if form.is_valid():
            form.save()
            return redirect('listar_generos')
    else:
        form = GeneroForm(instance=genero)
    return render(request, 'genero/form.html', {'form': form})

def deletar_genero(request, pk):
    genero = get_object_or_404(Genero, pk=pk)
    if request.method == 'POST':
        genero.delete()
        return redirect('listar_generos')
    return render(request, 'genero/confirmar_delete.html', {'genero': genero})
