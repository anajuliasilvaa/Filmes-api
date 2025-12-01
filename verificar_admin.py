#!/usr/bin/env python
"""
Script para verificar se o usuário admin está configurado corretamente
Execute: python verificar_admin.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'catalogofilmes.settings')
django.setup()

from django.contrib.auth.models import User

print("=" * 50)
print("VERIFICAÇÃO DE USUÁRIOS ADMINISTRADORES")
print("=" * 50)

# Listar todos os usuários
users = User.objects.all()
print(f"\nTotal de usuários: {users.count()}\n")

for user in users:
    print(f"Usuário: {user.username}")
    print(f"  - Email: {user.email}")
    print(f"  - is_staff: {user.is_staff}")
    print(f"  - is_superuser: {user.is_superuser}")
    print(f"  - is_active: {user.is_active}")
    print(f"  - Grupos: {', '.join([g.name for g in user.groups.all()]) or 'Nenhum'}")
    print("-" * 50)

print("\n" + "=" * 50)
print("COMO TORNAR UM USUÁRIO ADMIN:")
print("=" * 50)
print("1. Via Django Admin: http://localhost:8000/admin")
print("2. Via shell do Django:")
print("   python manage.py shell")
print("   >>> from django.contrib.auth.models import User")
print("   >>> user = User.objects.get(username='SEU_USERNAME')")
print("   >>> user.is_staff = True")
print("   >>> user.is_superuser = True")
print("   >>> user.save()")
print("=" * 50)
