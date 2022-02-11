let welcomes = ['Good afternoon,','Good morning,'];
let username = 'Michael';
var nowTime = new Date();
var lastbackgroundTime = new Date();
let tick = false;
let photos = [];
let apikey = "Bearer 563492ad6f917000010000011c2607a74b374f9f8daf3428ddc31151";
function changeStyle(id, attribute, text){document.getElementById(id).style[attribute] = text };
function changeText(id1, shadowid, text){document.getElementById(id1).innerText = text;document.getElementById(shadowid).innerText = text;}
function semicolonChange(text){changeStyle('semicolon', 'visibility', text);changeStyle('semicolonshadow','visibility', text);}
function timeChange(hours,minutes){changeText('hours','hoursshadow', hours);changeText('minutes','minutesshadow', minutes);}

var request = new XMLHttpRequest();

requestImages('query=nature&orientation=landscape&size=medium');
checkTime();
animateClock();
setInterval(() => {
    animateClock()
    if ((nowTime.getTime() - lastbackgroundTime.getTime()) > 1800000){
        lastbackgroundTime = nowTime;
        loadBackground();
    };

}, 1000);
function animateClock(){
    if(tick == false){
        semicolonChange('visible');
        tick = true;
    }else {
        semicolonChange('hidden');
        tick = false;
    }

    nowTime = new Date();
    let hours = nowTime.getHours();
    let minutes = nowTime.getMinutes();
    
    timeChange(formatTime(hours),formatTime(minutes));
}
function loadBackground(){
    let data = photos.shift();
    console.log(photos)
    if (photos.length < 1){
        requestImages('query=nature&orientation=landscape&size=medium') 
        // we requested before but we use this to make sure we have more images to use
    };

    let imageUrl = data.src.original; //api path
    document.getElementById('background-image').src = imageUrl;//unique, doesn't need a function
    changeText('credit','creditshadow',data.photographer);
    
}
document.getElementById('background-image').onload = ()=> { //AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

    let ui = document.getElementsByClassName('ui') // short hand
    console.log()
    for(i = 2;i>=0;i--){
        ui[i].classList.add('ui-block'); // relic, this is beautiful. applys a second, higher priority class to another class
    };
}
function requestImages(query){
    request.open('GET','https://api.pexels.com/v1/search?' + query);
    request.setRequestHeader('Authorization', apikey);
    request.send();
    request.onload = ()=>{
        photos = JSON.parse(request.response).photos;
        loadBackground();
    };
}
(function () {
    // Add event listener
    document.addEventListener("mousemove", parallax);
    
    // Magic happens here, kudos to this guy https://codepen.io/oscicen/pen/zyJeJw
    function parallax(e) {
        let _w = window.innerWidth / 2;
        let _h = window.innerHeight / 2;
        let _mouseX = e.clientX;
        let _mouseY = e.clientY;

        let xtranvalue = (((_mouseX) - (_w)) * 0.5 / 100)-100;
        let ytranvalue = (((_mouseY) - (_h)) * 0.5 / 100)-100;

        let imagemove = `translateX(${xtranvalue}px) translateY(${ytranvalue}px)`;
        let textmove = `translateX(${-(xtranvalue+100)}px) translateY(${-(ytranvalue+100)}px)`;
        
        document.querySelector("#background-image").style.transform = imagemove;
        document.querySelector("#container").style.transform = textmove;
    }
})();
function formatTime(num){
    if(num >= 10){
        return num;
    }else {
        return '0'+num;
    };
};
function checkTime(){
    nowTime = new Date();
    if(nowTime.getHours() >= 12){
        //afternoon
        changeText('maintext', 'maintextshadow', welcomes[0]+' '+username);
    } else {
        //morning
        changeText('maintext', 'maintextshadow', welcomes[1]+' '+username);
    };
};