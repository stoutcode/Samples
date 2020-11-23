/**
 * 
 */
package demo10;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Scanner;

/**
 * Kysytään tiedoston nimi ja tulostetaan tiedostosta vain rivit, jotka alkavat " ** ";
 * @author mikar
 * @version 11 Mar 2020
 *
 */
public class TietytRivit {

    /**
     * @param args ei käytössä
     */
    @SuppressWarnings("resource")
    public static void main(String[] args) {
        
        Scanner luku = new Scanner(System.in);
        System.out.println("Minkä nimisestä tiedostosta etsitään? Esim. \"tekstiTiedosto\" ");
        String tiedosto = luku.next();
        
        Scanner sisaan;
        
        ArrayList<String> rivit = new ArrayList<String>();
        try {
            sisaan = new Scanner(new FileInputStream(new File(tiedosto + ".txt")));
            while (sisaan.hasNextLine()) {
                String rivi = sisaan.nextLine();
                if (rivi.substring(0, 2).equals("**") && rivi.charAt(2) != '*') rivit.add(rivi);
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
