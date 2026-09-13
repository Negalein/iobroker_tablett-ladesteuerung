# 📱🔋 Tablet Ladesteuerung V2 Deluxe für ioBroker

Automatische und intelligente Ladesteuerung für Android-Tablets mit **FullyBrowser**, **ioBroker** und **Shelly Steckdosen**.

Das Script überwacht den Akkustand von mehreren Tablets und steuert die Stromversorgung automatisch über Shelly-Steckdosen.

Zusätzlich stehen umfangreiche Funktionen für **VIS**, **Telegram**, **WhatsApp**, Ladezeiten und Ladezyklen zur Verfügung.

---

# ✨ Funktionen

- 🔋 Automatische Ladesteuerung
- 📱 Unterstützung mehrerer Tablets
- 🔌 Steuerung über Shelly Steckdosen
- 🎛️ VIS-Unterstützung
- 🤖 Automatikbetrieb
- ⚡ Manuell EIN
- ⛔ Manuell AUS
- 🔋 Einstellbare Mindest-Ladegrenze
- 🔋 Einstellbare maximale Ladegrenze
- 🚨 Einstellbarer kritischer Akkustand
- ⏱️ Aktuelle Ladezeit
- ⏱️ Letzte Ladezeit
- 🔄 Ladezyklen
- 📅 Letzter Ladebeginn
- 📅 Letztes Ladeende
- ✈️ Telegram-Benachrichtigungen
- 💬 WhatsApp-Benachrichtigungen
- 🔕 Schutz vor Nachrichtenflut
- 📊 Umfangreiche Statusinformationen

---

# 🔋 Automatische Ladesteuerung

Die automatische Ladesteuerung arbeitet mit zwei frei einstellbaren Grenzen.

Beispiel:

```text
Akku ≤ 20 %  → Laden EIN
Akku ≥ 80 %  → Laden AUS
```

Zwischen den beiden Grenzwerten bleibt der aktuelle Zustand erhalten.

Dadurch entsteht eine Hysterese und die Steckdose wird nicht ständig ein- und ausgeschaltet.

---

# 📱 Unterstützte Tablets

Das Script unterstützt mehrere Tablets.

In der aktuellen Konfiguration sind bereits zwei Tablets eingerichtet.

## 📱 Tablet Nega

### Akkustand

```text
fullybrowser.0.Tablet-Nega.Info.batteryLevel
```

### Shelly Steckdose

```text
shelly.0.shellyplusplugs#64b7080c4f74#1.Relay0.Switch
```

---

## 📱 Tablet Nega 2

### Akkustand

```text
fullybrowser.0.Tablet-Nega_2.Info.batteryLevel
```

### Shelly Steckdose

```text
shelly.1.SHPLG-S#C38331#1.Relay0.Switch
```

---

# 🎛️ Betriebsarten

Jedes Tablet besitzt eine eigene Betriebsart.

Folgende Modi stehen zur Verfügung:

## 🤖 Automatik

Die Ladesteuerung arbeitet automatisch.

```text
Akku ≤ MinAkku → Laden EIN

Akku ≥ MaxAkku → Laden AUS
```

---

## ⚡ Manuell EIN

Die Steckdose wird eingeschaltet.

Die automatische Ladesteuerung greift nicht ein.

```text
Betriebsart:

Manuell EIN
```

---

## ⛔ Manuell AUS

Die Steckdose wird ausgeschaltet.

Die automatische Ladesteuerung greift nicht ein.

```text
Betriebsart:

Manuell AUS
```

---

# 🎛️ VIS-Unterstützung

Alle Datenpunkte werden automatisch unter folgendem Pfad erstellt:

```text
0_userdata.0.TabletLadung
```

Dadurch können alle Einstellungen und Statusinformationen einfach in **ioBroker VIS** verwendet werden.

---

# 📂 Datenpunkte

## 🔔 Globale Benachrichtigungen

```text
0_userdata.0.TabletLadung.Benachrichtigungen.Telegram

0_userdata.0.TabletLadung.Benachrichtigungen.WhatsApp
```

