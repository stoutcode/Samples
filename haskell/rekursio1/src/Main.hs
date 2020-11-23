module Main where

-- Mietintäkaavio
-- esimerkki    = {- Tähän joku lista, vaikkapa [1,3,2,6,5,4] -}
-- haluttuTulos = {- Mitä pitäisi listalla tulla tulokseksi? -}
-- funktionTulosLopuille = {- Mikä olisi tulos esimerkille ilman ekaa alkiota? -}
-- funktionTulosTyhjälle = {- Mitä tyhjän lista tuottaa?-}
-- eka          = {- Esimerkin eka alkio -}
-- 
-- Miten eka ja funktionTulosLopuille yhdistetään halutuksi tulokseksi?

-- Laskee listan summan rekursiivisesti
-- summaRek [1,2,3,5]
-- 11
summaRek :: [Natural] -> Natural
summaRek [] = 0
summaRek (eka : loput)
    = eka + summaRek loput


-- Tehdään funktio partition :: forall a. (a -> Bool) -> [a] -> ([a,a]), joka jakaa syötelistan ehdon mukaan kahdeksi:
-- 
-- TIEA341> partition even [1,2,4,6,3,2,1]
-- ([1,3,1],[2,4,6,2])
-- 
-- TIEA341> partition isUpper "Kissa Istuu Aidalla"
-- ("KIA","issa stuu idalla")


-- esimerkki    = {- [1,3,2,6,5,4] -}
-- eka          = {- [1] -}
-- esimerkinLoput = {- [3,2,6,5,4] -}
-- 
-- partition even esimerkki = {- [1,3,5],[2,6,4] -}
-- partition even esimerkinLoput = {- [3,5],[2,6,4] -}
-- partition even ([]) = {- ([]) -}

partition :: forall a. (a -> Bool) -> [a] -> ([a], [a])
partition _f [] =  ([],[])
partition f (eka : loput) =  
  let
    partitionLopuille = partition f loput
    vasen = fst partitionLopuille
    oikea = snd partitionLopuille
  in case f eka of
       True -> (eka : vasen, oikea)
       False -> (vasen, eka : oikea)

-- partition even [1,2,3,4]
-- 1 [2,3,4] -> False -> ([2,4],[1,3])
-- 2 [3,4] -> True -> ([2,4],[3])
-- 3 [4] -> False -> ([4],[3])
-- 4 -> True -> ([4],[])


-- esimerkki1 = [3,4,3,5,6,1]
-- loput = [4,3,5,6,1]
-- eka = 3
-- maksimiLopuista = Just 6
-- maksimi esimerkki1 = Just 6

-- esimerkki2 = [6,3,4,3,5,1]
-- loput = [3,4,3,5,1]
-- eka = 6
-- maksimiLopuista = Just 5
-- maksimi esimerkki2 = Just 6

maksimi :: forall a. Ord a => [a] -> Maybe a
maksimi [] = Nothing
maksimi (eka:loput)
  = let
      maksimiLopuista :: Maybe a
      maksimiLopuista = maksimi loput

      teeLopullinenTulos :: a -> Maybe a -> Maybe a
      teeLopullinenTulos seEka seMaksimiLopuista 
        = case seMaksimiLopuista of
            Nothing -> Just seEka
            Just loppujenMaks
                | seEka > loppujenMaks -> Just seEka
                | otherwise            -> Just loppujenMaks
                                      
    in teeLopullinenTulos eka maksimiLopuista

-- Hieman lyhyempänä
maksimi2 :: forall a. Ord a => [a] -> Maybe a
maksimi2 [] = Nothing
maksimi2 (x : xs) = case maksimi2 xs of
                       Nothing -> Just x
                       Just y
                          | x > y -> Just x
                          | otherwise -> Just y

-- Vielä lyhyempänä
maksimi3 :: forall a. Ord a => [a] -> Maybe a
maksimi3 [] = Nothing
maksimi3 (x : xs)
      | Just x > m = Just x
      | otherwise = m
  where
    m = maksimi3 xs


