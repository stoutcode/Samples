{-# LANGUAGE CPP #-}
{-# LANGUAGE NoRebindableSyntax #-}
{-# OPTIONS_GHC -fno-warn-missing-import-lists #-}
module Paths_rekursioPuu (
    version,
    getBinDir, getLibDir, getDynLibDir, getDataDir, getLibexecDir,
    getDataFileName, getSysconfDir
  ) where

import qualified Control.Exception as Exception
import Data.Version (Version(..))
import System.Environment (getEnv)
import Prelude

#if defined(VERSION_base)

#if MIN_VERSION_base(4,0,0)
catchIO :: IO a -> (Exception.IOException -> IO a) -> IO a
#else
catchIO :: IO a -> (Exception.Exception -> IO a) -> IO a
#endif

#else
catchIO :: IO a -> (Exception.IOException -> IO a) -> IO a
#endif
catchIO = Exception.catch

version :: Version
version = Version [0,1,0,0] []
bindir, libdir, dynlibdir, datadir, libexecdir, sysconfdir :: FilePath

bindir     = "F:\\Yliopisto\\Funktio_ohjelmointi\\rekursioPuu\\.stack-work\\install\\cc66a988\\bin"
libdir     = "F:\\Yliopisto\\Funktio_ohjelmointi\\rekursioPuu\\.stack-work\\install\\cc66a988\\lib\\x86_64-windows-ghc-8.8.4\\rekursioPuu-0.1.0.0-9hpsyR75EZVJRdIkQZEghl-rekursioPuu"
dynlibdir  = "F:\\Yliopisto\\Funktio_ohjelmointi\\rekursioPuu\\.stack-work\\install\\cc66a988\\lib\\x86_64-windows-ghc-8.8.4"
datadir    = "F:\\Yliopisto\\Funktio_ohjelmointi\\rekursioPuu\\.stack-work\\install\\cc66a988\\share\\x86_64-windows-ghc-8.8.4\\rekursioPuu-0.1.0.0"
libexecdir = "F:\\Yliopisto\\Funktio_ohjelmointi\\rekursioPuu\\.stack-work\\install\\cc66a988\\libexec\\x86_64-windows-ghc-8.8.4\\rekursioPuu-0.1.0.0"
sysconfdir = "F:\\Yliopisto\\Funktio_ohjelmointi\\rekursioPuu\\.stack-work\\install\\cc66a988\\etc"

getBinDir, getLibDir, getDynLibDir, getDataDir, getLibexecDir, getSysconfDir :: IO FilePath
getBinDir = catchIO (getEnv "rekursioPuu_bindir") (\_ -> return bindir)
getLibDir = catchIO (getEnv "rekursioPuu_libdir") (\_ -> return libdir)
getDynLibDir = catchIO (getEnv "rekursioPuu_dynlibdir") (\_ -> return dynlibdir)
getDataDir = catchIO (getEnv "rekursioPuu_datadir") (\_ -> return datadir)
getLibexecDir = catchIO (getEnv "rekursioPuu_libexecdir") (\_ -> return libexecdir)
getSysconfDir = catchIO (getEnv "rekursioPuu_sysconfdir") (\_ -> return sysconfdir)

getDataFileName :: FilePath -> IO FilePath
getDataFileName name = do
  dir <- getDataDir
  return (dir ++ "\\" ++ name)