Mit diesen Schaltern können Telegram- und WhatsApp-Benachrichtigungen unabhängig voneinander aktiviert oder deaktiviert werden.

---

# 📱 Tablet Nega

Pfad:

```text
0_userdata.0.TabletLadung.Tablet_Nega
```

Folgende Datenpunkte werden erstellt:

```text
Betriebsart

MinAkku
MaxAkku
KritischAkku

Akku
Laedt
Steckdose
Status

AktuelleLadezeit
LetzteLadezeit

Ladezyklen
LadezyklenReset

LetzterLadebeginn
LetztesLadeende

ManuellEin
ManuellAus
```

---

# 📱 Tablet Nega 2

Pfad:

```text
0_userdata.0.TabletLadung.Tablet_Nega_2
```

Folgende Datenpunkte werden erstellt:

```text
Betriebsart

MinAkku
MaxAkku
KritischAkku

Akku
Laedt
Steckdose
Status

AktuelleLadezeit
LetzteLadezeit

Ladezyklen
LadezyklenReset

LetzterLadebeginn
LetztesLadeende

ManuellEin
ManuellAus
```

---

# ⚙️ Einstellungen

## 🔋 MinAkku

Der Wert bestimmt, wann der Ladevorgang gestartet wird.

Standard:

```text
20 %
```

Beispiel:

```text
Akku: 20 %

→ Shelly wird eingeschaltet
→ Tablet beginnt zu laden
```

---

## 🔋 MaxAkku

Der Wert bestimmt, wann der Ladevorgang beendet wird.

Standard:

```text
80 %
```

Beispiel:

```text
Akku: 80 %

→ Shelly wird ausgeschaltet
→ Ladevorgang beendet
```

---

## 🚨 KritischAkku

Der kritische Akkustand bestimmt, wann eine Warnung verschickt wird.

Standard:

```text
10 %
```

Beispiel:

```text
Akku: 10 %

→ Telegram Nachricht
→ WhatsApp Nachricht
```

Die Warnung wird nur einmal gesendet.

Eine erneute Warnung ist erst wieder möglich, nachdem der Akkustand mindestens **2 % über dem kritischen Wert** liegt.

---

# ⏱️ Ladezeit

Das Script misst automatisch die Dauer eines Ladevorgangs.

## Aktuelle Ladezeit

Datenpunkt:

```text
AktuelleLadezeit
```

Beispiel:

```text
01:24:37
```

---

## Letzte Ladezeit

Datenpunkt:

```text
LetzteLadezeit
```

Beispiel:

```text
02:15:42
```

---

# 🔄 Ladezyklen

Jeder gestartete Ladevorgang wird gezählt.

Datenpunkt:

```text
Ladezyklen
```

Beispiel:

```text
Ladezyklen: 42
```

Die Ladezyklen können über folgenden Datenpunkt zurückgesetzt werden:

```text
LadezyklenReset
```

---

# 📅 Ladehistorie

Das Script speichert Informationen über den letzten Ladevorgang.

## Letzter Ladebeginn

Datenpunkt:

```text
LetzterLadebeginn
```

Beispiel:

```text
13.09.2026 18:32
```

---

## Letztes Ladeende

Datenpunkt:

```text
LetztesLadeende
```

Beispiel:

```text
13.09.2026 20:48
```

---

# 📊 Status

Der Datenpunkt:

```text
Status
```

zeigt den aktuellen Zustand des Tablets.

Mögliche Statusmeldungen:

```text
Automatik: Laedt | Akku: 20%

Laedt | Akku: 55%

Akku OK | 67%

Ladeziel erreicht | Akku: 80%

Manuell EIN | Akku: 45%

Manuell AUS | Akku: 45%

Fehler: Kein Akkustand verfügbar

Fehler: MinAkku muss kleiner als MaxAkku sein
```

---

# 📲 Benachrichtigungen

Das Script unterstützt zwei Benachrichtigungsdienste:

- ✈️ Telegram
- 💬 WhatsApp

Es werden nur bei wichtigen Ereignissen Nachrichten verschickt.

