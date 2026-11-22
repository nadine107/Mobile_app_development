Daily3 - Mobile App Development

1. Projektübersicht
Projektidee:
Daily3 ist eine mobile Aufgaben- und Habit-Tracking-App, welche Nutzerinnen und Nutzer dabei unterstützt, täglich kleine Gewohnheiten und Aufgaben zu verfolgen. Der Fokus liegt auf Einfachheit und Motivation: Anstatt viele Aufgaben gleichzeitig zu verwalten, hilft die App, indem der Nutzer als Ziel des Tages drei Aufgaben oder Gewohnheiten abgehackt werden können (natürlich gehen auch mehrere Aufgaben. Als Ziel wären einfach drei pro Tag).

Zielgruppe:
- Personen, die neue Gewohnheiten aufbauen möchten
- Studierende, die eine einfache App zur Strukturierung ihrer Aufgaben benötigen
- Berufstätige mit wenig Zeit
- Nutzer, die eine einfache Alternative zu komplexen To-Do-Apps suchen

Zielsetzung:
Die App soll: 
- Den Nutzer darin unterstützen ihren täglichen Fortschritt sichtbar zu machen
- mit Bildern und GIFs motivierend sein 
- eine simple und einfach bedienbare App 

2. Design und Planungsvorgehen
Ein erster Entwurf wurde auf Figma erstellt:
https://www.figma.com/design/W0UqR55pHUycfnpZvTXywA/Daily-3?t=DDw96ykMDkmSIrOb-1
Das Figma-Board diente als Grundlage für die Planung der Benutzeroberfläche und der Kernfunktionen.

Während der Umsetzung wurden mehrere Anpassungen vorgenommen:
- Entfernung des Fortschrittskreises auf der Startseite
- Entfernung zusätzlicher Icons innerhalb der Aufgaben
- Vereinfachung der Statistikansicht
- Fokus auf eine klarere Benutzerführung

Diese Änderungen wurden vorgenommen, um die App übersichtlicher zu gestalten und den Entwicklungsaufwand auf die wichtigsten Funktionen zu konzentrieren. 
Eine Bild-Ansicht befindet sich unter "Daily 3.png". 

3. Technische Umsetzung
Verwendete Technologien:
- React Native (Entwicklung der mobilen App)
- Expo (Entwicklungsumgebung)
- TypeScript (Typisierung und bessere Codequalität)
- React Navigation (Navigation zwischen Screens)
- AsyncStorage (Speicherung der Daten)

Verwendete Befehle (noch ergänzen !!!!) 
npm install 
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
