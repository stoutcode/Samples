"use strict";

/**
 * Datarakenteen kopioiminen, valmiiksi annettu funktio tehtävään
 * (c) Tommi Lahtonen
 */ 
function kopioi_kilpailu(data) {
        let kilpailu = new Object();
        kilpailu.nimi = data.nimi;
        kilpailu.loppuaika = data.loppuaika;
        kilpailu.alkuaika = data.alkuaika;
        kilpailu.kesto = data.kesto;
        kilpailu.leimaustavat = Array.from( data.leimaustavat );
        function kopioi_rastit(j) {
            	        let uusir = {};
            	        uusir.id = j.id;
            	        uusir.koodi = j.koodi;
            	        uusir.lat = j.lat;
            	        uusir.lon = j.lon;
            	        return uusir; 
        }
        kilpailu.rastit = Array.from( data.rastit, kopioi_rastit );
        function kopioi_sarjat(j) {
            	        let uusir = {};
            	        uusir.id = j.id;
            	        uusir.nimi = j.nimi;
            	        uusir.kesto = j.kesto;
            	        uusir.loppuaika = j.loppuaika;
            	        uusir.alkuaika = j.alkuaika;
            	        return uusir; 
        }
        kilpailu.sarjat = Array.from( data.sarjat, kopioi_sarjat );
        function kopioi_joukkue(j) {
                    let uusij = {};
                    uusij.nimi = j.nimi;
                    uusij.id = j.id;
                    uusij.sarja = j.sarja;

                    uusij["jasenet"] = Array.from( j["jasenet"] );
	            function kopioi_leimaukset(j) {
            	        let uusir = {};
            	        uusir.aika = j.aika;
            	        uusir.rasti = j.rasti;
            	        return uusir;
	            }
                    uusij["rastit"] = Array.from( j["rastit"], kopioi_leimaukset );
                    uusij["leimaustapa"] = Array.from( j["leimaustapa"] );
                    return uusij;
        }

        kilpailu.joukkueet = Array.from( data.joukkueet, kopioi_joukkue);

	return kilpailu;
}

/**
 * Pääkomponentti, jonka tilaan tallennetaan kaikki tarvittava muuttuva tieto, ja jonka
 * metodeja hyödynnetään myös muissa komponenteissa.
 */
class App extends React.PureComponent {
    constructor(props) {
      super(props);
        this.state = {"kilpailu": data,
                      "id": undefined,
                      "nimi": "",
                      "leimaustapa": [],
                      "rastit": [],
                      "jasenet": ["","","","",""],
                      "jasenetActive": [true, true, false, false, false],
                      "sarja": "",
                      "radio": "radio0",
                      "checkbox": [],
                      "uusiko": true
                    };

        this.lomakeHandleChange = this.lomakeHandleChange.bind(this);
        this.lomakeSubmit = this.lomakeSubmit.bind(this);
        this.uusiId = this.uusiId.bind(this);
        this.submitValidation = this.submitValidation.bind(this);
        this.päivitäJoukkueet = this.päivitäJoukkueet.bind(this);
        this.haeSarjaNimi = this.haeSarjaNimi.bind(this);
        this.sarjatJarjestettyna = this.sarjatJarjestettyna.bind(this);
        this.haeLeimausTapaNimet = this.haeLeimausTapaNimet.bind(this);
        this.joukkueLomakkeeseen = this.joukkueLomakkeeseen.bind(this);

        console.log( this.state.kilpailu );
        return;
    }

    // Päivittää joukkueen tietorakenteeseen
    päivitäJoukkueet (joukkue) {

      // Deep clone vanhasta tilan kilpailu objektista.
      let uusiKilpailu = kopioi_kilpailu(this.state.kilpailu);
      // Jos oli kyse uudesta joukkueesta, niin lisätään se tietorakenteeseen
      if (this.state.uusiko) {
        uusiKilpailu.joukkueet.push(joukkue);
      } else {
        // Muuten muutetaan olemassaolevan joukkueen tiedot id:n perusteella
        for (let i = 0; i < uusiKilpailu.joukkueet.length; i++) {
          if (parseInt(uusiKilpailu.joukkueet[i].id) == parseInt(joukkue.id)) {
            uusiKilpailu.joukkueet[i] = joukkue;
            break;
          }
        }
      }

      this.setState({
        "kilpailu": uusiKilpailu,
        "id": undefined,
        "nimi": "",
        "leimaustapa": [],
        "rastit": [],
        "jasenet": ["","","","",""],
        "jasenetActive": [true,true,false,false,false],
        "sarja": "",
        "radio": "radio0",
        "checkbox": [],
        "uusiko": true
      });
    }

