var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 18.5,
        center: {lat: 25.769587, lng: -80.364214},
    });
}

function upload() {

    var readFileBtn = document.getElementById("read-file");
    readFileBtn.click();
    
    readFileBtn.addEventListener("change", () => {
        load(readFileBtn.files[0].name); // Loads JSON file 
    });
    
}

function loadJSON(file, callback) {   

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
            }
    };
    xobj.send(null);  
    }
        
    
function load(fileName) {

    loadJSON(fileName, function(response) {
    
        var actual_JSON = JSON.parse(response);

        //Humidity , AirTemp , Lux , Turbidity , PH , WaterTemp

        humidity = 50; airTemp = 72; lux = 10000; turbidity = 4; phMin = 6.5; phMax = 9; waterTemp = 17;

        var count = 0;
        var color = ""; 

        for (i = 0; i < Object.keys(actual_JSON).length; i++) {

            count = 0;

            // These addData functions are in the graphs.js 
            addData(humidityChart,i,actual_JSON[i].Humidity);
            addData(airTempChart,i,actual_JSON[i].AirTemp);
            addData(luxChart,i,actual_JSON[i].Lux);
            addData(turbidityChart,i,actual_JSON[i].Turbidity);
            addData(phChart,i,actual_JSON[i].PH);
            addData(waterTempChart,i,actual_JSON[i].WaterTemp);

            if(actual_JSON[i].Humidity > humidity) count++;
            if(actual_JSON[i].AirTemp > airTemp) count++;
            if(actual_JSON[i].Lux > lux) count++;
            if(actual_JSON[i].Turbidity < turbidity) count++;
            if(actual_JSON[i].PH < phMin || actual_JSON[i].PH > phMax) count++;
            if(actual_JSON[i].WaterTemp > waterTemp) count++;

            console.log("count: " + count)
            if (count < 3) color = "green";
            else if (count == 3) color = "yellow";
            else if (count > 3) color = "red";

            var location = {lat: actual_JSON[i].Lat, lng: actual_JSON[i].Lng,}
            addMarker(location,color);
        }
    });
}


function addMarker(location, color) {
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: { 
            url: "http://maps.google.com/mapfiles/ms/icons/" + color + ".png" 
        }
    });
}