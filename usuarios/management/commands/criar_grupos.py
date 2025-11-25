from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from filmes.models import Filme


class Command(BaseCommand):
    help = 'Cria os grupos de usuários (Usuarios Gerais e Administradores)'

    def handle(self, *args, **options):
        # Criar grupo de Usuários Gerais
        usuarios_gerais, created = Group.objects.get_or_create(name='Usuarios Gerais')
        if created:
            self.stdout.write(
                self.style.SUCCESS('Grupo "Usuarios Gerais" criado com sucesso!')
            )
        else:
            self.stdout.write(
                self.style.WARNING('Grupo "Usuarios Gerais" já existe!')
            )

        # Criar grupo de Administradores
        administradores, created = Group.objects.get_or_create(name='Administradores')
        if created:
            self.stdout.write(
                self.style.SUCCESS('Grupo "Administradores" criado com sucesso!')
            )
        else:
            self.stdout.write(
                self.style.WARNING('Grupo "Administradores" já existe!')
            )

        # Configurar permissões para Administradores
        filme_content_type = ContentType.objects.get_for_model(Filme)
        
        # Permissões para o modelo Filme
        permissions = [
            'add_filme',
            'change_filme', 
            'delete_filme',
            'view_filme'
        ]
        
        for perm_codename in permissions:
            try:
                permission = Permission.objects.get(
                    codename=perm_codename,
                    content_type=filme_content_type
                )
                administradores.permissions.add(permission)
                self.stdout.write(
                    self.style.SUCCESS(f'Permissão "{perm_codename}" adicionada ao grupo Administradores')
                )
            except Permission.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f'Permissão "{perm_codename}" não encontrada')
                )

        # Permissões para Usuários Gerais (apenas visualização)
        try:
            view_permission = Permission.objects.get(
                codename='view_filme',
                content_type=filme_content_type
            )
            usuarios_gerais.permissions.add(view_permission)
            self.stdout.write(
                self.style.SUCCESS('Permissão "view_filme" adicionada ao grupo Usuarios Gerais')
            )
        except Permission.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Permissão "view_filme" não encontrada')
            )

        self.stdout.write(
            self.style.SUCCESS('Configuração de grupos finalizada!')
        ) 