"use strict";
/*jshint esversion: 6 */
// seuraavat estävät jshintin narinat jqueryn ja leafletin objekteista
/* jshint jquery: true */
/* globals L */


// valittu rasti kartalla
let valittu = {};
// raahattava joukkue
let raahattava;

$(document).ready(function() {
    // joukkuelistaus ul
    let joukkuelistausJQ = $("#joukkueListaus");
    // rastilistaus ul
    let rastilistausJQ = $("#rastiListaus");
    // kartta
    let kartta = new L.map('map', { crs: L.TileLayer.MML.get3067Proj() });
    L.tileLayer.mml_wmts({layer: "maastokartta"}).addTo(kartta);

    // Tehdään data.js datasta deep clone käsiteltäväksi, jotta ei tehdä alkuperäiseen dataan muutoksia.
    // Olin epävarma saako alkuperäisen datan rastien koordinaatteja muuttaa rastien siirtelyn
    // tuloksena, siksi tämä ratkaisu.
    let kaikkiData = JSON.parse(JSON.stringify(data));

    alustukset(joukkuelistausJQ, rastilistausJQ, kartta);
    lisääJoukkueet(joukkuelistausJQ, kaikkiData);
    lisääRastit(rastilistausJQ, kartta, kaikkiData);
});

/**
 * Otsikoiden muotoilut, dragoverit ja dropboxit.
 * @param {*} joukkuelistausJQ joukkuelistaus ul
 * @param {*} rastilistausJQ  rastilistaus ul
 * @param {*} kartta kartta
 */
