#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'catalogofilmes.settings')
django.setup()

from django.contrib.auth.models import User

# Tornar o usuário 'adm' admin do sistema (staff)
user = User.objects.get(username='adm')
user.is_staff = True
user.save()

print(f"✅ Usuário '{user.username}' agora é admin do sistema!")
print(f"   is_staff: {user.is_staff}")
print(f"   is_superuser: {user.is_superuser}")