    // Asetetaan klikatun joukkueen tiedot tilaan, josta ne päivittyvät lomakkeelle
    // Joukkue on tässä vaiheessa
    joukkueLomakkeeseen(joukkue) {

      // Asetetaan valittu radio joukkueen sarjan mukaan
      // Pitää ottaa sarjat käsittelyyn siinä järjestyksessä,
      // kuin ne ovat lomakkeella.
      let sarjat = this.sarjatJarjestettyna();
      let radio = "radio" + 1;
      for (let i = 0; i < sarjat.length; i++) {
        if (sarjat[i].id == joukkue.sarja) {
          radio = "radio" + i;
        }
      }
    
      // Lomakkeella valitut leimaustavat joukkueen leimaustapojen mukaan
      let checkbox = [];
      joukkue.leimaustapa.map(leimaustapa => {
        checkbox.push("checkbox" + leimaustapa);
      });

      // Montako jäsenkenttää asetetaan näkyviin. Joukkueen jäsenmäärän mukaisesti + 1 tyhjä.
      let jasenetActive = [true,true,false,false,false]; // Alussa on aina kaksi näkyvissä
      for (let i = 0; i < joukkue.jasenet.length - 1; i++) {
        if (i + 2 < jasenetActive.length) {
          jasenetActive[i+2] = true;
        }
      }

      // Tallennetaan jäsenet tilassa olevan taulukon kokoiseen taulukkoon, jotta
      // jäsenkenttiä on olemassa oikea määrä (5 kpl)
      let jasenet = new Array(this.state.jasenet.length).fill("");
      joukkue.jasenet.map((jasen, i) => {
        jasenet[i] = jasen;
      });

      // Asetetaan joukkueen tiedot tilaan
      this.setState({
        "id": joukkue.id,
        "nimi": joukkue.nimi,
        "leimaustapa": joukkue.leimaustapa,
        "rastit": joukkue.rastit,
        "jasenet": jasenet,
        "jasenetActive": jasenetActive,
        "sarja": joukkue.sarja,
        "radio": radio,
        "checkbox": checkbox,
        "uusiko": false
      });
      
    }

    // Palautetaan sarjan nimi
    haeSarjaNimi(id) {
      let sarjat = this.state.kilpailu.sarjat;
      for (let i = 0; i < sarjat.length; i++) {
        if ( parseInt(sarjat[i].id) == parseInt(id) ) {
          return sarjat[i].nimi;
        }
      }      
    }

    // Palautetaan sarjat järjestettynä nimen mukaan.
    // Syväkopioidaan kilpailu taas ennen sarjojen järjestämistä, jotta ei mutatoida tilaa
    sarjatJarjestettyna() {
      return kopioi_kilpailu(this.state.kilpailu).sarjat.sort(function(a,b) {
        if (a.nimi.trim().toLowerCase() < b.nimi.trim().toLowerCase()) {return -1;}
        if (a.nimi.trim().toLowerCase() > b.nimi.trim().toLowerCase()) {return 1;}
        return 0;
      });
    }

    // Palautetaan leimaustapojen nimet pilkulla eroteltuna, jotta
    // voidaan näyttää ne joukkueiden listauksessa
    haeLeimausTapaNimet(joukkueenLeimaustavat) {
      let leimaustavat = this.state.kilpailu.leimaustavat;
      let nimet = [];
      for (let i = 0; i < leimaustavat.length; i++) {
        for (let u = 0; u < joukkueenLeimaustavat.length; u++) {
          if ( i == parseInt(joukkueenLeimaustavat[u]) ) {
            nimet.push(leimaustavat[i]);
            break;
          }
        }
      }
      return nimet.join(", ");
    }

    // Luodaan uudelle joukkueelle id, joka on yhden suurempi arvoltaan kuin suurin tähän mennessä ollut id.
    uusiId() {
      let joukkueet = this.state.kilpailu.joukkueet;
      let suurin = parseInt(joukkueet[0].id);
      for (let i = 1; i < joukkueet.length; i++) {
        let joukkueenId = parseInt(joukkueet[i].id);
        if (joukkueenId > suurin) {
          suurin = joukkueenId;
        }
      }
      return suurin + 1;
    }

