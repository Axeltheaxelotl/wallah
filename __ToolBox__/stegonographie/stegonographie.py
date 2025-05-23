from PIL import Image
import sys

# --- Fonctions de stéganographie ---
def encode_message(image_path, output_path, message):
    img = Image.open(image_path)
    encoded = img.copy()
    width, height = img.size
    message += chr(0)  # Marqueur de fin
    data = iter([ord(c) for c in message])
    for y in range(height):
        for x in range(width):
            pixel = list(encoded.getpixel((x, y)))
            for n in range(3):  # Pour chaque canal RGB
                try:
                    char = next(data)
                    pixel[n] = pixel[n] & ~1 | ((char >> (2 - n)) & 1)
                except StopIteration:
                    pass
            encoded.putpixel((x, y), tuple(pixel))
    encoded.save(output_path)
    print(f"Message caché dans {output_path}")

def decode_message(image_path):
    img = Image.open(image_path)
    width, height = img.size
    chars = []
    char = 0
    bits_collected = 0
    for y in range(height):
        for x in range(width):
            pixel = img.getpixel((x, y))
            for n in range(3):
                char = (char << 1) | (pixel[n] & 1)
                bits_collected += 1
                if bits_collected == 8:
                    if char == 0:
                        return ''.join(chars)
                    chars.append(chr(char))
                    char = 0
                    bits_collected = 0
    return ''.join(chars)

# --- Interface CLI améliorée ---
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage :\n  Pour encoder : python stegonographie.py encode image.png output.png code.txt\n  Pour décoder : python stegonographie.py decode image_stego.png")
        sys.exit(1)
    if sys.argv[1] == 'encode' and len(sys.argv) == 5:
        # Lecture du message depuis un fichier (ex: code.txt)
        with open(sys.argv[4], 'r') as f:
            message = f.read()
        encode_message(sys.argv[2], sys.argv[3], message)
    elif sys.argv[1] == 'decode' and len(sys.argv) == 3:
        message = decode_message(sys.argv[2])
        print('Message caché :')
        print(message)
    else:
        print("Arguments invalides.")

