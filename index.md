---
title: Ejby Badminton
layout: home
description: Ejby Badminton — Badminton for alle!
intro_image: /images/illustrations/pointing.svg
intro_image_hide_on_mobile: true
show_call_box: false
show_service_grid: false
---

# Badminton i Ejbyhallen

Hos Ejby IF Badminton dyrker vi fællesskabet omkring spillet – uanset om du er
til sved på panden, fleksible træninger eller faste banetider med din egen
makker. Vi holder til i Ejbyhallen og tilbyder flere forskellige træningstyper
i løbet af ugen, så der er plads til både nye og erfarne spillere.

## Vælg dit badminton-tilbud

Her er de mest populære måder at spille badminton hos os lige nu. Vælg det
tilbud, der passer dig, og brug knapperne under kortene for at læse mere eller
tage kontakt direkte til holdlederen.

{% assign offers = site.data.offers %}
{% if offers %}
<div class="offer-grid">
{% for offer in offers %}
	{% assign service = site.services | where: "slug", offer.slug | first %}
	{% assign primary_contact = offer.contacts | first %}
	<article class="offer-card">
		<header class="offer-card__header">
			{% if offer.season %}
			<p class="offer-card__season">Sæson {{ offer.season }}</p>
			{% endif %}
			<h3 class="offer-card__title">{{ offer.title }}</h3>
		</header>
		<p class="offer-card__blurb">{{ offer.blurb }}</p>
		<ul class="offer-card__meta">
			{% if offer.times %}
			<li>
				<span class="offer-card__label">Spilletid</span>
				<span class="offer-card__value">{{ offer.times | join: "<br />" }}</span>
			</li>
			{% endif %}
			{% if offer.pricing %}
			<li>
				<span class="offer-card__label">Pris</span>
				<span class="offer-card__value">{{ offer.pricing | join: "<br />" }}</span>
			</li>
			{% endif %}
		</ul>
		{% if offer.signup %}
		<p class="offer-card__signup">{{ offer.signup | first }}</p>
		{% endif %}
		<div class="offer-card__actions">
			{% if service %}
			<a class="button button-primary" href="{{ service.url | relative_url }}">Se detaljer</a>
			{% endif %}
			{% if primary_contact and primary_contact.email %}
			<a class="button button-secondary" href="mailto:{{ primary_contact.email | strip }}?subject={{ offer.title | uri_escape }}">Kontakt {{ primary_contact.name }}</a>
			{% endif %}
		</div>
	</article>
{% endfor %}
</div>
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
