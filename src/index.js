import _ from 'lodash';
import kaboom from "kaboom"
import level1 from "./level1.js"

const isViewPort = () => {
  return window.innerWidth < window.innerHeight;
}

const blockSize = 20;
const blockAmountWidth = 23;
const mapHeight = 10 * blockSize;
const margin = 3;
const labelHeight = blockSize * 2;
const totalPixelsHeight = mapHeight + margin + labelHeight + margin;
const isTouchScreen = ("ontouchstart" in document.documentElement);

const scale = () => {
  const touchControlsHeight = isTouchScreen ? blockSize + margin + blockSize + margin + blockSize + margin : 0;
  return (window.innerHeight / (totalPixelsHeight + touchControlsHeight));
}

const width_50 = (window.innerWidth / 2) / scale();

const width_100 = (window.innerWidth) / scale();

const MOVE_SPEED = 120;

const k = kaboom({
  global: true,
  fullscreen: true,
  scale: scale(),
  debug: true,
  background: [248,220,192,1]
})

const initialCamera = camPos();
let currentLevel = '';

loadRoot('https://i.imgur.com/')
loadSprite('bush', 'IFJXXKd.png')
loadSprite('frameTop', '0w4z2Yi.png')
loadSprite('frameBottom', 'H4GU7X1.png')
loadSprite('frameLeft', 'YHI7yQs.png')
loadSprite('frameRight', 'eBT66Ra.png')
loadSprite('pipeX', 'PdQCWGC.png')
loadSprite('pipeY', 'dhkvXDm.png')
loadSprite('rock', '2j926pJ.png')
loadSprite('player', 'Mj4JXIA.png')
loadSprite('level', 'BCHi1Ma.png')
loadSprite('node', 'fzdN4qV.png')

level1.loadLevel();