function alustukset(joukkuelistausJQ, rastilistausJQ, kartta) {
    // otsikoiden responsiivisuus
    $("#joukkueetOtsikko").css("font-size", "1.5vh");
    $("#kartallaOtsikko").css("font-size", "1.5vh");
    $("#rastitOtsikko").css("font-size", "1.5vh");    
    
    // Joukkuelistauksen dragover. Sallitaan, jos kyseessä joukkue.
    // Toteutettu muuttujan avulla, koska datatranferin data on
    // firefoxia lukuunottamatta muissa selaimissa protected tilassa dragover eventissä
    let teamsdrop = document.getElementById("teamsList");
    teamsdrop.addEventListener("dragover", function(e) {
        if (raahattava.joukkue !== undefined) {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
        } else {
            e.dataTransfer.dropEffect = "none";
        }
    });

    // Joukkuelistauksen drop
    teamsdrop.addEventListener("drop", function(e) {
        e.preventDefault(); 
        let data = e.dataTransfer.getData("text");
        let joukkue = document.getElementById(data);
        let joukkueJQ = $("#" + data);
        // Muutetaan joukkue elementin (p) display takaisin blokiksi, jotta värialue laajenee
        joukkueJQ.css("display", "block");
        // Muutetaan järjestäytyminen taas takaisin normaaliksi
        joukkueJQ.css("position", "static");
        joukkueJQ.css("left", "0");
        joukkueJQ.css("top", "0");
        // Poistetaan edellinen listaelementti, jos sellainen oli.
        // Tämä vain tapauksissa, jossa joukkue siirretään joukkuelistauksesta ja
        // sijoitetaan vain listan viimeiseksi.
        if (joukkue.parentNode.nodeName.toLowerCase() == "li") {
            joukkue.parentNode.parentNode.removeChild(joukkue.parentNode);
        }
        // Luodaan uusi listaselementti, johon joukkue liitetään ja laitetaan se listan viimeiseksi
        let listaYksilö = document.createElement("li");
        // Jos osoitetaan tiputuksella listan elementtiä p, niin
        // tiputetaan ennen sitä, muuten listan loppuun
        listaYksilö.appendChild(joukkue);
        if (e.target.nodeName.toLowerCase() == "p") {
            e.target.parentNode.parentNode.insertBefore(listaYksilö, e.target.parentNode);
        } else {
            $(listaYksilö).appendTo(joukkuelistausJQ);
        }
        // Poistetaan vielä taival kartalta
        if (joukkue.taival !== undefined) {
            kartta.removeLayer(joukkue.taival);
            joukkue.taival = undefined;
            joukkue.kartalla = false;
        }
    });

    let mapBoxDiv = document.getElementById("mapBox");
    let mapBoxDivJQ = $(mapBoxDiv);

    // Kartalla divin dragover.
    mapBoxDiv.addEventListener("dragover", function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    });

    // Kartalla divin drop
    mapBoxDiv.addEventListener("drop", function(e) {
        e.preventDefault(); 
        let data = e.dataTransfer.getData("text");
        // lisätään tämän elementin sisään
        let elementti = document.getElementById(data);
        let elementtiJQ = $(elementti);
        // Muutetaan elementin (p) pituus tekstin pituiseksi
        elementtiJQ.css("display", "inline-block");
        // Annetaan elementin asettua sinne mihin se tiputetaan
        elementtiJQ.css("position", "absolute");
        // Poistetaan elementin (p) parentNodena ollut listaelementti alkuperäisestä listauksesta, jos sellainen oli
        if (elementti.parentNode.nodeName.toLowerCase() == "li") {
            elementti.parentNode.parentNode.removeChild(elementti.parentNode);
        }
        // Lisätään mapBoxin sisälle.
        elementtiJQ.appendTo(mapBoxDivJQ);
        // Määritetään elementille sijainti, joka myöhemmin muutetaan suhteelliseksi
        elementtiJQ.css("left", e.pageX - mapBoxDiv.offsetLeft);
        elementtiJQ.css("top",  e.pageY - mapBoxDiv.offsetTop - elementti.offsetHeight);   
        // Muutetaan elementin sijainti suhteelliseksi divin sisällä
        let vasen = elementtiJQ.position().left / elementtiJQ.parent().width() * 100;
        let ylä = elementtiJQ.position().top / elementtiJQ.parent().height() * 100;
        // Rajataan sijaintialuetta, että elementti pysyy siirrettäessä jotakuinkin divin rajojen sisällä
        if ( vasen > 95 ) {
            vasen = 95;
        }
        if ( ylä > 90 ) {
            ylä = 90;
        } else if ( ylä < (-3) ) {
            ylä = (-3);
        }
        elementtiJQ.css("left", vasen + "%");
        elementtiJQ.css("top",  ylä + "%");
        // Lisätään joukkueen kulkema matka kartalle, jos sitä ei vielä ollut siellä
        if (elementti.kartalla !== undefined && elementti.kartalla === false) {
            joukkueenTaivalKartalle(elementti, kartta);
        }
    });

    // Rastit listan dragover. Sallitaan, jos kyseessä rasti.
    // Toteutettu muuttujan avulla, koska datatranferin data on
    // firefoxia lukuunottamatta muissa selaimissa protected tilassa dragover eventissä
    let pointsdrop = document.getElementById("pointsList");
    pointsdrop.addEventListener("dragover", function(e) {
        if (raahattava.rasti !== undefined) {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
        } else {
            e.dataTransfer.dropEffect = "none";
        }
    });

    // Rastit listan drop
    pointsdrop.addEventListener("drop", function(e) {
        e.preventDefault(); 
        let data = e.dataTransfer.getData("text");
        // lisätään tämän elementin sisään
        let rasti = document.getElementById(data);
        let rastiJQ = $("#" + data);
        // Muutetaan joukkue elementin (p) display takaisin blokiksi, jotta värialue laajenee
        rastiJQ.css("display", "block");
        // Muutetaan järjestäytyminen taas takaisin normaaliksi
        rastiJQ.css("position", "static");
        rastiJQ.css("left", "0");
        rastiJQ.css("top", "0");
        // Poistetaan elementin (p) parentNodena ollut listaelementti alkuperäisestä listauksesta, jos sellainen oli
        if (rasti.parentNode.nodeName.toLowerCase() == "li") {
            rasti.parentNode.parentNode.removeChild(rasti.parentNode);
        }
        // Liitetään se listaelementin sisään ja listan viimeiseksi
        let listaYksilö = document.createElement("li");
        listaYksilö.appendChild(rasti);
        // Jos osoitetaan tiputuksella listan elementtiä p, niin
        // tiputetaan ennen sitä, muuten listan loppuun
        if (e.target.nodeName.toLowerCase() == "p") {
            e.target.parentNode.parentNode.insertBefore(listaYksilö, e.target.parentNode);
        } else {
            $(listaYksilö).appendTo(rastilistausJQ);
        }
    });
}

