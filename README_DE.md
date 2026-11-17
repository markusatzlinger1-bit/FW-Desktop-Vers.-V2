# Forward Desktop 2.0 — Windows-Programm (Electron)

**Dieses Paket enthält den Quellcode und die GitHub-Actions-Bauanleitung, nicht bereits eine fertige EXE.**

## Ohne lokale Entwicklungsumgebung: EXE über GitHub erstellen

1. Erstelle vorzugsweise ein separates GitHub-Repository für die Windows-Version (oder verwende dein bestehendes Repository).
2. Lade **den gesamten Inhalt dieses ZIP** hoch, sodass `.github/workflows/build-forward-windows.yml` im Repository-Stamm und `windows/package.json` darunter liegen.
3. Öffne GitHub → **Actions** → **Build Forward Windows** → **Run workflow**.
4. Wenn der Build erfolgreich durchläuft, öffne den Workflow-Lauf, scrolle zu **Artifacts**, und lade `Forward-Windows-Portable` herunter.
5. Entpacke das Artifact und starte `Forward-Windows-2.0.0-x64.exe` auf Windows. Der Build enthält Electron und benötigt keine Python-/Node-Installation auf deinem PC.

Windows kann bei einer unsignierten privaten EXE einen SmartScreen-Hinweis anzeigen. Prüfe in diesem Fall, dass der Build aus deinem eigenen Repository stammt.

## Alternative: Lokal bauen

Voraussetzung: Node.js 22, Internet zum einmaligen Installieren der Abhängigkeiten.

```powershell
cd windows
npm install
npm run build:windows
```

Ergebnis: `windows/dist/Forward-Windows-2.0.0-x64.exe`.

## Daten aus der iPhone-Version importieren

1. **iPhone:** Forward → Optionen → Bibliothek sichern → JSON-Datei speichern und auf den PC übertragen.
2. **Windows:** Forward → Einstellungen → **Backup einlesen** → JSON-Datei wählen.
3. Ein Import ersetzt die bereits vorhandene lokale Bibliothek. Deshalb vor dem Import auf dem PC ebenfalls ein Backup anlegen.

Die Windows-App verwendet eine eigene IndexedDB unter der stabilen, lokalen App-Origin `forward://app`. Die Daten bleiben normalerweise zwischen Starts erhalten. Es gibt **keine automatische Synchronisierung** mit der iPhone-Version oder mit GitHub.

## Offline-Betrieb und Privatsphäre

Die gebaute App funktioniert offline. Der Schreibinhalt bleibt im lokalen App-Speicher. Backups und Exporte werden nur auf ausdrückliche Aktion des Nutzers erstellt.

## Bekannte Einschränkungen

- Dies ist ein erster Desktop-Build und wurde nicht mit einem echten Windows-Rechner oder Electron ausführlich getestet; Syntaxprüfungen sind durchgeführt.
- Der Entwurf sperrt Absätze beim Drücken von Enter. Das ist eine Schreibsperre innerhalb der Benutzeroberfläche, kein kryptografischer Schreibschutz.
- Der Revisionseditor ist derzeit ein einfacher Texteditor; formatierte Draft-Absätze werden im Entwurf, im Originalarchiv und bei Markdown-/DOCX-Export erhalten, solange die Revisionsfassung nicht geändert wurde.
- Windows-EXE ist nicht digital signiert.
