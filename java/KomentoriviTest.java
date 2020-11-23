package demo12.test;
// Generated by ComTest BEGIN
import demo12.Komentorivi.*;
import static org.junit.Assert.*;
import org.junit.*;
import demo12.*;
// Generated by ComTest END

/**
 * Test class made by ComTest
 * @version 2020.03.25 13:07:59 // Generated by ComTest
 *
 */
@SuppressWarnings({ "all" })
public class KomentoriviTest {



  // Generated by ComTest BEGIN
  /** testTulkitse159 */
  @Test
  public void testTulkitse159() {    // Komentorivi: 159
    Komennot komennot = new Komennot(); 
    komennot.add(new Komento("+", new Ynnaa())); 
    komennot.add(new Komento("ynnää", new Ynnaa())); 
    komennot.add(new Komento("palindromiko", new Palindromiko())); 
    komennot.add(new Komento("isoksi", new Isoksi())); 
    assertEquals("From: Komentorivi line: 166", "Tulos on 15", komennot.annaKomento(0).getKomento().suorita("1 2 3 4 5")); 
    assertEquals("From: Komentorivi line: 167", "Tulos on 15", komennot.annaKomento(1).getKomento().suorita("1 2 3 4 5")); 
    assertEquals("From: Komentorivi line: 168", "Sana saippuakauppias on palindromi!", komennot.annaKomento(2).getKomento().suorita("saippuakauppias")); 
    assertEquals("From: Komentorivi line: 169", "Sana kauppias ei ole palindromi.", komennot.annaKomento(2).getKomento().suorita("kauppias")); 
    assertEquals("From: Komentorivi line: 170", "Sana kana isona on KANA", komennot.annaKomento(3).getKomento().suorita("kana")); 
    assertEquals("From: Komentorivi line: 171", "Sana aasdASD isona on AASDASD", komennot.annaKomento(3).getKomento().suorita("aasdASD")); 
    assertEquals("From: Komentorivi line: 173", "Tulos on 15", komennot.tulkitse("+ 1 2 3 4 5")); 
    assertEquals("From: Komentorivi line: 174", "Tulos on 15", komennot.tulkitse("ynnää 1 2 3 4 5")); 
    assertEquals("From: Komentorivi line: 175", "Sana saippuakauppias on palindromi!", komennot.tulkitse("palindromiko saippuakauppias")); 
    assertEquals("From: Komentorivi line: 176", "Sana kauppias ei ole palindromi.", komennot.tulkitse("palindromiko kauppias")); 
    assertEquals("From: Komentorivi line: 177", "Sana kana isona on KANA", komennot.tulkitse("isoksi kana")); 
    assertEquals("From: Komentorivi line: 178", "Sana aasdASD isona on AASDASD", komennot.tulkitse("isoksi aasdASD")); 
  } // Generated by ComTest END
}