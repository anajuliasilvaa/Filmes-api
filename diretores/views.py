from django.shortcuts import render
from django.shortcuts import render, get_object_or_404 
from django.http import HttpResponseRedirect
from django.urls import reverse
from .models import Diretor
from .forms import DiretorForm
from usuarios.decorators import admin_required, user_required


@user_required 
def lista_diretores(request):
    """Lista todos os diretores."""
    diretores = Diretor.objects.all().order_by('nome') # Busca todos os diretores, ordenados por nome
    context = {'diretores': diretores}
    return render(request, 'diretores/lista_diretores.html', context)


@user_required 
def detalhar_diretor(request, id):
    """Mostra os detalhes de um diretor específico."""
    diretor = get_object_or_404(Diretor, pk=id) 
    context = {'diretor': diretor}
    return render(request, 'diretores/detalhes_diretor.html', context)


@admin_required
def adicionar_diretor(request):
    """Permite adicionar um novo diretor."""
    if request.method != 'POST':
        form = DiretorForm()
    else:
        form = DiretorForm(request.POST, request.FILES) 
        if form.is_valid():
            form.save()
            return HttpResponseRedirect(reverse('diretores:lista_diretores')) 

    context = {'form': form}
    return render(request, 'diretores/adicionar_diretor.html', context)


@admin_required 
def editar_diretor(request, id):
    """Permite editar um diretor existente."""
    diretor = get_object_or_404(Diretor, pk=id) 

    if request.method != 'POST':
        form = DiretorForm(instance=diretor)
    else:
        form = DiretorForm(request.POST, request.FILES, instance=diretor) 
        if form.is_valid():
            form.save()
            return HttpResponseRedirect(reverse('diretores:detalhar_diretor', args=[diretor.id])) 

    context = {'form': form, 'diretor': diretor}
    return render(request, 'diretores/editar_diretor.html', context)


@admin_required 
def deletar_diretor(request, id):
    """Permite deletar um diretor."""
    diretor = get_object_or_404(Diretor, pk=id) 
    diretor.delete()
    return HttpResponseRedirect(reverse('diretores:lista_diretores')) 