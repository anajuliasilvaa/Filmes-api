# catalogofilmes/favoritos/views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from django.contrib.auth.decorators import login_required 

from .models import ListaFavoritos
from .forms import ListaFavoritosForm
from filmes.models import Filme 
from django.http import JsonResponse
from django.contrib import messages


@login_required
def minhas_listas(request):
    """Lista as listas de favoritos do usuário logado."""
    listas = ListaFavoritos.objects.filter(usuario=request.user).order_by('nome')
    context = {'listas': listas}
    return render(request, 'favoritos/minhas_listas.html', context)


@login_required
def criar_lista(request):
    """Permite ao usuário logado criar uma nova lista de favoritos."""
    if request.method == 'POST':
        form = ListaFavoritosForm(request.POST)
        if form.is_valid():
            nova_lista = form.save(commit=False)
            nova_lista.usuario = request.user 
            nova_lista.save()
            form.save_m2m() 
            return redirect(reverse('favoritos:detalhes_lista', args=[nova_lista.id]))
    else:
        form = ListaFavoritosForm()
    context = {'form': form}
    return render(request, 'favoritos/criar_lista.html', context)


@login_required
def detalhes_lista(request, lista_id):
    """Mostra os detalhes de uma lista de favoritos."""
    lista = get_object_or_404(ListaFavoritos, id=lista_id)

    if lista.usuario != request.user:
        return redirect(reverse('favoritos:minhas_listas')) 

    context = {'lista': lista}
    return render(request, 'favoritos/detalhes_lista.html', context)


@login_required
def editar_lista(request, lista_id):
    """Permite ao usuário logado editar uma de suas listas de favoritos."""
    lista = get_object_or_404(ListaFavoritos, id=lista_id, usuario=request.user)

    if request.method == 'POST':
        form = ListaFavoritosForm(request.POST, instance=lista)
        if form.is_valid():
            form.save() 
            return redirect(reverse('favoritos:detalhes_lista', args=[lista.id]))
    else:
        form = ListaFavoritosForm(instance=lista)
    context = {'form': form, 'lista': lista}
    return render(request, 'favoritos/editar_lista.html', context)


@login_required
def deletar_lista(request, lista_id):
    """Permite ao usuário logado deletar uma de suas listas de favoritos."""
    lista = get_object_or_404(ListaFavoritos, id=lista_id, usuario=request.user) 
    if request.method == 'POST':
        lista.delete()
        return redirect(reverse('favoritos:minhas_listas'))

    return render(request, 'favoritos/confirmar_delete_lista.html', {'lista': lista})


def adicionar_aos_favoritos(request, filme_id):
    """Adiciona um filme aos favoritos do usuário."""
    if not request.user.is_authenticated:
        if request.headers.get('Content-Type') == 'application/json' or request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                'success': False,
                'message': 'Você precisa estar logado para adicionar filmes aos favoritos.',
                'redirect_login': True
            }, status=401)
        else:
            return redirect('login')
    
    filme = get_object_or_404(Filme, id=filme_id)
    listas_usuario = ListaFavoritos.objects.filter(usuario=request.user)
    
    if request.method == 'POST':
        lista_id = request.POST.get('lista_id')
        lista = get_object_or_404(ListaFavoritos, id=lista_id, usuario=request.user)
        
        if filme in lista.filmes.all():
            return JsonResponse({
                'success': False,
                'message': f'O filme "{filme.titulo}" já está na lista "{lista.nome}"!'
            })
        else:
            lista.filmes.add(filme)
            return JsonResponse({
                'success': True,
                'message': f'Filme "{filme.titulo}" adicionado à lista "{lista.nome}" com sucesso!'
            })
    
    if listas_usuario.count() == 0:
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                'success': False,
                'message': 'Você precisa criar uma lista de favoritos primeiro.',
                'redirect_criar_lista': True
            })
        else:
            messages.info(request, 'Você precisa criar uma lista de favoritos primeiro.')
            return redirect('favoritos:criar_lista')
    elif listas_usuario.count() == 1:
        lista = listas_usuario.first()
        if filme in lista.filmes.all():
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': False,
                    'message': f'O filme "{filme.titulo}" já está na sua lista de favoritos!'
                })
            else:
                messages.warning(request, f'O filme "{filme.titulo}" já está na sua lista de favoritos!')
                return redirect('detalhes_filme', id=filme.id)
        else:
            lista.filmes.add(filme)
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': True,
                    'message': f'Filme "{filme.titulo}" adicionado aos favoritos!'
                })
            else:
                messages.success(request, f'Filme "{filme.titulo}" adicionado aos favoritos!')
                return redirect('detalhes_filme', id=filme.id)
    else:
        listas_data = [{
            'id': lista.id,
            'nome': lista.nome,
            'total_filmes': lista.filmes.count(),
            'filme_ja_na_lista': filme in lista.filmes.all()
        } for lista in listas_usuario]
        
        return JsonResponse({
            'listas': listas_data,
            'filme_titulo': filme.titulo
        }) 