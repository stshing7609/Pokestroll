// SOUND METHODS

// Set up the function to drag and drop the song to load it
function setUpDragDropAndLoad(dropTarget) {
	dropTarget.addEventListener("dragover", function(e) {
	e.stopPropagation();
	e.preventDefault();
	e.dataTransfer.dropEffect = "copy";
	});

	dropTarget.addEventListener("drop", function(e) {
	e.stopPropagation();
	e.preventDefault();
	songFile = e.dataTransfer.files[0];
	loadFile(songFile);
	});
	// load the file
	function loadFile(fileObject) {
		//statusDiv = document.getElementById("status");
		var reader = new FileReader();
		
		reader.addEventListener("load", function(e) {
			//console.log(e.target.result);
			analyzeSoundOnly(e.target.result);
		});
		
		reader.readAsArrayBuffer(fileObject);
		
		statusDiv.innerHTML = "Loading...";
	}
}	// end setUpDragDropAndLoad()


// a version of playAndAnalyzeSound that doesn't play the song immediately
// after loading it - easiest way to do it
function analyzeSoundOnly(arrayBuffer) {
	try
	{
		if(sourceNode)
			sourceNode.stop(0);
		
		analyzerNode = audioCtx.createAnalyser();
		
		audioCtx.decodeAudioData(arrayBuffer, function(buffer) 
		{
			reverseBufferData = buffer;
			
			for(var i = 0; i < reverseBufferData.numberOfChannels; i++)
			{					
				Array.prototype.reverse.call( reverseBufferData.getChannelData(i) );					
			}
		});
		
		audioCtx.decodeAudioData(arrayBuffer, function(buffer) 
		{
			bufferData = buffer;
			
			/*sourceNode = audioCtx.createBufferSource();
			sourceNode.buffer = bufferData;
			sourceNode.connect(analyzerNode);
			analyzerNode.connect(audioCtx.destination);*/ // EXTRANEOUS REPEATED STUFF 
			
			// load in a brand new song, and it won't play from where the
			// last one left off
			prevTrackPos = trackPos = 0;
			
			minutes = Math.floor((bufferData.duration / 60));
			seconds = Math.floor((bufferData.duration % 60));
			//console.log("minutes: " + minutes + "seconds: " + seconds);
			statusDiv.innerHTML = "Done Loading!";
			// Reveal the UI after the song is loaded
			controls.style.visibility = "visible";
			// Only start animating once the song has loaded
			animate();
			loop();
		});
	} 
	catch(e){
		statusDiv.innerHTML = "Error! " + e;
	}
}


function loop() {		
	var byteArray = new Uint8Array(analyzerNode.frequencyBinCount);
	analyzerNode.getByteFrequencyData(byteArray);
	requestAnimationFrame(loop);
}