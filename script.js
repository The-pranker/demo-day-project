// Supabase Setup
const SUPABASE_URL = "https://fldnqgunmnwdggnagoqt.supabase.co";
const SUPABASE_KEY = "sb_publishable_pGhVsQXpO6CfYM1KIu6Wjg_nR6uKkVv";
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const currentPath = window.location.pathname;


async function isUserLoggedIn() {
    const { data: { session }, error } = await db.auth.getSession();
    if (error || !session) {
        return false;
    }
    return true;
}


if (currentPath.includes("register.html") || currentPath.endsWith("register")) {
    (async () => {
        if (await isUserLoggedIn()) {
            window.location.href = "index.html";
            return;
        }
    const registerEmailInput = document.getElementById("email_register");
    const registerPasswordInput = document.getElementById("password_register");
    const registerButton = document.getElementById("register_button");

    registerButton.onclick = async function (event) {
        event.preventDefault();
        const email = registerEmailInput.value;
        const password = registerPasswordInput.value;
        if (!email || !password) {
            alert("Please enter both an email and a password.");
            return;
        }
        const { data, error } = await db.auth.signUp({ email: email, password: password });
        if (error) {
            alert("Registration Error: " + error.message);
            return;
        }
        window.location.href = "index.html";
    };
    })();
}


if (currentPath.includes("login")) {
    const loginEmailInput = document.getElementById("email_login");
    const loginPasswordInput = document.getElementById("password_login");
    const loginButton = document.getElementById("login_button");

    if (loginButton) {
        loginButton.onclick = async function (event) {
            event.preventDefault();
            
            if (!loginEmailInput || !loginPasswordInput) {
                console.error("Login input fields were not found in the HTML.");
                return;
            }

            const email = loginEmailInput.value;
            const password = loginPasswordInput.value;

            if (!email || !password) {
                alert("Please enter both an email and a password.");
                return;
            }

            const { data, error } = await db.auth.signInWithPassword({ email: email, password: password });
            if (error) {
                alert("Login Error: " + error.message);
                return;
            }
            window.location.href = "index.html";
        };
    }

    (async () => {
        if (await isUserLoggedIn()) {
            window.location.href = "index.html";
        }
    })();
}




