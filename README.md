**Mobile Bridge** is a connector between two mobile devices (subscriber and publisher). React Native UI is allowing you to remotely control other smartphone's hardware features via MQTT messaging over Wi-Fi. The app connects to a local MQTT broker and provides real-time control of device functions like the torch (flashlight) and vibration.

## Settings

### 1) Mobile device (Android)

Install **Termux** and **Termux-API** via **F-Droid**.

### Termux

Update packages:

```bash
pkg update && pkg upgrade
```

Install Python:

```bash
pkg install python
```

Install Python's modules:

```bash
pip install -r https://raw.githubusercontent.com/kshshton/mobile-bridge/refs/heads/main/sub/requirements.txt
```

Download MQTT server script:

```bash
curl -O https://raw.githubusercontent.com/kshshton/mobile-bridge/refs/heads/main/sub/mqtt_server.py
```

Set permissions for script:

```bash
chmod +x mqtt_server.py
```

Run server:

```bash
./mqtt_server.py
```


### 2) PC

Download Mosquitto MQTT broker from [their website](https://mosquitto.org/download/).

In `mosquitto.conf` set:

MQTT listener (used for mobile server / subscriber):

```text
# listener port-number [ip address/host name/unix socket path]
listener 1883 0.0.0.0
```

Websocket listener (used for React Native Interface / publisher):

```text
listener 9001
protocol websockets
```

Set `allow_anonymous` flag:

```text
# Defaults to false, unless there are no listeners defined in the configuration
# file, in which case it is set to true, but connections are only allowed from
# the local machine.
allow_anonymous true
```

---

If you are using Windows, make sure that firewall is not blocking MQTT port:

```powershell
netsh advfirewall firewall add rule name="Mosquitto MQTT" dir=in action=allow protocol=TCP localport=1883
```

Run service:

```powershell
net start mosquitto
```

Remember, after each change in `mosquitto.conf` you need to restart service:

```powershell
net stop mosquitto
net start mosquitto
```

You can test MQTT connection by command:

```powershell
mosquitto_pub -h {your_local_ip} -t phone/control -m ping
```

*(you should receive "pong" message)*

---

### Initialize React Native app

Clone repo:

```powershell
git clone https://github.com/kshshton/mobile-bridge.git && cd pub
```

Install node modules:

```powershell
npm install
```

Run expo script:
```powershell
npx expo start
```

You can initialize user interface by:
- scanning QR code with second mobile device (Android/iOS)
- using mobile emulator
- web browser

<br>
Happy hacking! :)