    // Jos lomakkeeseen ei ole muuten koskettu, mutta painettu vain Tallenna nappia, niin tarkistetaan vaaditut kentät
    // ja asetetaan validity messaget.
    submitValidation(event) {

      // Jäsenien oletetut paikat
      let jasen1 = 10, jasen2 = 11;
      // Tarkistetaan vielä paikat
      for (let i = 0; i < event.target.parentNode.length; i++) {
        if (event.target.parentNode[i].id == "jasen0") {
          jasen1 = i;
          jasen2 = i + 1;
          break;
        }
      }

      if (this.state.nimi.trim() == "") {
        event.target.parentNode[1].setCustomValidity("Nimi pitää täyttää.");
      } else {
        event.target.parentNode[1].setCustomValidity("");
      }

      if (this.state.leimaustapa.length == 0) {
        event.target.parentNode[2].setCustomValidity("Vähintään yksi leimaustapa tulee valita.");
      } else {
        event.target.parentNode[2].setCustomValidity("");
      }

      if (this.state.jasenet[0].trim() == "") {
        event.target.parentNode[jasen1].setCustomValidity("Ensimmäiset kaksi jäsentä tulee täyttää.");
      } else {
        event.target.parentNode[jasen1].setCustomValidity("");
      }

      if (this.state.jasenet[1].trim() == "") {
        event.target.parentNode[jasen2].setCustomValidity("Ensimmäiset kaksi jäsentä tulee täyttää.");
      } else {
        event.target.parentNode[jasen2].setCustomValidity("");
      }

    }

    // Tapahtuu kun lomake lähetetään
    // Kootaan lomakkeen tiedot ja lähetään eteenpäin päivitäJoukkueet metodille
    lomakeSubmit(event) {
      event.preventDefault();
      
      let joukkue = {};
      if (this.state.id === undefined) {
        joukkue.id = this.uusiId();
      } else { // Tehdään id numerostakin deep copy varmuuden vuoksi
        joukkue.id = this.state.id;
      }

      // Jäseniksi ne jäsenkentät, jotka eivät ole tyhjiä
      let joukkueJasenet = this.state.jasenet.map(jasen => jasen.trim());
      joukkueJasenet = joukkueJasenet.filter(jasen => jasen != "");
      joukkue.jasenet = joukkueJasenet;

      // Leimaustapa, nimi ja rastit
      joukkue.leimaustapa = this.state.leimaustapa;
      joukkue.nimi = this.state.nimi.trim();
      joukkue.rastit = this.state.rastit;

      // Asetetaan valittu sarja defaultiksi, jos sitä ei oltu muutettu
      // default sarjavalinta tulee hakea järjestetyistä sarjoista, koska niin ne ovat lomakkeellakin
      if (this.state.sarja == "") {
        joukkue.sarja = this.sarjatJarjestettyna()[0].id;
      } else { // Muuten valittu sarja
        joukkue.sarja = this.state.sarja;
      }
      // Päivitetään joukkue tietorakenteeseen
      this.päivitäJoukkueet(joukkue);

    }

