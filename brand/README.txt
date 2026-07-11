SCOTCH EGG — BRAND ASSETS
==========================

Palette
  Ring (primary)   #B5652A
  Egg white        #FBF6EC
  Yolk (accent)    #E7B86A
  Ink (text)       #3A2A1D

Typeface
  Lora, weight 600 (Google Fonts) — fallback: Georgia, serif

FILES

/scotch-egg-icon.svg              Icon mark, full color, transparent-safe (self-contained circular badge)
/scotch-egg-icon-black.svg        Icon mark, single-color black (for light backgrounds)
/scotch-egg-icon-white.svg        Icon mark, single-color white (for dark backgrounds)
/scotch-egg-logo-horizontal.svg   Icon + wordmark, side by side
/scotch-egg-logo-stacked.svg      Icon + wordmark, stacked

/png/icon-16.png … icon-512.png   Icon mark rasters, transparent background
/png/icon-black-64.png / -256.png Black variant rasters
/png/icon-white-64.png / -256.png White variant rasters
/png/logo-horizontal.png          Horizontal lockup raster (2x)
/png/logo-stacked.png             Stacked lockup raster (2x)
/png/apple-touch-icon.png         180×180, opaque cream background (iOS home screen)
/png/android-chrome-192.png       192×192, opaque background (Android/PWA)
/png/android-chrome-512.png       512×512, opaque background (Android/PWA)
/png/og-image.png                 1200×630 social share / Open Graph image

/favicon.ico                      Multi-size (16/32/48) favicon

USAGE — drop this in your <head>:

  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/svg+xml" href="/scotch-egg-icon.svg">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192.png">
  <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512.png">
  <meta property="og:image" content="https://scotchegg.co/og-image.png">

Prefer the SVG lockups on the live site (crisp at any size, loads the real Lora
font). The wordmark text in the SVGs needs Lora loaded on the page:

  <link href="https://fonts.googleapis.com/css2?family=Lora:wght@600&display=swap" rel="stylesheet">

The PNG lockups fall back to a system serif and are meant for places that can't
load web fonts (docs, slides, email).
