using System;
using System.Text;
using System.Linq;
using System.Collections.Generic;

/// @author mikar
/// @version 19.4.2020
/// <summary>
///  Ohjelma demonstroi union-find joukko-operaatioiden toteuttamista taulukossa sijaitseville puille.
/// </summary>
public class UnionFind
{

    /// <summary>
    /// Luokka Solmuolioille
    /// </summary>
    public class Solmu
    {
        private int linkki;
        private string merkkijono;

        /// <summary>
        /// Solmun muodostaja
        /// </summary>
        /// <param name="linkki">solmun vanhempi tai juurisolmulla puun koko</param>
        /// <param name="merkkijono">solmun sisältö, joka tässä tapauksessa merkkijono</param>
        public Solmu(int linkki, string merkkijono)
        {
            this.linkki = linkki;
            this.merkkijono = merkkijono;
        }

        /// <summary>
        /// Palauttaa solmun linkin
        /// </summary>
        /// <returns>solmun linkki</returns>
        public int getLinkki()
        {
            return this.linkki;
        }


        /// <summary>
        /// Palauttaa solmun sisällön
        /// </summary>
        /// <returns>solmun sisältö, merkkijono</returns>
        public string getMerkkijono()
        {
            return this.merkkijono;
        }


        /// <summary>
        /// Asettaa solmun linkin
        /// </summary>
        /// <param name="linkki">asetettava linkki</param>
        public void setLinkki(int linkki)
        {
            this.linkki = linkki;
        }


        /// <summary>
        /// Asettaa solmun sisällön, merkkijonon
        /// </summary>
        /// <param name="merkkijono">Solmun sisällöksi asetettava merkkijono</param>
        public void setMerkkijono(string merkkijono)
        {
            this.merkkijono = merkkijono;
        }


        public string toString()
        {
            if (this.linkki >=0)
                return this.linkki+1 + ", " + this.merkkijono;
            return this.linkki + ", " + this.merkkijono;
        }
    }

    /// <summary>
    /// Yhdistää kaksi puuta niin, että pienemmänstä tulee isomman puun juurisolmun lapsi.
    /// </summary>
    /// <param name="taulukko">Taulukko joka sisältää puut</param>
    /// <param name="a">Ensimmäisen puun juurisolmu</param>
    /// <param name="b">Toisen puun juurisolmu</param>
    public static void Union(Solmu[] taulukko, int a, int b)
    {
        // Lasketaan yhteen puiden sisältämät solmut
        int k;
        k = taulukko[a].getLinkki() + taulukko[b].getLinkki();
        // Asetetaan suurempi puu vanhemmaksi ja pienempi puu vanhemman juurisolmun lapseksi
        if ( taulukko[a].getLinkki() <= taulukko[b].getLinkki() )
        {
            taulukko[a].setLinkki(k);
            taulukko[b].setLinkki(a);
        }
        else
        {
            taulukko[b].setLinkki(k);
            taulukko[a].setLinkki(b);
        }
    }


    /// <summary>
    /// Tiivistää hakupolun asettamalla jokaisen hakupolun solmun puun juurisolmun lapseksi
    /// </summary>
    /// <param name="x">haettava solmu</param>
    /// <param name="taulukko">käsiteltävä taulukko</param>
    /// <returns>juurisolmun linkkiarvo</returns>
    public static int Find(Solmu[] taulukko, int x)
    {
        int j, k;
        // Etsitään juurisolmu
        j = x;
        while ( taulukko[j].getLinkki() > -1 )
        {
            j = taulukko[j].getLinkki();
        }
        // tiivistetään hakupolku
        while ( taulukko[x].getLinkki() > -1 )
        {
            k = x;
            x = taulukko[x].getLinkki();
            taulukko[k].setLinkki(j);
        }
        return j;
    }


    /// <summary>
    /// Tulostaa taulukon demonstroiden union find tyyliä.
    /// </summary>
    /// <param name="taulukko">taulukko jonka sisältö tulostetaan</param>
    public static void Tulosta(Solmu[] taulukko)
    {
        System.Console.WriteLine("(indeksi, linkki, sisältö)");
        for (int i = 0; i < taulukko.Length; i++)
        {
            System.Console.WriteLine(i + 1 + ", " + taulukko[i].toString());
        }
        System.Console.WriteLine();
    }


    /// <summary>
    /// Testit aliohjelmille
    /// </summary>
    /// <returns>true jos menivät läpi ja false jos eivät</returns>
    public static bool Testit()
    {
        bool tulos = true;
        Solmu[] taulukko = new Solmu[5];
        Solmu kiuru = new Solmu(-1, "kiuru");
        Solmu lokki = new Solmu(-1, "lokki");
        Solmu rastas = new Solmu(-1, "rastas");
        Solmu sorsa = new Solmu(-1, "sorsa");
        Solmu varis = new Solmu(-1, "varis"); 
        taulukko[0] = kiuru;
        taulukko[1] = lokki;
        taulukko[2] = rastas;
        taulukko[3] = sorsa;
        taulukko[4] = varis;
        Union(taulukko, 0, 1);
        if (taulukko[1].getLinkki() != 0)
            tulos = false;
        if (taulukko[0].getLinkki() != -2)
            tulos = false;
        Union(taulukko, 0, 2);
        if (taulukko[2].getLinkki() != 0)
            tulos = false;
        if (taulukko[0].getLinkki() != -3)
            tulos = false;
        Union(taulukko, 3, 4);
        Union(taulukko, Find(taulukko, 4), Find(taulukko, 2));
        if (taulukko[0].getLinkki() != -5)
            tulos = false;
        if (taulukko[4].getLinkki() != 3)
            tulos = false;
        if (taulukko[3].getLinkki() != 0)
            tulos = false;
        return tulos;
    }


    /// <summary>
    /// Testipääohjelma
    /// </summary>
    public static void Main()
    {
        if (Testit())
        {
            System.Console.WriteLine("Testit läpi.");
            System.Console.WriteLine();
        }
        else
        {
            System.Console.WriteLine("Testeissä löytyi virhe. Ei muuta kuin debuggaamaan.");
            System.Console.WriteLine();
        }

        Solmu[] taulukko = new Solmu[5];
        Solmu kiuru = new Solmu(-1, "kiuru");
        Solmu lokki = new Solmu(-1, "lokki");
        Solmu rastas = new Solmu(-1, "rastas");
        Solmu sorsa = new Solmu(-1, "sorsa");
        Solmu varis= new Solmu(-1, "varis");
        taulukko[0] = kiuru;
        taulukko[1] = lokki;
        taulukko[2] = rastas;
        taulukko[3] = sorsa;
        taulukko[4] = varis;

        System.Console.WriteLine("Solmut alussa:");
        Tulosta(taulukko);
        
        System.Console.WriteLine("Yhdistetään solmut 1 ja 4");
        Union(taulukko, 0, 3);
        Tulosta(taulukko);
        
        System.Console.WriteLine("Yhdistetään solmut 2 ja 5 ");
        Union(taulukko, 1, 4);
        Tulosta(taulukko);
        
        System.Console.WriteLine("Lisätään vielä solmu 3 tuohon äskeiseen puuhun.");
        Union(taulukko, Find(taulukko, 1), 2);
        Tulosta(taulukko);
        
        System.Console.WriteLine("Yhdistetään lopulta vielä molemmat puut yhdeksi puuksi");
        Union(taulukko, Find(taulukko, 0), Find(taulukko, 1));
        Tulosta(taulukko);
    }


}
