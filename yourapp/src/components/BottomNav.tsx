import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HomeIcon, BookmarkedIcon, BrainIcon, LineChartIcon } from "./IconUtility";

const navItems = [
  { label: "Home", path: "/Home", icon: HomeIcon },
  { label: "Watchlist", path: "/Watchlist", icon: BookmarkedIcon },
  { label: "AI Suggestions", path: "/AISuggestions", icon: BrainIcon },
  { label: "Predictions", path: "/Predictions", icon: LineChartIcon },
];

const BottomNavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 shadow-lg rounded-full px-6 py-3 flex gap-8 items-center backdrop-blur-lg bg-opacity-90 border border-gray-200 dark:border-gray-700">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <motion.button
            key={item.label}
            onClick={() => navigate(item.path)}
            whileTap={{ scale: 0.9 }}
            className={`flex flex-col items-center justify-center transition-all duration-200 ${
              isActive ? "text-blue-500" : "text-gray-500 dark:text-gray-400"
            } hover:text-blue-600 dark:hover:text-blue-400`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">{item.label}</span>
          </motion.button>
        );
      })}
    </nav>
  );
};

export default BottomNavigationBar;
