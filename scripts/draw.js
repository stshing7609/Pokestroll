// draws everything
function drawAll() {
	
	drawBackground();
	// draw the scenery
	// make the clouds 1.5x their normal size
	ctx.save();
	ctx.scale(1.5, 1.5);
	// draw clouds at
	for(var i = 0; i < cloudArray.length; i++){
		// checking the first number in the array, is it 1 or 0?
		// if it's 1 >> littleCloud, if not >> bigCloud
		ctx.drawImage(cloudArray[i][0] == 1 ? images["littleCloud"] : images["bigCloud"], cloudArray[i][1], cloudArray[i][2]);
	}
	
	ctx.restore();
	// double the size of the pokemon sprites and the player
	ctx.save();
	ctx.scale(2.0, 2.0);
	// drawing clouds yay
	
	drawPokemon();
		
	// draw the player on the top layer
	
	// Add a shadow of the person if shadows are toggled on
	if(showPlayerShadow) {
		// translate to the starting x point of the player, but move the y point
		// to just below the player, and rotate 180 degrees
		ctx.save();
		ctx.translate(500, 560);
		ctx.rotate(180*(Math.PI/180));
		
		ctx.shadowColor = "#302013";
		ctx.shadowBlur = 20;
		ctx.shadowOffsetX = 0;
		//ctx.shadowOffsetY = 670;	// Offset the shadow to accord for the fact that we're drawing another player off the top of the screen
		//player.y += 280;			// Move the player off the top of the screen
		
		// flip the shadow horizontally so it matches the player
		ctx.save();
		ctx.translate(CANVAS_WIDTH/2, 0);
		ctx.scale(-1,1);
		// reduce the alpha of the shadow in accordance to the time of day
		if(timeOfDay == 0) ctx.globalAlpha = .3;		//morning
		else if(timeOfDay == 1) ctx.globalAlpha = .5;	//sunset
		else ctx.globalAlpha = .1;						//night
		player.draw(ctx);
		ctx.restore();
		ctx.restore();
	}
	
	// reset alpha
	ctx.globalAlpha = 1;
	
	// re-adjust the player if we moved him to make the shadow
	//if(showPlayerShadow) player.y -= 280;
	// draw the normal player
	player.draw(ctx);
	ctx.restore();
	
	// reset shadows
	ctx.shadowColor = '#000';
	ctx.shadowBlur = 0;
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	
	// draws the rain
	if(isRaining) 
		drawRain();
	
	// draws the snow
	if(isSnowing)
		drawSnow();
}

