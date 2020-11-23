/**
 * 
 */
package demo12;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.List;

import fi.jyu.mit.ohj2.Mjonot;
import fi.jyu.mit.ohj2.Syotto;
import fi.jyu.mit.ohj2.Help;

/**
 * Pieni komentorivi simulaatio
 * @author mikar
 * @version 25 Mar 2020
 *
 */
public class Komentorivi {


    /**
     *  Suorittaa yhden komennon.
     */
    public interface KomentoRajapinta {
        /**
         * @param parametrit parametrit, joita välitetään tehtävälle
         * @return vastaus pyydettyyn asiaan
         */
        public String suorita(String parametrit);
    }


    /**
     * Lasketaan yhteen välilyönnillä erotetut numerot ja palautetaan vastaus
     * @author mikar
     * @version 25 Mar 2020
     *
     */
    public static class Ynnaa implements KomentoRajapinta {
        /**
         * @param parametrit numerot jotka lasketaan yhteen
         * @return vastaus yhteenlaskun tulos Stringinä
         */
        @Override
        public String suorita(String parametrit) {
            int summa = 0;
            StringBuilder sb = new StringBuilder(parametrit);
            while (sb.length() > 0) {
                summa += Integer.parseInt(Mjonot.erota(sb, ' '));
            }
            return "Tulos on " + Integer.toString(summa);
        }
    }
    

    /**
     * Tarkistetaan onko sana palindromi vai ei ja palautetaan vastaus.
     * @author mikar
     * @version 25 Mar 2020
     *
     */
    public static class Palindromiko implements KomentoRajapinta {
        /**
         * @param parametrit sana jota tutkitaan
         * @return vastaus oliko palindromi vai ei String lauseena
         */
        @Override
        public String suorita(String parametrit) {
            StringBuilder sb = new StringBuilder();
            for (int i = parametrit.length()-1; i >= 0; i--) {
                sb.append(parametrit.charAt(i));
            }
            if ( sb.toString().equals(parametrit) )
                return "Sana " + parametrit + " on palindromi!";
            return "Sana " + parametrit + " ei ole palindromi.";
        }
        
    }
    
    
    /**
     * Muutetaan annetun sanan kirjaimet isoiksi kirjaimiksi ja palautetaan sana.
     * @author mikar
     * @version 25 Mar 2020
     *
     */
    public static class Isoksi implements KomentoRajapinta {
        /**
         * @param parametrit sana jonka kirjaimet muutetaan
         * @return vastaus sama sana, mutta isoilla kirjaimilla
         */
        @Override
        public String suorita(String parametrit) {
            return "Sana " + parametrit + " isona on " +parametrit.toUpperCase();
        }
        
    }
    
    
    /**
     * Annetaan ohjeet ohjelman käytöstä tiedostosta
     * @author mikar
     * @version 25 Mar 2020
     *
     */
    public static class Apua implements KomentoRajapinta {
        private Help help = null;
        private ByteArrayOutputStream bos = new ByteArrayOutputStream();
        
        
        /**
         * Muodosta jossa asetetaan tiedosto josta ohjeet luetaan
         * @param tiedosto tiedosto josta ohjeet luetaan
         */
        public Apua(String tiedosto) {
            try {
                help = new Help(tiedosto);
                help.setOut(new PrintStream(bos));
                help.printTopic("Ohjeet");
            } catch (IOException e) {
                System.out.println(e.getMessage());
            }
        }
        
        @Override
        public String suorita(String parametrit) {
            return bos.toString();
        }
        
    }
    
    
    /**
     * Komennon nimi ja vastaava "funktio".
     */
    public static class Komento {
        
        private String nimi;
        private KomentoRajapinta komento;
        
        /**
         * @param nimi komennon nimi
         * @param komento komennon toteuttava olio
         */
        public Komento(String nimi, KomentoRajapinta komento) {
            this.nimi = nimi;
            this.komento = komento;
        }
        
        
        /**
         * Palauttaa komennon nimen
         * @return palauttaa komennon nimen
         */
        public String getNimi() {
            return this.nimi;
        }
        
        
        /**
         * Palauttaa komennon olion
         * @return komento oliona
         */
        public KomentoRajapinta getKomento() {
            return this.komento;
        }
        
        
    }
    

