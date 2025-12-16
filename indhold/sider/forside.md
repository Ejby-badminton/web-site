---
title: Ejby Badminton
layout: home
description: Ejby Badminton — Badminton for alle!
show_call_box: false
show_service_grid: false
permalink: "/"
---

# Badminton i Ejbyhallen

Hos Ejby IF Badminton dyrker vi fællesskabet omkring spillet – uanset om du er
til sved på panden, fleksible træninger eller faste banetider med din egen
makker. Vi holder til i Ejbyhallen og tilbyder flere forskellige træningstyper
i løbet af ugen, så der er plads til både nye og erfarne spillere.

## Vælg dit badminton-tilbud

Her er de mest populære måder at spille badminton hos os lige nu. Vælg det
tilbud, der passer dig, og brug knapperne under kortene for at læse mere.

{% assign offers = site.data.tilbud %}
{% if offers %}
<div class="offer-grid-wrapper">
<div class="offer-grid">
{% for offer in offers %}
	{% assign service = site.tilbud | where: "slug", offer.slug | first %}
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
	</div>
{% endif %}

## Sådan får du en prøvetime

1. Kig forbi Ejbyhallen en mandag eller onsdag i tidsrummet 18.00-21.00.
2. Spørg efter William så finder han et niveau, der passer dig.

Har du brug for mere info? Brug [Kontakt-siden](/kontakt/).

## Hvorfor vælge Ejby IF Badminton?

- Trygt og socialt miljø med plads til både nybegyndere og rutinerede spillere
- Fleksible tilbud – drop-in hyggebadminton, motionisttræning eller faste baner
- Frivilligt drevet klub, hvor kontingentet går direkte til at holde klubben og
	fællesskabet i gang
