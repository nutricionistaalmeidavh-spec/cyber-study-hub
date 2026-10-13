FROM python:3.13-alpine
# Imagem didática; fixe digest após resolver a imagem no seu ambiente.
WORKDIR /app
RUN chown 10001:10001 /app
COPY --chown=10001:10001 server.py /app/server.py
USER 10001:10001
EXPOSE 8080
CMD ["python", "-u", "/app/server.py"]
