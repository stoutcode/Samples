"use strict";

// Pohja svg
var svg;
// Montako sivuttaisesti liikkuvaa palkkia luodaan
var palkkienMaara;
// Kaikki lisätyt elementit sisältävä div
var containerDiv;
// Käytössä oleva väripaletti palkeille
var varit;
// Seuraava väri, joka valitaan
var seuraavaVari;
// Montako palkkia on väritetty nykyisellä värillä
var varejaLaitettu;
// tekstiskrollerin keyframet
var tekstikeyframes;
// tekstiskrollerin diville
var tekstiKontaineri;
// css tiedosto
var tyylit;
// Taustalla olevien palkkien keyframet
var laattaKeyframe;

window.onload = function() {
    containerDiv = document.getElementById("animationContainer");
    tyylit = document.styleSheets[0];
    
    // Palkkien värivaihtoehdot
    varit = ["#ff0000", "#00ff00", "#0000ff", "#ff00ff", "#ffff00","#00ff00", "#00ffff", "#ffffff"];
    // Luodaan svg pohja ja gradient määritykset
    alustaSvg();

    // Taustalla ja niiden edessä olevien palkkien määrä
    palkkienMaara = 10;
    // Luodaan taustalla olevat palkit
    laattaKeyframe = etsiKeyframesaanto("kiemurtelu");
    kiemurtelevatPalkit(0,0,0);

    // Liikkuvat pingviinit
    liikkuvatPingviinit();

    // Horisontaalisesti kulkevat palkit
    // Parametrina jo luotujen palkkien määrä
    luoPalkkeja(0);

    // Pöllön palaset. Parametriksi asetetaan ensimmäisen palasen numero.
    pollonPalaset(1);

    // Tekstiskrolleri
    tekstikeyframes = etsiKeyframesaanto("scrollUpwards");
    let scrolliteksti = "Mieleni minun tekevi,\n  aivoni ajattelevi\n  lähteäni laulamahan,\n  saa'ani sanelemahan,\n  sukuvirttä suoltamahan,\n  lajivirttä laulamahan.\n  Sanat suussani sulavat,\n  puhe'et putoelevat,\n  kielelleni kerkiävät,\n  hampahilleni hajoovat.\n  Veli kulta, veikkoseni,\n  kaunis kasvinkumppalini!\n  Lähe nyt kanssa laulamahan,\n  saa kera sanelemahan\n  yhtehen yhyttyämme,\n  kahta'alta käytyämme!\n  Harvoin yhtehen yhymme,\n  saamme toinen toisihimme\n  näillä raukoilla rajoilla,\n  poloisilla Pohjan mailla.\n  Lyökämme käsi kätehen,\n  sormet sormien lomahan,\n  lauloaksemme hyviä,\n  parahia pannaksemme,\n  kuulla noien kultaisien,\n  tietä mielitehtoisien,\n  nuorisossa nousevassa,\n  kansassa kasuavassa:\n  noita saamia sanoja,\n  virsiä virittämiä\n  vyöltä vanhan Väinämöisen,\n  alta ahjon Ilmarisen,\n  päästä kalvan Kaukomielen,\n  Joukahaisen jousen tiestä,\n  Pohjan peltojen periltä,\n  Kalevalan kankahilta.\n  Niit' ennen isoni lauloi\n  kirvesvartta vuollessansa;\n  niitä äitini opetti\n  väätessänsä värttinätä,\n  minun lasna lattialla\n  eessä polven pyöriessä,\n  maitopartana pahaisna,\n  piimäsuuna pikkaraisna.\n  Sampo ei puuttunut sanoja\n  eikä Louhi luottehia:\n  vanheni sanoihin sampo,\n  katoi Louhi luottehisin,\n  virsihin Vipunen kuoli,\n  Lemminkäinen leikkilöihin.\n  Viel' on muitaki sanoja,\n  ongelmoita oppimia:\n  tieohesta tempomia,\n  kanervoista katkomia,\n  risukoista riipomia,\n  vesoista vetelemiä,\n  päästä heinän hieromia,\n  raitiolta ratkomia,\n  paimenessa käyessäni,\n  lasna karjanlaitumilla,\n  metisillä mättähillä,\n  kultaisilla kunnahilla,\n  mustan Muurikin jälessä,\n  Kimmon kirjavan keralla.\n  Vilu mulle virttä virkkoi,\n  sae saatteli runoja.\n  Virttä toista tuulet toivat,\n  meren aaltoset ajoivat.\n  Linnut liitteli sanoja,\n  puien latvat lausehia.\n  Ne minä kerälle käärin,\n  sovittelin sommelolle.\n  Kerän pistin kelkkahani,\n  sommelon rekoseheni;\n  ve'in kelkalla kotihin,\n  rekosella riihen luoksi;\n  panin aitan parven päähän\n  vaskisehen vakkasehen.\n  Viikon on virteni vilussa,\n  kauan kaihossa sijaisnut.\n  Veänkö vilusta virret,\n  lapan laulut pakkasesta,\n  tuon tupahan vakkaseni,\n  rasian rahin nenähän,\n  alle kuulun kurkihirren,\n  alle kaunihin katoksen,\n  aukaisen sanaisen arkun,\n  virsilippahan viritän,\n  kerittelen pään kerältä,\n  suorin solmun sommelolta?\n  Niin laulan hyvänki virren,\n  kaunihinki kalkuttelen\n  ruoalta rukihiselta,\n  oluelta ohraiselta.\n  Kun ei tuotane olutta,\n  tarittane taarivettä,\n  laulan suulta laihemmalta,\n  vetoselta vierettelen\n  tämän iltamme iloksi,\n  päivän kuulun kunniaksi,\n  vaiko huomenen huviksi,\n  uuen aamun alkeheksi.";
    tekstiSkrolleri(scrolliteksti);
    
};

