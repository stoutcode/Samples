using System;
using System.Text;
using System.Linq;
using System.Collections.Generic;

/// @author mikar
/// @version 1.4.2020
/// <summary>
/// Esimerkki yksinkertaisesta hajautuksesta (hashing).
/// Käytetään avointa osoitteenmuodostusta ja lineaarista etsintää.
/// </summary>
public class Hajautus
{
    /// <summary>
    /// Antaa alkiolle hajautetun sijainnin taulukosta lineaarisen etsinnän hajautusfunktiolla
    /// </summary>
    /// <param name="k">alkion avaimen arvo, tässä esimerkissä alkion oma arvo</param>
    /// <param name="i">törmäysten määrä, monesko yritys on menossa sijainnin määrittämisessä</param>
    /// <param name="maara">taulukon alkoiden määrä</param>
    /// <returns>hajautettu sijainti taulukosta</returns>
    /// 
    /// <example>
    /// <pre name="test">
    ///  Hajauta(24, 0, 10) === 4;
    ///  Hajauta(54, 2, 10) === 6;
    ///  Hajauta(99, 1, 10) === 0;
    ///  Hajauta(99, 5, 20) === 4;
    /// </pre>
    /// </example>
    public static int Hajauta(int k, int i, int maara)
    {
        return (k % maara + i) % maara;
    }


    /// <summary>
    /// Lisää taulukkoon alkion avoimella osoitteenmuodostuksella
    /// </summary>
    /// <param name="taulukko">taulukko johon lisätään</param>
    /// <param name="alkio">alkio joka lisätään</param>
    /// <returns>true jos lisäys onnistui, false jos ei</returns>
    /// 
    /// <example>
    /// <pre name="test">
    ///  int[] t = new int[10];
    ///  Lisaa(t, 24) === true;
    ///  Lisaa(t, 54) === true;
    ///  Lisaa(t, 99) === true;
    ///  t[4] === 24;
    ///  t[5] === 54;
    ///  t[9] === 99;
    /// </pre>
    /// </example>
    public static bool Lisaa(int[] taulukko, int alkio)
    {
        int k = alkio; // Alkion avaimen arvo, tässä esimerkissä alkion oma arvo.
        for (int i = 0; i < taulukko.Length; i++)
        {
            // Määritetään alkiolle paikka hajauttamalla
            int paikka = Hajauta(k, i, taulukko.Length);
            // Katsotaan että paikka on tyhjä (0 = vapaa, -1 = poistettu)
            if (taulukko[paikka] == 0 || taulukko[paikka] == -1)
            {
                taulukko[paikka] = alkio;
                return true;
            }
        }
        return false;
    }


    /// <summary>
    /// Etsii taulukosta alkion
    /// </summary>
    /// <param name="taulukko">taulukko josta etsitään</param>
    /// <param name="alkio">alkio jota etsitään</param>
    /// <returns>alkion indeksi taulukossa tai -1 jos ei löytynyt</returns>
    /// 
    /// <example>
    /// <pre name="test">
    ///  int[] t = new int[10];
    ///  Lisaa(t, 24) === true;
    ///  Lisaa(t, 54) === true;
    ///  Lisaa(t, 99) === true;
    ///  Etsi(t, 24) === 4;
    ///  Etsi(t, 54) === 5;
    ///  Etsi(t, 99) === 9;
    /// </pre>
    /// </example>
    public static int Etsi(int[] taulukko, int alkio)
    {
        int k = alkio;
        for (int i = 0; i < taulukko.Length; i++)
        {
            // Alkion potentiaalinen sijanti
            int paikka = Hajauta(k, i, taulukko.Length);
            // Jos sijainti on tyhjä niin etsiminen voi päättyä. Alkiota ei ollut taulukossa.
            if (taulukko[paikka] == 0)
                break;
            // Jos sijainti on -1, niin kohdasta on poistettu alkio. Jatketaan etsimistä.
            if (taulukko[paikka] == -1)
                continue;
            // Jos paikka löytyi, niin palautetaan sen indeksi
            if (taulukko[paikka] == k)
                return paikka;
        }
        return -1;
    }


    /// <summary>
    /// Poistaa taulukosta alkion
    /// </summary>
    /// <param name="taulukko">taulukko josta poistetaan</param>
    /// <param name="alkio">alkio joka poistetaan</param>
    /// <returns>true jos onnistui, false jos ei</returns>
    /// 
    /// <example>
    /// <pre name="test">
    ///  int[] t = new int[10];
    ///  Lisaa(t, 24) === true;
    ///  Lisaa(t, 54) === true;
    ///  Lisaa(t, 99) === true;
    ///  Poista(t, 24) === true;
    ///  Poista(t, 54) === true;
    ///  Poista(t, 99) === true;
    /// </pre>
    /// </example>
    public static bool Poista(int[] taulukko, int alkio)
    {
        // Alkion potentiaalinen paikka
        int paikka = Etsi(taulukko, alkio);
        if (paikka < 0)
            return false; // alkiota ei ollut taulukossa
        taulukko[paikka] = -1; // Asetetaan -1 merkiksi poistamisesta
        return true;
    }


    /// <summary>
    /// Testipääohjelma
    /// </summary>
    public static void Main()
    {
        // Taulukon kokoa voi vapaasti vaihtaa, kunhan se on vähintään lisättäviä lukuja vastaava määrä. Jos se on suurempi, niin jää tyhjiä paikkoja.
        int[] taulukko = new int[10];
        System.Console.WriteLine("Taulukko alussa (0 = vapaa paikka): {" + String.Join(",", taulukko) + "} \n");
        // Luodaan satunnaisia lukuja lisättäväksi taulukkoon. Luvut voivat olla positiivisia kokonaislukuja.
        Random rnd = new Random();
        int[] luvut = new int[10];
        for (int i = 0; i < 10; i++)
        {
            luvut[i] = rnd.Next(11, 99);
        }
        System.Console.WriteLine("Lisätään taulukkoon luvut " + String.Join(" ", luvut) );
        int virheita = 0;
        for (int i = 0; i < luvut.Length; i++)
        {
            int numero = luvut[i];
            if ( !Lisaa(taulukko, numero) ) virheita++;
        }
        System.Console.WriteLine("Taulukko lisäyksen jälkeen: {" + String.Join(", ", taulukko) + "}" + "\n");
        System.Console.WriteLine("Poistetaan taulukosta " + luvut[0] + " ja " + luvut[6]);
        if( !Poista(taulukko, luvut[0]) ) 
            virheita++;
        if( !Poista(taulukko, luvut[6]) )
            virheita++;
        System.Console.WriteLine("Taulukko poiston jälkeen (-1 = poistettu): {" + String.Join(", ", taulukko) + "}" + "\n");
        System.Console.WriteLine("Virheitä: " + virheita + " kpl \n");
    }


}