if (currentPath === "/" || currentPath.includes("index.html") || currentPath.includes("demo-day-project")) {
    const loginNav = document.getElementById('login_nav');
    const registerNav = document.getElementById('register_nav');
    const logoutNav = document.getElementById('logout_nav');
    const logoutBtn = document.getElementById('logout_btn');

    (async () => {
    const { data: { session }, error } = await db.auth.getSession();

    if (session && !error) {
        if (loginNav) loginNav.style.display = 'none';
        if (registerNav) registerNav.style.display = 'none';
        if (logoutNav) logoutNav.style.display = 'block';
    } else {
        if (loginNav) loginNav.style.display = 'block';
        if (registerNav) registerNav.style.display = 'block';
        if (logoutNav) logoutNav.style.display = 'none';
    }
})();


    if (logoutBtn) {
        logoutBtn.onclick = async function(event) {
            event.preventDefault(); 
            
            const { error } = await db.auth.signOut();
            if (error) {
                alert("Error logging out: " + error.message);
                return;
            } 
            
            window.location.href = "index.html";
        };
    }
    
    
    
    var map = L.map('map_cont');
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    setTimeout(() => { map.invalidateSize(); }, 150);

    let currentUserPosition = null;
    let currentMapMarkers = []; 
    let activeRoutingControl = null; 

    const locationModal = document.getElementById('locationModal');
    const allowLocationBtn = document.getElementById('allowLocationBtn');
    const denyLocationBtn = document.getElementById('denyLocationBtn');

    function checkLocationPermissionChoice() {
        const userChoice = localStorage.getItem('locationPermissionChoice');
        if (userChoice === 'allowed') {
            requestBrowserGeolocation();
        } else if (userChoice === 'denied') {
            loadDefaultMapCoordinates();
        } else {
            locationModal.style.display = 'flex';
        }
    }

    allowLocationBtn.onclick = function() {
        localStorage.setItem('locationPermissionChoice', 'allowed');
        locationModal.style.display = 'none';
        requestBrowserGeolocation();
    };

    denyLocationBtn.onclick = function() {
        localStorage.setItem('locationPermissionChoice', 'denied');
        locationModal.style.display = 'none';
        loadDefaultMapCoordinates();
    };

    function requestBrowserGeolocation() {
        map.locate({ setView: true, maxZoom: 16 });
    }

    function loadDefaultMapCoordinates() {
        map.setView([40.74189, -74.00494], 16);
    }

    map.on('locationfound', function(e) {
        L.marker(e.latlng).addTo(map).bindPopup("You are here!").openPopup();
        L.circle(e.latlng, e.accuracy).addTo(map);
        currentUserPosition = { lat: e.latlng.lat, lng: e.latlng.lng };
    });

    map.on('locationerror', function(e) {
        loadDefaultMapCoordinates();
    });

    checkLocationPermissionChoice();


    let plusButton = document.getElementById('plus_button');
    let listName = document.getElementById('list_name');
    let listDescription = document.getElementById('list_description');
    let listLocation = document.getElementById('list_location');
    let listSubmit = document.getElementById('list_submit');
    let listForm = document.getElementById('list_form');
    let listingsSection = document.getElementById('listings');
    let suggestionsContainer = document.getElementById('address_suggestions');
    let locationWrapper = document.getElementById('location_wrapper'); 
    let plusButtonRotation = 0;
    let debounceTimer;

    plusButton.onclick = function() {
        let elements = [listName, listDescription, locationWrapper, listSubmit];
        if (plusButtonRotation === 0) {
            elements.forEach(el => el.classList.add('show-layout'));
            setTimeout(() => {
                elements.forEach(el => el.classList.add('active'));
            }, 10);
            plusButton.style.transform = 'rotate(360deg)';
            plusButtonRotation = 360;
        } else {
            elements.forEach(el => el.classList.remove('active'));
            suggestionsContainer.innerHTML = '';
            suggestionsContainer.classList.remove('has-data');
            setTimeout(() => {
                elements.forEach(el => el.classList.remove('show-layout'));
            }, 300);
            plusButton.style.transform = 'rotate(0deg)';
            plusButtonRotation = 0;
        }
    };

    listLocation.addEventListener('input', function() {
        let query = listLocation.value.trim();
        clearTimeout(debounceTimer);
        if (query.length < 3) {
            suggestionsContainer.innerHTML = '';
            suggestionsContainer.classList.remove('has-data');
            return;
        }
        debounceTimer = setTimeout(async () => {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&limit=5`, {
                    headers: { 'Accept': 'application/json' }
                });
                const data = await response.json();
                suggestionsContainer.innerHTML = '';
                if (data && data.length > 0) {
                    suggestionsContainer.classList.add('has-data');
                    data.forEach(item => {
                        let div = document.createElement('div');
                        div.className = 'suggestion-item';
                        div.innerText = item.display_name;
                        div.onclick = function() {
                            listLocation.value = item.display_name;
                            suggestionsContainer.innerHTML = '';
                            suggestionsContainer.classList.remove('has-data');
                        };
                        suggestionsContainer.appendChild(div);
                    });
                } else {
                    suggestionsContainer.classList.remove('has-data');
                }
            } catch (err) {
                console.error("Suggestions fetch failed:", err);
            }
        }, 300);
    });

    document.addEventListener('click', function(e) {
        if (e.target !== listLocation && e.target !== suggestionsContainer) {
            suggestionsContainer.innerHTML = '';
            suggestionsContainer.classList.remove('has-data');
        }
    });

    listForm.addEventListener("submit", addListing);

    async function addListing(event) {
        event.preventDefault();
        let name = listName.value;
        let description = listDescription.value;
        let locationInputValue = listLocation.value.trim();
        let targetLat = null;
        let targetLng = null;

        if (locationInputValue !== "") {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(locationInputValue)}&limit=1`, {
                    headers: { 'Accept': 'application/json' }
                });
                const data = await response.json();
                if (!data || data.length === 0) {
                    alert("Could not find that address on the map. Please verify spelling.");
                    return;
                }
                targetLat = parseFloat(data[0].lat);
                targetLng = parseFloat(data[0].lon);
            } catch (err) {
                console.error("Geocoding failed:", err);
                alert("Error processing location address.");
                return;
            }
        } else {
            if (!currentUserPosition) {
                alert("Please wait for the map to find your location, or type an address manually!");
                return;
            }
            targetLat = currentUserPosition.lat;
            targetLng = currentUserPosition.lng;
        }

        const { error } = await db.from('listings').insert({
            name: name,
            description: description,
            lat: targetLat,
            lng: targetLng
        });

        if (error) {
            console.log(error);
            return;
        }

        listName.value = '';
        listDescription.value = '';
        listLocation.value = '';
        listingsSection.innerHTML = '';
        await loadListings();
    }

    async function loadListings() {
        const { data, error } = await db.from('listings').select('*').order('created_at', { ascending: true });
        if (error) {
            console.log(error);
            return;
        }
        currentMapMarkers.forEach(marker => map.removeLayer(marker));
        currentMapMarkers = [];

        for (let i = 0; i < data.length; i++) {
            displayListings(data[i]);
            
            if (data[i].lat && data[i].lng) {
                let newMarker = L.marker([data[i].lat, data[i].lng])
                    .addTo(map)
                    .bindPopup(`
                        <div style="font-family: sans-serif; padding: 2px;">
                            <h4 style="margin: 0 0 5px 0; color: #333;">${data[i].name}</h4>
                            <p style="margin: 0; font-size: 12px; color: #666;">${data[i].description || 'No description.'}</p>
                        </div>
                    `);
                currentMapMarkers.push(newMarker);
            }
        }
    }



function showDirections(routesArray) {
    const directionsDiv = document.getElementById('displayDirections');
    if (!directionsDiv || !routesArray || routesArray.length === 0) return;
    
    const activeRoute = routesArray[0];


    if (!activeRoute.instructions) return;

    directionsDiv.style.padding = "20px";
    directionsDiv.style.border = "1px solid #e0e0e0";
    directionsDiv.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.05)";
    
    let html = '<strong>Turn-by-Turn Directions:</strong><ol>';
    
    activeRoute.instructions.forEach(function(step) {
        html += '<li>' + step.text + '</li>';
    });
    
    html += '</ol>';
    directionsDiv.innerHTML = html;
}


    function displayListings(row) {
        let cardElement = document.createElement('div');
        let titleElement = document.createElement('h3');
        let descriptionElement = document.createElement('p');
        let deleteButton = document.createElement('button');
        let routeButton = document.createElement('button');

        cardElement.className = 'listing-card';
        titleElement.className = 'listing-title';
        descriptionElement.className = 'listing-description';
        deleteButton.className = 'listing-delete-btn';
        routeButton.className = 'listing-route-btn';

        titleElement.innerHTML = row.name;
        descriptionElement.innerHTML = row.description || "No description provided.";
        deleteButton.innerHTML = "❌";
        routeButton.innerHTML = "➔";

        cardElement.onclick = function (e) {
            if (e.target === deleteButton || e.target === routeButton) return;
            if (row.lat && row.lng) {
                map.setView([row.lat, row.lng], 16, { animate: true, duration: 1.0 });
            } else {
                alert("This listing does not have coordinates attached.");
            }
        };


        routeButton.onclick = function(e) {
            e.stopPropagation(); 

            if (!currentUserPosition) {
                alert("Please enable or wait for device GPS detection before drawing directions!");
                return;
            }

            if (!row.lat || !row.lng) {
                alert("This item is missing coordinates needed to calculate a route.");
                return;
            }

             const directionsDiv = document.getElementById('displayDirections');
            if (directionsDiv) directionsDiv.innerHTML = '';
            if (activeRoutingControl) {
                map.removeControl(activeRoutingControl);
            }


            activeRoutingControl = L.Routing.control({
                waypoints: [
                    L.latLng(currentUserPosition.lat, currentUserPosition.lng),
                    L.latLng(row.lat, row.lng)
                ],
                routeWhileDragging: false,
                addWaypoints: false,
                show: false
            })
            .on('routesfound', function(e) {
            
                showDirections(e.routes); 
            })
            .addTo(map);
        };

        deleteButton.onclick = async function() {
            await deleteListing(row.id);
        };

        cardElement.append(deleteButton, routeButton, titleElement, descriptionElement);
        listingsSection.append(cardElement);
    }

    async function deleteListing(id) {
        const { error } = await db.from('listings').delete().eq('id', id);
        if (error) {
            console.log("Error deleting row item:", error);
            return;
        }
        listingsSection.innerHTML = '';
        await loadListings();
    }

    loadListings();
}

