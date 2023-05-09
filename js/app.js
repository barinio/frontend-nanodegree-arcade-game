const gameLevel = document.createElement('div');
gameLevel.textContent = 'Your level: 0';
document.body.append(gameLevel);

// Coordinates
const yStep = 85;
const xStep = 100;
const coordinates = {
	defaultPlayerPositionX: 200,
	defaultPlayerPositionY: 380,
	winPosition: -10,
	maxRight: 400,
	maxLeft: 0,
	maxDown: 380,
	startEnemyPositionX: -90,
	enemyPositionDiffY: 20,
}

// Enemies
const Enemy = function ({ speed, x, y }) {
	this.sprite = 'images/enemy-bug.png'
	this.x = x;
	this.y = y;
	this.speed = speed;
};

const allEnemies = [
	new Enemy({ speed: 350, y: 230, x: -20 }),
	new Enemy({ speed: 420, y: 145, x: -55 }),
	new Enemy({ speed: 390, y: 60, x: -75 }),
];

Enemy.prototype.update = function (dt) {
	this.x += this.speed * dt;
	//Cross the boundaries of the board - move to start position (endless movement) 
	if (this.x >= ctx.canvas.width) {
		this.x = coordinates.startEnemyPositionX;
	};
	// Check end game; Check loose only for the same Y
	if (player.y === (this.y - coordinates.enemyPositionDiffY)) {
		if (player.x < this.x && (this.x - player.x) <= 50 || //back
			player.x > this.x && (player.x - this.x) <= 50     //front
		) {
			alert('Game over!');
			player.resetGame();
		}
	}
};

Enemy.prototype.render = function () {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player
const Player = function () {
	this.sprite = 'images/char-cat-girl.png';
	this.level = 0;
	this.x = coordinates.defaultPlayerPositionX;
	this.y = coordinates.defaultPlayerPositionY;
}

const player = new Player();

Player.prototype.render = function () {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.resetPosition = function () {
	this.x = coordinates.defaultPlayerPositionX;
	this.y = coordinates.defaultPlayerPositionY;
}

Player.prototype.update = function () {
	if (this.y <= coordinates.winPosition) {
		this.level += 1;
		gameLevel.textContent = `Your level: ${this.level}`;

		this.resetPosition();
	}
}

Player.prototype.resetGame = function () {
	this.level = 0;
	gameLevel.textContent = `Your level: ${this.level}`;

	this.resetPosition();
}

Player.prototype.handleInput = function (direction) {
	switch (direction) {
		case 'left':
			if (this.x > coordinates.maxLeft) {
				this.x -= xStep;
			}
			break;
		case 'right':
			if (this.x < coordinates.maxRight) {
				this.x += xStep;
			}
			break;
		case 'up':
			this.y -= yStep;
			break;
		case 'down':
			if (this.y < coordinates.maxDown) {
				this.y += yStep;
			}
			break;
	}
};

document.addEventListener('keyup', (e) => {
	const allowedKeys = {
		ArrowLeft: 'left',
		ArrowUp: 'up',
		ArrowRight: 'right',
		ArrowDown: 'down'
	};

	player.handleInput(allowedKeys[e.code]);
});