    // Kutsutaan kun lomakkeen kenttiä muutetaan.
    lomakeHandleChange(event) {
      let kohde = event.target;
      let nimi = kohde.name;
      let value = kohde.value;
      let checked = kohde.checked;
      let id = kohde.id;
      let type = kohde.type;

      // Tehdään elementeille yksilöllisesti tilan päivitykset
      switch(nimi) {
        case "nimi":
            if (value.trim() == "") {
              kohde.setCustomValidity("Nimi pitää täyttää.");
            } else {
              kohde.setCustomValidity("");
            }
            this.setState({[nimi]: value});
            break;
        case "leimaustapa":
            // tyhjennetään mahdollisesti asetettu customValidity
            kohde.setCustomValidity("");
            // tehdään kloonit
            let uudetLeimaukset = this.state.leimaustapa.slice(0);
            let uudetValinnat = this.state.checkbox.slice(0);
            // toimenpiteet sen mukaan oliko checkbox valittuna
            if (checked) {
                uudetLeimaukset.push(parseInt(value));
                uudetValinnat.push("checkbox" + value);
            } else {
              // for silmukka on ilmeisesti nopeampi kuin indexOf menetelmä
              for (let i = 0; i < uudetLeimaukset.length; i++) {
                  if (uudetLeimaukset[i] == value) {
                     uudetLeimaukset.splice(i, 1);
                     break;
                  }
              }
              for (let i = 0; i < uudetValinnat.length; i++) {
                  if (uudetValinnat[i] == "checkbox" + value) {
                    uudetValinnat.splice(i,1);
                  }
              }
            }
            // Tallenetaan valitut leimaukset tilaan
            this.setState({[nimi]:uudetLeimaukset});
            // Tallennetaan ruksitut checkboxit tilaan
            this.setState({[type]: uudetValinnat});
            break;
        case "sarja":
            // Tallennetaan valitun sarjan radio tilaan
            let uusiRadio = {"radio": "radio" + value};
            this.setState(uusiRadio);
            // Tallennetaan sarjamerkintä järjestettyjen sarjojen mukaan, koska valuen sisältämä indeksi oli myös niiden mukaisesti
            let sarjat = this.sarjatJarjestettyna();
            this.setState({[nimi]:sarjat[value].id});
            break;
        case "jasenet":
            // Tunnistetaan jäsen id:n viimeisen numeron perusteella
            let jasenNro = parseInt(id.slice(-1));
            // Ensimmäiset kaksi jäsentä tulee täyttää
            if ( (jasenNro == 0 || jasenNro == 1) && value.trim() == "" ) {
              kohde.setCustomValidity("Vähintään ekat kaksi jäsentä tulee täyttää.");
            } else {
              kohde.setCustomValidity("");
            }
            // Tallennetaan muutettu jäsen
            let jasenet = this.state.jasenet.slice(0);
            jasenet[jasenNro] = value;
            this.setState({[nimi]: jasenet});

            // Päivitetään täytetyt jäsenkentät tilan jasenetActive taulukkoon
            let actives = this.state.jasenetActive.slice(0);
            if (value.trim() != "" && jasenNro < 4) {
              if ( (jasenNro == 0 && this.state.jasenet[1].trim() != "") || (jasenNro == 1 && this.state.jasenet[0].trim() != "") ) {
                actives[2] = true;
              } else if ( (jasenNro > 0) && (this.state.jasenet[0] != "" && this.state.jasenet[1] != "") ) {
                actives[jasenNro+1] = true;
              }
            }
            // Tallennetaan muutetut aktiiviset jäsenkentät
            this.setState({["jasenetActive"]: actives});
            break;
        default:
            console.log(nimi + " vaihtoehdolle ei löytynyt onChange käsittelyä.");
            break;
      }
    }

    render () {
      return (
        <div className="flex-container">
          <LisaaJoukkue kilpailu={this.state.kilpailu} lisäys={this.päivitäJoukkueet} lomakeHandleChange={this.lomakeHandleChange} lomakeSubmit={this.lomakeSubmit} uusiId={this.uusiId} submitValidation={this.submitValidation} sarjatJarjestettyna={this.sarjatJarjestettyna} id={this.state.id} nimi={this.state.nimi} leimaustapa={this.state.leimaustapa} rastit={this.state.rastit} jasenet={this.state.jasenet} jasenetActive={this.state.jasenetActive} sarja={this.state.sarja} radio={this.state.radio} checkbox={this.state.checkbox} />
          <ListaaJoukkueet kilpailu={this.state.kilpailu} joukkueLomakkeeseen={this.joukkueLomakkeeseen} sarjanNimi = {this.haeSarjaNimi} leimausTapaNimet={this.haeLeimausTapaNimet} />
        </div>
      );
    }

}

/**
 * Lisää joukkue lomakkeen komponentti, joka tuottaa lomakkeen. Hyödyntää App komponentin metodeja ja tilaa.
 */
class LisaaJoukkue extends React.PureComponent {
    constructor(props) {
      super(props);

      this.lomakeHandleChange = this.props.lomakeHandleChange.bind(this);
      this.lomakeSubmit = this.props.lomakeSubmit.bind(this);
      this.uusiId = this.props.uusiId.bind(this);
      this.submitValidation = this.props.submitValidation.bind(this);
      this.sarjatJarjestettyna = this.props.sarjatJarjestettyna.bind(this);
    }

