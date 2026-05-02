# SocialStream Analytics Dashboard

## 📌 Project Overview
**SocialStream Analytics** is a real-time data visualization platform built with **React** and **JavaScript**. The application fetches live engagement data from social media APIs to provide insights into trending topics and user interactions. This project serves as a Capstone Project to demonstrate proficiency in modern frontend development, state management, and performance optimization.

## 🛠️ Tech Stack
* **Frontend:** React (Vite)[cite: 1]
* **Language:** JavaScript (ES6+)[cite: 1]
* **Routing:** React Router[cite: 1]
* **State Management:** Context API[cite: 1]
* **API Integration:** Axios[cite: 1]
* **Styling:** Tailwind CSS[cite: 1]
* **Deployment:** Vercel[cite: 1]

## 🚀 Key Features (SOP Compliant)
As per the mandatory project requirements, the following advanced features are implemented[cite: 1]:
* **Debounced Search:** Utilizes `useEffect` with a cleanup function to limit API calls during user input, enhancing performance[cite: 1].
* **Pagination:** Efficiently handles large datasets by slicing data into digestible pages[cite: 1].
* **Dark Mode Toggle:** A global theme switcher managed via the **Context API** to ensure a seamless user experience[cite: 1].
* **Dynamic Routing:** Uses `useParams` to create unique URLs for specific community analytics[cite: 1].

## 📖 React Concepts Implemented
This project strictly utilizes core React concepts[cite: 1]:
* **Hooks:** `useState` for state, `useEffect` for side effects, and `useRef` for DOM access[cite: 1].
* **Side Effects & Cleanup:** Management of timers and API subscriptions within `useEffect`[cite: 1].
* **Context API:** `createContext` and `useContext` for global theme management[cite: 1].
* **Forms:** Controlled components with synthetic event handling[cite: 1].
* **Routing:** Setup of `BrowserRouter`, `Routes`, and `NavLink` with `isActive` status[cite: 1].

## 📂 Project Structure
```text
src/
├── context/      # ThemeContext for Global State (Dark Mode)
├── components/   # Reusable UI (Navbar, SearchBar, Loader)
├── pages/        # Route-based components (Home, Search, Details)
├── assets/       # Global styles and static images
├── App.jsx       # Router setup and layout
└── main.jsx      # Application entry point
