from ultralytics import YOLO
import cv2

import numpy as np
import serial
from time import sleep


arduino = serial.Serial('/dev/cu.usbmodem14101', 9600)

sleep(2)
arduino.write("a".encode())
sleep(1)


model = YOLO('best.pt')
predictions = model.predict(source="0", show=True, conf=0.1)
for p in predictions:
    print(p[0])