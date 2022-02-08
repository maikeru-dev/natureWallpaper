
let welcomes = ['Good afternoon,','Good morning,']
let username = 'Michael'
var nowTime = new Date();
let tick = false;
let photos = []
let apikey = "Bearer 563492ad6f917000010000011c2607a74b374f9f8daf3428ddc31151"
function changetext(id1, shadowid, text){document.getElementById(id1).innerText = text;document.getElementById(shadowid).innerText = text;}
function semicolonchange(text){document.getElementById('semicolon').style.visibility = text;document.getElementById('semicolonshadow').style.visibility = text}
function timechange(hours,minutes){changetext('hours','hoursshadow', hours);changetext('minutes','minutesshadow', minutes)}
function background(text){document.getElementById('background-image').style.backgroundImage = `url('${text}')`;}

var request = new XMLHttpRequest();
request.open('GET','https://api.pexels.com/v1/search?query=nature&orientation=landscape&size=medium')
request.setRequestHeader('Authorization', apikey)
request.send();
request.onload = ()=>{
    photos = JSON.parse(request.response)['photos']
    let random = Math.round(Math.random() * photos.length)
    let data = photos.slice(random-1,random)[0]
    console.log(data, random)

    let image = data.src['original']
    background(image);
}


checkTime()
animateclock()
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
    if(num >= 10){
        return num
    }else {
        return '0'+num
    }
}
function checkTime(){
    nowTime = new Date();
    if(nowTime.getHours() >= 12){
        //afternoon
        changetext('maintext', 'maintextshadow', welcomes[0]+' '+username)
    } else {
        //morning
        changetext('maintext', 'maintextshadow', welcomes[1]+' '+username)
    }
}