scene("home", () => {
  layers(['bg', 'obj', 'ui'], 'obj');

  const map = [
    ' ^^^^^^^^^^^^^^^^^^^^^ ',
    '<}}}}}}}}}}}rrrrrr}}}}>',
    '<OOOO1---2---$}}$---$}>',
    '<-0--$}}r|}}}|}}|}}}6}>',
    '<}}O}}O}}|}rr|O}|} }|}>',
    '<}}}}3---$} }|O}|}rr|}>',
    '<   }|}}O}}}}|}}|} r|}>',
    '< r r$--4----5--$}}O7}>',
    '<rrOr}}}}OO}}}rrr}OO}}>',
    ' vvvvvvvvvvvvvvvvvvvvv ',
  ];

  const levelCfg = {
    width: blockSize,
    height: blockSize,
    '}': () => [sprite('bush'), area(), solid()],
    '<': () => [sprite('frameLeft'), area(), solid()],
    '>': () => [sprite('frameRight'), area(), solid()],
    '^': () => [sprite('frameTop'), area(), solid()],
    'v': () => [sprite('frameBottom'), area(), solid()],
    '|': () => [sprite('pipeY'), area(), 'pipe'],
    '-': () => [sprite('pipeX'), area(), 'pipe'],
    'r': () => [sprite('rock'), area(), solid()],
    'O': () => [sprite('rock'), area(), solid(), opacity(0)],
    '$': () => [sprite('node'), area()],
    '0': () => [sprite('level'), area()],
    '1': () => [sprite('level'), area(), 'about_me'],
    '2': () => [sprite('level'), area(), 'studies'],
    '3': () => [sprite('level'), area(), 'professional'],
    '4': () => [sprite('level'), area(), 'languages'],
    '5': () => [sprite('level'), area(), 'projects'],
    '6': () => [sprite('level'), area(), 'skills'],
    '7': () => [sprite('level'), area(), 'social']

  }


  const gameLevel = addLevel(map, levelCfg);

  const player = add([
    sprite('player'), area({scale: 0.5}), solid(),
    pos(50,70),
    origin('center')
  ])


  const labelX = mapHeight + margin + labelHeight / 2;
  const label = add([ pos(width_50, labelX), rect(Math.min(width_100 -margin -margin, blockSize*blockAmountWidth), labelHeight), outline(2), area(), origin('center'), color(180, 225, 253), fixed() ])
  const levelLabel = add([ text(currentLevel, {size: 20}), pos(width_50, labelX), origin('center'), layer('ui'), fixed()]);

  if (isTouch()) {
    let touching = '';
    const clicking = (button, coord) => coord.x >= button.pos.x -10 && coord.x <= button.pos.x + 10 && coord.y >= button.pos.y -10 && coord.y <= button.pos.y + 10;

    const keyE = add([
      sprite('node'), area(), solid(),
      pos(width_50, label.pos.y + blockSize + 25 + blockSize/2 + margin),
      fixed(),
      origin('center')
    ])
    const keyU = add([
      sprite('node'), area(), solid(),
      pos(width_50, label.pos.y + 20 + blockSize/2 + margin),
      fixed(),
      origin('center'), 'keyU'
    ])
    const keyD = add([
      sprite('node'), area(), solid(),
      pos(width_50, label.pos.y + 20 + 25 + 25 + blockSize/2 + margin),
      fixed(),
      origin('center'), 'keyD'
    ])
    const keyL = add([
      sprite('node'), area(), solid(),
      pos(width_50 - 25, label.pos.y + 20 + 25 + blockSize/2 + margin),
      fixed(),
      origin('center'), 'keyL'
    ])
    const keyR = add([
      sprite('node'), area(), solid(),
      pos(width_50 + 25, label.pos.y + 20 + 25 + blockSize/2 + margin),
      fixed(),
      origin('center'), 'keyR'
    ])

    onTouchStart((e, coord) => {
      if (clicking(keyR, coord)) {
        touching = 'right';
      }
      if (clicking(keyL, coord)) {
        touching = 'left';
      }
      if (clicking(keyU, coord)) {
        touching = 'up';
      }
      if (clicking(keyD, coord)) {
        touching = 'down';
      }
    });
    onTouchEnd(() => {
      touching = '';
    });

    onUpdate(() => {
      if (touching === 'right') {
        player.move(100, 0);
      }
      if (touching === 'left') {
        player.move(-100, 0);
      }
      if (touching === 'up') {
        player.move(0, -100);
      }
      if (touching === 'down') {
        player.move(0, 100);
      }
    })
  } else {
    keyPress('space', () => { if (currentLevel) { go(currentLevel, {level: 0, score: 0}); } })
    keyDown('left', () => { player.move(-MOVE_SPEED, 0); })
    keyDown('right', () => { player.move(MOVE_SPEED, 0); })
    keyDown('up', () => { player.move(0, -MOVE_SPEED); })
    keyDown('down', () => { player.move(0, MOVE_SPEED); })
  };

  const levels = {
    about_me: { index: 1, name: 'About me' },
    studies: { index: 2, name: 'Studies' },
    professional: { index: 3, name: 'Professional' },
    languages: { index: 4, name: 'Languages' },
    projects: { index: 5, name: 'Projects' },
    skills: { index: 6, name: 'Skills' },
    social: { index: 7, name: 'Social' }
  }

  player.action(() => {
    let currCam = camPos();
    const leftCorner = Math.min(width_50, 230);
    const rightCorner = (blockAmountWidth * blockSize) - leftCorner;
    camPos(Math.min(Math.max(player.pos.x, leftCorner), rightCorner), currCam.y)
  });

  Object.keys(levels).forEach((levelName) => {
    player.onCollide(levelName, () => {
      currentLevel = levelName;
      levelLabel.text = currentLevel;
    })
  });
  player.onCollide('pipe', () => {
    currentLevel = '';
    levelLabel.text = '';
  })
  player.onCollide('node', () => {
    currentLevel = '';
    levelLabel.text = '';
  })
})

go('home');
