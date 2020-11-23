module Main where
import Test.QuickCheck
import Data.Char
-- import Prelude hiding (map)


-- foldr toteutus
foldrx :: forall t1 t2. (t1 -> t2 -> t2) -> t2 -> [t1] -> t2
foldrx _laitaYhteen tyhja []
  = tyhja
foldrx laitaYhteen tyhja (eka : loput)  
  = let
     loputMäpätty = foldr laitaYhteen tyhja loput
    in laitaYhteen eka loputMäpätty

-- foldl toteutus
foldlx :: forall p t. p -> (t -> t -> t) -> (t -> p) -> [t] -> p
foldlx tyhjaTulos _f _justiinsa  [] = tyhjaTulos
foldlx _tyhjaTulos f justiinsa (eka : loput) = justiinsa (laskuApu eka loput)
 where
    -- foldlx :: a -> [a] -> a
    laskuApu laskuNyt [] 
        = laskuNyt
    laskuApu !laskuNyt (eka1 : loput1) 
        = laskuApu (f eka1 laskuNyt) loput1

-- foldl´ toteutus
foldlPilkku :: forall t1 t2. (t1 -> t2 -> t1) -> t1 -> [t2] -> t1
foldlPilkku päivitäVälitulos tyhjä lista = apu tyhjä lista
  where
    apu välitulos [] = välitulos
    apu !välitulos (eka : loput)
      = apu (päivitäVälitulos välitulos eka) loput

-------------------------------------------------------------------------------------
-- fold muotoon muutettuja funktioita

alkupMap :: forall a b . (a -> b) -> [a] -> [b]
alkupMap f lista = foldrx (\eka loputMäpätty -> f eka : loputMäpätty) [] lista

summa1 :: forall a . Num a => [a] -> a
summa1 = foldrx (\eka loppujenSumma -> eka + loppujenSumma) 0

summa2 :: forall a . Num a => [a] -> a
summa2 = foldlx 0 (\x välitulos -> x + välitulos) (\x -> x)

-- summa3 [1..100]
-- 5050
summa3 :: forall a. Num a => [a] -> a
summa3 = foldlPilkku (\alkio välitulosSumma -> alkio + välitulosSumma) 0

maksimi :: forall a. Ord a => [a] -> Maybe a
maksimi = foldlx Nothing max Just

maksimiAAlkuperainen :: forall a. Ord a => [a] -> Maybe a
maksimiAAlkuperainen = foldlPilkku päivitäMax Nothing
  where
     päivitäMax välitulos eka 
        = case välitulos of
            Nothing -> Just eka
            Just !väli -> Just (max eka väli)  

minimi :: forall a . Ord a => [a] -> Maybe a
minimi = foldlx Nothing min Just
----------------------------------------------------------------------------------

arvoväli :: forall a . (Ord a, Num a) => [a] -> a
arvoväli lista = lopuksi (foldlPilkku f (Nothing, Nothing) lista)
  where
    lopuksi :: (Maybe a, Maybe a) -> a
    lopuksi ehkäRajat = case ehkäRajat of
                          (Just pienin, Just suurin) -> suurin - pienin
                          _ -> 0
    f :: (Maybe a, Maybe a) -> a -> (Maybe a, Maybe a)
    f (ehkäPienin, ehkäSuurin) alkio
      = ( case ehkäPienin of 
            Nothing -> Just alkio
            Just pienin -> Just (min pienin alkio)
        ,
          case ehkäSuurin of
            Nothing -> Just alkio
            Just suurin -> Just (max suurin alkio)
        )

-----------------------------------------------------------------------------------

-- yksikäänEiFalse [True,True,True,True]
-- True
yksikäänEiFalse :: [Bool] -> Bool
yksikäänEiFalse = foldrx (\eka loput -> eka && loput) True

-- edellisen funktion testi
testi_yksikään :: [Bool] -> Bool
testi_yksikään syöte
  = let
      tulos = yksikäänEiFalse syöte
    in if tulos
        then notElem False syöte
        else elem False syöte

-- onListassa 1 [3,5,2,5,1,2]
-- True
onListassa :: forall a. Eq a => a -> [a] -> Bool
onListassa etsittävä = foldrx (\x löytyyLopuista -> etsittävä == x || löytyyLopuista) False

-- edellisen funktion testi
testi_onListassa :: Int -> [Int] -> Bool
testi_onListassa mikä lista
  = let
      tulos = onListassa mikä lista
    in tulos == or (map (\x -> x == mikä) lista)

-- etsii listasta alkion ja palauttaa sen Maybe alkiona
etsi :: forall a. (a -> Bool) -> [a] -> Maybe a
etsi haku = foldrx f Nothing
  where
    f :: a -> Maybe a -> Maybe a
    f eka lopuistaEhkä
        | haku eka = Just eka
        | otherwise = lopuistaEhkä