    render () {
      // Järjestetään sarjat nimen mukaan ennen lisäystä
      let sarjatJarjestyksessa = this.sarjatJarjestettyna();

      return (
        <div>
          <h1>Lisää joukkue</h1>
          <form className="lomake" method="post" onSubmit={this.lomakeSubmit}>
            <fieldset>
              <legend>Joukkueen tiedot</legend>
              <div className="lomakeSisä">
                <p>
                  <label htmlFor="nimi">Nimi
                    <input id="nimi" className="oikealle inputLeveammaksi" type="text" name="nimi" value={this.props.nimi} onChange={this.lomakeHandleChange}></input>
                  </label>
                </p>
                <div className="leimaustapaDiv">
                  <label>Leimaustapa</label>
                  {this.props.kilpailu.leimaustavat.map((leimaustapa, i) => {
                    return (
                      <label key={i} className="oikealle lohkolabel" htmlFor={leimaustapa}>{leimaustapa}
                        <input id={leimaustapa} type="checkbox" name="leimaustapa" value={i} checked={this.props.checkbox.includes("checkbox" + i)} onChange={this.lomakeHandleChange}></input>
                      </label>
                    )
                  })}
                </div>
                <div className="sarjaDiv">
                <label>Sarjat</label>
                  {sarjatJarjestyksessa.map((sarja, i) => {
                    return (
                      <label key={i} className="oikealle lohkolabel" htmlFor={sarja.nimi}>{sarja.nimi}
                        <input id={sarja.nimi} type="radio" name="sarja" value={i} checked={this.props.radio === "radio" + i} onChange={this.lomakeHandleChange}></input>
                      </label>
                    )
                  })}
                </div>
              </div>
             </fieldset>
             <fieldset>
                <legend>Jäsenet</legend>
                <div className="lomakeSisä">
                {this.props.jasenetActive.map((active, i) => {
                    if (active) {
                      return (
                        <p key={i}>
                          <label htmlFor={"jasen"}>Jäsen {i + 1}
                              <input id={"jasen" + i} className="oikealle lohkolabel inputLeveammaksi" type="text" name="jasenet" value={this.props.jasenet[i]} onChange={this.lomakeHandleChange}></input>
                          </label>
                        </p>
                      )
                    }
                })}
                </div>
             </fieldset>
             <button type="submit" onClick={ (e) => {this.submitValidation(e) }}>Tallenna</button>
          </form>
        </div>
      );
    }
}

/**
 * Joukkuelistaus komponentti.
 * Kutsuu ListaJoukkue komponenttia, joka taas kutsuu ListaJoukkueJasenet kompoenttia.
 */
class ListaaJoukkueet extends React.PureComponent {
    constructor(props) {
      super(props);
      this.haeSarjanNimi = this.props.sarjanNimi.bind(this),
      this.haeLeimausTapaNimet = this.props.leimausTapaNimet.bind(this);
      this.joukkueLomakkeeseen = this.props.joukkueLomakkeeseen.bind(this)
    }

    render () {

      // Järjestetään joukkueet nimen mukaan ennen lisäystä.
      // Syväkopioidaan propsin sisältämä kilpailu ennen joukkueiden järjestämistä, jotta ei mutatoida propsia.
      let järjestetty = kopioi_kilpailu(this.props.kilpailu).joukkueet.sort(function(a,b) {
        if (a.nimi.trim().toLowerCase() < b.nimi.trim().toLowerCase()) {return -1;}
        if (a.nimi.trim().toLowerCase() > b.nimi.trim().toLowerCase()) {return 1;}
        return 0;
      });

      return (
          <div className="listausDiv">
            <h1>Joukkueet</h1>
            <ul>
              {järjestetty.map((joukkue, i) => {
                return (
                  <ListaJoukkue key={i} joukkue={joukkue} joukkueLomakkeeseen={this.joukkueLomakkeeseen} haeSarjanNimi={this.haeSarjanNimi} haeLeimausTapaNimet={this.haeLeimausTapaNimet}/>
                )
              })}
            </ul>
          </div>
      );
    }
}

/**
 * Joukkuelistauksen yksittäinen joukkue.
 * Kutsuu ListaJoukkueJasenet komponenttia.
 */
class ListaJoukkue extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <li>
        <a href="#" onClick={(e) => this.props.joukkueLomakkeeseen(this.props.joukkue)}>{this.props.joukkue.nimi}</a>
        <br />
        {this.props.haeSarjanNimi(this.props.joukkue.sarja) + " (" + this.props.haeLeimausTapaNimet(this.props.joukkue.leimaustapa) + ")"}
        <ListaJoukkueJasenet jasenet={this.props.joukkue.jasenet} />
      </li>
    );
  }

}

/**
 * Joukkuelistauksen yksittäisen joukkueen jäsenlistaus
 */
class ListaJoukkueJasenet extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ul>
        {this.props.jasenet.map((jasen, i) => {
          return (
            <li key={i}>{jasen}</li>
          )
        })}
      </ul>
    );
  }

}


ReactDOM.render(
    <App />,
  document.getElementById('root')

);
