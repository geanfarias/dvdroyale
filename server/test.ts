// Test script to demonstrate WebSocket functionality
import Game from './src/websocket/game';
import Player from './src/websocket/player';

// Create a game instance with a player, as shown in the issue description
const game = new Game();
game.addPlayer(new Player("teste", "abc"));

// Start the game with a callback that logs player updates to the console
game.startGame(console.log);

console.log("Game started with WebSocket callback. Check the console for updates.");

// Keep the script running for a few seconds to see updates
setTimeout(() => {
  console.log("Test completed.");
  process.exit(0);
}, 5000);