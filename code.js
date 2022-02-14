let welcomeData = {
    'greetings':['Good night,','Good morning,','Good afternoon,','Good evening,','Good night,'],
    // each index is that equilvent to the time of day divided by 6 to give the accuracy, it's complex and works.
    'happyday':{
        '5':'Happy Friday,', // the numbers represent the day of the week
        '6':'Happy Sunday,',
        '7':'Happy Saturday,'
    }
} 
let username = 'Michael'; //Change this to your own name.
let loadedImgs = []; 
var nowTime = new Date();
var lastbackgroundTime = new Date();
let tick = false; // variable used for the semicolon in the clock
let photos = []; // variable used to load images
let apikey = "Bearer 563492ad6f917000010000011c2607a74b374f9f8daf3428ddc31151"; // api key, please don't steal it


function changeStyle(id, attribute, text){document.getElementById(id).style[attribute] = text };
function changeText(id1, shadowid, text){document.getElementById(id1).innerText = text;document.getElementById(shadowid).innerText = text;}
function semicolonChange(text){changeStyle('semicolon', 'visibility', text);changeStyle('semicolonshadow','visibility', text);}
function timeChange(hours,minutes){changeText('hours','hoursshadow', hours);changeText('minutes','minutesshadow', minutes);}
// functions to prevent repeatitive code


let request = new XMLHttpRequest(); // variable constructor used for http requests for images

requestImages('query=nature&orientation=landscape&size=medium'); // function details are below, query parameter allows for vertasity

setInterval(() => { // function repeats itself non-stop, every 1000ms
    animateClock()
    checkTime();
    if ((nowTime.getTime() - lastbackgroundTime.getTime()) > 1800000){ 
        // if the time difference between the last recorded background change and now is 30 minutes, do this
        lastbackgroundTime = nowTime; // sets last recorded time to now
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
    } // simply, animating the clock

    nowTime = new Date();
    let hours = nowTime.getHours();
    let minutes = nowTime.getMinutes();
    
    timeChange(formatTime(hours),formatTime(minutes)); 
    // we are required to format the time because it may display something like 1:2,
    // when the intended text is 01:02
}

function loadBackground(){
    let data = photos.shift();
    console.log(photos)
    if (photos.length < 1){
        requestImages('query=nature&orientation=landscape&size=medium') 
        // we requested before but we use this to make sure we have more images to use
    };

    let imageUrl = data.src.original; //api path

    document.getElementById('background-image').src = imageUrl; //unique, doesn't need a function
    changeText('credit','creditshadow',data.photographer); // applying the credit <3
    
}
document.getElementById('background-image').onload = ()=> { 
    // This property function is why we use <img>, very useful

    let ui = document.getElementsByClassName('ui') // short hand

    for(i = 2;i>=0;i--){
        // we are loooping back through the list of elements to make sure we load in order
        // i.e since the wallpaper element is last inside 'body', we load ui[2] first. :)

        ui[i].classList.add('ui-block'); // applys a second, higher priority class to another class
        // class becomes equal to 'ui ui-block', resetting the value to display.
    };
    let image = new Image()
    image.src = photos[0]
    loadedImgs.push(image)
    // Loading the future image, for the future.
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


(function () { // sadly I don't know why but this code doesn't work outside of (function()...
    // Add event listener
    document.addEventListener("mousemove", parallax);
    
    // Magic happens here, kudos to this guy https://codepen.io/oscicen/pen/zyJeJw
    function parallax(e) {
        let _w = window.innerWidth / 2;
        let _h = window.innerHeight / 2;
        let _mouseX = e.clientX;
        let _mouseY = e.clientY;

        let xtranvalue = (((_mouseX) - (_w)) * 0.5 / 100);
        let ytranvalue = (((_mouseY) - (_h)) * 0.5 / 100);

        let imagemove = `translateX(${xtranvalue-100}px) translateY(${ytranvalue-100}px)`;
        let textmove = `translateX(${-(xtranvalue)}px) translateY(${-(ytranvalue)}px)`; // notice these values are inverted to produce the opposite effect
        
        document.querySelector("#background-image").style.transform = imagemove;
        document.querySelector("#container").style.transform = textmove;
    }
})();

function formatTime(num){ // good function use
    if(num >= 10){
        return num;
    }else {
        return '0'+num;
    };
};

function checkTime(){
    nowTime = new Date();
    if (nowTime.getDay() >= 5){
        console.log(nowTime.getDay())
        changeText('maintext', 'maintextshadow', welcomeData.happyday[nowTime.getDay()]+' '+username);
        // we can use the day raw because the data object is structured to be accessed accordingly without error
    }else {
        changeText('maintext', 'maintextshadow', welcomeData.greetings[Math.floor(nowTime.getHours()/6)]+' '+username);
        // fancy math allows the data object to accessed according to the time of day
        // i.e. result = floor(10/6) => 1 > greetings[result] > 'Good morning,'
        // i.e. result = floor(12/6) => 2 > greetings(result) > 'Good afternoon,'
    }
    
};