/**
 * Alustaa svg pohjan palkeille ja kahdelle pingviinille.
 * Lisää palkeille liukuvärivaihtoehdot värit[] taulukosta.
 */
function alustaSvg() {
    // Svg
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    containerDiv.appendChild(svg);
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("class", "svgPohja");
    svg.setAttribute("version", "1.1");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    // Liukuvärivaihtoehdot
    let defsP = document.createElementNS("http://www.w3.org/2000/svg", 'defs');
    svg.appendChild(defsP);
    for (let i = 0; i < varit.length; i++) {
        let gradP = document.createElementNS("http://www.w3.org/2000/svg", 'linearGradient');
        defsP.appendChild(gradP);
        gradP.setAttribute("id", "gradientPalkki" + (i+1));
        gradP.setAttribute("x1", "0%");
        gradP.setAttribute("y1", "0%");
        gradP.setAttribute("x2", "100%");
        gradP.setAttribute("y2", "0%");
        let stopP1 = document.createElementNS("http://www.w3.org/2000/svg", 'stop');
        let stopP2 = document.createElementNS("http://www.w3.org/2000/svg", 'stop');
        let stopP3 = document.createElementNS("http://www.w3.org/2000/svg", 'stop');
        stopP1.setAttribute("offset", "0%");
        stopP1.setAttribute("stop-color", "#000000");
        stopP2.setAttribute("offset", "50%");
        stopP2.setAttribute("stop-color", varit[i]);
        stopP3.setAttribute("offset", "100%");
        stopP3.setAttribute("stop-color", "#000000");
        gradP.appendChild(stopP1);
        gradP.appendChild(stopP2);
        gradP.appendChild(stopP3);
    }
}

/**
 * Luo sivun taustalle liikkuvat palkit. Jokainen palkki koostuu 120 osasta.
 * Osia lisäämällä tulisi animaatiosta sulavampi, mutta sivun lataus hidastuisi myös.
 * @param {*} laattojaLuotu montako laattaa on tehty tähän mennessä
 * @param {*} palkkejaLuotu montako palkkia on tehty tähän mennessä
 * @param {*} laattaX laatan horisontaalinen sijainti, alkaa nollasta
 */
