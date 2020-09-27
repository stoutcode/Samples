	.text
	.global useimmiten
# Käyttöjärjestelmät kurssin demo 6 tehtävää varten toteutettu aliohjelma, jota voi kutsua C-kielestä.
# Esim. aliohjelmaa voitaisiin kutsua int useimmiten(FIle *fp, int eofmarket), jossa ensimmäinen
# parametri olisi tiedosto, joka luetaan ja toinen sen end-of-file merkki, eli merkki johon datan
# lukeminen loppuu.
#
# Toetutuksessa käytetään 64 bittisiä lukuja. Ohjelman käsittelemät rekisterit ovat x86-64
# arkkitehtuurin prosessoreista. Ohjelma olettaa, että annettu syöte/tiedosto sisältää vain 
# amerikkalaisia merkkejä.
#
# Pinokehyksen sommitelma:
# RBP+8		paluuosoite, jonka aliohjelmakutsu loi
# RBP+0		edellisen pinokehyksen kantaosoite
# RBP-8		ensimmäinen parametri (File* fp) RDI rekisteristä
# RBP-16	toinen parametri (int end-of-filemarker) RSI rekisteristä
# RBP-24	taulukon viimeinen merkki, taulukon koko 255 merkkiä eli sama kuin ASCII taulukon koko
# RBP-32	tauluklon toiseksi viimeinen merkki
# ...
# ...
# RBP-2064	taulukon ensimmäinen merkki, eli taulukko[0].
useimmiten:
# Alustetaan pinon kehys aliohjelman toimintaa varten
	pushq	%rbp 			;# Vanha kantaosoite pinon päälle.
	movq	%rsp, %rbp 		;# Siirretään kantaosoitin uuteen sijaintiin pinon päälle.
	subq	$2064, %rsp		;# Siirretään pinon huippusosoitinta 2064 tavua alaspäin. Ensimmäiset 8 tavua on
					;# varattu edellisen pinon kantaosoittimelle, joka juuri siirrettiin siihen
					;# ensimmäisellä käskyllä. Seuraavat 16 tavua on varattu kahdelle saadulle parametrille
					;# ja loput 2040 tavua 255 merkin taulukolle.
	movq	%rdi, -8(%rbp)		;# Ensimmäinen parametri (File* fp) talteen 8 tavua base pointerin alle.
	movq	%rsi, -16(%rbp)		;# Toinen parametri (EOF end-of-file) talteen 16 tavua base pointerin alle.


# Jotta mahdollisten ASCII merkkien määrä (255) voidaan laskea, niin alustetaan taulukon alkiot (eli 255 muistiosoitetta) arvoon 0.
	movq	$0, %rax		;# Siirretään luku 0 rekisteriin RAX, jota käytetään silmukan indeksinumeron säilytyspaikkana tässä.
taulukonNollaus:
	movq	$0, -2064(%rbp, %rax, 8);# Sijoitetaan 0 taulukkoon indeksiin 0.
	addq	$1, %rax		;# Lisätään RAX rekisterin arvoon 1.
	cmpq	$256, %rax		;# Verrataan lukua 256 RAX indeksin arvoon
	jl	taulukonNollaus		;# Jos rekisterin arvo oli pienempi kuin 256, niin jatketaan silmukkaa, koska taulukon alkioita
					;# on vielä jäljellä.

# Mallivastaus: http://users.jyu.fi/~nieminen/kj20/UnlockingTheTreasuresOfTheCore.html

# Sitten käytetään c-kielen aliohjelmaa fgetc lukemaan merkit tiedostosta tai syötteestä merkki kerrallaan ja lisätään kyseisen merkin mukaiseen
# indeksiin aina +1, kun sellainen löydetään.	
merkit:	
	movq	-8(%rbp), %rdi	;# Asetetaan parametriksi tiedosto rdi rekisteriin
	call	fgetc		;# kutsutaan fgetc, joka palauttaa striimistä seuraavan merkin, eli alussa ensimmäisen
	cmpq	%rax, -16(%rbp)	;# verrataan merkkiä end-of-file merkkiin ('-1'), joka saatiin parametrina alussa ja asetettiin pinoon
	je	suurin_alustus	;# jos merkit täsmäsivät, niin tiedosto on käyty läpi ja voidaan siirtyä seuraavaan osioon
	addq	$1, -2064(%rbp, %rax, 8) ;# jos eivät täsmänneet, niin lisätään kyseisen merkin indeksiin 1, 
	jmp	merkit 		;# jatketaan looppia jatkamalla osion alusta
	
# Alustetaan rekisterit seuraavaa osiota varten arvolla 0
suurin_alustus:
	movq	$0, %rax
	movq	$0, %rcx
	movq	$0, %rdx
	jmp	suurin		;# siirrytään seuraaavaan osioon

# Tässä käydään läpi kaikki indeksit ja katsotaan mitä merkkiä esiintyi eniten
suurin:
	cmpq	$255, %rcx	;# Verrataan rcx rekisterin arvoa "taulukon" maksimikokoon. Rcx rekisterin arvo toimii tässä indeksinumerona.
	jg	loppu		;# jos oli suurempi, kuin taulukon koko, niin kaikki indeksit on käyty läpi ja siirrytään loppu-osioon
	cmpq	-2064(%rbp, %rcx, 8), %rdx	;# verrataan indeksissä olevaa merkkiä Rdx rekisterin arvoon, jossa on tähän mennessä eniten
						;# esiintyneen merkin määrä
	jl	vaihto		;# jos Rdx rekisterin arvo oli pienempi, niin uusi useammin esiintynyt merkki on löytynyt. Siirrytään vaihto-osioon
	addq	$1, %rcx	;# jos ei ollut pienempi, niin kasvatetaan Rcx rekisterin arvoa yhdellä
	jmp	suurin		;# siirrytään loopin alkuun

# Tässä suoritetaan löytyneen eniten tähän mennessä esiintyneen merkin vaihto rekistereihin
vaihto:
	movq	-2064(%rbp, %rcx, 8), %rdx	;# Siirretään merkin esiintymismäärä Rfx rekisteriin
	movq	%rcx, %rax			;# Siirretään itse merkin ASCII arvo Rax rekisteriin
	addq	$1, %rcx			;# Sama kuin edellisessä, kasvatetaan indeksin arvoa yhdellä lisäämällä se Rcx rekisterin arvoon
	jmp	suurin				;# Jatketaan looppia

# Loppu, paluu takaisin aliohjelman kutsujaan. Tässä vaiheessa Rax reksiterissä on eniten esiintyneen merkin ASCII arvo, ja se toimii
# automaattisesti palautusrekisterinä tätä aliohjelmaa kutsuneelle ohjelmalle.
loppu:
	leaveq			;# Puretaan pinokehys. Eli osoittimet siirtyvät aliohjelmaa edeltäneille paikoille.
	ret			;# Palataan aliohjelman kutsujan koodiin.
