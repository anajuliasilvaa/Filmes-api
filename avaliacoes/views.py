from django.shortcuts import render, redirect, get_object_or_404
from .forms import AvaliacaoForm
from .models import Avaliacao
from filmes.models import Filme
from django.contrib.auth.decorators import login_required

@login_required
def adicionar_avaliacao(request, filme_id):
    filme = get_object_or_404(Filme, pk=filme_id)

    if request.method == 'POST':
        form = AvaliacaoForm(request.POST)
        if form.is_valid():
            avaliacao = form.save(commit=False)
            avaliacao.filme = filme
            avaliacao.usuario = request.user
            avaliacao.save()
            return redirect('detalhes_filme', id=filme.id)
    else:
        form = AvaliacaoForm()

    return render(request, 'avaliacoes/adicionar_avaliacao.html', {'form': form, 'filme': filme})

@login_required
def editar_avaliacao(request, avaliacao_id):
    avaliacao = get_object_or_404(Avaliacao, pk=avaliacao_id)

    # ✅ Só deixa editar se o usuário for o dono da avaliação
    if avaliacao.usuario != request.user:
        return redirect('detalhes_filme', id=avaliacao.filme.id)

    if request.method == 'POST':
        form = AvaliacaoForm(request.POST, instance=avaliacao)
        if form.is_valid():
            form.save()
            return redirect('detalhes_filme', id=avaliacao.filme.id)
    else:
        form = AvaliacaoForm(instance=avaliacao)

    context = {
        'form': form,
        'filme': avaliacao.filme,
        'editar': True
    }
    return render(request, 'avaliacoes/editar_avaliacao.html', context)

@login_required
def deletar_avaliacao(request, avaliacao_id):
    avaliacao = get_object_or_404(Avaliacao, pk=avaliacao_id)

    # ✅ Só deixa deletar se o usuário for o dono da avaliação
    if avaliacao.usuario == request.user:
        avaliacao.delete()

    return redirect('detalhes_filme', id=avaliacao.filme.id)
