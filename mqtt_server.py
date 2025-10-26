#!/data/data/com.termux/files/usr/bin/env python3

import paho.mqtt.client as mqtt
import subprocess
from os import getenv
from dotenv import load_dotenv

load_dotenv()

BROKER = getenv("IP")
TOPIC = "phone/control"

def on_message(client, userdata, msg):
    payload = msg.payload.decode()
    print(f"Received: {payload}")
    if payload == "ping":
        print("pong")
    elif payload == "torch_on":
        subprocess.run(["termux-torch", "on"])
    elif payload == "torch_off":
        subprocess.run(["termux-torch", "off"])
    elif payload == "vibrate":
        subprocess.run(["termux-vibrate", "-d", "500"])
    else:
        print("Unknown command")

def main():
    client = mqtt.Client()
    client.on_message = on_message
    client.connect(BROKER, 1883)
    client.subscribe(TOPIC)
    print(f"Connected to {BROKER}, listening on {TOPIC}...")
    client.loop_forever()


if __name__ == "__main__":
    main()