Dadurch wird eine Nachrichtenflut verhindert.

---

# ✈️ Telegram

Das Script verwendet den ioBroker Telegram Adapter.

Konfiguration im Script:

```javascript
const TELEGRAM_INSTANCE = "telegram.0";

const CHAT_ID = 630041062;
```

Nachrichten werden über:

```javascript
sendTo(
    TELEGRAM_INSTANCE,
    "send",
    {
        text: text,
        chatId: CHAT_ID
    }
);
```

gesendet.

---

# 💬 WhatsApp

Für WhatsApp wird der Datenpunkt:

```text
whatsapp-cmb.0.sendMessage
```

verwendet.

Nachrichten werden als Text gesendet.

Beispiel:

```javascript
setState(
    "whatsapp-cmb.0.sendMessage",
    "Testnachricht"
);
```

---

# 🔔 Benachrichtigungen

Benachrichtigungen werden nur bei wichtigen Ereignissen gesendet.

---

## ⚡ Ladevorgang gestartet

Beispiel:

```text
⚡ Ladevorgang gestartet

📱 Tablet Nega
🔋 Akku: 20%
🔄 Ladezyklus: 15
```

---

## ✅ Ladeziel erreicht

Beispiel:

```text
✅ Ladeziel erreicht

📱 Tablet Nega
🔋 Akku: 80%
🔌 Ladegerät ausgeschaltet
⏱️ Ladezeit: 02:14:32
```

---

## 🚨 Akku kritisch

Beispiel:

```text
🚨 AKKU KRITISCH!

📱 Tablet Nega
🔋 Akku: 10%
```

---

# 🔕 Benachrichtigungen deaktivieren

Telegram und WhatsApp können separat deaktiviert werden.

## Telegram

```text
0_userdata.0.TabletLadung.Benachrichtigungen.Telegram
```

## WhatsApp

```text
0_userdata.0.TabletLadung.Benachrichtigungen.WhatsApp
```

---

# 🖥️ VIS-Integration

Das Script wurde für die Verwendung mit **ioBroker VIS** entwickelt.

Beispiel einer möglichen Anzeige:

```text
┌──────────────────────────────────┐
│       📱 TABLET NEGA             │
│                                  │
│          🔋 Akku: 67 %           │
│                                  │
│     🟢 Status: Akku OK           │
│                                  │
│     🤖 Automatik                 │
│                                  │
│     🔌 Steckdose: AUS            │
│                                  │
│     ⏱️ Letzte Ladezeit           │
│          02:14:32                │
│                                  │
│     🔄 Ladezyklen: 42            │
└──────────────────────────────────┘
```

---

# 🎛️ Empfohlene VIS-Steuerung

Für jedes Tablet werden folgende Elemente empfohlen.

## 🔋 Akkuanzeige

Datenpunkt:

```text
Akku
```

---

## 🤖 Betriebsart

Datenpunkt:

```text
Betriebsart
```

Mögliche Werte:

```text
Automatik

Manuell EIN

Manuell AUS
```

---

## ⚙️ Ladegrenzen

```text
MinAkku

MaxAkku
```

Beispiel:

```text
Einschalten bei:

20 %
```

```text
Ausschalten bei:

80 %
```

---

## ⚡ Manueller Ladebutton

```text
ManuellEin
```

---

## ⛔ Manueller Ausschaltbutton

```text
ManuellAus
```

---

# ➕ Weitere Tablets hinzufügen

Weitere Tablets können einfach im Bereich:

```javascript
const TABLETS = [
```

hinzugefügt werden.

Beispiel:

```javascript
{
    name: "Tablet_3",

    displayName: "Tablet 3",

    batteryDP:
        "fullybrowser.0.Tablet-3.Info.batteryLevel",

    shellyDP:
        "shelly.2.DEIN_SHELLY_DP.Switch"
}
```

Nach dem Hinzufügen werden automatisch alle benötigten Datenpunkte erstellt.

---

# 🔧 Voraussetzungen

Folgende Komponenten werden benötigt:

