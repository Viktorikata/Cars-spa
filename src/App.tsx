import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

export default function App() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold">Cars SPA</h1>
      <p className="text-sm text-gray-600">React + TS + Vite + Tailwind v4</p>
      <button className="mt-4 rounded-xl px-4 py-2 border hover:bg-gray-50">
        Кнопка-тест
      </button>
    </div>
  );
}
