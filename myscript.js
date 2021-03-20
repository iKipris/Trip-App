// allow enter only on input textareas!
$(document).on("keydown", ":input:not(textarea)", function(event)
{
    if (event.key == "Enter")
    {
        event.preventDefault();
    }
});

jQuery(document).ready(function()
{
    "use strict"; // Start of use strict
    var map = new google.maps.Map(document.getElementById("map"),
    {
        center:
        {
            lat: 40.629269,
            lng: 22.947412
        },
        zoom: 12
    });
    // Toggle the side navigation
    $("#sidebarToggle, #sidebarToggleTop").on('click', function(e)
    {
        $("body").toggleClass("sidebar-toggled");
        $(".sidebar").toggleClass("toggled");
        if ($(".sidebar").hasClass("toggled"))
        {
            $('.sidebar .collapse').collapse('hide');
        };
    });

    // Close any open menu accordions when window is resized below 768px
    $(window).resize(function()
    {
        if ($(window).width() < 768)
        {
            $('.sidebar .collapse').collapse('hide');
        };

        // Toggle the side navigation when window is resized below 480px
        if ($(window).width() < 480 && !$(".sidebar").hasClass("toggled"))
        {
            $("body").addClass("sidebar-toggled");
            $(".sidebar").addClass("toggled");
            $('.sidebar .collapse').collapse('hide');
        };
    });

    // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
    $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e)
    {
        if ($(window).width() > 768)
        {
            var e0 = e.originalEvent,
                delta = e0.wheelDelta || -e0.detail;
            this.scrollTop += (delta < 0 ? 1 : -1) * 30;
            e.preventDefault();
        }
    });
    jQuery("#from_places").focusout(function()
    {
        if (document.getElementById("to_places").innerText)
        {
            initMap();
        }

        //$('#myperiod').text(document.getElementById("timetype").value);
    });
    jQuery("#to_places").focusout(function()
    {

        if (document.getElementById("from_places").innerText)
        {
            initMap();

        }


        //$('#myperiod').text(document.getElementById("timetype").value);
    });
    jQuery("#waypoint_places").focusout(function()
    {
        if (document.getElementById("from_places").value && document.getElementById("to_places").value)
        {
            initMap();
        }
        if (this.value == "")
        {
            passval();
        }

    });
    
     jQuery("#consumption").focusout(function()
    {
        var x=document.getElementById("mydistancee").innerText;
        x=parseFloat(x);
        var num=x*this.value;
        document.getElementById("totalprice").innerText = Math.floor(num*10)/10;
        
    });


}); // End of use strict


$('#mode4').on('mousedown', function() {
    if (this.checked) { 
        this.dataset.check = '1';
    }
}).on('mouseup', function() {
    
    if (this.dataset.check) { 
        var radio = this;
        setTimeout(function() {radio.checked = false;}, 20); 
        passval();
        delete this.dataset.check; 
    }
});


$('#mode5').on('mousedown', function() {
    if (this.checked) { 
        this.dataset.check = '1';
    }
}).on('mouseup', function() {
    
    if (this.dataset.check) { 
        var radio = this;
        setTimeout(function() {radio.checked = false;}, 20); 
        passval();
        delete this.dataset.check; 
    }
});
// allow enter only on input textareas!
$(document).on("keydown", ":input:not(textarea)", function(event)
{
    if (event.key == "Enter")
    {
        event.preventDefault();
    }
});


function initMap()
{
    var from_places = document.getElementById("from_places");
    var to_places = document.getElementById("to_places");
    var waypoint_places = document.getElementById("waypoint_places");
    var options = {
        componentRestrictions:
        {
            country: "gr"
        }
    };
    var searchBox_waypoint = new google.maps.places.Autocomplete(
        waypoint_places,
        options
    );
    searchBox_waypoint.addListener("place_changed", function()
    {

        var waypoint_place = searchBox_waypoint.getPlace();
        var waypoint_address = waypoint_place.formatted_address;
        $('#waypoint').val(waypoint_address);
        passval();


    });


    var searchBox_from = new google.maps.places.Autocomplete(
        from_places,
        options
    );
    searchBox_from.addListener("place_changed", function()
    {

        var from_place = searchBox_from.getPlace();
        var from_address = from_place.formatted_address;
        $('#origin').val(from_address);
        
        window.from_lat = from_place.geometry.location.lat();
        window.from_lng = from_place.geometry.location.lng();
        
        passval();
       
    });


    var searchBox_to = new google.maps.places.Autocomplete(
        to_places,
        options
    );
    searchBox_to.addListener("place_changed", function()
    {


        var to_place = searchBox_to.getPlace();
        var to_address = to_place.formatted_address;
        $('#destination').val(to_address);
        
        window.to_lat = to_place.geometry.location.lat();
        window.to_lng = to_place.geometry.location.lng();
        
        passval();
        



    });
}


function passval()
{
    var from = document.getElementById("from_places").value;
    var to = document.getElementById("to_places").value;

    if (from != "" && to != "")
    {

        var lat_origin = window.from_lat;
        var lng_origin = window.from_lng;
        var lat_dest = window.to_lat;
        var lng_dest = window.to_lng;
        initMap1(lat_origin, lng_origin, lat_dest, lng_dest);
    }
}

