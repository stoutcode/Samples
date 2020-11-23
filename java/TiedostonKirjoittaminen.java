/**
 * 
 */
package demo9;

import java.io.*;
import java.util.*;

/**
 * @author mikar
 * @version 4 Mar 2020
 *
 */
public class TiedostonKirjoittaminen {

    /**
     * @param args ei käytössä
     */
    @SuppressWarnings("resource")
    public static void main(String[] args) {
        
        
        Scanner sc = new Scanner(System.in);
        System.out.println("Mitä kirjoitetaan tiedoston riveille?");
        String teksti = sc.nextLine();
        System.out.println("Montako riviä kirjoitetaan?");
        int kertaa = Integer.parseInt(sc.nextLine());
        
        PrintStream ulos;
        
        try {
            ulos = new PrintStream(new FileOutputStream("TiedostonKirjoittaminen.txt"));
            for (int i = 0; i < kertaa; i++) {
                ulos.printf("%03d %s", i ,teksti + "\n");
            }
            ulos.close();
        } catch (FileNotFoundException e) {
            System.out.println(e.getMessage());
        } catch (IndexOutOfBoundsException e) {
            System.out.println(e.getMessage());
        }
        
        
        
        ArrayList<String> rivit = new ArrayList<String>();
        
        
        // Ensin luetaan ja tulostetaan tiedosto
        Scanner sisaan;
        try {
            sisaan = new Scanner(new FileInputStream(new File("TiedostonKirjoittaminen.txt")));
            while (sisaan.hasNextLine()) {
                String rivi = sisaan.nextLine();
                rivit.add(rivi);
            }
            sisaan.close();
        } catch (FileNotFoundException e) {
            System.out.println(e.getMessage());
        } catch (IndexOutOfBoundsException e) {
            System.out.println(e.getMessage());
        }
        
        
        for (int i = 0; i < rivit.size(); i++) {
            System.out.println(rivit.get(i));
        }
        
     
        
    }
 
    
}