function kiemurtelevatPalkit(laattojaLuotu, palkkejaLuotu, laattaX) {
    if (laattojaLuotu > 120) {
        palkkejaLuotu++;
        if (palkkejaLuotu == palkkienMaara) {
            return;
        }
        laattaX += 7;
        kiemurtelevatPalkit(0,palkkejaLuotu, laattaX);
        return;
    }
    let laatta = document.createElementNS("http://www.w3.org/2000/svg","rect");
    svg.appendChild(laatta);
    laattaKeyframe.deleteRule(laattaKeyframe.cssRules[0].keyText);
    laattaKeyframe.deleteRule(laattaKeyframe.cssRules[0].keyText);
    laattaKeyframe.appendRule("0% { transform: translateX(0%); }");
    laattaKeyframe.appendRule("15% { transform: translateX(30%); }");
    laattaKeyframe.appendRule("35% { transform: translateX(0%); }");
    laattaKeyframe.appendRule("75% { transform: translateX(30%); }");
    laattaKeyframe.appendRule("100% { transform: translateX(0px); }");
    laatta.setAttribute("fill", "url(#gradientPalkki5");
    laatta.setAttribute("width", "6%");
    laatta.setAttribute("height", "1%");
    laatta.setAttribute("x", laattaX + "%");
    laatta.setAttribute("y", laattojaLuotu/1.2 + "%");
    laatta.style.position = "absolute";
    laatta.style.animationName = "kiemurtelu";
    laatta.style.animationDuration = "10s";
    laatta.style.animationIterationCount = "infinite";
    laatta.style.animationTimingFunction = "ease-in-out";
    laatta.style.animationDelay = laattojaLuotu/60 + 1 + "s";
    laattojaLuotu++;
    kiemurtelevatPalkit(laattojaLuotu, palkkejaLuotu, laattaX);
}


/**
 * Luo palkkeja svg kuvaan ja asettaa niille tyylit.css tiedostossa asetetun animaation,
 * kullekin omalla viiveellä.
 * @param {*} palkkejaLuotu montako palkkia on luotu, alussa 0
 */
function luoPalkkeja(palkkejaLuotu) {
    let palkkeja = palkkejaLuotu;
    if (palkkeja >= palkkienMaara) {
        return;
    }
    // Palkki
    let palkki = document.createElementNS("http://www.w3.org/2000/svg","rect");
    svg.appendChild(palkki);
    palkki.setAttribute("width", "0%");
    palkki.setAttribute("height", "0%");
    palkki.setAttribute("class", "palkki");
    seuraavaVari = 4;
    palkki.setAttribute("fill", "url(#gradientPalkki" + seuraavaVari);
    // Seuraava väri on toinen gradient vaihtoehto, koska ensimmäiseen iteraatioon käytettiin ensimmäinen
    // Alussa seuraavaa väriä on laitettu 0 kpl
    varejaLaitettu = 0;
    // Värin vaihto joka iteraatiolla.
    // Samaa väriä käytetään palkkien määrän verran ja sitten vaihtuu väri.
    palkki.addEventListener("animationiteration", function() {
        if (varejaLaitettu == palkkienMaara) {
            if (seuraavaVari > varit.length-1) {
                seuraavaVari = 1;
            } else {
                seuraavaVari++;
            }
            varejaLaitettu = 0;
        }
        palkki.setAttribute("fill", "url(#gradientPalkki" + seuraavaVari);
        varejaLaitettu++;
    });
    // Toistuvien palkkien viiveen asettaminen
    palkki.style.animationDelay = (palkkeja * 0.2 + 's');
    palkkeja++;
    luoPalkkeja(palkkeja);
}

/**
 * Luo kaksi pingviiniä, jotka liikkuvat ristiin sivulla kulmasta kulmaan
 * src https://appro.mit.jyu.fi/tiea2120/vt/vt4/penguin.png
 */
function liikkuvatPingviinit() {
    for (let i = 1; i < 3; i++) {
        let pingviini = document.createElementNS("http://www.w3.org/2000/svg","image");
        svg.appendChild(pingviini);
        pingviini.setAttribute("width", "150px");
        pingviini.setAttribute("height", "150px");
        pingviini.setAttribute("class", "pinkviini" + i);
        pingviini.setAttribute("href", "https://appro.mit.jyu.fi/tiea2120/vt/vt4/penguin.png");
    }
}

