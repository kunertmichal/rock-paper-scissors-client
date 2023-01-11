import axios from 'axios';
import {useEffect} from 'react';
import {io} from 'socket.io-client';

export default function Home() {
  function handleClick() {
    // call API to create a room
    // redirect to room
  }

  return (
    <div>
      <h1 className="text-xl font-bold">Rock, paper, scissors</h1>
      <label className="block">Number of rounds:</label>
      <select className="p-3 rounded-xl border-2 border-gray-100">
        <option>1</option>
        <option>3</option>
        <option>5</option>
        <option>7</option>
        <option>9</option>
      </select>
      <button className="bg-gray-100 py-3 px-6 rounded-xl">
        Get started <span className="text-blue-500">👉</span>
      </button>
    </div>
  )
}
