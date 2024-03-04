// Haptics
#include <Wire.h>
#include "Adafruit_DRV2605.h"

// Networking
#include <ArduinoHttpClient.h>
#include <WiFiNINA.h>  // use this for MKR1010 and Nano 33 IoT
//#include <WiFi101.h>    // use this for MKR1000
// your passwords go in arduino_secrets.h
#include "arduino_secrets.h"

WiFiSSLClient wifi;

char serverAddress[] = "api.liveblocks.io";
int port = 443;
char endpoint[] = "/v7?roomId=web-haptics&pubkey=pk_prod_NRpn0sb0aCNWsl7RXQ7FnxiTE5xlAR52PRgSyDD13xlidKhB0GLNuAJGWVIFNm77&version=1.9.8";

// initialize the webSocket client
WebSocketClient client = WebSocketClient(wifi, serverAddress, port);
// message sending interval, in ms:
int interval = 5000;
// last time a message was sent, in ms:
long lastSend = 0;

Adafruit_DRV2605 drv;

void setup() {
  Serial.begin(9600);
  if (!Serial) delay(3000);

  // connect to WIFi:
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print("Attempting to connect to Network named: ");
    Serial.println(SECRET_SSID);
    // Connect to WPA/WPA2 network:
    WiFi.begin(SECRET_SSID, SECRET_PASS);
  }

  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your board's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);
  // If there's an API endpoint to connect to, add it here.
  // leave blank if there's no endpoint:
  client.begin(endpoint);

  drv.begin();

  drv.setMode(DRV2605_MODE_INTTRIG); // default, internal trigger when sending GO command
  drv.selectLibrary(1);
}

void loop() {
  // if not connected to the socket server, try to connect:
  if (client.connected()) {
    // Serial.println("Connected");
  }
  else {
    client.begin();
    delay(1000);
    Serial.println("attempting to connect to server");
    // skip the rest of the loop:
    return;
  }

  // check if a message is available to be received
  int messageSize = client.parseMessage();
  String messageText = client.readString();
  // if there's a string with length > 0:
  if (messageSize > 0) {
    Serial.print("Received a message:");
    Serial.println(messageText);
    digitalWrite(LED_BUILTIN, HIGH);
  }

  if (messageText.indexOf("rocket") > 0) {
    drv.setWaveform(0, 86);
    drv.setWaveform(1, 84);
    drv.setWaveform(2, 82);
    drv.setWaveform(3, 0);  // end of waveforms
    drv.go();
    delay(1000);
  }
  if (messageText.indexOf("alarm") > 0) {
    // two clicks
    drv.setWaveform(0, 1);
    drv.setWaveform(1, 9);

    // shorter
    drv.setWaveform(3, 84);
    drv.setWaveform(4, 74);

    // longer
    drv.setWaveform(5, 82);
    drv.setWaveform(6, 72);

    drv.setWaveform(9, 0);  // end of waveforms

    drv.go();
    delay(1000);
    // digitalWrite(LED_BUILTIN, LOW);
  }
  if (messageText.indexOf("cat") > 0) {
    drv.setWaveform(0, 119);
    drv.setWaveform(1, 120);
    drv.setWaveform(2, 121);
    drv.setWaveform(3, 122);
    drv.setWaveform(8, 119);
    drv.setWaveform(9, 120);
    drv.setWaveform(10, 121);
    drv.setWaveform(11, 122);
    drv.setWaveform(12, 0);  // end of waveforms
    drv.go();
    delay(1000);
  }
  if (messageText.indexOf("fairy") > 0) {
    drv.setWaveform(0, 22);
    drv.setWaveform(1, 21);
    drv.setWaveform(2, 0);  // end of waveforms
    drv.go();
    delay(1000);
  }
}