/**
 * Luo neljä palasta pöllön kuvasta. Css määritysten kautta pöllön palaset liikkuvat
 * sivun keskeltä kohti sivun kulmia ja takaisin.
 * @param {*} palasetMaara 
 */
function pollonPalaset(palasetMaara) {
    if (palasetMaara > 4) {
        return;
    }
    // Canvas
    let canvas = document.createElement("canvas");
    containerDiv.appendChild(canvas);
    let ctx = canvas.getContext('2d');
    canvas.className += "pollot " + "pollo" + palasetMaara;
    // Isompi neljässä palasessa oleva pollo
    let pollo = document.createElement("img");
    pollo.src = "http://appro.mit.jyu.fi/cgi-bin/tiea2120/kuva.cgi"; 
    // "http://appro.mit.jyu.fi/tiea2120/vt/vt4/owl.png";

    // Otetaan palasetMäärä arvo talteen, jotta se on käytössä kun onload funktio pääsee suoritukseen
    let indeksi = palasetMaara;
    pollo.onload = function() {
        // Canvaksen koko neljäsosaan pöllöstä, eli sama kuin yksi palanen
        canvas.setAttribute("width", pollo.width/2);
        canvas.setAttribute("height", pollo.height/2);
        // Piirretään pöllön palaset ja muutetaan
        // keyframet pöllön koon mukaisiksi
        switch (indeksi) {
            case 1:
                let p1keyframes = etsiKeyframesaanto("pollo1") ;
                p1keyframes.deleteRule(p1keyframes.cssRules[0].keyText);
                p1keyframes.deleteRule(p1keyframes.cssRules[0].keyText);
                p1keyframes.appendRule("0% { transform: translate(0%); }");
                p1keyframes.appendRule("100% { transform: translate(calc(-" + (pollo.width/2) + "px + 50vw), calc(-" + (pollo.height/2) + "px + 50vh)); }");
                ctx.drawImage(pollo, 0, 0, pollo.width/2, pollo.height/2, 0, 0, pollo.width/2, pollo.height/2);
                break;
            case 2:
                let p2keyframes = etsiKeyframesaanto("pollo2") ;
                p2keyframes.deleteRule(p2keyframes.cssRules[0].keyText);
                p2keyframes.deleteRule(p2keyframes.cssRules[0].keyText);
                p2keyframes.appendRule("0% { transform: translate(calc(-" + pollo.width/2 + "px + 100vw), 0vh); }");
                p2keyframes.appendRule("100% { transform: translate(calc(50vw), calc(-" + (pollo.height/2) + "px + 50vh)); }");
                ctx.drawImage(pollo, pollo.width/2, 0, pollo.width/2, pollo.height/2, 0, 0, pollo.width/2, pollo.height/2);
                break;
            case 3:
                let p3keyframes = etsiKeyframesaanto("pollo3") ;
                p3keyframes.deleteRule(p3keyframes.cssRules[0].keyText);
                p3keyframes.deleteRule(p3keyframes.cssRules[0].keyText);
                p3keyframes.appendRule("0% { transform: translate(calc(-" + pollo.width/2 + "px + 100vw), calc(-" + pollo.height/2 + "px + 100vh)); }");
                p3keyframes.appendRule("100% { transform: translate(calc(50vw), calc(50vh)); }");
                ctx.drawImage(pollo, pollo.width/2, pollo.height/2, pollo.width/2, pollo.height/2, 0, 0,pollo.width/2, pollo.height/2);
                break;
            case 4:
                let p4keyframes = etsiKeyframesaanto("pollo4") ;
                p4keyframes.deleteRule(p4keyframes.cssRules[0].keyText);
                p4keyframes.deleteRule(p4keyframes.cssRules[0].keyText);
                p4keyframes.appendRule("0% { transform: translate(0%, calc(-" + pollo.height/2 + "px + 100vh)); }");
                p4keyframes.appendRule("100% { transform: translate(calc(-" + (pollo.width/2) + "px + 50vw), calc(50vh)); }");
                ctx.drawImage(pollo, 0, pollo.height/2, pollo.width/2, pollo.height/2, 0, 0, pollo.width/2, pollo.height/2);
                break;
            default:
                console.log("Something went wrong with drawing the owl pieces to canvas.");
                break;

        }
    };
    palasetMaara++;
    pollonPalaset(palasetMaara);
}

