### Servicio de cloud function para procesamiento de datos y clasificación

## Instrucciones

Se recomienda crear un notebook de Google Colab 

El contenido de esta carpeta se recomienda subir a colab o a Google Drive para su despliegue: 

1. Conectar con Drive y con GCP: 

```python
# Conectamos con Drive
from google.colab import drive
drive.mount('/content/drive')
```
#### 1. Conectamos con GCP
```python
import sys

# If you are running this notebook in Colab, run this cell and follow the
# instructions to authenticate your GCP account. This provides access to your
# Cloud Storage bucket and lets you submit training jobs and prediction
# requests.

if 'google.colab' in sys.modules:
  from google.colab import auth as google_auth
  google_auth.authenticate_user()

# If you are running this notebook locally, replace the string below with the
# path to your service account key and run this cell to authenticate your GCP
# account.
else:
  %env GOOGLE_APPLICATION_CREDENTIALS ''

```

#### 2. Copiamos nuestra carpeta de Drive a Colab

```python  
! cp -r /content/drive/MyDrive/proyecto-final-rogelio/MedDataBrigadeOnline /content/MedDataBrigadeOnline
# Accedemos a nuestra carpeta 
%cd MedDataBrigadeOnline
```

#### 3. Declaramos nuestras variables de entorno

```python  
PROJECT_ID = "fleet-impact-385817" #@param {type:"string"}
! gcloud config set project $PROJECT_ID

BUCKET_NAME = "meddatabrigade" #@param {type:"string"}
REGION = "us-east4" #@param {type:"string"}
```

#### 4. Desplegamos nuestra imagen en GCP

```python
! gcloud builds submit --tag gcr.io/$PROJECT_ID/heartbeat-analysis-server
```


### En GCP

Seguimos la documentación para crear un servicio de Cloud Run

https://cloud.google.com/run/docs/deploying

![image](./images/Captura%20de%20pantalla%20de%202023-05-10%2011-52-54.png)

La URL del servicio nos servirá para hacer peticiones POST desde las cloud functions.