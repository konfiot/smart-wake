#!/usr/bin/python2.7
# -*- coding: utf-8 -*-

from Tkinter import *
import Image, ImageTk
import json
import urllib
import StringIO
from datetime import datetime

root = Tk()

conf_file = open("../conf/wake.json")
conf = json.load(conf_file)


# On met la fenêtre en plein écran

w, h = 320, 240
root.overrideredirect(1)
root.geometry("%dx%d+0+0" % (w, h))
root.configure(background='black')

# On va chercher la météo

req = urllib.urlopen("http://api.openweathermap.org/data/2.5/weather?q=" + conf["weather"]["location"]);
data = json.load(req)

# On ouvre l'image

reqimg = urllib.urlopen("http://openweathermap.org/img/w/"+ data["weather"][0]["icon"] + ".png")

image = Image.open("../images/weather/" + data["weather"][0]["icon"] + ".png")
tkpi = ImageTk.PhotoImage(image)

label_image = Label(root, image=tkpi, background="black")
label_image.place(x=0,y=0,width=w*50/100,height=h*50/100)

# On ajoute l'heure

label_time = Label(root, background="black", foreground="white", text=datetime.today().strftime("%H:%M"), font=("Helvetica", 95))
label_time.place(x=0, y=120, width=w, height=h*50/100)

# On ajoute les image de lever et de coucher du soleil

image_rise = Image.open("../images/misc/rise.png")
tkpi_rise = ImageTk.PhotoImage(image_rise)

label_image_rise = Label(root, image=tkpi_rise, background="black")
label_image_rise.place(x=160,y=0,width=w*25/100,height=h*25/100)

image_set = Image.open("../images/misc/set.png")
tkpi_set = ImageTk.PhotoImage(image_set)

label_image_set = Label(root, image=tkpi_set, background="black")
label_image_set.place(x=160,y=60,width=w*25/100,height=h*25/100)

# On lance la fenêtre

root.mainloop()