-----------------------------------------------------------------------------------

data EkaVaiToka = Eka | Toka

-- partition (\x -> if even x then Eka else Toka) [1..100]
partition :: forall a . (a -> EkaVaiToka) -> [a] -> ([a],[a])
partition kumpaan = foldr f ([],[])
  where
    f :: a -> ([a],[a]) -> ([a],[a])
    f eka loppujenPartition
      = case kumpaan eka of
            Eka -> (eka : fst loppujenPartition, snd loppujenPartition)
            Toka -> (fst loppujenPartition, eka : snd loppujenPartition)

-- Muuttaa joka toisen merkin isoksi ja joka toisen pieneksi.
-- Bool on mukana välituloksessa kertomassa mitä edelliselle tehtiin. False -> pieneksi kirjaimeksi, True -> isoksi kirjaimeksi
-- Pakko olla foldr, kun pitäisi toimia päättymättömälle merkkilistalle.
--
-- sekaisin "kissa istuu aidalla"
-- (True,"KiSsA IsTuU AiDaLlA")
sekaisin :: [Char] -> (Bool,[Char])
sekaisin = foldr f (False, [])
  where
    f :: Char -> (Bool, [Char]) -> (Bool, [Char])
    f eka (olikoIso, loputSekaisin)
       | olikoIso = (False, toLower eka : loputSekaisin)
       | otherwise = (True, toUpper eka : loputSekaisin)

-- poistaViimeinen 3 [1,3,1,4,3,4]
-- [1,3,1,4,4]
poistaViimeinen :: forall a. Eq a => a -> [a] -> (Bool, [a])
poistaViimeinen esiintymä = foldr f (False, [])
  where
    f :: a -> (Bool, [a]) -> (Bool, [a])
    f eka (onkoJoPoistettu, loputJoistaEhkäPoistettu)
      = case onkoJoPoistettu of
            True -> (True, eka : loputJoistaEhkäPoistettu)
            False -> case eka == esiintymä of
                            True -> (True, loputJoistaEhkäPoistettu)
                            False -> (False, eka : loputJoistaEhkäPoistettu)

-----------------------------------------------------------------------------------

-- onko tullut vielä vastaan vai ei
data OnkoNähty = OnNähtyN | EiOllaNähtyN deriving Eq

-- kaikkialla missä lukee 'Tulos a', lukee nyt 'OnkoNähty -> [a]'
type Tulos a = OnkoNähty -> [a]

nollaaJälkeen :: forall a. (Eq a, Num a) => a -> [a] -> [a]
nollaaJälkeen n lista = nollaaJälkeen_ n lista EiOllaNähtyN

-- nollaaJälkeen 2 [1,2,3,4,5,6]
-- [1,2,0,0,0,0]
-- f 1 (foldr f tyhjä [2,3,4,5,6])
-- f 1 (\nähty -> 
--        case nähty of
--            OnNähtyN -> 0 : (nollaaJälkeen_ 2 [3,4,5,6] OnNähtyN)
--            EiOllaNähtyN -> listanEka : (nollaaJälkeen_ 2 [3,4,5,6] EiOllaNähtyN))
nollaaJälkeen_ :: forall a. (Eq a, Num a) => a -> [a] -> (OnkoNähty -> [a])
nollaaJälkeen_ n lista = foldrx f tyhjä lista
  where
    tyhjä _ = []
    f :: a -> Tulos a -> Tulos a
    f listanEka tulosLopuille EiOllaNähtyN
      | listanEka == n = listanEka : tulosLopuille OnNähtyN
      | otherwise = listanEka : tulosLopuille EiOllaNähtyN
    f _listanEka tulosLopuille OnNähtyN
          = 0 : tulosLopuille OnNähtyN


-- ota 3 [1..]
-- [1,2,3]
ota :: forall a. Natural -> [a] -> [a]
ota n lista = (foldrx f tyhjä lista) n
          --    Natural -> [a]
  where
    tyhjä :: Natural -> [a]
    tyhjä _n = []
    f :: a -> (Natural -> [a]) -> (Natural -> [a])
   --    |           |              |          a on lopun case lause
    f listaEka tulosLopulle = (\kuinkaMontaVielä -> 
                                  case kuinkaMontaVielä of
                                      0 -> []
                                      kpl -> listaEka : tulosLopulle (kpl - 1)     
                              )


main :: IO ()
main = do
  putStrLn "Hello TIEA341"

  putStrLn "Yksikään ei false testi"
  quickCheck testi_yksikään

  putStrLn "On listassa testi"
  quickCheck testi_onListassa
