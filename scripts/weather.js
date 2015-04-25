// PARALLAX WEATHER FUNCTIONS

// some variables for rain
var rain = [];					// array to hold raindrops
var splashes = [];				// array to hold raindrop splashes
var rainSpeed = 7;				// how fast are these things falling?
var rainSlant = -.5;			// how much to the left are these things falling?
var rainWidth = 2;				// how thick the raindrops are
var rainHeight = 1.5;			// how long the raindrops are
var rainSpread = 130;			// how much the rain spreads out across the ground
var destroyHeight = 650;		// the point at which the raindrops disappear
var splashLife = 5;				// the duration of the splashes
var splashSize = .8;			// how big the splashes are going to be

// some variables for snow - stupid recycling
var snow = [];					// array to hold snow
var snowSpeed = 3;				// how fast are these things falling?
var snowSlant = -.15;			// how much to the left are these things falling?
var snowWidth = 3;				// how thick these things are
var snowHeight = 3;				// how long the raindrops are
var snowSpread = 140;			// how much the snow spreads out across the ground
var snowBuffer;					// a 'canvas' to draw piling snow on. ooh fancy.
var snowCtx;					// context for the snowBuffer canvas


// **all random number ranges were chosen arbitrarily/based on how good the results looked

/*******************
		RAIN
*******************/

function makeRain()
{
	var rainChance = Math.random() * 100;
	
	if(rainChance < 55)
	{
		// produce random number of raindrops *per frame*
		var rainCount = Math.floor(Math.random() * 12) + 15;
		
		// random x position where rain is generated
		var rainPosition = Math.random() * 100;
		
		for(var i = 0; i < rainCount; i++)
		{
			// makes each raindrop's speed differ slightly (for a more natural feel)
			var speedMultiplier = Math.random() * .5 + 1;
			
			// array of info about the raindrop
			var drop = [];
			drop[0] = rainPosition;						// x position
			drop[1] = -50 - Math.random() * rainSpread;	// y position
			drop[2] = 0;								// used later below to keep track of how far the drop has fallen
			drop[3] = -50 / drop[1];					// used later to scale the size of each raindrop (each one has a different size depending on where it was generated)
			drop[4] = speedMultiplier;
			rain[firstOpen(rain)] = drop;				// first open index in rain gets set to this current drop
			
			
			// moving the raindrops so that the next ones will be generated at a further x position
			rainPosition += Math.random() * 50 + Math.random() * 50;
		}
	}	
}

function updateRain()
{
	// making the iterator only once
	var i;
	
	for(i = 0; i < rain.length; i++)
	{
		if(!rain[i]) 
			continue;
		
		rain[i][0] += rainSlant * playbackSpeed;				// move the rain in some x direction
		rain[i][1] += rainSpeed * rain[i][4] * playbackSpeed;	// move the rain in some y direction
		rain[i][2] += rainSpeed * rain[i][4] * playbackSpeed;	// keep track of how far the rain fell
		
		// if the drop has fallen further than its destroy height
		if(rain[i][2] > destroyHeight)
		{
			// then let it splash!
			var splash = [rain[i][0], rain[i][1], 0];	  	// [x, y, drop life]
			splashes[firstOpen(splashes)] = splash;		  	// add the splash to the splash array at the first open index
			rain[i] = null;									// raindrop is now null (because it splashed and died :( )
		}
	}
	
	for(i = 0; i < splashes.length; i++)
	{
		if(!splashes[i])
			continue;
		
		splashes[i][2]++;									// drop life used to keep track of how long it's been alive
			
		// if the drop life exceeds the maximum life
		if(splashes[i][2] >= splashLife)
			// DESTROY IT
			splashes[i] = null;
	}
}