function initMap1(lat1, lng1, lat2, lng2)
{

    var lat_origin = lat1;
    var lng_origin = lng1;
    var lat_dest = lat2;
    var lng_dest = lng2;
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;

    var origin = new google.maps.LatLng(lat_origin, lng_origin);

    var destination = new google.maps.LatLng(lat_dest, lng_dest);
    var bounds = new google.maps.LatLngBounds();

    var markersArray = [];
    var destinationIcon = "https://chart.googleapis.com/chart?" + "chst=d_bubble_icon_text_small&chld=ski|bb|Wheeee!|FFFFFF|000000";

    var originIcon = "https://chart.googleapis.com/chart?" + "chst=d_bubble_icon_text_small&chld=ski|bb|Wheeee!|FFFFFF|000000";



    var geocoder = new google.maps.Geocoder();
    var service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
    {

        origins: [origin],
        destinations: [destination],
        travelMode: "DRIVING",
        unitSystem: google.maps.UnitSystem.METRIC,
        //avoidHighways: false,
        //avoidTolls: true
    }, function(response, status)
    {
        if (status !== "OK")
        {
            document.getElementById("totalprice").innerText = '';
            document.getElementById("priceperkm").hidden = true;
            document.getElementById("mydurationn").innerText = ' ';
            document.getElementById("mydistancee").innerText = ' ';
            document.getElementById("map").hidden = true;
            document.getElementById("ContactUs").hidden = false;
        }
        else
        {
            var map = new google.maps.Map(document.getElementById("map"),
            {
                center:
                {
                    lat: 40.629269,
                    lng: 22.947412
                },
                zoom: 12
            });
            var originList = response.originAddresses;
            var destinationList = response.destinationAddresses;

            deleteMarkers(markersArray);
            var showGeocodedAddressOnMap = function(asDestination)
            {
                var icon = asDestination ? destinationIcon : originIcon;
                return function(results, status)
                {

                    if (status === "OK")
                    {

                        map.fitBounds(bounds.extend(results[0].geometry.location));
                        markersArray.push(
                            new google.maps.Marker(
                            {
                                map: map,
                                position: results[0].geometry.location,
                                icon: icon
                            })
                            
                        );
                        
                    }
                };
            };

            checkif = document.getElementById("waypoint_places").value;
            if (checkif)
            {
                var waypts = [
                {
                    location: checkif,
                    stopover: true
                }];
            }
            else
            {

                var waypts = [];
            }
            var travelmode=['DRIVING','WALKING','BICYCLING'];
            var checkbox1=document.getElementById("mode1");
            var checkbox2=document.getElementById("mode2");
            var checkbox3=document.getElementById("mode3");
            var checkbox4=document.getElementById("mode4").checked;
            var checkbox5=document.getElementById("mode5").checked;
            
            if (checkbox1.checked == true)
            {
                 
                document.getElementById("totalprice").hidden=false;    
                document.getElementById("priceperkm").hidden=false;
                mymode=travelmode[0];
            }
            else if (checkbox2.checked == true)
            {
                
                document.getElementById("totalprice").hidden=true;
                document.getElementById("consumption").value='';
                document.getElementById("totalprice").innerText='';
                document.getElementById("priceperkm").hidden=true;
                mymode=travelmode[1];
            }
            else if (checkbox3.checked == true)
            {
                document.getElementById("totalprice").hidden=true;
                document.getElementById("totalprice").innerText='';
                document.getElementById("consumption").value='';
                document.getElementById("priceperkm").hidden=true;
                mymode=travelmode[2];
            }
            var origina = originList[0];
            var destina = destinationList[0];
            directionsDisplay.setMap(map);
            directionsService.route(
            {
                avoidHighways: checkbox4,
                avoidTolls: checkbox5,
                waypoints: waypts,
                origin: origina,
                destination: destina,
                optimizeWaypoints: true,
                travelMode: mymode

            }, function(response, status)
            {
                if (status === 'OK')
                {
                    directionsDisplay.setDirections(response);
                    const route = response.routes[0];
                    var totalDist = 0;
                    var totalTime = 0;
                    for (var i = 0; i < route.legs.length; ++i)
                    {

                        var km1 = route.legs[i].distance.value;
                        totalDist = totalDist + km1;


                        var time1 = route.legs[i].duration.value;
                        totalTime = totalTime + time1;

                    }
                    print_Duration = totalTime;
                    totalTime = secondsToHms(totalTime);

                    var duration_text = totalTime;




                    var km = totalDist / 1000;

                    var pricetaxi = km * 1.275;


                    if (document.getElementById("triptype").value == "roundtrip")
                    {
                        km = 2 * km;
                        duration_text = secondsToHms(2 * print_Duration);
                        

                        



                    }

                    
                    
                    document.getElementById("mydistancee").innerText = km.toFixed(2);
                    document.getElementById("mydurationn").innerText = duration_text;
                    if (document.getElementById("consumption").value  )
                    {
                    document.getElementById("totalprice").innerText=km.toFixed(2) * document.getElementById("consumption").value;
                    }
                    
                    
                    
                    document.getElementById("ContactUs").hidden = true;
                    document.getElementById("map").hidden = false;


                }
                else
                {
                    document.getElementById("totalprice").innerText = '';
                    document.getElementById("priceperkm").hidden = true;
                    document.getElementById("mydurationn").innerText = ' ';
                    document.getElementById("mydistancee").innerText = ' ';
                    document.getElementById("map").hidden = true;
                    document.getElementById("ContactUs").hidden = false;
                    //window.alert('Directions request failed due to ' + status);
                }
            });

            var results = response.rows[0].elements;
            var duration = response.rows[0].elements[0].duration;
            var printDuration = duration;
            var duration_text = secondsToHms(duration.value);



        }

    });
}

function deleteMarkers(markersArray)
{
    for (var i = 0; i < markersArray.length; i++)
    {
        markersArray[i].setMap(null);
    }
    markersArray = [];
}


function myFunction1()
{
    passval();
        
    
}


function secondsToHms(d)
{
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    

    var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
    
    return hDisplay + mDisplay ;
}