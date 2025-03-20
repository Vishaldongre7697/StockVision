# StockVision - AI Powered Stock Analysis

StockVision is an AI-powered stock analysis and prediction application that helps investors make informed decisions. It provides real-time stock data, technical analysis, and AI-generated predictions for the Indian stock market.

## Features

- Real-time stock data and market indices
- AI-powered stock recommendations and predictions
- Technical analysis indicators
- Watchlist management
- News impact analysis
- Voice search capabilities

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **UI Components**: Custom components with Lucide icons
- **State Management**: React Hooks
- **Animation**: Framer Motion
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm (v7 or newer)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/stockvision.git
cd stockvision
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The application will open in your browser at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The build files will be created in the `dist` directory.

## Project Structure

```
stockvision/
├── public/               # Static assets
├── src/                  # Source code
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page components
│   ├── App.tsx           # Main App component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── package.json          # Dependencies and scripts
└── README.md             # This file
```

## Usage

### Home Dashboard

The home dashboard provides an overview of the market with current indices, trending stocks, and your watchlist.

### Watchlist

Manage your watchlist and get real-time updates on your selected stocks.

### AI Suggestions

Get AI-powered recommendations based on technical analysis, fundamental data, and market trends.

### Predictions

View detailed predictions and analysis for specific stocks.

## Customization

You can customize the appearance by modifying the Tailwind configuration in `tailwind.config.js`.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [Vite](https://vitejs.dev/) 