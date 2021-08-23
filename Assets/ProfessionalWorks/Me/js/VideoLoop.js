let RootPath = document.URL;
let PathArr = RootPath.split("/");
let VideoDirectory = ""
for (let i = 0; i < PathArr.length - 2; i++) {
    VideoDirectory += PathArr[i] + "/";
}
let videoSource = new Array();
videoSource[0] = VideoDirectory + 'res/video/hero1/hero1.mp4';
videoSource[1] = VideoDirectory + 'res/video/hero1/Cyberpunk_Cut_02.mp4';
videoSource[2] = VideoDirectory + 'res/video/hero1/Cut_009.mp4';
let i = 0; // global
const videoCount = videoSource.length;
const element = document.getElementById("VideoPlayer");
document.getElementById('VideoPlayer'); //.addEventListener('ended', myHandler, false);
videoPlay(2); // play the video

function videoPlay(videoNum) {
    element.setAttribute("src", videoSource[videoNum]);
    element.autoplay = true;
    element.load();
    element.play();
    element.addEventListener('ended', myHandler, false);
}



function myHandler() {
    i++;
    if (i == videoCount) {
        i = 0;
        videoPlay(i);
    } else {
        videoPlay(i);
    }
}