    /**
     * Lista komennoista ja metodit etsimiseksi ja suorittamiseksi.
     */
    public static class Komennot {
        private static List<Komento> komennot = new ArrayList<Komento>();
        
        /**
         * @param komento komento joka lisätään listaan
         */
        public void add(Komento komento) {
            komennot.add(komento);
        }
        
        /**
         * Suoritetaan käyttäjän antama komento käyttäjän antamilla parmetreillä.
         * Tai vaihtoehtoisesti ilmoitetaan ettei komentoa löytynyt.
         * @param syotto käyttäjän antama syöttö
         * @return vastaus syötön käskyyn tai ilmoitus ettei käskyä ole olemassa
         * 
         * @example
         * <pre name="test">
         * #import demo12.Komentorivi.*;
         * Komennot komennot = new Komennot();
         * komennot.add(new Komento("+", new Ynnaa()));
         * komennot.add(new Komento("ynnää", new Ynnaa()));
         * komennot.add(new Komento("palindromiko", new Palindromiko()));
         * komennot.add(new Komento("isoksi", new Isoksi()));
         * komennot.annaKomento(0).getKomento().suorita("1 2 3 4 5") === "Tulos on 15";
         * komennot.annaKomento(1).getKomento().suorita("1 2 3 4 5") === "Tulos on 15";
         * komennot.annaKomento(2).getKomento().suorita("saippuakauppias") === "Sana saippuakauppias on palindromi!";
         * komennot.annaKomento(2).getKomento().suorita("kauppias") === "Sana kauppias ei ole palindromi.";
         * komennot.annaKomento(3).getKomento().suorita("kana") === "Sana kana isona on KANA";
         * komennot.annaKomento(3).getKomento().suorita("aasdASD") === "Sana aasdASD isona on AASDASD";
         * 
         * komennot.tulkitse("+ 1 2 3 4 5") === "Tulos on 15";
         * komennot.tulkitse("ynnää 1 2 3 4 5") === "Tulos on 15";
         * komennot.tulkitse("palindromiko saippuakauppias") === "Sana saippuakauppias on palindromi!";
         * komennot.tulkitse("palindromiko kauppias") === "Sana kauppias ei ole palindromi.";
         * komennot.tulkitse("isoksi kana") === "Sana kana isona on KANA";
         * komennot.tulkitse("isoksi aasdASD") === "Sana aasdASD isona on AASDASD";
         * </pre>
         */
        public String tulkitse(String syotto) {
            StringBuilder sb = new StringBuilder(syotto);
            String komento = Mjonot.erota(sb, ' ');
            for (int i = 0; i < komennot.size(); i++) {
                if (komennot.get(i).getNimi().equalsIgnoreCase(komento)) {
                    return komennot.get(i).getKomento().suorita(sb.toString());
                }
            }
            return "En tunne komentoa '" + syotto + "' .";
        }
        
        
        /**
         * Palautetaan komento indeksistä i
         * @param i monesko annetaan
         * @return komento indeksistä i
         */
        public Komento annaKomento(int i) {
            return komennot.get(i);
        }
        
    }
    
    
    /**
     * Testipääohjelma
     * @param args ei käytössä
     */
    public static void main(String[] args) {
        Komennot komennot = new Komennot();
        Apua apua = new Apua("komento.txt");
        komennot.add(new Komento("?", apua));
        komennot.add(new Komento("apua", apua));
        komennot.add(new Komento("+", new Ynnaa()));
        komennot.add(new Komento("ynnää", new Ynnaa()));
        komennot.add(new Komento("isoksi", new Isoksi()));
        komennot.add(new Komento("palindromiko", new Palindromiko()));

        String s;

        while (true) {
            s = Syotto.kysy("Anna komento");
            if ("".equals(s))
                break;
            String tulos = komennot.tulkitse(s);
            System.out.println(tulos);
        }
    }
    
}
