import React from 'react';
import {useRouter} from 'next/router';
import {socket} from '../shared';

export default function Home() {
  const router = useRouter();

  React.useEffect(() => {
    socket.connect();
  });

  async function handleClick() {
    await socket.emit('game:create', {
      clientId: socket.id,
    });
    socket.on('game:created', (data) => {
      router.push(`/games/${data.gameId}`);
    });
  }

  return (
    <div>
      <h1 className="text-xl font-bold">Rock, paper, scissors</h1>
      <button
        className="bg-gray-100 py-3 px-6 rounded-xl"
        onClick={handleClick}
      >
        Get started <span className="text-blue-500">👉</span>
      </button>
    </div>
  );
}
