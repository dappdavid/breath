# Breathing Programs

A simple, customizable web application for practicing breathing exercises. This tool allows you to create your own breathing patterns and guides you through them with visual cues.

## Features

- **Customizable Programs:** Create and save your own breathing programs by defining durations for Inhale, Inhale Hold, Exhale, and Exhale Hold phases.
- **Visual Guide:** A smooth, animated circle expands and contracts to guide your breathing.
- **Session Timer:** Set the total duration for your breathing session.
- **Playback Controls:** Start, pause, resume, and stop your sessions at any time.
- **Persistent Storage:** Your custom programs are saved locally in your browser (`localStorage`), so they remain available when you return.

## How to Use

### Running the Application
Simply open `index.html` in your web browser. No installation or server is required.

### Creating a Program
1. Navigate to the **Saved Programs** tab.
2. Enter a name for your program (e.g., "Box Breathing").
3. Set the duration (in seconds) for each phase:
   - **Inhale**
   - **Inhale Hold**
   - **Exhale**
   - **Exhale Hold**
4. Click **Save Program**.

### Starting a Session
1. Navigate to the **Session** tab.
2. Select your desired program from the dropdown menu.
   - *Note: A default "4-8-8" program is provided if no custom programs exist.*
3. Enter the session duration in minutes (default is 10 minutes).
4. Click **Start** to begin.
5. Follow the visual guide:
   - **Inhale** as the circle expands.
   - **Hold** when the circle stops.
   - **Exhale** as the circle contracts.

## Technologies

- **HTML5**: Structure and semantics.
- **CSS3**: Styling, Flexbox layout, and CSS Transitions for animations.
- **JavaScript (Vanilla)**: Application logic, DOM manipulation, `localStorage` management, and timing control.

## Project Structure

- `index.html`: The main entry point containing the HTML structure.
- `styles.css`: Contains all styles for the dark-themed UI and the breathing animation.
- `app.js`: Handles the core logic, including state management, the breathing engine loop, and UI updates.
