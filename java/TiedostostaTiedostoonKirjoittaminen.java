/**
 * 
 */
package demo9;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.PrintStream;
import java.util.Scanner;

/**
 * @author mikar
 * @version 4 Mar 2020
 *
 */
public class TiedostostaTiedostoonKirjoittaminen {

    /**
     * Luetaan tiedostosta ja kirjoitetaan toiseen tiedostoon, mikäli
     * luetun rivin alussa on luku, joka on suurempi kuin 30.
     * 
     * @param args ei käytössä
     * 
     * Testeiksi pitäisi kirjoittaa jotenkin, että olisi tiedosto josta luettaisiin ja
     * lukeminen menisi oikein ja tallentaminen toiseen tiedostoon menisi myös oikein.
     * Tai että tiedostoja imitoisi jokin muu virtuaalinen asia.
     */
    @SuppressWarnings("resource")
    public static void main(String[] args) {
        
        // Ensin luetaan ja tulostetaan tiedosto
        Scanner sisaan;
        PrintStream ulos;
        try {
            sisaan = new Scanner(new FileInputStream(new File("hiljaahiipii.txt")));
            ulos = new PrintStream(new FileOutputStream("hiljaatulos.txt"));
            while (sisaan.hasNextLine()) {
                String rivi = sisaan.nextLine();
                try {
                    int luku = Integer.parseInt(rivi.substring(0,2));
                    if (luku > 30) ulos.printf(rivi + "\n");;
                } catch (NumberFormatException e) {
                    continue;
                } 
            }
            sisaan.close();
        } catch (FileNotFoundException e) {
            System.out.println(e.getMessage());
        } catch (IndexOutOfBoundsException e) {
            System.out.println(e.getMessage());
        }
    
    
    }

}
