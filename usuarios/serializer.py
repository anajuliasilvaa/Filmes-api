from rest_framework import serializers
from django.contrib.auth.models import User, Group
from .models import Profile
from .disney_service import DisneyAPIService
from django.contrib.auth.password_validation import validate_password


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['avatar_url', 'avatar_name']


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'email']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email']
        )

        # Disney avatar aleatório
        disney = DisneyAPIService.get_random_character()
        if disney:
            user.profile.avatar_url = disney.get("imageUrl")
            user.profile.avatar_name = disney.get("name")
            user.profile.save()

        # adiciona ao grupo de usuários gerais
        group, created = Group.objects.get_or_create(name='Usuarios Gerais')
        user.groups.add(group)

        return user
