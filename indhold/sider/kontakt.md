---
title: Kontakt
layout: contact
meta_title: "Kontakt Ejby IF Badminton – Ejbyhallen, Lille Skensved"
description: >-
  Kontakt Ejby IF Badminton i Ejbyhallen, Skovvang 4, 4623 Lille Skensved.
  Adresse, telefon, kort og svar på de spørgsmål vi oftest får.
permalink: "/kontakt/"
# show_faq aktiverer både FAQ-afsnittet nedenfor og FAQPage-markup (JSON-LD),
# som Google og AI-assistenter læser. Indholdet kommer fra indhold/data/faq.yml.
show_faq: true
---
{%- assign k = site.data.kontakt -%}
Har du spørgsmål til medlemskab, prøvetimer eller baneudlejning, så ræk endelig
ud. Vi bestræber os på at svare inden for 1-2 hverdage, og du er altid velkommen
til at kigge forbi hallen i træningstiden.

## Find os i Ejbyhallen

- **Adresse:** {{ k.spillested }}, {{ k.vej }}, {{ k.postnr }} {{ k.by }}
- **Telefon:** [{{ k.phone_display }}](tel:{{ k.phone | replace: " ", "" }})
- **E-mail:** [{{ k.email }}](mailto:{{ k.email }})
- **Træningstider:** Mandag og onsdag kl. 18.00-21.00
- **Parkering:** Gratis parkering foran hallen
- **Offentlig transport:** Kort gåtur fra Ejby Station
- **Personlig kontakt:** [kontakt bestyrelsen](/bestyrelsen/)

## Ofte stillede spørgsmål

{% for item in site.data.faq -%}
### {{ item.q | strip }}

{{ item.a | strip }}

{% endfor -%}

## Kort over Ejbyhallen

<iframe
	title="Kort over Ejbyhallen, {{ k.vej }}, {{ k.postnr }} {{ k.by }}"
	src="https://www.google.com/maps?q={{ k.vej | uri_escape }},+{{ k.postnr }}+{{ k.by | uri_escape }}&t=k&output=embed"
	width="100%"
	height="320"
	style="border:0;"
	allowfullscreen
	loading="lazy"
	referrerpolicy="no-referrer-when-downgrade"></iframe>
<p><a href="https://www.google.com/maps/place/{{ k.vej | uri_escape }},+{{ k.postnr }}+{{ k.by | uri_escape }}/@{{ k.latitude }},{{ k.longitude }},18z/data=!3m1!1e3" target="_blank" rel="noopener">Åbn i Google Maps (satellit)</a></p>

## Generelle oplysninger

- **Klubbens juridiske navn:** {{ k.juridisk_navn }}
- **Afdelingens navn:** {{ k.afdelingsnavn }}
- **Selskabsform:** {{ k.selskabsform }}
- **CVR-nummer (Ejby Idrætsforening):** {{ k.cvr }}
- **P-nr.:** {{ k.pnr }}