/**
 * Lisätään joukkueet listaukseen
 * @param {*} joukkuelistausJQ joukkuelistaus ul
 * @param {*} kaikkiData käsiteltävä data
 */
function lisääJoukkueet(joukkuelistausJQ, kaikkiData) {
    // Järjestys aakkosjärjestyksessä
    kaikkiData.joukkueet.sort(function(a,b) {
        if (a.nimi.trim().toLowerCase() < b.nimi.trim().toLowerCase()) {return -1;}
        if (a.nimi.trim().toLowerCase() > b.nimi.trim().toLowerCase()) {return 1;}
        return 0;
    });
    // i määrittää väriä rainbow funktiolle
    let i = 1;
    kaikkiData.joukkueet.forEach(joukkue => {
        let listaYksilö = document.createElement("li");
        let listaJoukkue = document.createElement("p");
        listaYksilö.appendChild(listaJoukkue);
        listaJoukkue.joukkue = joukkue;
        listaJoukkue.kartalla = false;
        listaJoukkue.taival = undefined;
        listaJoukkue.rastienKoordinaatit = haeRastienKoordinaatit(joukkue, kaikkiData);
        listaJoukkue.matka = joukkueenMatka(joukkue, kaikkiData);
        listaJoukkue.textContent = joukkue.nimi.trim() + " (" + listaJoukkue.matka + " km)";
        // id:ksi "joukkue" + id
        listaJoukkue.setAttribute("id", "joukkue" + joukkue.id);
        // css luokka tunnistusta ja tekstin responsiivista kokoa varten
        listaJoukkue.setAttribute("class", "listaJoukkue");
        // Raahaus
        listaJoukkue.setAttribute("draggable", "true");
        listaJoukkue.addEventListener("dragstart", function(e) {
            // dataTransfer dataksi id arvo
            e.dataTransfer.setData("text/plain", listaJoukkue.getAttribute("id"));
            // dragover tapahtumaa varten raahattavaan sijoitetaan listaJoukkue, joka sisältää joukkueen objektin
            raahattava = listaJoukkue;
        });
        let listaJoukkueJQ = $(listaJoukkue);
        // väritys
        listaJoukkueJQ.css("background-color", rainbow(kaikkiData.joukkueet.length, i));
        // perus display blokkina, koska keskellä menee inline blokiksi
        listaJoukkueJQ.css("display", "block");
        // nämä kanssa defaulttina, kun keskellä ne muuttuvat
        listaJoukkueJQ.css("left", "0");
        listaJoukkueJQ.css("top", "0");
        $(listaYksilö).appendTo(joukkuelistausJQ);
        i++;
    });
}

/**
 * Muodostaa joukkueen kulkeman yhteismatkan joukkueen rastileimausten perusteella.
 * Palauttaa joukkueen kulkeman matkan kilometreinä.
 * @param {*} joukkue joukkue
 * @param {*} kaikkiData käsiteltävä data
 */
function joukkueenMatka(joukkue, kaikkiData) {
    let rastiKoordinaatit = haeRastienKoordinaatit(joukkue, kaikkiData);
    let matka = 0;
    if (rastiKoordinaatit.length > 1) {
        for (let i = 1; i < rastiKoordinaatit.length; i++) {
            // Haetaan yksittäisen välin matka peräkkäisten rastien koordinaattien perusteella
            matka += getDistanceFromLatLonInKm(rastiKoordinaatit[i-1][0], rastiKoordinaatit[i-1][1], rastiKoordinaatit[i][0], rastiKoordinaatit[i][1]);
        }
        // Pyöristetään kokonaismatka yhden desimaalin tarkuudella
        matka = Math.round(matka * 10) / 10;
    }
    return matka;
}

