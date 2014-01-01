#!/usr/bin/python2.7
# -*- coding: utf-8 -*-

from functions import get
import time
import json
import socket
import os

conf_file = open("../conf/wake.json")
conf = json.load(conf_file)

# Mise en place des proxies

os.environ["http_proxy"] = conf["general"]["http_proxy"]
os.environ["https_proxy"] = conf["general"]["https_proxy"]

while 1 :
	try :
		(data, data_forecast) = get.weather(conf)
		unread = get.mail(conf)
		news = get.news(conf)
		cal = get.calendar(conf)
	except :
		continue;
	s = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
	s.connect("mastersocket")
	s.send(json.dumps({"request": "new_data", "content": [data, data_forecast, unread, news, cal]}))
	print s.recv(8192)	
	s.shutdown(socket.SHUT_RDWR)
	time.sleep(10)
