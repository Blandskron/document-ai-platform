from pathlib import Path
from django.conf import settings
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from openai import OpenAI  # ✅ nuevo cliente

from .models import Document
from .serializers import DocumentSerializer
from .utils import get_file_content, generate_summary


# Inicializar cliente OpenAI
client = OpenAI(api_key=settings.OPENAI_API_KEY)


# 📄 Listar documentos del usuario
class DocumentListView(generics.ListAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Document.objects.filter(user=self.request.user)


# 📤 Subir documento con resumen automático
class DocumentUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    @extend_schema(
        request={
            "multipart/form-data": {
                "type": "object",
                "properties": {
                    "file": {"type": "string", "format": "binary"},
                    "title": {"type": "string"},
                },
                "required": ["file"],
            }
        },
        responses={201: DocumentSerializer},
        description="Subir un documento en formato `multipart/form-data`. "
                    "El campo **file** es obligatorio, **title** es opcional."
    )
    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get("file")
        if not file_obj:
            return Response({"error": "Debe enviar un archivo"}, status=400)

        title = request.data.get("title", file_obj.name)

        # 📂 Guardar archivo en carpeta uploads/
        upload_path = Path(settings.MEDIA_ROOT) / "uploads"
        upload_path.mkdir(parents=True, exist_ok=True)

        safe_filename = file_obj.name.replace(" ", "_")
        file_path = upload_path / safe_filename

        with open(file_path, "wb+") as dest:
            for chunk in file_obj.chunks():
                dest.write(chunk)

        # 📌 Crear registro en DB
        document = Document.objects.create(
            user=request.user,
            file=f"uploads/{file_path.name}",
            title=title
        )

        # 🧠 Generar resumen (puede usar tu utils o directamente OpenAI)
        content = get_file_content(str(file_path))
        document.summary = generate_summary(content)
        document.save()

        return Response(DocumentSerializer(document).data, status=201)


# 🔍 Buscar con IA en resúmenes
class DocumentSearchAI(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="q",
                type=str,
                location=OpenApiParameter.QUERY,
                description="Texto de búsqueda en los resúmenes de documentos"
            )
        ],
        responses={200: OpenApiResponse(response={"type": "object"})},
        description="Busca en los resúmenes de documentos del usuario con IA."
    )
    def get(self, request):
        query = request.query_params.get("q", "")
        docs = Document.objects.filter(user=request.user)

        summaries = "\n\n".join(
            [f"{doc.title}: {doc.summary}" for doc in docs if doc.summary]
        )
        if not summaries.strip():
            return Response({"query": query, "result": "No hay documentos con resúmenes"})

        # 📌 Prompt para IA
        prompt = (
            f"El usuario busca: {query}\n"
            f"Busca en los resúmenes de documentos:\n{summaries}\n\n"
            "Devuelve la respuesta más relevante."
        )

        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",   # ✅ puedes cambiar a gpt-4o-mini si quieres mejor calidad
                messages=[
                    {"role": "system", "content": "Eres un asistente que ayuda a buscar en resúmenes de documentos."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=200,
                temperature=0.4,
            )
            result = response.choices[0].message.content.strip()
        except Exception as e:
            print(f"❌ Error en búsqueda IA: {e}")
            result = "Error en búsqueda con IA"

        return Response({"query": query, "result": result})
