---
title: Tilbud
layout: page
meta_title: "Badminton i Ejby – hold, spilletider og priser 2025/2026"
description: >-
  Alle badmintontilbud i Ejbyhallen: Senior Motion, Flex-hygge og
  baneudlejning. Se spilletider og priser for sæsonen 2025/2026.
permalink: "/tilbud/"
full_width: true
---
{%- assign k = site.data.kontakt -%}
Ejby IF Badminton tilbyder motionsbadminton for voksne i {{ k.spillested }},
{{ k.vej }}, {{ k.postnr }} {{ k.by }}. Vi har tre forskellige tilbud, så du kan
vælge mellem fast træning, drop-in eller din egen lejede bane. Nedenfor finder du
spilletider og priser for hele sæsonen.

## Sammenlign tilbuddene

| Tilbud | Spilletid | Pris for sæsonen |
| ------ | --------- | ---------------- |
{% for offer in site.data.tilbud -%}
{%- assign service = site.tilbud | where: "slug", offer.slug | first -%}
| {% if service %}[{{ offer.title }}]({{ service.url }}){% else %}{{ offer.title }}{% endif %} | {{ offer.times | join: " " | replace: " i Ejbyhallen", "" }} | {{ offer.pricing | join: " " }} |
{% endfor %}

{% for offer in site.data.tilbud %}
{%- assign service = site.tilbud | where: "slug", offer.slug | first -%}
## {{ offer.title }}

{{ offer.blurb | strip }}

- **Spilletid:** {{ offer.times | join: " " }}
- **Pris:** {{ offer.pricing | join: " " }}
- **Sådan kommer du i gang:** {{ offer.signup | join: " " }}
{%- for contact in offer.contacts %}
- **Kontakt:** {{ contact.name }}{% if contact.phone %} — telefon [{{ contact.phone | remove: "+45 " }}](tel:{{ contact.phone | replace: " ", "" }}){% endif %}
{%- endfor %}
{% if service %}
[Læs mere om {{ offer.title }}]({{ service.url }})
{% endif %}
{% endfor %}

## Hvilket tilbud skal jeg vælge?

- Vil du spille fast hver uge og have sved på panden, er **Senior Motion** det
  oplagte valg. Du får op til 3 gratis prøvetimer, før du melder dig ind.
- Kan du ikke binde dig til en fast ugedag, passer **Flex-hygge** bedre. Her
  møder du op, når det passer, og betaler pr. gang.
- Spiller du helst med din egen faste makker eller familien, kan du leje din
  egen bane gennem **baneudlejning**.

Er du i tvivl, så mød op i {{ k.spillested }} en mandag eller onsdag mellem
kl. 18 og 21, eller ring til os på
[{{ k.phone_display }}](tel:{{ k.phone | replace: " ", "" }}). Du kan også se
[svar på de spørgsmål vi oftest får](/kontakt/).
