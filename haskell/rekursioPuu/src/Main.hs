module Main where
import Test.QuickCheck

data BHP avain = Tyhjä
               | Yksi avain 
               | Haara avain 
                        (BHP avain)
                        (BHP avain)
                    deriving Show

-- stack repl:ssä sulut omille riveilleen komennolla:
-- :set -interactive-print=Text.Pretty.Simple.pPrint
esimerkkiPuu :: BHP Natural
esimerkkiPuu = Haara 8
                   (Haara 3
                      (Yksi 1)
                      (Haara 6
                       (Yksi 4)
                       (Yksi 7)))
                   (Haara 10
                     (Tyhjä)
                     (Haara 14
                      (Yksi 13)
                      (Tyhjä)))

-- onkoPuussa 4 esimerkkiPuu
-- True
-- onkoPuussa 0 esimerkkiPuu
-- False
onkoPuussa :: forall a. Ord a => a -> BHP a -> Bool
onkoPuussa _etsitty Tyhjä = False
onkoPuussa etsitty (Yksi avain) = case avain == etsitty of
                                    True -> True
                                    False -> False
onkoPuussa etsitty (Haara avain vasen oikea)
 = case etsitty == avain of
      True -> True
      False -> case etsitty < avain of
                True -> onkoPuussa etsitty vasen
                False -> onkoPuussa etsitty oikea

-- Hakee pienimmän arvon puusta menemällä aina vasempaan haaraan, koska siellä on pienimmät
haePienin :: forall a . BHP a -> Maybe a
haePienin Tyhjä = Nothing
haePienin (Yksi avain) = Just(avain)
haePienin (Haara _avain vasen _oikea) = haePienin vasen


-- lisää 2 esimerkkiPuu
lisää :: forall a . Ord a => a -> BHP a -> BHP a
lisää lisättävä Tyhjä = (Yksi lisättävä)
lisää lisättävä (Yksi avain) = case compare lisättävä avain of
                                  EQ -> (Haara avain (Tyhjä)(Yksi lisättävä))
                                  LT -> (Haara avain (Yksi lisättävä)(Tyhjä))
                                  GT -> (Haara avain (Tyhjä)(Yksi lisättävä))
lisää lisättävä (Haara avain vasen oikea) = case compare lisättävä avain of
                                  EQ -> Haara avain vasen (lisää lisättävä oikea)
                                  LT -> Haara avain (lisää lisättävä vasen) oikea
                                  GT -> Haara avain vasen (lisää lisättävä oikea)



-- irroitaPienin esimerkkipuu
-- (1, *esimerkkiPuu*)
irroitaPienin :: forall a . BHP a -> Maybe(a, BHP a)
irroitaPienin Tyhjä = Nothing
irroitaPienin (Yksi alkio) = Just (alkio, Tyhjä)
irroitaPienin (Haara avain vasen oikea) = case irroitaPienin vasen of
                                            Nothing -> Just(avain, oikea)
                                            Just (pieninalkio, vasenEiPienintä) -> Just(pieninalkio, (Haara avain vasenEiPienintä oikea))

-- poista 8 esimerkkiPuu
-- palauttaa esimerkkiPuun uudelleen järjestettynä
poista :: forall a . Ord a => a -> BHP a -> BHP a
poista _poistettava Tyhjä = Tyhjä
poista poistettava (Yksi avain)
  | poistettava == avain = Tyhjä
  | otherwise = (Yksi avain)
poista poistettava (Haara avain vasen oikea) = case compare poistettava avain of
                                                EQ -> case irroitaPienin oikea of
                                                        Nothing -> vasen
                                                        Just jotain -> Haara (fst jotain) vasen (snd jotain)
                                                LT -> Haara avain (poista poistettava vasen) oikea
                                                GT -> Haara avain vasen (poista poistettava oikea)
-- listaPuuksi [11,25,9,55,67,88,2,34,3]                
listaPuuksi :: forall a. Ord a => [a] -> BHP a
listaPuuksi [] = Tyhjä
listaPuuksi (x : xs) = loputPuuhun xs (Yksi x) 
  where
    loputPuuhun :: [a] -> BHP a -> BHP a
    loputPuuhun [] puu = puu
    loputPuuhun (eka : loput) puu = lisää eka (loputPuuhun loput puu)