- ioBroker
- JavaScript Adapter
- FullyBrowser Adapter
- Shelly Adapter
- Telegram Adapter
- WhatsApp-CMB Adapter

Optional:

- ioBroker VIS

---

# 🚀 Installation

## 1. Script erstellen

Im ioBroker JavaScript Adapter ein neues Script erstellen.

Zum Beispiel:

```text
Tablet Ladesteuerung V2 Deluxe
```

---

## 2. Script einfügen

Das komplette JavaScript in das Script einfügen.

---

## 3. Datenpunkte prüfen

Prüfen, ob die Datenpunkte für die Tablets vorhanden sind.

### Tablet 1

```text
fullybrowser.0.Tablet-Nega.Info.batteryLevel
```

```text
shelly.0.shellyplusplugs#64b7080c4f74#1.Relay0.Switch
```

### Tablet 2

```text
fullybrowser.0.Tablet-Nega_2.Info.batteryLevel
```

```text
shelly.1.SHPLG-S#C38331#1.Relay0.Switch
```

---

## 4. Script starten

Das Script aktivieren.

Nach wenigen Sekunden werden automatisch alle benötigten Datenpunkte unter:

```text
0_userdata.0.TabletLadung
```

erstellt.

---

## 5. VIS konfigurieren

Die gewünschten Datenpunkte in ioBroker VIS verwenden.

---

# ⚠️ Wichtige Hinweise

## MinAkku und MaxAkku

Der Wert von:

```text
MinAkku
```

muss immer kleiner sein als:

```text
MaxAkku
```

Beispiel:

```text
MinAkku: 20

MaxAkku: 80
```

Wenn `MinAkku` größer oder gleich `MaxAkku` ist, wird ein Fehlerstatus angezeigt.

---

## 🔌 Manuelle Betriebsarten

Bei folgenden Betriebsarten wird die Automatik deaktiviert:

```text
Manuell EIN
```

und:

```text
Manuell AUS
```

Um wieder zur automatischen Steuerung zurückzukehren:

```text
Automatik
```

als Betriebsart auswählen.

---

# 🧠 Funktionsweise

Die Steuerung arbeitet mit einer Hysterese.

```text
                Akku

0% ───────────────────────────────── 100%

     20%                      80%
      │                        │
      │                        │
      ▼                        ▼

   Laden EIN                Laden AUS
```

Dadurch wird verhindert, dass die Steckdose ständig ein- und ausgeschaltet wird.

---

# 🔮 Mögliche zukünftige Funktionen

Mögliche Erweiterungen:

- 📊 Akkuverlauf
- 📈 Ladehistorie
- 📉 Akkuverbrauch pro Stunde
- 🌙 Nachtmodus
- ⏰ Zeitgesteuertes Laden
- 🔔 Individuelle Benachrichtigungen pro Tablet
- 📊 Energieverbrauch des Ladegeräts
- 🔌 Erkennung eines ausgefallenen Shelly
- 📱 Tablet Online/Offline Überwachung
- 🔄 Automatischer Neustart des Tablets
- 🏠 Integration in weitere ioBroker Automationen

---

# 🤝 Mitwirken

Verbesserungsvorschläge, Ideen und Erweiterungen sind willkommen.

Wenn du das Script verwendest oder weiterentwickelst, freue ich mich über Feedback.

---

# ⚖️ Lizenz

Dieses Projekt steht unter der **MIT License**.

```text
MIT License

Copyright (c) 2026 Negalein (Christian Wimmer)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

---

# 👤 Autor

**Negalein (Christian Wimmer)**

Copyright © 2026 Negalein (Christian Wimmer)

---

# ⭐ Unterstützung

Wenn dir dieses Projekt gefällt und es dir hilft, freue ich mich über:

- ⭐ einen Stern auf GitHub
- 💡 Verbesserungsvorschläge
- 🐛 Fehlerberichte
- 🔧 eigene Erweiterungen

---

# 📱🔋 Viel Spaß mit der Tablet Ladesteuerung V2 Deluxe!

**Automatisch. Intelligent. VIS-fähig.**

Made with ❤️ for **ioBroker**.
