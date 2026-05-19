import cv2
import os
import numpy as np
from PIL import Image, ImageOps

def process_passport_photo(input_path, output_dir, file_id):
    img = Image.open(input_path)
    width, height = img.size

    target_ratio = 35 / 45
    current_ratio = width / height

    if current_ratio > target_ratio:
        new_width = int(height * target_ratio)
        left = (width - new_width) / 2
        img = img.crop((left, 0, left + new_width, height))
    else:
        new_height = int(width / target_ratio)
        top = (height - new_height) / 2
        img = img.crop((0, top, width, top + new_height))

    img = img.resize((350, 450), Image.Resampling.LANCZOS)

    output_path = os.path.join(output_dir, f"{file_id}_fototessera.jpg")
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    img.save(output_path, quality=95)
    return output_path


def censor_photo(input_path, output_dir, file_id):
    image = cv2.imread(input_path)
    if image is None:
        return input_path

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=4)
    for (x, y, w, h) in faces:
        roi = image[y:y+h, x:x+w]
        image[y:y+h, x:x+w] = cv2.GaussianBlur(roi, (99, 99), 30)

    plate_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_russian_plate_number.xml')
    plates = plate_cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=1, minSize=(30, 10))
    for (x, y, w, h) in plates:
        roi = image[y:y+h, x:x+w]
        image[y:y+h, x:x+w] = cv2.GaussianBlur(roi, (99, 99), 30)

    rectKernel = cv2.getStructuringElement(cv2.MORPH_RECT, (13, 5))
    blackhat = cv2.morphologyEx(gray, cv2.MORPH_BLACKHAT, rectKernel)
    gradX = cv2.Sobel(blackhat, ddepth=cv2.CV_32F, dx=1, dy=0, ksize=-1)
    gradX = np.absolute(gradX)
    minVal, maxVal = np.min(gradX), np.max(gradX)
    if maxVal - minVal > 0:
        gradX = (255 * ((gradX - minVal) / (maxVal - minVal))).astype("uint8")
    else:
        gradX = np.zeros_like(gradX, dtype="uint8")
    gradX = cv2.GaussianBlur(gradX, (5, 5), 0)
    gradX = cv2.morphologyEx(gradX, cv2.MORPH_CLOSE, rectKernel)
    thresh = cv2.threshold(gradX, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
    thresh = cv2.erode(thresh, None, iterations=2)
    thresh = cv2.dilate(thresh, None, iterations=2)
    cnts, _ = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    for c in cnts:
        (x, y, w, h) = cv2.boundingRect(c)
        ar = w / float(h)
        if 2.5 <= ar <= 6.0 and w > 40 and h > 10:
            roi = image[y:y+h, x:x+w]
            image[y:y+h, x:x+w] = cv2.GaussianBlur(roi, (99, 99), 30)

    output_path = os.path.join(output_dir, f"{file_id}_censurata.jpg")
    cv2.imwrite(output_path, image)
    return output_path


def restore_old_photo(input_path, output_dir, file_id):
    img = cv2.imread(input_path)
    if img is None:
        raise ValueError("Impossibile leggere l'immagine fornita.")

    denoised = cv2.fastNlMeansDenoisingColored(img, None, 10, 10, 7, 21)

    gaussian = cv2.GaussianBlur(denoised, (0, 0), 2.0)
    sharpened = cv2.addWeighted(denoised, 1.5, gaussian, -0.5, 0)

    result = cv2.normalize(sharpened, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX)

    output_path = os.path.join(output_dir, f"{file_id}_restaurata.jpg")
    cv2.imwrite(output_path, result)
    return output_path


def enhance_real_estate(input_path, output_dir, file_id):
    img = cv2.imread(input_path)
    if img is None:
        return input_path

    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    h, s, v = cv2.split(hsv)
    v = cv2.add(v, 30)
    s = cv2.add(s, 20)
    final_hsv = cv2.merge((h, s, v))
    img = cv2.cvtColor(final_hsv, cv2.COLOR_HSV2BGR)

    gaussian = cv2.GaussianBlur(img, (0, 0), 2.0)
    img = cv2.addWeighted(img, 1.2, gaussian, -0.2, 0)

    out = os.path.join(output_dir, f"{file_id}_immobiliare.jpg")
    cv2.imwrite(out, img)
    return out


def remove_background(input_path, output_dir, file_id):
    img = cv2.imread(input_path)
    if img is None:
        return input_path

    h, w = img.shape[:2]
    rect = (10, 10, w - 20, h - 20)

    mask = np.zeros(img.shape[:2], np.uint8)
    bgdModel = np.zeros((1, 65), np.float64)
    fgdModel = np.zeros((1, 65), np.float64)

    cv2.grabCut(img, mask, rect, bgdModel, fgdModel, 5, cv2.GC_INIT_WITH_RECT)

    mask2 = np.where((mask == 2) | (mask == 0), 0, 1).astype('uint8')
    result = img * mask2[:, :, np.newaxis]

    out = os.path.join(output_dir, f"{file_id}_nobg.png")
    cv2.imwrite(out, result)
    return out


def upscale_image(input_path, output_dir, file_id):
    img = cv2.imread(input_path)
    if img is None:
        return input_path
    height, width = img.shape[:2]
    img = cv2.resize(img, (width*2, height*2), interpolation=cv2.INTER_CUBIC)
    gaussian = cv2.GaussianBlur(img, (0, 0), 2.0)
    img = cv2.addWeighted(img, 1.5, gaussian, -0.5, 0)
    out = os.path.join(output_dir, f"{file_id}_upscaled.jpg")
    cv2.imwrite(out, img)
    return out


def social_resize(input_path, output_dir, file_id):
    img = Image.open(input_path)
    sizes = {
        "instagram": (1080, 1080),
        "tiktok": (1080, 1920),
        "youtube": (1920, 1080)
    }
    base, ext = os.path.splitext(os.path.basename(input_path)) if input_path else ("output", ".jpg")
    for platform, size in sizes.items():
        resized = ImageOps.pad(img, size, color="#0d0e15")
        path = os.path.join(output_dir, f"{file_id}_{platform}.jpg")
        resized.convert("RGB").save(path, quality=90)
    out = os.path.join(output_dir, f"{file_id}_social.jpg")
    ImageOps.pad(img, (1080, 1080), color="#0d0e15").convert("RGB").save(out, quality=90)
    return out
