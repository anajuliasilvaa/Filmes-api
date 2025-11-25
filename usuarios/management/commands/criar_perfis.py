from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from usuarios.models import Profile


class Command(BaseCommand):
    help = 'Cria perfis para usuários que não possuem'

    def handle(self, *args, **options):
        users_without_profile = User.objects.filter(profile__isnull=True)
        created_count = 0
        
        for user in users_without_profile:
            Profile.objects.create(user=user)
            created_count += 1
            self.stdout.write(
                self.style.SUCCESS(f'Perfil criado para o usuário: {user.username}')
            )
        
        if created_count == 0:
            self.stdout.write(
                self.style.WARNING('Todos os usuários já possuem perfil!')
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(f'{created_count} perfis criados com sucesso!')
            ) 