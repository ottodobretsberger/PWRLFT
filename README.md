# PowerLift ⚡ - Professional Powerlifting Tracker

A progressive web app (PWA) built with Vue 3 and TypeScript for tracking powerlifting workouts, calculating 1RM, managing plate inventory, and analyzing progress.

## Features

### 📦 Inventory Manager
- Set and store your plate inventory (kilos and pounds)
- Configure bar weight and collar weight
- Persisted in local storage

### ⚖️ Bar Loader Calculator
- Calculate exactly which plates to load for a target weight
- Color-coded plate display matching standard IWF colors
- Automatic unit conversion (kg ↔ lbs)
- Shows weight per side and total load

### 📊 1RM Calculator
- Calculate estimated 1-rep-max using 7 different formulas:
  - Epley
  - Brzycki
  - McGlothin
  - Lombardi
  - Mayhew
  - O'Conner
  - Wathen
- Displays average 1RM across formulas
- Quick workout logging from results

### 💪 Workout Logger
- Log exercises with multiple sets
- Track weight, reps, and units
- Automatic 1RM estimation per set
- View workout history with beautiful cards
- Delete old workouts
- Personal records tracking
- Statistics dashboard with:
  - Total workouts logged
  - Number of unique exercises
  - Average 1RM
  - Top personal records

### 📱 Progressive Web App
- Install as native app on iOS/Android/Desktop
- Works offline with cached data
- Fast load times with service worker
- Dark theme optimized for gym environment
- Responsive design for all devices

## Design

- **Dark Theme**: Black and gunmetal background for low-light gym environments
- **Vibrant Colors**: Bright, contrasting colors for easy visibility
- **Dynamic Animations**: Smooth transitions and fade-ins
- **Color-Coded Plates**: Standard powerlifting plate colors (Red, Blue, Yellow, Green, White, Orange, Pink, Indigo)

## Tech Stack

- **Frontend**: Vue 3 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **PWA**: Vite PWA Plugin
- **Storage**: Browser LocalStorage API

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

This will create an optimized build in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Installation as PWA

### On Android
1. Open the app in Chrome
2. Tap the menu button (⋮)
3. Select "Install app" or "Add to Home screen"

### On iOS
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

### On Desktop
1. Open the app in Chrome/Edge
2. Click the install icon in the address bar (or use the app menu)

## Data Storage

All data is stored locally in your browser:
- Plate inventory
- Workout history
- Settings and preferences

**No data is sent to external servers.**

## Default Plate Configuration

### Kilogram Plates (Standard IPF)
- 20kg (Red) - 2 pairs
- 16kg (Orange) - 2 pairs
- 15kg (Yellow) - 2 pairs
- 10kg (Green) - 2 pairs
- 5kg (Blue) - 4 pairs
- 2.5kg (White) - 4 pairs
- 2kg (Indigo) - 4 pairs
- 1.25kg (Pink) - 4 pairs

### Pound Plates
- 45lbs (Red) - 2 pairs
- 35lbs (Orange) - 2 pairs
- 25lbs (Yellow) - 2 pairs
- 10lbs (Green) - 2 pairs
- 5lbs (Blue) - 4 pairs
- 2.5lbs (White) - 4 pairs

### Bar Weight
- 20kg Olympic Bar
- 45lbs Olympic Bar

## Tips

- Always verify the weight calculation before loading the bar
- Use multiple 1RM formulas for a more reliable estimate
- Log your sessions to track long-term progress
- Customize your plate inventory to match your gym's equipment

## Browser Support

Works on all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+

## License

MIT

## Author

Built with 💪 for powerlifters

---

**Disclaimer**: This app provides estimated values. Always verify calculations independently and use proper safety equipment during training.
