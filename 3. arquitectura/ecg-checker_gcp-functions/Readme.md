## Requerimientos
- node >= 18.16.0
- GCP SDK
## Despliegue de funciones 
gcloud functions deploy login --runtime nodejs18 --trigger-http --allow-unauthenticated


## Funciones adicionales
- gcloud config set project [PROJECT_ID]
- gcloud functions list
- gcloud functions describe [FUNCTION_NAME]
- gcloud functions logs read [FUNCTION_NAME]
- gcloud functions delete [FUNCTION_NAME]

## Instalación de gcloud SDK
- https://cloud.google.com/sdk/docs/install
- https://cloud.google.com/sdk/docs/quickstart
- https://cloud.google.com/sdk/docs/initializing

## Seleccionamos el proyecto de GCP
- gcloud config set project [PROJECT_ID]
