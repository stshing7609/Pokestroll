// handle animations
function animate() {
	var dt = calculateDeltaTime();
	
	if(!paused) {
		// update sprites
		update(dt);
		
		// draw everything
		drawAll();

	}
	
	window.requestAnimFrame(animate);
}

// update the player, the song, and the background
function update(dt) {

	// animate rain only IF MUSIC-ING
	if(isRaining && isPlaying)
	{
		makeRain();
		updateRain();
	}
	
	// animate snow
	if(isSnowing && isPlaying)
	{
		makeSnow();
		updateSnow();
	}
	
	// the max for the timer must be divisible by 80 (for the player sprite update) and 120 (for the imageFrequency variable)
	if(timer > 1200) timer = 0;
	
	if(isPlaying) { 
		// Increase the timer
		timer++;
		// If the song is going backwards, don't add any more images to the arrays
		if(!isReversed) {
			var random = Math.floor(Math.random() * 50);
			var imageFrequency = timer % ((120 - random) * (scrollSpeed/playbackSpeed));	// frequency of image generation (to reduce overlap)
			// add pokemon
			if(imageFrequency == 1) makePokemon();
			
			// have clouds appear at a different rate from pokemonw
			random = Math.floor(Math.random() * 50);
			imageFrequency = timer % ((120 - random) * (scrollSpeed/playbackSpeed));
			// add clouds
			if(imageFrequency == 1) makeClouds();
		}
	}
	
	// Play the song forward at normal speed
	if(keydown[KEYBOARD.KEY_D]) 
	{
		if(!isPlaying) 
		{
			isPlaying = true;
			isReversed = false;
			playbackSpeed = 1;
			
			// new stuff from here down
			analyzerNode = audioCtx.createAnalyser();					
			sourceNode = audioCtx.createBufferSource();
			
			sourceNode.playbackRate.value = 1.0;
			
			// gets rid of having to reload song from scratch/getting a new buffer.
			// just setting sourceNode's buffer equal to the one stored in bufferData
			// and playing after a pause won't "load" or buffer anymore
			sourceNode.buffer = bufferData;
			sourceNode.connect(analyzerNode);
			analyzerNode.connect(audioCtx.destination);	
			
			
			
			sourceNode.start(0, trackPos);
			startTime = (new Date()).getTime(); // gets time in msecs
			
			statusDiv.innerHTML = "Now Playing Forward";
			
			loop();
		}
		
		//player.color = "red";
		
		// Scroll the images to the left
		if(!isReversed) {
			for(var i = 0; i < pokemonArray.length; i++) {
				pokemonArray[i][2] -= scrollSpeed;
			}
			for(var j = 0; j < cloudArray.length; j++) {
				cloudArray[j][1] -= scrollSpeed;
			}
		}
		// Update the player to move forward to the right
		if(timer % playerSpeed == 0) {
			player.sy = 80;
			if(player.sx == 0) player.sx = 32;
			else if(player.sx == 32) player.sx = 64;
			else if(player.sx == 64) player.sx = 96;
			else if(player.sx == 96) player.sx = 0;
		}
	}
	
	// Play the song forward at 2x speed
	else if(keydown[KEYBOARD.KEY_W])
	{
		if(!isPlaying) 
		{
			isPlaying = true;
			isReversed = false;
			playbackSpeed = 2;
			
			analyzerNode = audioCtx.createAnalyser();					
			sourceNode = audioCtx.createBufferSource();
			
			sourceNode.playbackRate.value = 2.0;
			
			sourceNode.buffer = bufferData;
			sourceNode.connect(analyzerNode);
			analyzerNode.connect(audioCtx.destination);	
			
			sourceNode.start(0, trackPos);
			startTime = (new Date()).getTime(); // gets time in msecs
		
			statusDiv.innerHTML = "Now Playing 2x";
			
			loop();
		}

		// Scroll the images to the left at 2x speed
		if(!isReversed) {
			for(var i = 0; i < pokemonArray.length; i++) {
				pokemonArray[i][2] -= scrollSpeed*playbackSpeed;
			}
			for(var j = 0; j < cloudArray.length; j++) {
				cloudArray[j][1] -= scrollSpeed*playbackSpeed;
			}
		}
		
		// Update the player to move forward to the right every 10 frames
		if(timer % (playerSpeed/2) == 0) {
			player.sy = 80;
			if(player.sx == 0) player.sx = 32;
			else if(player.sx == 32) player.sx = 64;
			else if(player.sx == 64) player.sx = 96;
			else if(player.sx == 96) player.sx = 0;
		}
	}
	
	// Play the song in reverse at normal speed
	else if(keydown[KEYBOARD.KEY_A])
	{
		if(!isPlaying) 
		{
			isPlaying = true;
			isReversed = true;
			var reader = new FileReader();
			
			analyzerNode = audioCtx.createAnalyser();					
			sourceNode = audioCtx.createBufferSource();
			
			sourceNode.buffer = reverseBufferData;
			sourceNode.connect(analyzerNode);
			analyzerNode.connect(audioCtx.destination);
			
			sourceNode.start(0, reverseBufferData.duration - trackPos);
			startTime = (new Date()).getTime(); // gets time in msecs
		
			statusDiv.innerHTML = "Now Playing in Reverse";
			
			loop();
		}
		
		// Scroll the images to the right at normal speed
		
		for(var i = 0; i < pokemonArray.length; i++) {
			pokemonArray[i][2] += scrollSpeed;
		}
		for(var j = 0; j < cloudArray.length; j++) {
			cloudArray[j][1] += scrollSpeed;
		}
		
		// Update the player to move backward to the left
		if(timer % playerSpeed == 0) {
			player.sy = 40;
			if(player.sx == 0) player.sx = 96;
			else if(player.sx == 32) player.sx = 0;
			else if(player.sx == 64) player.sx = 32;
			else if(player.sx == 96) player.sx = 64;
		}
	}
	
	// Play the song forward at half speed
	else if(keydown[KEYBOARD.KEY_S])
	{
		if(!isPlaying) 
		{
			isPlaying = true;
			isReversed = false;
			playbackSpeed = 0.5;
			
			analyzerNode = audioCtx.createAnalyser();					
			sourceNode = audioCtx.createBufferSource();
			
			sourceNode.playbackRate.value = 0.5;
			
			sourceNode.buffer = bufferData;
			sourceNode.connect(analyzerNode);
			analyzerNode.connect(audioCtx.destination);	
			
			sourceNode.start(0, trackPos);
			startTime = (new Date()).getTime(); // gets time in msecs
		
			statusDiv.innerHTML = "Now Playing 0.5x";
			
			loop();
		}
		
		// Scroll the images to the left at half speed
		if(!isReversed) {
			for(var i = 0; i < pokemonArray.length; i++) {
				pokemonArray[i][2] -= scrollSpeed*playbackSpeed;
			}
			for(var j = 0; j < cloudArray.length; j++) {
				cloudArray[j][1] -= scrollSpeed*playbackSpeed;
			}
		}
		
		// Update the player to move forward to the right every 40 frames
		if(timer % (playerSpeed*2) == 0) {
			player.sy = 80;
			if(player.sx == 0) player.sx = 32;
			else if(player.sx == 32) player.sx = 64;
			else if(player.sx == 64) player.sx = 96;
			else if(player.sx == 96) player.sx = 0;
		}
	}
	
	// If the player stops holding down any of the arrow keys, pause everything
	else if(isPlaying) 
	{
		if(sourceNode) 
		{
			isPlaying = false;					
			
			sourceNode.stop(0);
			
			var stopTime = (new Date()).getTime(); // get time at which song was stopped
			prevTrackPos = trackPos; // the point at which the song resumes at					
			var elapsedTime = ((stopTime - startTime) * playbackSpeed);
			trackPos = isReversed ? prevTrackPos - elapsedTime / 1000 : prevTrackPos + elapsedTime / 1000; // pos in song at which it paused					
			
			// *needs to be here, or else isReversed will always be false*
			isReversed = false; // reset isReversed because the song isn't playing anymore = not playing at all
			
			if(trackPos < 0)
				trackPos = 0;
			
			if(trackPos > reverseBufferData.duration)
				trackPos = reverseBufferData.duration;
			
			//console.log(stopTime + ", " + startTime + ", " + trackPos);
			
			statusDiv.innerHTML = "Paused -- Total Time: " + minutes + ":" + seconds;
		}				
	}
}

// HELPER METHOD
// This method was created by Tony Jefferson

function calculateDeltaTime() {
	var now, fps;
	now = (+new Date);
	fps = 1000/(now-lastTime);
	fps = clamp(fps, 12, 60);
	lastTime = now;
	return 1/fps;
}