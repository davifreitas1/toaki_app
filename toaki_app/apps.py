from django.apps import AppConfig

class ToakiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'toaki_app'

    def ready(self):
        # Isso executa o __init__.py da pasta signals, registrando tudo
        import toaki_app.signals
