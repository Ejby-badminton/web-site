---
title: Ejby Badminton
layout: home
description: Ejby Badminton — Badminton for alle!
intro_image: /images/illustrations/pointing.svg
intro_image_hide_on_mobile: true
show_call_box: false
---

# Badminton i Ejbyhallen

Hos Ejby IF Badminton dyrker vi fællesskabet omkring spillet – uanset om du er
til sved på panden, fleksible træninger eller faste banetider med din egen
makker. Vi holder til i Ejbyhallen og tilbyder flere forskellige træningstyper
i løbet af ugen, så der er plads til både nye og erfarne spillere.

## Det tilbyder vi i sæsonen 2025/2026

{% assign offers = site.data.offers %}
{% if offers %}
{% for offer in offers %}
### {{ offer.title }}{% if offer.season %} ({{ offer.season }}){% endif %}

{{ offer.blurb }}

{% if offer.times %}
**Hvornår spiller vi?**
{% for time in offer.times %}
- {{ time }}
{% endfor %}
{% endif %}

{% if offer.pricing %}
**Prisoversigt**
{% for price in offer.pricing %}
- {{ price }}
{% endfor %}
{% endif %}

{% assign service = site.services | where: "slug", offer.slug | first %}
{% if service %}
[Læs den fulde beskrivelse →]({{ service.url | relative_url }})
{% endif %}

{% unless forloop.last %}---{% endunless %}
{% endfor %}
{% endif %}

## Sådan får du en prøvetime

1. Kig forbi Ejbyhallen en mandag eller onsdag i tidsrummet 18.00-21.00.
2. Spørg efter Allan (Senior Motion / baneudlejning) eller Georg (Flex-hygge),
	 så finder de et niveau, der passer dig.
3. Når du er klar til at melde dig ind, hjælper vi med oprettelsen i Klubmodul
	 og svarer på spørgsmål om betaling, udstyr og kontingent.

## Hvorfor vælge Ejby IF Badminton?

- Trygt og socialt miljø med plads til både nybegyndere og rutinerede spillere
- Fleksible tilbud – drop-in hyggebadminton, motionisttræning eller faste baner
- Frivilligt drevet klub, hvor kontingentet går direkte til at holde hallen og
	fællesskabet i gang

## Praktisk info og kontakt

- **Adresse:** Skovvang 44, 4623 Lille Skensved (Ejbyhallen)
- **Telefon til klubben:** [40 38 27 95](tel:+4540382795)
- **Kontaktpersoner:** Allan – [alyn015@outlook.dk](mailto:alyn015@outlook.dk) ·
	Georg – [georgmand@hotmail.com](mailto:georgmand@hotmail.com)
- **Bestyrelse & dokumenter:**
	[Se mere i Klubmodul](https://ejbyifbadminton.klub-modul.dk/bestyrelse)
- **Facebook:** [facebook.com/Ejbyif](https://www.facebook.com/Ejbyif)

Har du specifikke ønsker til hold eller tidsrum, så skriv eller ring – vi finder
en løsning, der passer dig.