/**
 * Lisätään rastit järjestettynä listaukseen,
 * niille draggable ja kutsutaan ympyrän piirtämistä kartalle.
 * @param {*} rastilistausJQ rastilistaus ul
 * @param {*} kartta kartta
 * @param {*} kaikkiData käsiteltävä data
 */
function lisääRastit(rastilistausJQ, kartta, kaikkiData) {
    // järjestys päinvastaiseksi
    kaikkiData.rastit.sort(function(a,b) {
        if (a.koodi > b.koodi) {return -1;}
        if (a.koodi < b.koodi) {return 1;}
        return 0;
    });
    // i määrittää rainbow funktion väriä
    let i = 1;
    // Kartan kuvan asemointia varten featureGroup, jonka avulla tehdään fitBounds myöhemmin
    let lisätytRastit = L.featureGroup();
    // Lisätään rastit listaan ja kartalle
    kaikkiData.rastit.forEach(rasti => {
        let listaYksilö = document.createElement("li");
        let listaRasti = document.createElement("p");
        listaYksilö.appendChild(listaRasti);
        listaRasti.rasti = rasti;
        // idksi rasti id
        listaRasti.setAttribute("id", "rasti" + rasti.id);
        // Tekstin responsiivista kokoa varten css luokka.
        // Eri kuin joukkueilla, koska joukkueilla
        // luokka toimii myös tunnisteena.
        listaRasti.setAttribute("class", "listaRasti");
        listaRasti.textContent = rasti.koodi;
        // Raahaus
        listaRasti.setAttribute("draggable", "true");
        listaRasti.addEventListener("dragstart", function(e) {
            // datatransfer dataksi id arvo
            e.dataTransfer.setData("text/plain", listaRasti.getAttribute("id"));
            // dragover tapahtumaa varten raahattavaan sijoitetaan listaRasti, joka sisältää rastin objektin
            raahattava = listaRasti;
        });
        let listaRastiJQ = $(listaRasti);
        // väritys
        listaRastiJQ.css("background-color", rainbow(kaikkiData.rastit.length, i));
        $(listaYksilö).appendTo(rastilistausJQ);
        // rastille ympyrä karttaan
        ympyräKartalle(rasti, kartta, kaikkiData);
        // Lisätään fitboundsia varten koordinaateista tehty marker lisätytRastit featuregrouppiin
        let tempMarker = L.marker([parseFloat(rasti.lat), parseFloat(rasti.lon)]);
        tempMarker.addTo(lisätytRastit);
        i++;        
    });
    // Kartan kuvan asemointi niin, että kaikki rastit näkyvät kartan kuvassa myös selainikkunan koon muuttuessa.
    kartta.fitBounds(lisätytRastit.getBounds());
    // Kartan kuvan asemointi responsiivisesti
    $(window).resize(function() {
        kartta.fitBounds(lisätytRastit.getBounds());
    });
}

/**
 * Lisää rastin ympyrän kartalle sille asetettuun koordinaattiin
 * ja luo markerin kun sitä klikataan sekä tapahtumankäsittelijän
 * markerin raahauksen loppuun.
 * @param {*} rasti rastin objekti
 * @param {*} kartta leaflet kartta
 * @param {*} kaikkiData käsiteltävä data
 */
