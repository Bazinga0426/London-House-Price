import React, { useEffect, useRef ,} from "react";
import "./newindex.css";

let google = window.google;

function GOOGLEMAP({address,setAdress}) {
  const ref = useRef();
  useEffect(() => {
    ref.current && google && initMap(ref.current,address);
  }, [address]);

  return (
    <div id="container" >
      <div id="map" ref={ref}></div>
      <div id="sidebar">
        <h2>Results</h2>
        <ul id="places"></ul>
        <button id="more">Load more results</button>
      </div>
    </div>
  );
}

function initMap(div,address) {
  // Create the map.
  const pyrmont = {
    lat: 51.50876,
    lng: -0.12789,
  };
  // const results1;
  const map = new google.maps.Map(document.getElementById("map"), {
    center: pyrmont,
    zoom: 14,
    mapId: "8d193001f940fde3",
  });
  //place request
  const request = {
    query:address,
    fields: ["name", "geometry"],
  };
  // Create the places service.
  const service = new google.maps.places.PlacesService(map);
  service.findPlaceFromQuery(request, (results1, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results1) {
      for (let i = 0; i < results1.length; i++) {
        createMarker(results1[i], map);
      }
      map.setCenter(results1[0].geometry.location);
      console.log(pyrmont);
      console.log(results1[0].geometry.viewport.Ua.g);
      console.log(results1[0].geometry.viewport.La.g);
      console.log(results1[0]);
    }

    let getNextPage;
    const moreButton = document.getElementById("more");
    moreButton.onclick = function () {
      moreButton.disabled = true;

      if (getNextPage) {
        getNextPage();
      }
      // else{

      // }
    };
    // Perform a nearby search.
    //new
    //new5\5
    console.log(results1);
    const newpyrmont = {
      lat: results1[0].geometry.viewport.Ua.g,
      lng: results1[0].geometry.viewport.La.g,
    };
    console.log(newpyrmont);
    service.nearbySearch(
      {
        location: newpyrmont,
        radius: 35000,
        type: "school",
      },
      (results, status, pagination) => {
        if (status !== "OK" || !results) return;
        addPlaces(results, map);
        moreButton.disabled = !pagination || !pagination.hasNextPage;

        if (pagination && pagination.hasNextPage) {
          getNextPage = () => {
            // Note: nextPage will call the same handler function as the initial call
            pagination.nextPage();
          };
        }
      }
    );
  });
}

function addPlaces(places, map) {
  const placesList = document.getElementById("places");

  for (const place of places) {
    if (place.geometry && place.geometry.location) {
      const image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };
      new google.maps.Marker({
        map,
        icon: image,
        title: place.name,
        position: place.geometry.location,
      });
      const li = document.createElement("li");
      li.textContent = place.name;
      placesList.appendChild(li);
      li.addEventListener("click", () => {
        // map.setCenter(place.geometry.location);
      });
    }
  }
}

function createMarker(place, map) {
  if (!place.geometry || !place.geometry.location) return;
  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });
  google.maps.event.addListener(marker, "click", () => {
    window.infowindow.setContent(place.name || "");
    window.infowindow.open(map);
  });
}


export default GOOGLEMAP;
