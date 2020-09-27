package demo11;

import javax.swing.*;

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Graphics;
import java.awt.Graphics2D;

/**
 * Piirretään sinin kuvaaja
 * @author mikar
 * @version 17 Mar 2020
 */


public class Piirto {
    
    
    /**
     * Piirretään sin X
     * @author mikar
     * @version 18 Mar 2020
     *
     */
    public static class SinX extends JPanel {
        
        /**
         * 
         */
        private static final long serialVersionUID = 1L;

        @Override
        public void paint(Graphics g)
        {
            
            super.paintComponent(g);
            Graphics2D g2 = (Graphics2D)g;
            
            // Piirretään koordinaatiston akselit
            g2.drawLine(0,350,900,350); // x-akseli
            g2.drawLine(450,0,450,900); // y-akseli
            
            // Asetetaan väri ja viivan paksuus sinin piirrolle, akselit tulivat defaultilla
            g2.setColor(Color.blue);
            g2.setStroke(new BasicStroke(2));
           
            // Piirretään sini
            for(double x=-450;x<=450;x=x+0.5)
            {
                double y = 50 * Math.sin(x*(3.1415926/180)); // Lasketaan y. Muutetaan x radiaaneiksi kertomalla x * pii/180 astetta
                int Y = (int)y;
                int X = (int)x;
                g2.drawLine(450+X,350-Y,450+X,350-Y); // Piirretään viivaa
            }
        }
    }

  

  /**
   * Luodaan pääohjelmassa piirto-ikkuna ja sisältö sille
   * @param args ei käytössä
   */
  public static void main(String[] args)  {
      JFrame ikkuna = new JFrame();
      ikkuna.setSize(900, 700);
      ikkuna.setTitle("Sin(x) Graph ~ RadixCode.com");
      ikkuna.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
      ikkuna.setResizable(false);
      ikkuna.getContentPane().add(new SinX());
      ikkuna.setVisible(true);
  }
}


