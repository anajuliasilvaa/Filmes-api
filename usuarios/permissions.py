from rest_framework.permissions import BasePermission

class IsAdminUserGroup(BasePermission):
    """
    Permissão para administradores do sistema (via grupo ou is_staff).
    Permite superuser ou usuários no grupo 'Administradores' ou com is_staff=True.
    """
    message = "Apenas administradores podem realizar esta ação."
  
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and (
                request.user.is_superuser or
                request.user.is_staff or
                request.user.groups.filter(name="Administradores").exists()
            )
        )


class IsGeneralOrAdmin(BasePermission):
    """
    Permissão para usuários gerais ou administradores.
    Permite acesso a usuários autenticados que sejam admin ou usuários gerais.
    """
    message = "Você precisa ser um usuário registrado para acessar este recurso."
    
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and (
                request.user.is_superuser or
                request.user.is_staff or
                request.user.groups.filter(name="Administradores").exists() or
                request.user.groups.filter(name="Usuarios Gerais").exists()
            )
        )


class IsAdminOrReadOnly(BasePermission):
    """
    Permissão que permite leitura para todos, mas modificação apenas para admins.
    GET/HEAD/OPTIONS: Qualquer um
    POST/PUT/PATCH/DELETE: Apenas administradores
    """
    message = "Apenas administradores podem modificar este recurso."
    
    def has_permission(self, request, view):
        # Permite leitura para todos
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        
        # Modificação apenas para admins
        return (
            request.user.is_authenticated and (
                request.user.is_superuser or
                request.user.is_staff or
                request.user.groups.filter(name="Administradores").exists()
            )
        )
