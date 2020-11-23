{-# LANGUAGE CPP #-}
{-# LANGUAGE NoRebindableSyntax #-}
{-# OPTIONS_GHC -fno-warn-missing-import-lists #-}
module Paths_foldit (
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

bindir     = "/mnt/f/yliopisto/Funktio_ohjelmointi/foldit/.stack-work/install/x86_64-linux-tinfo6/99a2ec1539bffc08bbbf2d9417026bec34a9ef240a4ef882ca0483005dd7693a/8.8.4/bin"
libdir     = "/mnt/f/yliopisto/Funktio_ohjelmointi/foldit/.stack-work/install/x86_64-linux-tinfo6/99a2ec1539bffc08bbbf2d9417026bec34a9ef240a4ef882ca0483005dd7693a/8.8.4/lib/x86_64-linux-ghc-8.8.4/foldit-0.1.0.0-2C7076ST1aPGMISEXbUXMn-foldit"
dynlibdir  = "/mnt/f/yliopisto/Funktio_ohjelmointi/foldit/.stack-work/install/x86_64-linux-tinfo6/99a2ec1539bffc08bbbf2d9417026bec34a9ef240a4ef882ca0483005dd7693a/8.8.4/lib/x86_64-linux-ghc-8.8.4"
datadir    = "/mnt/f/yliopisto/Funktio_ohjelmointi/foldit/.stack-work/install/x86_64-linux-tinfo6/99a2ec1539bffc08bbbf2d9417026bec34a9ef240a4ef882ca0483005dd7693a/8.8.4/share/x86_64-linux-ghc-8.8.4/foldit-0.1.0.0"
libexecdir = "/mnt/f/yliopisto/Funktio_ohjelmointi/foldit/.stack-work/install/x86_64-linux-tinfo6/99a2ec1539bffc08bbbf2d9417026bec34a9ef240a4ef882ca0483005dd7693a/8.8.4/libexec/x86_64-linux-ghc-8.8.4/foldit-0.1.0.0"
sysconfdir = "/mnt/f/yliopisto/Funktio_ohjelmointi/foldit/.stack-work/install/x86_64-linux-tinfo6/99a2ec1539bffc08bbbf2d9417026bec34a9ef240a4ef882ca0483005dd7693a/8.8.4/etc"

getBinDir, getLibDir, getDynLibDir, getDataDir, getLibexecDir, getSysconfDir :: IO FilePath
getBinDir = catchIO (getEnv "foldit_bindir") (\_ -> return bindir)
getLibDir = catchIO (getEnv "foldit_libdir") (\_ -> return libdir)
getDynLibDir = catchIO (getEnv "foldit_dynlibdir") (\_ -> return dynlibdir)
getDataDir = catchIO (getEnv "foldit_datadir") (\_ -> return datadir)
getLibexecDir = catchIO (getEnv "foldit_libexecdir") (\_ -> return libexecdir)
getSysconfDir = catchIO (getEnv "foldit_sysconfdir") (\_ -> return sysconfdir)

getDataFileName :: FilePath -> IO FilePath
getDataFileName name = do
  dir <- getDataDir
  return (dir ++ "/" ++ name)
