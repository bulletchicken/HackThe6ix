from ultralytics import YOLO
import cv2

import numpy as np
import serial
from time import sleep


arduino = serial.Serial('/dev/cu.usbmodem14101', 9600)

sleep(2)
arduino.write("a90".encode())
sleep(1)


#model = YOLO('best_2.pt')
#model.predict(source="0", show=True, conf=0.1)