let welcomeData = {
  greetings: [
    "Good night,",
    "Good morning,",
    "Good afternoon,",
    "Good evening,",
    "Good night,",
  ],
  // each index is that equilvent to the time of day divided by 6 to give the accuracy, it's complex and works.
  happyday: {
    5: "Happy Friday,", // the numbers represent the day of the week
    6: "Happy Saturday,",
    7: "Happy Sunday,",
  },
};
// let bgDimensions = {width:0,height:0} // width and height is halfed because the use case combined with the math makes division later inefficient
// taken out this section because it may or may not be implemented.
// This will be used when I figure out if I want to zoom in the image or not.

let username = "Michael"; //Change this to your own name.
let loadedImgs = [];
var nowTime = new Date();
var lastbackgroundTime = new Date();
let tick = "visible"; // variable used for the semicolon in the clock
let photos = []; // variable used to load images
let apikey = {
  pexel: "563492ad6f917000010000011c2607a74b374f9f8daf3428ddc31151",
  openweather: "7675722a8276f3816b62ae9d8cd4146e",
}; // api keys, please don't steal them, I know this is very bad practice

let request = new XMLHttpRequest(); // variable constructor used for http requests for images, fetch is probably better

function main() {
  // runs at the bottom!
  requestImages(); // requesting images and user location for openweatherdata, fetch is probably better
  requestUserLoc(); // this isn't a web request, rather built in api with the user privacy considered!

  // Add event listener
  document.addEventListener("mousemove", parallax);

  // Magic happens here, kudos to this guy https://codepen.io/oscicen/pen/zyJeJw
  function parallax(e) {
    let _w = window.innerWidth / 2;
    let _h = window.innerHeight / 2;
    let _mouseX = e.clientX;
    let _mouseY = e.clientY;

    let xtranvalue = ((_mouseX - _w) * 0.5) / 100;
    let ytranvalue = ((_mouseY - _h) * 0.5) / 100;

    let imagemove = `translateX(${xtranvalue - 100}px) translateY(${ytranvalue - 100}px)`;
    let textmove = `translateX(${-xtranvalue}px) translateY(${-ytranvalue}px)`; // notice these values are inverted to produce the opposite effect

    document.querySelector("#background-image").style.transform = imagemove;
    document.querySelector("#container").style.transform = textmove;
  }

  setInterval(() => {
    // function repeats itself non-stop, every 1000ms
    animateClock();
    checkTime();
    if (nowTime.getTime() - lastbackgroundTime.getTime() > 1800000) {
      // If the time difference between the last recorded background change and now is 30 minutes, do this
      lastbackgroundTime = nowTime; // Sets last recorded time to now
      loadBackground();
    }
  }, 1000);
}

function requestImages() {
  // working on the apporiate query!
  // previously: 'query=nature&orientation=landscape&size=medium'
  let random = Math.floor(Math.random() * 14) + 1;
  console.log("random num generated ", random); // query is always the same but the page selected should be different
  request.open(
    "GET",
    "https://api.pexels.com/v1/search?" +
      "query=desktop backgrounds nature&orientation=landscape&size=small&page=" +
      random,
  );
  request.setRequestHeader("Authorization", apikey.pexel);
  request.send();
  request.onload = () => {
    photos = JSON.parse(request.response).photos; // make this fetch at some point, please
    loadBackground();
  };
}

function requestUserLoc() {
  // https://www.w3schools.com/js/js_api_geolocation.asp
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      fetch(
        "https://api.openweathermap.org/data/2.5/weather?lat=" +
          position.coords.latitude +
          "&lon=" +
          position.coords.longitude +
          "&appid=" +
          apikey.openweather,
      ).then((response) => {
        response.json().then((jsonResponse) => {
          console.log(jsonResponse);

          let weatherinfo = document.getElementById("weatherinfo");
          const desc = jsonResponse.weather[0].description.replace(
            /\w\S*/g,
            (w) => w.replace(/^\w/, (c) => c.toUpperCase()),
          );
          // >> https://www.digitalocean.com/community/tutorials/js-capitalizing-strings
          // This is required because for whatever reason lower case is classy and the main name is undescriptive (:

          let icon = new Image(150, 150); // We're resizing a bigger image to be smaller, high quality and fitting in size
          icon.style.position = "absolute";
          icon.style.marginTop = "-40px";
          icon.src =
            "https://openweathermap.org/img/wn/" +
            jsonResponse.weather[0].icon +
            "@4x.png";

          weatherinfo.innerHTML = desc;
          weatherinfo.appendChild(icon);
        });
        // sys.sunrise ideas, change background theme!!
        // weather.main, weather.icon
      });
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function loadBackground() {
  let data = photos.shift();

  if (photos.length < 1) {
    requestImages();
    // we've requested images before but we use this to make sure we have more to use in the future
    // I plan to make the selection more advanced in the future, like time based wallpaper :)
  }

  // bgDimensions.height = data.height*(userheight/userwidth+0.2)/2 // this is used later to center the image
  // bgDimensions.width = data.width*(userheight/userwidth+0.2)/2

  document.getElementById("background-image").src = data.src.original; //api path for image
  document.getElementById("credit").innerHTML = data.photographer; // applying the credit <3
}

document.getElementById("background-image").onload = () => {
  // This property function is the reason we use <img>, it is very useful

  let ui = document.getElementsByClassName("ui"); // short hand

  for (i = 2; i >= 0; i--) {
    // we are loooping back through the list of elements to make sure we load in order
    // i.e since the wallpaper element is last inside 'body', we load ui[2] first. :)

    ui[i].classList.add("ui-block"); // applys a second, higher priority class to another class
    // class becomes equal to 'ui ui-block', resetting the value to display.
  }
  let image = new Image();
  image.src = photos[0];
  loadedImgs.push(image);
  // Loading the future image, for the future.
};

function formatTime(num) {
  // Good function use. :)
  if (num >= 10) {
    return num;
  } else {
    return "0" + num;
  }
}
function animateClock() {
  nowTime = new Date();
  let hours = formatTime(nowTime.getHours());
  let minutes = formatTime(nowTime.getMinutes());
  // We are required to format the time because it may display something like 1:2,
  // when the intended text is 01:02

  if (tick == "visible") {
    tick = "hidden";
  } else {
    tick = "visible";
  } // This flips atleast 8x more bits than the previous (in history) method
  // This works by checking if the semicolon is already visible.
  // If it is, hide it, if it isn't, make it visible.
  document.getElementById("hours").innerHTML = hours;
  document.getElementById("minutes").innerHTML = minutes;
  document.getElementById("semicolon").style.visibility = tick;
}
function checkTime() {
  nowTime = new Date();
  let text = "";
  if (nowTime.getDay() >= 5) {
    console.log(nowTime.getDay());
    text = welcomeData.happyday[nowTime.getDay()] + " " + username;
    // We can use the day raw because the data object is structured to be accessed accordingly without error
  } else {
    text =
      welcomeData.greetings[Math.floor(nowTime.getHours() / 6)] +
      " " +
      username;
    // Fancy math allows the data object to accessed according to the time of day
    // i.e. result = floor(10/6) => 1 > greetings[result] > 'Good morning,'
    // i.e. result = floor(12/6) => 2 > greetings(result) > 'Good afternoon,'
  }
  document.getElementById("maintext").innerHTML = text;
}
main();

