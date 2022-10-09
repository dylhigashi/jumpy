title = "";

description = `
`;

characters = [
	`
llllll
ll l l
ll l l
llllll
 l  l
 l  l
	  `,


];

const settings = {
	WIDTH: 150,
	HEIGHT: 300,

	NUM_PLATFORMS: 3,
};

options = {
	viewSize: {x: settings.WIDTH, y: settings.HEIGHT},
    //isCapturing: true,
    //isCapturingGameCanvasOnly: true,
    //captureCanvasScale: 2,
    seed: 4848,
    isPlayingBgm: true,
    isReplayEnabled: true,
    //theme: "ark"
};

let yPos = 230;
let xPos = 50;

let lineY = 220;
let speed = 1;
let lineSpeedX = 1;
let lineSpeedY = 1;

let platMove = 0;
let platMoveX = 0;

let isDown = false;
let isJumping = false;
let lastTick = 0;

/**
 * @typedef {{
 * Y: number
 * X: number
 * length: number
 * }} Platform
 */

/**
 * @type { Platform [] }
 */
let platforms;


function update() {
	if (!ticks) {
		platforms = times(settings.NUM_PLATFORMS, () => {
			xPos += 15;
			const posX = rnd(10, 110);
            const posY = rnd(25, settings.HEIGHT - 60);
			const rand = Math.floor(Math.random() * 15) + 20;
			return {
				Y: posY,
				X: posX,
				length: rand
			};
		});

		platforms.push({
			Y: settings.HEIGHT - 10,
			X: 70,
			length: 10
		})
	}

	
	char("a", 75, 270);

	if(isDown) {
		platMove = 0;
		platMoveX = 0;
		isJumping = false;
	}
	else {
		platMove -= 0.01;
	}

	if(platMoveX >= 0) {
		platMoveX -= 0.001;
	}
	else if(platMoveX <= 0) {
		platMoveX += 0.001;
	}


	platforms.forEach((p) => {
		p.Y += platMove;
		p.X += platMoveX;
		color("purple")
		let isTouchChar = rect(p.X, p.Y, p.length, 2).isColliding.char.a;
		color("black");
		if(isTouchChar && platMove <= 0) {
			isDown = true;
		}

		
	});
	
	if(input.isJustReleased && !isJumping) {
		isJumping = true;
		platMove += ((lineY - 280) * -1) / 25;
		platMoveX += ((xPos - 75) * -1)/15;
		isDown = false;
		lastTick = ticks;
	}

	if(input.isPressed && !isJumping) {
		lineY += speed;
		if(lineY <= 220 || lineY >= 280) {
			speed *= -1;
		}
		line(140, 280, 140, lineY);

		//draw line
		color("blue");
		line(xPos, yPos, 75, 265, 2);
		color("black");
	}
	else {
		if(!isJumping) {
			lineY = 270;
			line(140, 280, 140, lineY);
			color("blue");
			line(xPos, yPos, 75, 265, 1);
			color("black");
			
			xPos += lineSpeedX;
			if(xPos <= 50 || xPos >= 100) {
				lineSpeedX *= -1;
			}
		}
		
	}
}