/**
 * Etsii ja palauttaa keyframe säännön
 * @param {*} saanto 
 */
function etsiKeyframesaanto(saanto) {
    for (let i = 0; i < tyylit.cssRules.length; i++) {
    if (tyylit.cssRules[i].type == window.CSSRule.KEYFRAMES_RULE && 
        tyylit.cssRules[i].name == saanto) { 
            return tyylit.cssRules[i];
        }
    }
    return null;
}

/**
 * Tekee divin ja sen sisälle tekstin riveistä paragraph elementtejä sekä
 * määrittää niille css classit, joiden kautta tulee scroll animaatio
 * @param {*} teksti 
 */
function tekstiSkrolleri(teksti) {
    // Muodostetaan taulukko riveistä
    let rivit = teksti.split("\n");
    tekstiKontaineri = document.createElement("div");
    tekstiKontaineri.setAttribute("class", "tekstiskrolleri");
    for (let i = 0; i < rivit.length; i++) {
        let rivi = document.createElement("p");
        rivi.textContent = rivit[i].trim();
        tekstiKontaineri.appendChild(rivi);
    }
    containerDiv.appendChild(tekstiKontaineri);
    tekstiKontaineri.style.animationDuration = rivit.length * 0.5 + 's';
    tekstikeyframes.deleteRule(tekstikeyframes.cssRules[0].keyText);
    tekstikeyframes.deleteRule(tekstikeyframes.cssRules[0].keyText);
    tekstikeyframes.appendRule("0% { transform: translate(calc(-" + tekstiKontaineri.clientWidth/2 + "px + 50vw), 100vh); }");
    tekstikeyframes.appendRule("100% { transform: translate(calc(-" + tekstiKontaineri.clientWidth/2 + "px + 50vw), calc(-" + tekstiKontaineri.clientHeight + "px + 0vh)); }");
    // Tarkistetaan tekstiskrollerin sijainti, jos ikkunan leveys pienenee tarkeeksi
    // css tiedostossa on määritelty myös tähän samaan kokoon fontin vaihtuminen
    const lessThan800 = window.matchMedia('(max-width: 800px)');
    lessThan800.addEventListener("change", (e) => {
        if (e.matches) {
            tekstikeyframes.deleteRule(tekstikeyframes.cssRules[0].keyText);
            tekstikeyframes.deleteRule(tekstikeyframes.cssRules[0].keyText);
            tekstikeyframes.appendRule("0% { transform: translate(calc(-" + tekstiKontaineri.clientWidth/2 + "px + 50vw), 100vh); }");
            tekstikeyframes.appendRule("100% { transform: translate(calc(-" + tekstiKontaineri.clientWidth/2 + "px + 50vw), calc(-" + tekstiKontaineri.clientHeight + "px + 0vh)); }");
        }
    });
    // Sama juttu, mutta jos ikkuna taas suurenee
    const moreThan800 = window.matchMedia('(min-width: 800px)');
    moreThan800.addEventListener("change", (e) => {
        if (e.matches) {
            tekstikeyframes.deleteRule(tekstikeyframes.cssRules[0].keyText);
            tekstikeyframes.deleteRule(tekstikeyframes.cssRules[0].keyText);
            tekstikeyframes.appendRule("0% { transform: translate(calc(-" + tekstiKontaineri.clientWidth/2 + "px + 50vw), 100vh); }");
            tekstikeyframes.appendRule("100% { transform: translate(calc(-" + tekstiKontaineri.clientWidth/2 + "px + 50vw), calc(-" + tekstiKontaineri.clientHeight + "px + 0vh)); }");
        }
    });
}