from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import Usuario

class CadastroUsuarioForm(UserCreationForm):
    """
    Formulário para criar conta completa (Nome, Email, Senha).
    """
    first_name = forms.CharField(label="Nome", max_length=150)
    email = forms.EmailField(label="E-mail")
    
    class Meta(UserCreationForm.Meta):
        model = Usuario
        fields = ('first_name', 'email', 'username')

    def save(self, commit=True):
        user = super().save(commit=False)
        user.first_name = self.cleaned_data['first_name']
        user.email = self.cleaned_data['email']
        if not user.username:
            user.username = user.email
        if commit:
            user.save()
        return user

class ConvidadoForm(forms.Form):
    """
    Formulário simplificado para acesso temporário.
    """
    nome = forms.CharField(label="Nome", max_length=150, widget=forms.TextInput(attrs={'placeholder': 'Ex: João Silva'}))
    celular = forms.CharField(label="Celular", max_length=20, widget=forms.TextInput(attrs={'placeholder': 'Ex: (00)00000-0000'}))
    