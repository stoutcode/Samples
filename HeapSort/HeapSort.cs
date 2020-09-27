using System;
using System.Text;
using System.Linq;
using System.Collections.Generic;

/// @author mikar
/// @version 26.3.2020
/// <summary>
/// Lajitellaan taulukko heapsort algoritmilla suuruusjärjestykseen
/// pienimmästä suurimpaan.
/// Algoritmin kertaluokka O(n log n).
/// </summary>
public class HeapSort
{
    /// <summary>
    /// Pääohjelma aliohjelmien kutsuja varten
    /// </summary>
    public static void Main()
    {
        // Luodaan luokasta olio
        HeapSort lajittelu = new HeapSort();

        // Muodostetaan taulukko satunnaisista kokonaisluvuista
        Random rnd = new Random();
        int[] t = new int[10];
        for (int i = 0; i < t.Length; i++)
        {
            t[i] = rnd.Next(1, 100);
        }
        // Tulostetaan taulukko alussa
        System.Console.WriteLine("Taulukko alussa:");
        for (int i = 0; i < t.Length; i++)
        {
            System.Console.Write(t[i] + ", ");
        }
        System.Console.WriteLine();
        System.Console.WriteLine();

        // Lajitellaan taulukko
        lajittelu.Sort(t);

        // Tulostetaan taulukko lopussa
        System.Console.WriteLine("Taulukko järjestettynä:");
        for (int i = 0; i < t.Length; i++)
        {
            System.Console.Write(t[i] + ", ");
        }
        System.Console.WriteLine();


    }

    /// <summary>
    /// Lajitellaan saatu taulukko HeapSort algoritmilla
    /// </summary>
    /// <param name="t">taulukko jota lajitellaan</param>
    private void Sort(int[] t)
    {
        int n = t.Length;

        // Tehdään taulukosta max-keko, eli suurin alkio on keon juuressa.
        // Asetetaan vanhempisolmuksi keon keskimmäinen alkio, jolloin viimeinen alkio
        // on sen lapsi. Jatkossa vanhempisolmuksi valitaan aina taulukossa vanhempisolmua
        // edeltävä alkio.
        for (int i = n / 2; i >= 0; i--)
        {
            Heapify(t, n, i);
        }

        // Taulukon suurin alkio on nyt taulukon ensimmäisenä alkiona
        for (int i = n-1; i >= 0; i--)
        {
            // Siirretään se viimeiseksi ja viimeinen ensimmäiseksi
            int temp = t[0];
            t[0] = t[i];
            t[i] = temp;

            // Koska ensimmäinen alkio muuttui, niin järjestetään taas keko niin,
            // että ensimmäisenä alkiona on jäljellä olevista järjestämättömistä alkioista suurin.
            // Viimeinen alkio ei voi enää muuttua, koska lapsien pitää olla Heapify metodissa sitä pienempiä.
            Heapify(t, i, 0);
        }
    }


    /// <summary>
    /// Oletetaan taulukon olevan keko ja verrataan valittua vanhempisolmua
    /// sen lapsiin. Vaihdetaan lapsi vanhemman paikalle, jos se on suurempi.
    /// </summary>
    /// <param name="t">käsiteltävä "keko" taulukko</param>
    /// <param name="n">keon koko</param>
    /// <param name="vanhempi">vanhempi solmu, jota verrataan lapsiinsa</param>
    private void Heapify(int[] t, int n, int vanhempi)
    {
        // "Oletetaan" että vanhempisolmu on suurin perheestä, vaikkei se ole.
        int suurin = vanhempi;
        // Vanhemman vasen lapsi
        int vasen = 2 * vanhempi;
        // Vanhemman oikea lapsi
        int oikea = 2 * vanhempi + 1;
        
        // Katsotaan onko vasen lapsi suurempi kuin vanhempi
        if (vasen < n && t[vasen] > t[suurin])
            suurin = vasen;
        // Katsotaan onko oikea lapsi suurempi kuin vanhempi
        if (oikea < n && t[oikea] > t[suurin])
            suurin = oikea;
        // Jos jompi kumpi oli suurempi, niin vaihdetaan se vanhemman tilalle
        if (suurin != vanhempi)
        {
            int temp = t[vanhempi];
            t[vanhempi] = t[suurin];
            t[suurin] = temp;
            // Koska tehtiin muutos, niin lajitellaan myös alipuut rekursiivisesti
            Heapify(t, n, suurin);
        }
    }
}
