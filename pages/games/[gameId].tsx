import {useEffect, useState} from 'react';
import {socket} from '../../shared';
import {useRouter} from 'next/router';
import {func} from 'prop-types';

type GameState = 'playing' | 'over' | 'waiting-for-move' | 'waiting-for-player' | 'not-found' | 'full';

function Game() {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState>('waiting-for-player');
  const [roundWinner, setRoundWinner] = useState<string | null>(null);
  const [score, setScore] = useState<{[key: string]: number}>({});

  useEffect(() => {
    if (!router.isReady) return;

    socket.on('game:started', (score) => {
      setRoundWinner(null);
      setGameState('playing');

      if (score) {
        setScore(score);
      }
    });

    socket.on('game:over', ({winner, score}) => {
      setRoundWinner(winner);
      setGameState('over');
      setScore(score);
    });

    socket.on('game:waiting-for-move', () => {
      setGameState('waiting-for-move');
    });

    socket.on('game:waiting-for-player', () => {
      setGameState('waiting-for-player');
    });

    socket.on('game:not-found', () => {
      setGameState('not-found');
    });

    socket.on('game:full', () => {
      setGameState('full');
    });

    socket.emit('game:player-joined', {
      gameId: router.query.gameId,
      clientId: socket.id
    });

    return () => {
      socket.off('game:started');
      socket.off('game:over');
      socket.off('game:waiting-for-move');
      socket.off('game:waiting-for-player');
      socket.off('game:not-found');
      socket.off('game:full');
    };
  }, [router.isReady, router.query.gameId]);

  function handleChoice(choice: 'rock' | 'paper' | 'scissors') {
    socket.emit('game:choice', {
      choice,
      clientId: socket.id,
      gameId: router.query.gameId
    });
  }

  function handleRestart() {
    socket.emit('game:play-again', {
      gameId: router.query.gameId
    });
  }

  if (roundWinner === 'tie') {
    return (
      <div>
        Game over. It is a tie!
        <button
          className="bg-gray-100 py-3 px-6 rounded-xl"
          onClick={handleRestart}
        >
          Play again
        </button>
      </div>
    );
  }
  if (roundWinner) {
    return (
      <div>
        <div>
          {socket.id === roundWinner ? 'Winner' : 'Looser'}
        </div>
        <button
          className="bg-gray-100 py-3 px-6 rounded-xl"
          onClick={handleRestart}
        >
          Play again
        </button>
      </div>
    );
  }

  if (gameState === 'full') {
    return <div>Room is full</div>;
  }

  if (gameState === 'not-found') {
    return <div>Room not found</div>;
  }

  if (gameState === 'waiting-for-player') {
    return <div>Waiting for another player...</div>;
  }

  const {[socket.id]: myScore, ...rivalScore} = score;
  const rivalId = Object.keys(rivalScore)[0];
  const rivalScoreValue = rivalScore[rivalId];

  return (
    <div className="flex">
      <div className="w-1/2">
        <h1>MOJE</h1>
        <p>My score: {myScore}</p>
        <p>Rival score: {rivalScoreValue}</p>
        <div>
          <button className="p-4" onClick={() => handleChoice('rock')}>
            Rock
          </button>
          <button className="p-4" onClick={() => handleChoice('paper')}>
            Paper
          </button>
          <button className="p-4" onClick={() => handleChoice('scissors')}>
            Scissors
          </button>
        </div>
      </div>
      <div className="w-1/2">
        <h1>PRZECIWNIK</h1>
        <div>
          {gameState === 'playing' && <div>Rywal mysli</div>}
          {gameState === 'waiting-for-move' && <p>Rywal zrobil ruch</p>}
        </div>
      </div>
    </div>
  );
}

export default Game;