function ympyräKartalle(rasti, kartta, kaikkiData) {
    // ympyrä
    let ympyrä = L.circle(
        [rasti.lat, rasti.lon], {
            color: 'red',
            fillOpacity: 0,
            radius: 150
        }            // kun klikataan ympyrää
    ).addTo(kartta).on("click", function() {
        // Valittu objekti sisältää ominaisuudet ympyrä ja merkki, joihin
        // kulloinenkin valittu ympyrä ja markeri sijoitetaan.
        // Jos on jo käsitelty jotain ympyrää, niin asetetaan edellinen ympyrä alkutilaan 
        if (valittu.ympyrä !== undefined) {
            valittu.ympyrä.setStyle({fillOpacity: 0});
        }
        // Asetetaan uusi ympyrä valittu ominaisuudeksi
        valittu.ympyrä = ympyrä;
        // Vaihdetaan valittu ympyrä punaiseksi ja luodaan
        // uusi raahattava markeri kartalle rastin kohtaan
        valittu.ympyrä.setStyle({fillOpacity: 100});
        let marker = L.marker([rasti.lat, rasti.lon], {draggable:'true'}).addTo(kartta);
        // poistetaan vanha jos oli olemassa
        if (valittu.merkki !== undefined) {
            kartta.removeLayer(valittu.merkki);
        }
        // uusi markeri valittu ominaisuudeksi
        valittu.merkki = marker;
        // tapahtumankäsittelijä, kun raahattu markeria
        marker.addEventListener("dragend", function() {
            // Otetaan uudet koordinaatit talteen
            let markerCoords = marker.getLatLng();
            // Pyöristetään koordinaatit 6 desimaalin tarkkuudella,
            // kuten muissakin rasteissa.
            rasti.lat = markerCoords.lat.toFixed(6);
            rasti.lon = markerCoords.lng.toFixed(6);
            // Poistetaan vanha ympyrä ja markeri
            kartta.removeLayer(valittu.ympyrä);
            kartta.removeLayer(valittu.merkki);
            // Luodaan uusi ympyrä
            ympyräKartalle(rasti, kartta, kaikkiData);
            // Päivitetään niiden joukkueiden matkat ja reitit,
            // jotka olivat kulkeneet rastin kautta
            päivitäJoukkueidenMatkat(rasti, kartta, kaikkiData);
        });
    // Rastin koodin näyttävä tooltip keskelle
    }).bindTooltip(rasti.koodi, {
        permanent: true,
        direction: "center",
        // Muutetaan css tiedostossa tausta ja reunat näkymättömiksi
        className: 'class-tooltip'
    }).openTooltip();
}

/**
 * Päivittää joukkueiden matkat sekä kartalle piirrettyjen joukkuiden reitit
 * niiden joukkueiden osalta, jotka olivat kulkeneet muuttuneen rastin kautta.
 * @param {*} rasti muutettu rasti
 * @param {*} kartta kartta
 * @param {*} kaikkiData käsiteltävä data
 */
function päivitäJoukkueidenMatkat(rasti, kartta, kaikkiData) {
    // Haetaan kaikki listatut joukkueet
    let listaJoukkueet = document.getElementsByClassName("listaJoukkue");
    for (let i = 0; i < listaJoukkueet.length; i++) {
        let listaJoukkue = listaJoukkueet[i];
        // Käydään joukkueiden validit rastikoordinaatit läpi ja muutetaan muuttuneen
        // rastin tiedot, sekä matka ja mahdollisesti kartalle piirretty reitti.
        for (let o = 0; o < listaJoukkue.rastienKoordinaatit.length; o++) {
            if (listaJoukkue.rastienKoordinaatit[o][2].trim().toLowerCase() == rasti.koodi.trim().toLowerCase()) {
                listaJoukkue.rastienKoordinaatit[o][0] = rasti.lat;
                listaJoukkue.rastienKoordinaatit[o][1] = rasti.lon;
                listaJoukkue.matka = joukkueenMatka(listaJoukkue.joukkue, kaikkiData);
                listaJoukkue.textContent = listaJoukkue.joukkue.nimi.trim() + " (" + listaJoukkue.matka + " km)"; 
                if (listaJoukkue.taival !== undefined) {
                    kartta.removeLayer(listaJoukkue.taival);
                    joukkueenTaivalKartalle(listaJoukkue, kartta);
                }
            }
        }
    }
}

/**
 * Piirtää joukkueen kulkeman matkan (linnuntietä) kartalle
 * @param {*} listaJoukkue joukkueen elementti (p)
 * @param {*} kartta kartta
 */
