#!/usr/bin/python2.7
# -*- coding: utf-8 -*-

import pygame
import json
import urllib
import StringIO
import time
from datetime import datetime, date
from functions import get, menu, render
import sys
import socket

# Initialisation

pygame.font.init()
screen = pygame.display.set_mode((320, 240))
background = pygame.Surface(screen.get_size())
background = background.convert()

# Récupération de la config

conf_file = open("../conf/wake.json")
conf = json.load(conf_file)

# Définition des polices
font_filename = pygame.font.match_font(conf["general"]["font"])
font = pygame.font.Font(font_filename, 14)
font_time = pygame.font.Font(font_filename, 135)


# Definition des images

image_temp = pygame.image.load("images/misc/temp.png")
image_rise = pygame.image.load("images/misc/rise.png")
image_set = pygame.image.load("images/misc/set.png")
image_mail = pygame.image.load("images/misc/mail.png")
image_news = pygame.image.load("images/misc/news.png")
image_cal = pygame.image.load("images/misc/cal.png")


config_menu = menu.Menu(screen, ["Modifier l'heure", "Durée du snooze", "Modifier l'action du snooze"], font)

def get_data(): 
	s = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
	s.connect("mastersocket")
	s.send(json.dumps({"request": "get_data"}))
	data = s.recv(8192)
	raw = json.loads(data)
	if raw :
		(data, data_forecast, unread, news, cal) = raw
		return (data, data_forecast, unread, news, cal)
	else :
		return False

def update(): 
	raw = get_data()
	if raw :
		(data, data_forecast, unread, news, cal) = raw

		image_weather = pygame.image.load("images/weather/" + data_forecast["list"][0]["weather"][0]["icon"] + ".png")
		# Collage des images
		background.fill((0, 0, 0))

		background.blit(image_weather, image_weather.get_rect())
		background.blit(image_temp, image_temp.get_rect(centerx=130))
		background.blit(image_rise, image_rise.get_rect(centerx=190, centery=22))
		background.blit(image_set, image_set.get_rect(centerx=260, centery=22))
		background.blit(image_mail, image_mail.get_rect(centerx=125, centery=60))
		background.blit(image_news, image_news.get_rect(centerx=190, centery=60))
		background.blit(image_cal, image_cal.get_rect(centerx=260, centery=60))

		# On ajoute l'heure

		"""text_time = font_time.render(datetime.today().strftime("%H:%M"), 1, (255, 255, 255))
		text_height = font_time.get_ascent()
		text_time = text_time.subsurface(pygame.Rect(0, (text_time.get_height() - text_height) / 2 , text_time.get_width(), text_height))
		background.blit(pygame.transform.smoothscale(text_time, (320, 120)), pygame.Rect(0, 120, 320, 120))"""
		
		render.render(datetime.today().strftime("%H:%M"), font_time, background, (255,255,255), 0, 120, 320, 120)
		# On ajoute la température

		"""text_temp = font.render(str(round(data_forecast["list"][0]["temp"]["day"], 1)), 1, (255, 255, 255))
		text_temp_pos = text_temp.get_rect(x=145, y=18)
		background.blit(text_temp, text_temp_pos)"""

		render.render(str(round(data_forecast["list"][0]["temp"]["day"], 1)), font, background, (255,255,255), 140, 20, 30, 14)
		# On ajoute les image de lever et de coucher du soleil

		"""text_time_rise = font.render(datetime.fromtimestamp(data["sys"]["sunrise"]).strftime("%H:%M"), 1, (255, 255, 255))
		text_time_rise_pos = text_time_rise.get_rect(x=210, y=18)
		background.blit(text_time_rise, text_time_rise_pos)"""

		render.render(datetime.fromtimestamp(data["sys"]["sunrise"]).strftime("%H:%M"), font, background, (255,255,255), 210, 20, 30, 14)

		"""text_time_set = font.render(datetime.fromtimestamp(data["sys"]["sunset"]).strftime("%H:%M"), 1, (255, 255, 255))
		text_time_set_pos = text_time_set.get_rect(x=280, y=18)
		background.blit(text_time_set, text_time_set_pos)"""

		render.render(datetime.fromtimestamp(data["sys"]["sunrise"]).strftime("%H:%M"), font, background, (255,255,255), 280, 20, 30, 14)

		# On ajoute le compteur des mails non lus


		"""text_mail = font.render(str(unread), 1, (255, 255, 255))
		text_mail_pos = text_mail.get_rect(x=145, y=55)
		background.blit(text_mail, text_mail_pos)"""

		render.render(str(unread), font, background, (255,255,255), 140, 52, 30, 14)

		# On met aussi les news


		"""text_news = font.render(str(news), 1, (255, 255, 255))
		text_news_pos = text_news.get_rect(x=210, y=55)
		background.blit(text_news, text_news_pos)"""

		render.render(str(news), font, background, (255,255,255), 210, 52, 30, 14)

		# On ajoute le compteur d'évènements dans la journée


		"""text_cal = font.render(str(cal[0]), 1, (255, 255, 255))
		text_cal_pos = text_cal.get_rect(x=280, y=55)
		background.blit(text_cal, text_cal_pos)"""

		render.render(str(cal[0]), font, background, (255,255,255), 280, 52, 30, 14)

		screen.blit(background, (0, 0))
		pygame.display.flip()
	else :
		return False

# Boucle de rafraichissement

while 1 : 
	time.sleep(0.1)
	update()

	#config_menu.show()
	#config_menu.select_delta(2)
	#config_menu.hide()
	for event in pygame.event.get():
		if event.type == pygame.QUIT:
			sys.exit()
