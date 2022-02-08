
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
(function () {
    // Add event listener
    document.addEventListener("mousemove", parallax);
    const elem = document.querySelector("#background-image");
    
    // Magic happens here, kudos to this guy https://codepen.io/oscicen/pen/zyJeJw
    function parallax(e) {
        let _w = window.innerWidth / 2;
        let _h = window.innerHeight / 2;
        let _mouseX = e.clientX;
        let _mouseY = e.clientY;

        let xtranvalue = (((_mouseX) - (_w)) * 0.5 / 100)-100;
        let ytranvalue = (((_mouseY) - (_h)) * 0.5 / 100)-100;

        let imagemove = `translateX(${xtranvalue}px) translateY(${ytranvalue}px)`;
        let textmove = `translateX(${-(xtranvalue+100)}px) translateY(${-(ytranvalue+100)}px)`
        
        document.querySelector("#background-image").style.transform = imagemove;
        document.querySelector("#container").style.transform = textmove;
    }

})();
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
document.addEventListener("mousemove", parallax);

function parallax(e){
    this.querySelectorAll('.layer').forEach(layer => {
        const speed = layer.getAttribute('data-speed')

        const x = (window.innerWidth - e.pageX*speed)/100
        const y = (window.innerHeight - e.pageY*speed)/100

        layer.style.transform = `translateX(${x}px) translateY(${y}px)`
    })
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