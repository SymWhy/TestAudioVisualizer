//javascript source code

//grab canvas element
let canvas = document.getElementById("audio-visual");
//create a 2D canvas context
let canvasCtx = canvas.getContext("2d");

//grab audio element
let audioElement = document.getElementById("source");
//create an audio context
let audioCtx = new AudioContext();

//create an analyzer node
let analyzer = audioCtx.createAnalyser();
//set analyzer data size to maximum
analyzer.fftSize = 2048;

let source = audioCtx.createMediaElementSource(audioElement);
source.connect(analyzer);
source.connect(audioCtx.destination);

//create an array to store analyzer data
let data = new Uint8Array(analyzer.frequencyBinCount);

//call function for each frame
requestAnimationFrame(loopingFunction);

function loopingFunction() {
    //must be recursive in order to loop
    requestAnimationFrame(loopingFunction);
    //populate array with frequency x volume
    //volume is always a value between 0-255
    analyzer.getByteFrequencyData(data);
    draw(data);
};

function draw(data) {
    //clear the canvas
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    let space = canvas.width / data.length;

    //(param1, paramN) => {expression}
    data.forEach((value, i) => {
        canvasCtx.beginPath();
        canvasCtx.moveTo(space * i, canvas.height);
        canvasCtx.lineTo(space * i, canvas.height - value);
        canvasCtx.stroke();
    })
}

audioElement.onplay = () => {
    audioCtx.resume();
}