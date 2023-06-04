import numpy as np
import cv2
import matplotlib.pyplot as plt
from PIL import Image, ImageOps
from scipy.signal import medfilt, find_peaks
import base64
from io import BytesIO


def load_base64_from_txt(input_file):
    with open(input_file, 'r') as file:
        image_base64_str = file.read()
    return image_base64_str


def load_image(image_base64):
    # Decodifica la imagen en formato base64
    img_data = base64.b64decode(image_base64)

    # Convierte los datos decodificados en un objeto de imagen
    img = Image.open(BytesIO(img_data))
    return img


def to_grayscale(img):
    # Convierte la imagen a escala de grises y devuelve la imagen en escala de grises
    return img.convert('L')


def apply_threshold(img_grayscale, threshold_value=150):
    # Aplica un umbral a la imagen en escala de grises y devuelve la imagen binarizada
    return img_grayscale.point(lambda x: 0 if x < threshold_value else 255, '1')


def invert_image(img_binary):
    # Invierte los colores de la imagen binarizada y devuelve la imagen invertida
    img_array = np.array(img_binary).astype(np.uint8)
    return Image.fromarray(255 - img_array)


def crop_bottom_section(image, y_factor=0.715, height_factor=0.2):
    # Normaliza la imagen y recorta la sección inferior en función de los factores proporcionados
    img_norm = cv2.normalize(image, None, 0, 255, cv2.NORM_MINMAX)
    height, width = image.shape[:2]
    x = 65
    y = int(height * y_factor)
    w = width-130
    h = int(height * height_factor)
    return img_norm[y:y + h, x:x + w]


def binarize_image(image, threshold=128):
    # Binariza la imagen utilizando el valor de umbral proporcionado
    _, binary_image = cv2.threshold(image, threshold, 255, cv2.THRESH_BINARY)
    return binary_image


def ecg_vector_from_binary(binary_image):
    # Extrae el vector ECG de la imagen binaria
    white_points = np.where(binary_image == 255)
    x_coords = white_points[1]
    y_coords = white_points[0]
    height, _ = binary_image.shape

    unique_x_coords = np.unique(x_coords)
    y_values = np.zeros(unique_x_coords.shape, dtype=np.float64)

    for i, x in enumerate(unique_x_coords):
        y_for_x = y_coords[np.where(x_coords == x)]
        y_values[i] = np.max(y_for_x)

    y_values_inverted = height - y_values
    ecg_vector = y_values_inverted.astype(np.float64)
    return ecg_vector


def smooth_ecg_vector(ecg_vector, window_size=7):
    # Suaviza el vector ECG utilizando un filtro de mediana con un tamaño de ventana específico
    return medfilt(ecg_vector, window_size)


def detect_peaks(ecg_vector, prominence=20, min_distance=50):
    # Detecta picos en el vector ECG utilizando la prominencia y la distancia mínima proporcionadas
    peaks, _ = find_peaks(ecg_vector, prominence=prominence, distance=min_distance)
    return peaks


def plot_ecg(ecg_vector, peaks=None):
    # Grafica el vector ECG y, si se proporcionan, los picos detectados
    plt.figure(figsize=(10, 6))
    plt.plot(ecg_vector)
    if peaks is not None:
        plt.plot(peaks, ecg_vector[peaks], "x")
    plt.ylabel('ECG Amplitude')
    plt.xlabel('Time')
    plt.show()


# FUNCIÓN PRINCIPAL
def process_image(image_base64):
    img = load_image(image_base64)
    img_grayscale = to_grayscale(img)
    img_binary = apply_threshold(img_grayscale)
    img_inverted = invert_image(img_binary)
    image = np.array(img_inverted).astype(np.uint8)
    bottom_section = crop_bottom_section(image)
    binary_image = binarize_image(bottom_section)
    ecg_vector = ecg_vector_from_binary(binary_image)
    # smoothed_ecg_vector = smooth_ecg_vector(ecg_vector)
    # peaks = detect_peaks(smoothed_ecg_vector)
    # plot_ecg(smoothed_ecg_vector, peaks)

    return ecg_vector, int(len(ecg_vector) / 10)