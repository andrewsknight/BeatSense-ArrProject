## Planificación de la arquitectura

## Introducción

En este documento se detalla la arquitectura del proyecto, se explican las decisiones tomadas y se justifican las mismas.
El sistema de detección de anomalias cardiacas mediante latidos se divide en 5 partes fundamentales, las cuales se describen a continuación:

1. **Adquisición de datos**: Se encarga de obtener los datos desde diferentes fuentes y almacenarlos en una base de datos. Las fuentes son:
* **Ficheros de datos**: Son archivos en formato CSV que contienen los datos segmentos de ECG de 10 segundos de duración.
* **Imagenes de electrocardiogramas**: Imagenes ad-hoc que contienen un electrocardiograma de 10 segundos de duración.
* **Datos predefinidos**: A modo de prueba, estos datos son precargados por la aplicación

Está definido por una aplicación cliente en Ionic y desplegada como PWA: [ECG checker](../5.%20clientes/ecg-checker/Readme.md)

2. **Procesamiento de datos**: Se encarga de procesar los datos almacenados en la base de datos: [ECG checker functions](./ecg-checker_gcp-functions/Readme.md)
3. **Modelo de predicción**: Se encarga de predecir si un latido es anómalo o no (teniendo en cuenta que son 5 clases) [MedDataBrigade Online](./MedDataBrigadeOnline).
4. **Visualización de resultados**: Se encarga de mostrar los datos procesados en una interfaz web que es la misma aplicación Ionic.
5. **Almacenamiento de datos**: Se encarga de almacenar los datos procesados en una base de datos.

![Arquitectura](./images/arquitectura%20app-Flujo%20de%20arquitectura.drawio.png)
*Diseño de la arquitectura planteada*
### 1. Adquisición de datos
La adquisición de los datos se hace por medio de un cliente web, el cual tiene las funcionalidades para poder obtener información de archivos CSV y 
de imágenes de electrocardiogramas. Estos datos son enviados a la capa de procesamiento de datos y se almacenan en una base de datos MongoDB Atlas.


![Adquisición de datos](./images/Captura%20de%20pantalla%20de%202023-05-10%2011-16-53.png)

Desde el ordenador o el movil se pueden subir los archivos CSV y las imagenes de electrocardiogramas.

![Selección de datos](./images/Captura%20de%20pantalla%20de%202023-05-10%2011-17-26.png)


### 2. Procesamiento de datos
El procesamiento de datos se realiza en 2 etapas, a diferentes niveles de la arquitectura. 
La primera parte sucede en cloud functions, su unica tarea es enviarlos a la segunda parte del procesamiento y a clasificar, 
con los resultados se generan estructuras de datos que se almacenan en MongoDB Atlas y en Google Cloud storage.
La segunda parte sucede en una instancia de Google Cloud Run, donde se encuentra el modelo de predicción, antes de pasar por el modelo se realiza el 
preprocesamiento que consiste en transformar los datos y segmentarlos


![Funciones de receopción de datos y almacenamiento](./images/Captura%20de%20pantalla%20de%202023-05-10%2011-22-23.png "Procesamiento")
*Las funciones de procesamiento de datos reciben y el resultado lo reestructuran para llevarlo a la base de datos*

A continuación se muestra la instancia de Cloud Run, donde se encuentra el modelo de predicción.






### 3. Modelo de predicción

El modelo de predicción se encuentra en la instancia de Cloud Run, es un modelo de clasificación de 5 clases y recibe el conjunto de segmentos 
para de la señal de ECG.

![Instancia de Cloud Run](./images/Captura%20de%20pantalla%20de%202023-05-10%2011-27-51.png "Procesamiento")


### 4. Visualización de resultados

Los resultados vuelven a la aplicación cliente, donde se muestran al cliente las graficas de cada latido segmentado y su clasificación.

![Visualización de resultados](./images/Captura%20de%20pantalla%20de%202023-05-10%2011-30-15.png "Visualización")

### 5. Almacenamiento de datos

Los datos se almacenan en una base de datos MongoDB Atlas, en la cual se almacenan los datos de los latidos segmentados y los resultados de la clasificación.

![Almacenamiento de datos](./images/Captura%20de%20pantalla%20de%202023-05-10%2011-33-15.png "Almacenamiento")