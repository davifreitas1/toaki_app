from django.apps import AppConfig

class ToakiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'toaki_app'
    
    def ready(self):
        # Importa os sinais quando o app inicia
        import toaki_app.signals
