# Daily3 – Mobile App Development

1. Projektübersicht
Projektidee:
Daily3 ist eine mobile Aufgaben- und Habit-Tracking-App, welche Nutzerinnen und Nutzer dabei unterstützt, täglich kleine Gewohnheiten und Aufgaben zu verfolgen. Der Fokus liegt auf Einfachheit und Motivation: Anstatt viele Aufgaben gleichzeitig zu verwalten, hilft die App, indem der Nutzer als Ziel des Tages drei Aufgaben oder Gewohnheiten abgehackt werden können (natürlich gehen auch mehrere Aufgaben. Als Ziel wären einfach drei pro Tag).

### Zielgruppe
* Personen, die neue tägliche Gewohnheiten aufbauen möchten
* Studierende, die eine einfache App zur Strukturierung ihrer Aufgaben benötigen
* Berufstätige mit wenig Zeit
* Nutzerinnen und Nutzer, die eine schlanke Alternative zu komplexen To-Do-Apps bevorzugen

### Zielsetzung
Die App soll:
* den täglichen Fortschritt sichtbar und nachvollziehbar machen
* mit Bildern und GIFs (z. B. nach erledigten Tagesaufgaben) motivierend wirken
* eine simple, intuitive und schnell bedienbare Oberfläche bieten

---

## 2. Design und Planungsvorgehen

Der erste Entwurf wurde auf Figma erstellt:  
[Figma-Board: Daily 3](https://www.figma.com/design/W0UqR55pHUycfnpZvTXywA/Daily-3?t=DDw96ykMDkmSIrOb-1)

Das Figma-Board diente als Grundlage für die Planung der Benutzeroberfläche und der Kernfunktionen. Während der Umsetzung wurden bewusst Anpassungen vorgenommen, um die App übersichtlicher zu gestalten und den Fokus auf die wichtigsten Funktionen zu legen:

* Entfernung des Fortschrittskreises auf der Startseite
* Entfernung zusätzlicher Icons innerhalb einzelner Aufgabenzeilen
* Vereinfachung der Statistikansicht
* Fokus auf eine klarere Benutzerführung und ein einheitliches Farbschema

Eine visuelle Übersicht ist unter `Daily 3.png` hinterlegt.

---

## 3. Technische Umsetzung

### Verwendete Technologien
* **React Native** – Entwicklung der mobilen Benutzeroberfläche
* **Expo** – Entwicklungsumgebung und Ausführung über Expo Go
* **TypeScript** – Typisierung und höhere Code-Sicherheit
* **React Navigation / Screen-Steuerung** – Wechsel zwischen den Ansichten (`Übersicht`, `Alle`, `Einstellungen`/`Hilfe`, Bearbeiten)
* **`AsyncStorage`** – Lokale Persistenz der Aufgaben und des täglichen Reset-Datums auf dem Gerät

### Verwendete Befehle & Setup
> **Hinweis zum Starten:** Beim Öffnen des Terminals befindet man sich häufig im übergeordneten Ordner `Mobile_app_development`. Zuerst muss in den Projektordner `daily3` gewechselt werden.

```bash
cd daily3
npm install
npx expo install @react-native-async-storage/async-storage expo-constants react-native-safe-area-context
npx expo start

Projektstruktur
???

4. Hauptfunktionen
Startseite:


Startseite: 
Über die Startseite gelangt der Nutzer direkt zu all den wichtigen Funktionen der App. Er erhält auch direkt einen ersten Überblick über die Ziele, die heute anstehen. Diese können dabei direkt abgehackt und dementsprechend in der Statistik erfasst werden. 

Hinzufügen einer Gewohnheit: 
Über diese Seite kann der User die neue Gewohnheit so bearbeiten wie er/sie möchte. Es gibt dabei unterschiedliche Kategorien, welche ausgewählt werden können und anders priorisiert werden. Jede neue Gewohnheit landet dann in einer erstellten Datenbank. 

Statistik-Seite: 
Auf dieser erfährt der Nutzer, wie weit sein Fortschritt der Woche ist. Es zeigt eine Übersicht, wie viele Aufgaben schon erledigt wurden und wie viele pro Tag. Ausserdem verfügt die Seite noch über eine Wochenansicht. 
