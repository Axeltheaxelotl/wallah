import os
import subprocess
import tkinter as tk
from tkinter import simpledialog, messagebox
from PIL import Image, ImageTk

# Paramètres du troll
TROLL_COMMANDS = [
    # Changer la taille des icônes du bureau
    "gsettings set org.gnome.nautilus.icon-view default-zoom-level 'small'",
    # Activer le zoom de l'écran
    "gsettings set org.gnome.desktop.a11y.magnifier mag-factor 2.0",
    "gsettings set org.gnome.desktop.a11y.applications screen-magnifier-enabled true",
    # Changer la disposition du dock
    "gsettings set org.gnome.shell.extensions.dash-to-dock dock-position 'RIGHT'",
    # Changer la vitesse de la souris
    "gsettings set org.gnome.desktop.peripherals.mouse speed -1.0",
    # Inverser le défilement de la souris
    "gsettings set org.gnome.desktop.peripherals.mouse natural-scroll true",
    # Changer le thème GTK
    "gsettings set org.gnome.desktop.interface gtk-theme 'Adwaita-dark'",
]

# Commandes pour restaurer les paramètres
RESTORE_COMMANDS = [
    "gsettings set org.gnome.nautilus.icon-view default-zoom-level 'standard'",
    "gsettings set org.gnome.desktop.a11y.magnifier mag-factor 1.0",
    "gsettings set org.gnome.desktop.a11y.applications screen-magnifier-enabled false",
    "gsettings set org.gnome.shell.extensions.dash-to-dock dock-position 'BOTTOM'",
    "gsettings set org.gnome.desktop.peripherals.mouse speed 0.0",
    "gsettings set org.gnome.desktop.peripherals.mouse natural-scroll false",
    "gsettings set org.gnome.desktop.interface gtk-theme 'Adwaita'",
]

PASSWORD = "motdepasse"  # À personnaliser
IMAGE_PATH = None  # Remplace par le chemin de ton image si tu veux en afficher une

def apply_troll():
    for cmd in TROLL_COMMANDS:
        subprocess.call(cmd, shell=True)

def restore_settings():
    for cmd in RESTORE_COMMANDS:
        subprocess.call(cmd, shell=True)

def ask_password():
    root = tk.Tk()
    root.withdraw()
    while True:
        pwd = simpledialog.askstring("Déblocage GNOME", "Entrez le mot de passe pour restaurer :", show='*')
        if pwd is None:
            continue  # Empêche de fermer la fenêtre
        if pwd == PASSWORD:
            restore_settings()
            messagebox.showinfo("Succès", "GNOME restauré !")
            break
        else:
            messagebox.showerror("Erreur", "Mot de passe incorrect.")

class LockScreen(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Écran verrouillé")
        self.geometry("600x400")  # Pour le test, pas en plein écran
        self.resizable(False, False)
        self.attributes("-topmost", True)
        self.protocol("WM_DELETE_WINDOW", self.disable_event)
        self.configure(bg="black")

        # Affichage de l'image si fournie
        if IMAGE_PATH:
            img = Image.open(IMAGE_PATH)
            img = img.resize((600, 300))
            self.photo = ImageTk.PhotoImage(img)
            label = tk.Label(self, image=self.photo)
            label.pack(pady=10)
        else:
            label = tk.Label(self, text="ÉCRAN BLOQUÉ", font=("Arial", 32), fg="white", bg="black")
            label.pack(pady=60)

        # Zone de mot de passe
        self.pwd_label = tk.Label(self, text="Mot de passe :", font=("Arial", 16), fg="white", bg="black")
        self.pwd_label.pack()
        self.pwd_entry = tk.Entry(self, show="*", font=("Arial", 16))
        self.pwd_entry.pack(pady=10)
        self.pwd_entry.focus_set()
        self.pwd_entry.bind('<Return>', self.check_password)

        self.btn = tk.Button(self, text="Déverrouiller", command=self.check_password)
        self.btn.pack(pady=10)

    def check_password(self, event=None):
        if self.pwd_entry.get() == PASSWORD:
            self.destroy()
        else:
            messagebox.showerror("Erreur", "Mot de passe incorrect.")
            self.pwd_entry.delete(0, tk.END)

    def disable_event(self):
        pass  # Empêche la fermeture de la fenêtre

if __name__ == "__main__":
    apply_troll()
    app = LockScreen()
    app.mainloop()