minimi :: forall a. Ord a => [a] -> Maybe a
minimi [] = Nothing
minimi (x : xs) = let
                    minimiLoput = minimi xs
                    loppuTulos ensimmäinen loppujenMin
                     = case loppujenMin of
                          Nothing -> Just ensimmäinen
                          Just ok
                           | ensimmäinen < ok -> Just ensimmäinen
                           | otherwise -> Just ok
                  in loppuTulos x minimiLoput

minimi2 :: forall a. Ord a => [a] -> Maybe a
minimi2 [] = Nothing
minimi2 (x : xs) = case minimi2 xs of
                    Nothing -> Just x
                    Just ok
                      | x < ok -> Just x
                      | otherwise -> Just ok


-- Tee eka
-- esimerkki1 4 [2,5,1,4]
-- (x : xs)
-- x = 2 -> False
-- x = 5 -> False
-- x = 1 -> False
-- x = 4 -> True
onListassa :: forall a. Eq a => a -> [a] -> Bool
onListassa _etsittävä [] = False
onListassa etsittävä (x : xs)
        | x == etsittävä = True
        | otherwise = onListassa etsittävä xs

-- laskeLkm (\x -> x > 1) [3,4,1,1,1]
-- 2
-- eli:
-- eka = 3 -> 0
-- eka = 0 -> 0
-- eka = 1 -> 1
-- eka = 1 -> 2
-- eka = 1 -> 3
laskeLkm :: forall a. (a -> Bool) -> [a] -> Natural
laskeLkm ehto lista = laskeVälitulos 0 ehto lista
  where
    laskeVälitulos :: Natural -> (a -> Bool) -> [a] -> Natural
    laskeVälitulos tulos _seEhto [] = tulos
    laskeVälitulos tulos seEhto (x : xs) = case seEhto x of
                                            True -> laskeVälitulos (tulos + 1) seEhto xs
                                            _otherwise -> laskeVälitulos tulos seEhto xs

-- maksimiAcc [1,2,3,4,5]
-- Just 5
-- maksimiAcc []
-- Nothing
maksimiAcc :: forall a. Ord a => [a] -> Maybe a
maksimiAcc lista = maksimiApu Nothing lista
  where
    maksimiApu :: Maybe a -> [a] -> Maybe a
    maksimiApu välitulos [] = välitulos
    maksimiApu välitulos (x : xs) = maksimiApu (päivitäTulos välitulos x) xs

    päivitäTulos :: Maybe a -> a -> Maybe a
    päivitäTulos välitulos x = case välitulos of
                                 Nothing -> Just x
                                 Just ok
                                    | x > ok -> Just x
                                    | otherwise -> Just ok

-- sama lyhyempänä
maksimiAcc2 :: forall a. Ord a => [a] -> Maybe a
maksimiAcc2 lista = maksimiApu Nothing lista
  where
    maksimiApu :: Maybe a -> [a] -> Maybe a
    maksimiApu välitulos [] = välitulos
    maksimiApu välitulos (x : xs) = maksimiApu (case välitulos of
                                                  Nothing -> Just x
                                                  Just ok
                                                    | x > ok -> Just x
                                                    | otherwise -> Just ok) xs

-- välitulos	syöte
-- (1,1)	[2,3,4,5]
-- (3,2)	[3,4,5]
-- (6,3)	[4,5]
-- (10,4)	[5]
-- (15,5)	[]
keskiarvo :: [Double] -> Maybe Double
keskiarvo lista = let
                    tulos = Just(keskiarvoApu (0,0) lista)
                  in case tulos of
                    Just 0.0 -> Nothing
                    _otherwise -> tulos
 where
  keskiarvoApu :: (Double,Double) -> [Double] -> Double
  keskiarvoApu välitulos [] = case snd välitulos of
                                 0 -> 0
                                 _otherwise -> (fst välitulos / snd välitulos)
  keskiarvoApu välitulos (x : xs) = keskiarvoApu ((fst välitulos + x),(snd välitulos + 1)) xs



main :: IO ()
main = do
  putStrLn "Hello TIEA341"
