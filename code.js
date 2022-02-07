
let welcomes = ['Good afternoon,','Good morning,']
let username = 'Michael'
var nowTime = new Date();
let tick = false;
function welcometext(text){document.getElementById('maintext').innerText = text}
function semicolonchange(text){document.getElementById('semicolon').style.visibility = text}
function timechange(hours,minutes){document.getElementById('hours').innerText = hours;document.getElementById('minutes').innerText = minutes;}
function background(text){document.getElementById('background-image').style.backgroundImage = text}
checkTime()
setInterval(() => {
    animateclock()
}, 1000);
function animateclock(){
    
    if(tick == false){
        semicolonchange('visible')
        tick = true
    }else {
        semicolonchange('hidden')
        tick = false
    }

    nowTime = new Date();
    let hours = nowTime.getHours()
    let minutes = nowTime.getMinutes()
    
    timechange(formatTime(hours),formatTime(minutes))
    
}
function formatTime(num){
    if(num > 10){
        return num
    }else {
        return '0'+num
    }
}
function checkTime(){
    nowTime = new Date();
    if(nowTime.getHours() >= 12){
        //afternoon
        welcometext(welcomes[0]+' '+username)
        background("url('./poppyfield.jpg')")
    } else {
        //morning
        welcometext(welcomes[1]+' '+username)
        background("url('./poppyfield.jpg')")
    }
}