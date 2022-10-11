title = "Jumpy!";

description = `
Hold down to power
  up your jump!

     Release
to reach the top!
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

	NUM_PLATFORMS: 8,
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
let isJumping = true;
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

let maxScore = 0;



function update() {
	if (!ticks) {
		score += 18;
		let lastY = -50;
		platforms = times(settings.NUM_PLATFORMS, () => {
			const posX = rnd(10, 110);
            const posY = lastY;//rnd(25, settings.HEIGHT - 60);
			const rand = Math.floor(Math.random() * 15) + 20;
			lastY += rnd(30, 50);
			return {
				Y: posY,
				X: posX,
				length: rand
			};
		});

		platforms.push({
			Y: settings.HEIGHT - 10,
			X: 20,
			length: 100
		})
	}

	//respawn platforms
	if(platforms.length <= settings.NUM_PLATFORMS) {
		for(let i = platforms.length; i < settings.NUM_PLATFORMS; i++) {
			const posX = rnd(10, 110);
            const posY = 0;
			const rand = Math.floor(Math.random() * 15) + 20;
			platforms.push ({
				Y: posY,
				X: posX,
				length: rand
			});
		}
	}

	//remove platforms
	remove(platforms, (p) => {
		if(p.Y < -200) {
			settings.NUM_PLATFORMS --;
		}
		return (p.Y > 400 || p.Y < -200)
	})

	if(platforms.length <= 0) {
		platMove = 0;
		platMoveX = 0;
		score = maxScore;
		settings.NUM_PLATFORMS = 8;
		end("You Fell!");
	}

	

	//Score
	score += platMove;


	//Character stays in place
	char("a", 75, 270);

	//if char on platform dont move
	if(isDown) {
		maxScore = score;
		platMove = 0;
		platMoveX = 0;
		isJumping = false;
	}
	else { //otherwise makeshift gravity
		platMove -= 0.01;
	}

	//if moving left and right makeshift air resist
	if(platMoveX >= 0) {
		platMoveX -= 0.001;
	}
	else if(platMoveX <= 0) {
		platMoveX += 0.001;
	}


	//update platform movement
	platforms.forEach((p) => {
		p.Y += platMove;
		p.X += platMoveX;
		color("purple")
		let isTouchChar = rect(p.X, p.Y, p.length, 2).isColliding.char.a;
		color("black");
		if(isTouchChar && platMove <= 0) {
			isDown = true;
		}	
		console.log(p.Y);
	});
	
	//release and is jumping
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