function joukkueenTaivalKartalle(listaJoukkue, kartta) {
    // Haetaan rastien koordinaatit taulukkoon ja muutetaan ne stringistä liukuvuksi
    // (vaikka periaattessa polyline toimisi myös muokkaamattomalla listajoukkue.rastienKoordinaatit taulukolla)
    let rastienKoordinaatit = [];
    listaJoukkue.rastienKoordinaatit.forEach(rasti => {
        rastienKoordinaatit.push([parseFloat(rasti[0]), parseFloat(rasti[1])]);
    });
    // Jos taulukossa on useampi kuin yksi rasti, niin piirretään viivat koordinaattien välille
    if (rastienKoordinaatit.length > 1) {
        let polyline = L.polyline(rastienKoordinaatit, {color : listaJoukkue.style.backgroundColor}).addTo(kartta);
        // Tuodaan reitti päällimmäiseksi kartalla
        polyline.bringToFront();
        // Asetetaan viivoitus joukkue elementin (p) ominaisuudeksi, jotta voidaan myös poistaa se tarvittaessa
        listaJoukkue.taival = polyline;
        // Joukkue on nyt kartalla, ei tarvitse piirtää enää uudestaan
        listaJoukkue.kartalla = true;
    } else {
        console.log("Joukkueella: '" + listaJoukkue.joukkue.nimi + "' ei ole valideja rastimerkintöjä, joten mitään ei piirretty.");
    }
}

/**
 * Muodostaa joukkueen rasteista rastitaulukon, jossa on rastien koordinaatit ja koodit
 * Voi myös palauttaa tyhjän taulukon jos yhtään validia rastia ei ollut
 * @param {*} joukkue joukkue objekti
 * @param {*} kaikkiData käsiteltävä data
 */
function haeRastienKoordinaatit(joukkue, kaikkiData) {
    let joukkueenKoordinaatit = [];
    joukkue.rastit.forEach(rasti => {
        let rastinKoordinaatit = rastiKoordinaatit(rasti.rasti, kaikkiData);
        if (rastinKoordinaatit.length > 0) {
            joukkueenKoordinaatit.push(rastinKoordinaatit);
        }
    });
    return joukkueenKoordinaatit;
}

/**
 * Hakee yksittäisen rastin koordinaatit ja koodin palauttaa ne taulukossa
 * Voi myös palauttaa tyhjän taulukon, jos rasti ei ollut validi
 * @param {*} id rasti id 
 * @param {*} kaikkiData käsiteltävä data
 */
function rastiKoordinaatit(id, kaikkiData) {
    let koordinaatit = [];
    for (let i = 0; i < kaikkiData.rastit.length; i++) {
        if (parseInt(kaikkiData.rastit[i].id) == parseInt(id)) {
            koordinaatit = [kaikkiData.rastit[i].lat, kaikkiData.rastit[i].lon, kaikkiData.rastit[i].koodi];
            break;
        }
    }
    return koordinaatit;
}

/**
 * Funktio värivalikoiman tuottamiseen. Tarkemmat kommentit funktion sisällä.
 * lähde: https://appro.mit.jyu.fi/tiea2120/vt/vt5/#vinkit
 * @param {*} numOfSteps length of steps
 * @param {*} step one step of steps
 */
function rainbow(numOfSteps, step) {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    let r, g, b;
    let h = step / numOfSteps;
    let i = ~~(h * 6);
    let f = h * 6 - i;
    let q = 1 - f;
    switch(i % 6){
        case 0: r = 1; g = f; b = 0; break;
        case 1: r = q; g = 1; b = 0; break;
        case 2: r = 0; g = 1; b = f; break;
        case 3: r = 0; g = q; b = 1; break;
        case 4: r = f; g = 0; b = 1; break;
        case 5: r = 1; g = 0; b = q; break;
    }
    let c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
    return (c);
}

/**
 * Funktio matkan laskemiseen kahden pisteen välillä
 * lähde: https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
 * @param {*} lat1 lateral koordinaatti
 * @param {*} lon1 longitudal koordinaatti
 * @param {*} lat2 toinen lateral koordinaatti
 * @param {*} lon2 toinen longitudal koordinaatti
 */
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
}

/**
 * Asteiden muuttaminen radiaaneiksi
 * lähde: https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
 * @param {*} deg 
 */
function deg2rad(deg) {
    return deg * (Math.PI/180);
}

