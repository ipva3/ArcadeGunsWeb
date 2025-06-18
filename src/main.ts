import { Game } from './core/game';
import { GuiLayer, WorldLayer } from './layers';

const game = new Game();

const worldLayer = new WorldLayer('game');
const guiLayer = new GuiLayer('game');
game.addLayers([worldLayer, guiLayer]);

game.start();
