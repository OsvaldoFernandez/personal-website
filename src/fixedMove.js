  keyDown('left', () => {
    if (!isMoving) {
      isMoving = true;
      fixedMove('left');
    }
  })
  keyDown('right', () => {
    if (!isMoving) {
      isMoving = true;
      fixedMove2('right');
    }
  })
  keyDown('down', () => {
    if (!isMoving) {
      isMoving = true;
      fixedMove('down');
    }
  })
  keyDown('up', () => {
    if (!isMoving) {
      isMoving = true;
      fixedMove('up');
    }
  })

  keyPress('left', () => {
    player.move(-MOVE_SPEED, 0);
    posLabel.text = player.pos.x+", "+player.pos.y;
  })
  keyPress('right', () => {
    player.move(MOVE_SPEED, 0);
    posLabel.text = player.pos.x+", "+player.pos.y;
  })
  keyPress('up', () => {
    player.move(0, -MOVE_SPEED);
    posLabel.text = player.pos.x+", "+player.pos.y;
  })
  keyPress('down', () => {
    player.move(0, MOVE_SPEED);
    posLabel.text = player.pos.x+", "+player.pos.y;
  })




    const posLabel = add([ text(player.pos.x+", "+player.pos.y, {size: 20}), pos(30,200), layer('ui')]);

    const blocksize = 20;

    let isMoving = false;

    const fixedMove = async (dir) => {
      const directions = {
        'left': {attribute: 'x', blocks: -1},
        'right': {attribute: 'x', blocks: 1},
        'up': {attribute: 'y', blocks: -1},
        'down': {attribute: 'y', blocks: 1}
      };
      const goal = { x: player.pos.x, y: player.pos.y }
      goal[directions[dir].attribute] = goal[directions[dir].attribute] + (blocksize * directions[dir].blocks);

      while ((player.pos[directions[dir].attribute] * directions[dir].blocks) < (goal[directions[dir].attribute] * directions[dir].blocks)) {
        player.moveTo(player.pos.x + (directions[dir].attribute == 'x' ? directions[dir].blocks : 0), player.pos.y + (directions[dir].attribute == 'y' ? directions[dir].blocks : 0));
        posLabel.text = player.pos.x+", "+player.pos.y;
        await sleep(5);
      }
      isMoving = false;
    };

    const fixedMove2 = async (dir) => {
      const goal = player.pos.x + 20;
      while (player.pos.x < goal) {
        player.moveTo(player.pos.x + 1, player.pos.y);
        posLabel.text = player.pos.x+", "+player.pos.y;
        await sleep(5);
      }
      isMoving = false;
    };

    function sleep(milliseconds) {
     return new Promise(resolve => setTimeout(resolve, milliseconds));
    };
