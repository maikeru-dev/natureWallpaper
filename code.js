
let welcomeData = {
    'greetings':['Good night,','Good morning,','Good afternoon,','Good evening,','Good night,'],
    // each index is that equilvent to the time of day divided by 6 to give the accuracy, it's complex and works.
    'happyday':{
        '5':'Happy Friday,', // the numbers represent the day of the week
        '6':'Happy Saturday,',
        '7':'Happy Sunday,'
    }
}
const userheight = window.innerHeight
const userwidth = window.innerWidth
// let bgDimensions = {width:0,height:0} // width and height is halfed because the use case combined with the math makes division later inefficient
// taken out this section because it may or may not be implemented.
// This will be used when I figure out if I want to zoom in the image or not.

let username = 'Michael'; //Change this to your own name.
let loadedImgs = []; 
var nowTime = new Date();
var lastbackgroundTime = new Date();
let tick = false; // variable used for the semicolon in the clock
let photos = []; // variable used to load images
let apikey = {'pexel':"Bearer 563492ad6f917000010000011c2607a74b374f9f8daf3428ddc31151",
                'openweather':'7675722a8276f3816b62ae9d8cd4146e' }; // api keys, please don't steal them

function changeStyle(id, attribute, text){document.getElementById(id).style[attribute] = text };
function changeText(id1, shadowid, text){document.getElementById(id1).innerText = text;document.getElementById(shadowid).innerText = text;}
function semicolonChange(text){changeStyle('semicolon', 'visibility', text);changeStyle('semicolonshadow','visibility', text);}
function timeChange(hours,minutes){changeText('hours','hoursshadow', hours);changeText('minutes','minutesshadow', minutes);}
// functions to prevent repeatitive code


let request = new XMLHttpRequest(); // variable constructor used for http requests for images, fetch is probably better

requestImages() // requesting images and user location for openweatherdata, fetch is probably better
requestUserLoc() // this isn't a web request, rather built in api with privacy considered!


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
        semicolonChange('visible'); // there's a better way of setting multiple innerHtmls', use a class combined with
                                    // the new technique you learned earlier, it's at 'onLoad' event for bg-image
                                    // <3
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
        requestImages() 
        // we've requested images before but we use this to make sure we have more to use in the future
        // I plan to make the selection more advanced in the future, like time based wallpaper :)
    };

    // bgDimensions.height = data.height*(userheight/userwidth+0.2)/2 // this is used later to center the image
    // bgDimensions.width = data.width*(userheight/userwidth+0.2)/2 

    document.getElementById('background-image').src = data.src.original; //api path for image
 

    changeText('credit','creditshadow',data.photographer); // applying the credit <3
    
}
document.getElementById('background-image').onload = ()=> { 
    // This property function is the reason we use <img>, it is very useful

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

function requestImages(){ // working on the apporiate query! 
                          // previously: 'query=nature&orientation=landscape&size=medium'
    let random = Math.floor(Math.random() * 14) + 1
    console.log('random num generated ', random) // query is always the same but the page selected should be different
    request.open('GET','https://api.pexels.com/v1/search?' + 'query=desktop backgrounds nature&orientation=landscape&size=small&page=' + random);
    request.setRequestHeader('Authorization', apikey.pexel);
    request.send();
    request.onload = ()=>{
        photos = JSON.parse(request.response).photos;
        loadBackground();
    }; 
}


function requestUserLoc(){ // https://www.w3schools.com/js/js_api_geolocation.asp
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position)=>{
            fetch("https://api.openweathermap.org/data/2.5/weather?lat="+ position.coords.latitude + "&lon="+ position.coords.longitude +"&appid=" + apikey.openweather).then(
                (response) => {
                    (response).json().then(jsonResponse =>{

                        console.log(jsonResponse)

                        let weatherinfo = document.getElementsByClassName('weatherinfo')
                        const desc = jsonResponse.weather[0].description.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
                        // >> https://www.digitalocean.com/community/tutorials/js-capitalizing-strings
                        // this is required because for whatever reason lower case is classy and the main name is undescriptive (:

                        let icon = new Image(150,150)
                            icon.style.position = 'absolute'
                            icon.style.marginTop = '-40px'
                            icon.src = 'https://openweathermap.org/img/wn/'+ jsonResponse.weather[0].icon +'@4x.png'

                        weatherinfo[0].innerHTML = desc
                        weatherinfo[1].innerHTML = desc    
                        weatherinfo[0].appendChild(icon)

                    })
                    // sys.sunrise ideas, change background theme!!
                    // weather.main, weather.icon
                }
            )
        });
      } else {
        alert("Geolocation is not supported by this browser.");
      }
};

(function () { // sadly I don't know why but this code doesn't work outside of (function()...)
    // Add event listener
    document.addEventListener("mousemove", parallax);
    
    // Magic happens here, kudos to this guy https://codepen.io/oscicen/pen/zyJeJw
    function parallax(e) {
        let _w = userwidth / 2;
        let _h = userheight / 2;
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