function drawRain()
{
	ctx.strokeStyle = "rgba(153, 204, 255, 170)";//'rgba(0,128,255,200)';
	ctx.lineWidth = rainWidth;
	ctx.beginPath();
	
	for(var i = 0; i < rain.length; i++)
	{
		if(!rain[i])
			continue;
		
		// using this to determine where to draw the endpoint of the raindrop lines (startpoint, endpoint)
		var previousPoint = [ rain[i][0] - rainSlant * rainHeight * rain[i][3], 
							  rain[i][1] - rainSpeed * rainHeight * rain[i][3] ];
		ctx.moveTo(previousPoint[0], previousPoint[1]);
		ctx.lineTo(rain[i][0], rain[i][1]);
	}
	ctx.closePath();
	ctx.stroke();
	
	ctx.strokeStyle = "rgba(153, 204, 255, 170)";
	ctx.lineWidth = 1;
	ctx.beginPath();
	
	for(var i = 0; i < splashes.length; i++)
	{
		if(!splashes[i])
			continue;
		
		// drawing splashes
		// starts at center
		ctx.moveTo(splashes[i][0], splashes[i][1]);
		// draw to top left corner
		ctx.lineTo(splashes[i][0] - splashSize*splashes[i][2], splashes[i][1] - splashSize*splashes[i][2]);
		// back to center
		ctx.moveTo(splashes[i][0], splashes[i][1]);
		// draw to top right corner
		ctx.lineTo(splashes[i][0] + splashSize*splashes[i][2], splashes[i][1] - splashSize*splashes[i][2]);
		// back to center
		ctx.moveTo(splashes[i][0], splashes[i][1]);
		// draw to bottom right corner
		ctx.lineTo(splashes[i][0] + splashSize*splashes[i][2], splashes[i][1] + splashSize*splashes[i][2]);
		// back to center
		ctx.moveTo(splashes[i][0], splashes[i][1]);
		// draw to bottom left corner
		ctx.lineTo(splashes[i][0] - splashSize*splashes[i][2], splashes[i][1] + splashSize*splashes[i][2]);
	}
	
	ctx.closePath();
	ctx.stroke();
}



/*******************
		SNOW
	recycling rain!
*******************/

function makeSnow()
{
	if(!snowBuffer)
		makeSnowBuffer();
	
	var snowChance = Math.random() * 100;
	
	if(playbackSpeed == 2) 
		snowChance = 0; // weather forecast: 100% snow.
	
	if(snowChance < 70)
	{
		// produce random number of snowflakes *per frame*
		var snowCount = Math.floor(Math.random() * 25) + 30;
		
		// random x position where snow is generated
		var snowPosition = Math.random() * 100;
		
		for(var i = 0; i < snowCount; i++)
		{
			// makes each snowflake's speed differ slightly (for a more natural feel)
			var speedMultiplier = Math.random() * .5 + 1;
			
			// array of info about the snowflake
			var flake = [];
			flake[0] = snowPosition;						// x position
			flake[1] = -50 - Math.random() * snowSpread;	// y position
			flake[2] = 0;									// used later below to keep track of how far the flake has fallen
			flake[3] = -50 / flake[1];						// used later to scale the size of each snowflake (each one has a different size depending on where it was generated)
			flake[4] = speedMultiplier;
			snow[firstOpen(snow)] = flake;					// first open index in snow gets set to this current flake
			
			
			// moving the snowflakes so that the next ones will be generated at a further x position
			snowPosition += Math.random() * 30 + Math.random() * 30;
		}
	}	
}

function updateSnow()
{
	// making the iterator only once
	var i;
	
	for(i = 0; i < snow.length; i++)
	{
		if(!snow[i]) 
			continue;
		
		snow[i][0] += snowSlant * playbackSpeed;				// move the snow in some x direction
		snow[i][1] += snowSpeed * snow[i][4] * playbackSpeed;	// move the snow in some y direction
		snow[i][2] += snowSpeed * snow[i][4] * playbackSpeed;	// keep track of how far the snow fell
		
		// if the flake has fallen further than its destroy height
		if(snow[i][2] > destroyHeight)
		{	
			snowCtx.fillStyle = "rgba(255, 255, 255, 255)";
			snowCtx.fillRect(snow[i][0] - snowWidth * 0.5, snow[i][1] - snowHeight * 0.5, snowWidth * snow[i][3], snowHeight * snow[i][3]);
			snow[i] = null;									// snowflake is now null (because it splashed and died :( )
		}
	}
}

function drawSnow()
{	
	ctx.fillStyle = "#fff";
	ctx.lineWidth = snowWidth;
	ctx.beginPath();
	
	for(var i = 0; i < snow.length; i++)
	{
		if(!snow[i])
			continue;
		
		// snow[i][3] will vary with the height at which the snow was spawned, allowing for difference in sizes
		ctx.fillRect(snow[i][0] - snowWidth * 0.5, snow[i][1] - snowHeight * 0.5, snowWidth * snow[i][3], snowHeight * snow[i][3]);	 
	}
	ctx.closePath();
	
	ctx.fill();		
	
}

function makeSnowBuffer()
{
	snowBuffer = document.createElement("canvas");
	snowBuffer.width = CANVAS_WIDTH;
	snowBuffer.height = CANVAS_HEIGHT;
	
	snowCtx = snowBuffer.getContext("2d");
	
	snowCtx.fillStyle = "rgba(0, 0, 0, 0)";
	snowCtx.fillRect(0, 0, snowBuffer.width, snowBuffer.height);
}

// returns the first open index in the array that's being passed in
function firstOpen(array)
{
	var i = 0;
	
	while(array[i])  // evals to true unless index is empty
		i++;
		
	return i;
}