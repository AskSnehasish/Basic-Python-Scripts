import cv2
import pytesseract

# Load an image
image = cv2.imread('../data/sample-image.png')

# Convert the image to grayscale
gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Perform OCR on the image
text = pytesseract.image_to_string(gray_image)

print(text)