-- Päteekö kaikille x ja xs, onkoPuussa x (listaPuuksi (x:xs))
test1 :: Int -> [Int] -> Bool
test1 eka loput = onkoPuussa eka puu
  where
    puu = listaPuuksi (eka : loput)

-- onkoPuussa x (lisää x puu) pätee kaikille x:lle ja kaikille puu:ille 
test2 :: Int -> [Int] -> Bool
test2 x lista = onkoPuussa x (lisää x puu)
  where
    puu = listaPuuksi lista

-- onkoPuussa x (poista x puu)
test3 :: Int -> [Int] -> Bool
test3 x lista = not (onkoPuussa x (poista x puu))
  where
    puu = listaPuuksi (ordNub lista)
    -- ordNub poistaa duplikaatit listasta

-- Onko kaikissa haaroissa niin, että arvo haarassa on suurempi kuin
-- vasemmassa alipuussa ja pienempi (tai yhtäsuuri) kuin oikeassa? 
-- validi esimerkkiPuu
-- True
validi :: forall a. Ord a => BHP a -> Bool
validi Tyhjä = True
validi (Yksi _a) = True
validi (Haara a (vasen) (oikea)) = (vertaileVas a vasen) && (vertaileOik a oikea)
  where
      vertaileOik :: a -> BHP a ->  Bool
      vertaileOik _arvo Tyhjä = True
      vertaileOik arvo (Yksi av) = case compare arvo av of
                                    EQ -> True
                                    GT -> False
                                    LT -> True
      vertaileOik arvo (Haara av (vas) (oik)) = case compare arvo av of
                                                    EQ -> True
                                                    GT -> False
                                                    LT -> (vertaileVas av vas) && (vertaileOik av oik)
        
      vertaileVas :: a -> BHP a -> Bool
      vertaileVas _arvo Tyhjä = True
      vertaileVas arvo (Yksi av) = case compare arvo av of
                                    EQ -> False
                                    GT -> True
                                    LT -> False
      vertaileVas arvo (Haara av (vas) (oik)) = case compare arvo av of
                                                    EQ -> False
                                                    LT -> False
                                                    GT -> (vertaileVas av vas) && (vertaileOik av oik)
-- Puun validius kokonaislukupuulla
-- testValidi1 [11,25,9,55,67,88,2,34,3]
-- True
testValidi1 :: [Int] -> Bool
testValidi1 lista = validi (listaPuuksi lista)

-- Puun validisu merkkijonopuulla
-- testValidi2 ["aaa","bbb","ccc","ddd","eee","fff","ggg","hhh","iii"]
-- True
testValidi2 :: [String] -> Bool
testValidi2 lista = validi (listaPuuksi lista)

-- Puun validius kun kokonaislukupuuhun lisätään kokonaisluku x
-- testValidi3 2 [4,3,1,7]
-- True
testValidi3 :: Int -> [Int] -> Bool
testValidi3 x lista = validi (lisää x puu)
  where
    puu = (listaPuuksi lista)

-- Puun validius kun kokonaislukupuusta poistetaan kokonaisluku x
-- testValidi4 1 [4,3,1,7]
-- True
testValidi4 :: Int -> [Int] -> Bool
testValidi4 x lista = validi (poista x puu)
  where
    puu = (listaPuuksi lista)

main :: IO ()
main = do
  putStrLn "test 1"
  quickCheck test1

  putStrLn "test 2"
  quickCheck test2

  putStrLn "test 3"
  quickCheck test3

  putStrLn "Validius testi 1"
  quickCheck testValidi1

  putStrLn "Validius testi 2"
  quickCheck testValidi2

  putStrLn "Validius testi 3"
  quickCheck (withMaxSuccess 1000 testValidi3)

  putStrLn "Validius testi 4"
  quickCheckWith stdArgs  { maxSuccess = 5000 } testValidi4