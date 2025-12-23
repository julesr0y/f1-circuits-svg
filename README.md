# F1 CIRCUITS SVG 🏎️

This repository contains the layouts and their evolutions of all the circuits that have hosted at least one world championship Grand Prix in Formula 1 history.  
⚠️ Evolutions only concern the layout of circuits, not the pitlane evolutions, track resurfacing, track enlargement etc...  
💽 All layouts are in SVG format.  

[PitLane Insider](https://pitlaneinsider.alwaysdata.net/) uses this repository to display circuit layouts.

### 🛣️ Included circuits : 
<details> 
  <summary>78 circuits :</summary>
  • Adelaide Street Circuit (Adelaide) <br>
  • Ain-Diab Circuit (Casablanca) <br>
  • Aintree Motor Racing Circuit (Aintree) <br>
  • Algarve International Circuit (Portimão) <br>
  • Anderstorp Raceway (Anderstorp) <br>
  • Autodromo Internazionale Enzo e Dino Ferrari (Imola) <br>
  • Autodromo Internazionale del Mugello (Scarperia e San Piero) <br>
  • Autodromo Nazionale Monza (Monza) <br>
  • Autódromo Hermanos Rodríguez (Mexico City) <br>
  • Autódromo Internacional Nelson Piquet (Rio de Janeiro) <br>
  • Autódromo José Carlos Pace (São Paulo) <br>
  • Autódromo Juan y Oscar Gálvez (Buenos Aires) <br>
  • Autódromo do Estoril (Estoril) <br>
  • Automobil-Verkehrs- und Übungs-Straße (Berlin) <br>
  • Bahrain International Circuit (Sakhir) <br>
  • Baku City Circuit (Baku) <br>
  • Brands Hatch (Fawkham) <br>
  • Buddh International Circuit (Greater Noida) <br>
  • Bugatti Circuit (Le Mans) <br>
  • Caesars Palace (Las Vegas) <br>
  • Canadian Tire Motorsport Park (Bowmanville) <br>
  • Charade Circuit (Clermont-Ferrand) <br>
  • Circuit Bremgarten (Bern) <br>
  • Circuit Gilles Villeneuve (Montreal) <br>
  • Circuit Mont-Tremblant (Mont-Tremblant) <br>
  • Circuit Park Zandvoort (Zandvoort) <br>
  • Circuit Paul Ricard (Le Castellet) <br>
  • Circuit Zolder (Heusden-Zolder) <br>
  • Circuit de Barcelona-Catalunya (Montmeló) <br>
  • Circuit de Monaco (Monte Carlo) <br>
  • Circuit de Nevers Magny-Cours (Nevers) <br>
  • Circuit de Spa-Francorchamps (Spa) <br>
  • Circuit of the Americas (Austin) <br>
  • Circuito da Boavista (Porto) <br>
  • Circuito de Jerez (Jerez de la Frontera) <br>
  • Circuito de Madring (Madrid) <br>
  • Circuito de Monsanto (Lisbon) <br>
  • Circuito de Montjuïc (Barcelona) <br>
  • Circuito del Jarama (Madrid) <br>
  • Detroit Street Circuit (Detroit) <br>
  • Dijon-Prenois (Dijon) <br>
  • Donington Park (Leicestershire) <br>
  • Fair Park (Dallas) <br>
  • Fuji Speedway (Oyama) <br>
  • Hockenheimring (Hockenheim) <br>
  • Hungaroring (Budapest) <br>
  • Indianapolis Motor Speedway (Indianapolis) <br>
  • Istanbul Park (Istanbul) <br>
  • Jeddah Corniche Circuit (Jeddah) <br>
  • Korea International Circuit (Yeongam) <br>
  • Kyalami Racing Circuit (Midrand) <br>
  • Las Vegas Street Circuit (Las Vegas) <br>
  • Long Beach (Long Beach) <br>
  • Losail International Circuit (Lusail) <br>
  • Marina Bay Street Circuit (Singapore) <br>
  • Melbourne Grand Prix Circuit (Melbourne) <br>
  • Miami International Autodrome (Miami Gardens) <br>
  • Nivelles-Baulers (Nivelles) <br>
  • Nürburgring (Nürburg) <br>
  • Okayama International Circuit (Aida) <br>
  • Pedralbes Circuit (Barcelona) <br>
  • Pescara Circuit (Pescara) <br>
  • Phoenix Street Circuit (Phoenix) <br>
  • Prince George Circuit (East London) <br>
  • Red Bull Ring (Spielberg) <br>
  • Reims-Gueux (Reims) <br>
  • Riverside International Raceway (Riverside) <br>
  • Rouen-Les-Essarts (Rouen) <br>
  • Sebring International Raceway (Sebring) <br>
  • Sepang International Circuit (Sepang) <br>
  • Shanghai International Circuit (Shanghai) <br>
  • Silverstone Circuit (Silverstone) <br>
  • Sochi Autodrom (Sochi) <br>
  • Suzuka Circuit (Suzuka) <br>
  • Valencia Street Circuit (Valencia) <br>
  • Watkins Glen International (Watkins Glen) <br>
  • Yas Marina Circuit (Abu Dhabi) <br>
  • Zeltweg (Zeltweg) <br>
</details>

### 🎨 Style :

You can find 4 styles of layouts in this repository (backgrounds are normally transparent, but here they are black or white for better visibility) :
- Black :
  
  <img src="readme/kyalami-2.svg" alt="Kyalami" width="150" height="150">

- Black outline :
  
  <img src="readme/spa-francorchamps-3.svg" alt="Spa" width="150" height="150">

- White :
  
  <img src="readme/estoril-2.svg" alt="Estoril" width="150" height="150">

- White outline :
  
  <img src="readme/monza-2.svg" alt="Monza" width="150" height="150">
  
### 📁 Structure :

`root` folder contains :
- `circuits.json` file containing all circuits data (id, name, length, layouts...)  
&nbsp;About `layouts` key in `circuits.json` file :  
&nbsp;• each layout has his circuit id, followed by -number (ex: monza-1 is the first ever used layout, monza-2 the second...)  
&nbsp;• each layout has the seasons when it was used (ex: "1958,1960-1962" indicates that the layout was used in 1958, 1960, 1961 and 1962)

`circuits` folder contains :
- 4 style folders (black, black-outline, white, white-outline), each containing all circuits layouts in SVG format

### 🖌️ Customisation :

By default, stroke width is set to 20px for outline, and 5px for inside outline. You can easily customize these files for your own use by modifying `stroke` and `stroke-width` values in the style attribute :

```svg
<svg width="500" height="500" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
    <path style="fill: none; stroke: custom_color; stroke-width: custom_width; stroke-linejoin: round; stroke-dasharray: none; stroke-opacity: 1;" d="M223.097 46.593c15.65-1.332 25.903-1.868..." />
</svg>
```

If needed, you can also customise width and height (default 500px x 500px) by modifying `width` and `height` attributes.

### 🔎 Sources :

- [Wikipedia](https://en.wikipedia.org/wiki/List_of_Formula_One_circuits)
- [StatsF1](https://www.statsf1.com/en/circuits.aspx)
- [Motorsport Magazine](https://www.motorsportmagazine.com/database/circuits/)
- [F1DB](https://github.com/f1db/f1db)

*Last update: 12/2025*

```
________ _______ __  __       _________        ______            
___  __ \__  __ \_ \/ /       ______  /____  _____  /_____ ________
__  /_/ /_  / / /__  /        ___ _  / _  / / /__  / _  _ \__  ___/
_  _, _/ / /_/ / _  /         / /_/ /  / /_/ / _  /  /  __/_(__  ) 
/_/ |_|  \____/  /_/          \____/   \__,_/  /_/   \___/ /____/  

```
