from rest_framework.permissions import BasePermission

class IsAdminUserGroup(BasePermission):
  
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            request.user.groups.filter(name="Administradores").exists()
        )


class IsGeneralOrAdmin(BasePermission):
    
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and (
                request.user.groups.filter(name="Administradores").exists() or
                request.user.groups.filter(name="Usuarios Gerais").exists()
            )
        )
