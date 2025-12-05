from django.shortcuts import render

def mostrar_logo(request):
    return render(request,"componentes/atomos/logo.html",{
        "logo_var" : "logo",
        "logo_url": "/static/imagem/logo.png"
    }),