// draws the background
function drawBackground() {
	// draw the sky
	var grd = ctx.createLinearGradient(500, 0, 500, 400);
	// Morning
	if(timeOfDay == 0){
		// Make the sky morning colored
		grd.addColorStop(0, "#0050a0");
		grd.addColorStop(0.5, "#56aaff");
		grd.addColorStop(1, "#b7dbff");	
		ctx.fillStyle = grd;
		ctx.fillRect(0, 0, 1000, 600);
		
		// add a sun high in the sky
		if(showAstronomicalBody) {
			// Give the sun a small animation by toggling on or off the stroke
			if(timer % 200 < 50) {
				ctx.fillStyle = "yellow";
				ctx.strokeStyle = "dd0";
				ctx.lineWidth = 6;
				ctx.beginPath();
				ctx.arc(200, 60, 100, 0, Math.PI*2);
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
			}
			else {
				ctx.fillStyle = "yellow";
				ctx.beginPath();
				ctx.arc(200, 60, 100, 0, Math.PI*2);
				ctx.closePath();
				ctx.fill();
			}
		}
	}
	// Sunset
	else if(timeOfDay == 1) {
		// Make the sky sunset color
		grd.addColorStop(0, "#a777b3");
		grd.addColorStop(0.5, "#fe5b35");
		grd.addColorStop(1, "#ffc0cb");
		ctx.fillStyle = grd;
		ctx.fillRect(0, 0, 1000, 600);
		
		// add a setting sun
		if(showAstronomicalBody) {
			// Give the sun a small animation by toggling on or off the stroke
			if(timer % 200 < 50) {
				ctx.fillStyle = "#ffe500";
				ctx.strokeStyle = "#eed400";
				ctx.lineWidth = 6;
				ctx.beginPath();
				ctx.arc(500, 450, 100, 0, Math.PI*2);
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
			}
			else {
				ctx.fillStyle = "#ffe500";
				ctx.beginPath();
				ctx.arc(500, 450, 100, 0, Math.PI*2);
				ctx.closePath();
				ctx.fill();
			}
		}
	}
	// Night
	else {
		// Make the sky night colored
		grd.addColorStop(0, "#000");
		grd.addColorStop(0.5, "#000073");
		grd.addColorStop(1, "#1919ce");
		ctx.fillStyle = grd;
		ctx.fillRect(0, 0, 1000, 600);
		
		// add a crescent moon
		if(showAstronomicalBody) {
			// Give the moon a small animation by toggling on or off the stroke
			if(timer % 200 < 50) {
				ctx.fillStyle = "#fefcd7";
				ctx.strokeStyle = "#edebc8";
				ctx.lineWidth = 6;
				ctx.beginPath();
				ctx.moveTo(800, 30);
				ctx.bezierCurveTo(900, 30, 900, 130, 785, 130);
				ctx.bezierCurveTo(860, 130, 860, 30, 800, 30);
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
			}
			else {
				ctx.fillStyle = "#fefcd7";
				ctx.beginPath();
				ctx.moveTo(800, 30);
				ctx.bezierCurveTo(900, 30, 900, 130, 785, 130);
				ctx.bezierCurveTo(860, 130, 860, 30, 800, 30);
				ctx.closePath();
				ctx.fill();
			}
		}
	}
	
	
	// draw the grass
	//ctx.fillStyle = "green";
	//ctx.fillRect(0, 400, 1000, 120);
	var i;
	for(i = 0; i < 10; i++){
		ctx.drawImage(images["shortGrass"], i * 109, 460);
	}
	
	var jMax = 1000 / 64; // doing this because divisions are costly in loops
	for(i = 0; i < 4; i++){ // 2 >> roughly 120 / 32
		for(var j = 0; j < jMax; j++){
			ctx.drawImage(images["grassTile"], j * 64, (i * 32) + 470);
		}
	}
	
	// draw the road 
	//ctx.fillStyle = "gray";
	//ctx.fillRect(0, 520, 1000, 200);
	for(i = 0; i < 4; i++){
		for(var j = 0; j < jMax; j++){			
			ctx.drawImage(images["groundTile"], j * 64, (i * 64) + 525);
		}
	}
	
	// more grass lining the side of the dirt road
	for(i = 0; i < 10; i++)
	{
		ctx.drawImage(images["shortGrass"], i * 109, 518);
	}
	
	if(isSnowing && snowBuffer)
	{
		ctx.drawImage(snowBuffer, 0, 0, snowBuffer.width, snowBuffer.height);
	}
	
}

// draws pokemon
// pokemon are always behind the player
function drawPokemon() {
// draw the pokemon
	for(var i = 0; i < pokemonArray.length; i++){
		ctx.drawImage(images["pokemonSpriteSheet"], pokemonArray[i][0]*60, pokemonArray[i][1]*60, 60, 60, pokemonArray[i][2], pokemonArray[i][3], 60, 60);	
	}
}

// this function exclusively to generate clouds
function makeClouds() {
	var cloud = new Array();
	cloud[0] = Math.round(Math.random());			// used to determine which of the two clouds will be drawn
	cloud[1] = CANVAS_WIDTH + 50;					// used as x position - initially offscreen so that it's not visible
	cloud[2] = (Math.random()*100) + 10;			// used as y position
	
	cloudArray.push(cloud);
}

// generate the next pokemon
function makePokemon(dt) {
	var newPokemon = new Array();
	newPokemon[0] = Math.floor(Math.random()*MAX_COL);	// get the column number
	newPokemon[1] = Math.floor(Math.random()*MAX_ROW);	// get the row number
	newPokemon[2] = CANVAS_WIDTH + 70;					// the starting x-value of the pokemon
	newPokemon[3] = (Math.random()*81) + 120;			// the y-value of the pokemon
	if(newPokemon[1] == MAX_ROW-1) newPokemon[0] = 0;	// there is only one column in the last row, so account for that
	
	pokemonArray.push(newPokemon);
}
