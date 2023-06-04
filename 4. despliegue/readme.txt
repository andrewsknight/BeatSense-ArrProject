La función que se encarga de segmentar los latidos es:
proceso_segmentacion.

def proceso_segmentacion(vector, fs, umbral=0.3, 
                        distancia_minima=20, grafica=0):

Parámetros:

vector: Arreglo de valores que representan el segmento de 
        10 segundos del trazo de ECG
fs:     Frecuencia de muestreo a la que fue registrado
        el trazo de ECG que se pasa en "vector"
umbral: El valor para identificar un candidato a onda R
        Por defecto es 0.3
distancia_minima: Número de muestras mínimas que deben
        existir entre R y R
ggrafica: Ayuda para visualizar paso a paso lo que 
        hace la función en el proceso de segmentación
        0: No grafica nada
        1: Gráfica del vector original recibido
        2: Gráfica del vector ajustado a una frecuencia de 125Hz
        3: Gráfica del vector normalizado
        4: Gráfica del vector después de derivar, 
           eliminar valores menores que cxero y normalizar
        5: Gráfica de latidos con vector derivado

Retorno:
        Regresa un dataframe con los latidos segmentados
        con 187 columnas.

        


El modelo retorna 5 clases utilizando la siguiente
codificación:

 ['N': 0, 'S': 1, 'V': 2, 'F': 3, 'Q': 4]

N: Normal beats
S: Supraventricular ectopic beats 
V: Ventricular ectopic beat
F: Fusion beats
Q: Unknown beats

