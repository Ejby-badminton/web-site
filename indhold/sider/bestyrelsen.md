---
title: Bestyrelsen
layout: page
permalink: "/bestyrelsen/"
description: Mød bestyrelsen i Ejby IF Badminton
full_width: true
intro_image_hide_on_mobile: true
---

# Bestyrelsen i Ejby IF Badminton

Vi bygger klubben på frivilligt engagement. Her finder du det nuværende hold i
bestyrelsen, så du hurtigt kan kontakte den rette person om økonomi,
træningstilbud eller nye idéer.

{% assign board = site.data.bestyrelse %}
{% if board %}
<div class="board-grid">
  {% for person in board %}
  <article class="board-card">
    <p class="board-card__role">{{ person.role }}</p>
    <h3 class="board-card__name">{{ person.name }}</h3>
    <ul class="board-card__meta">
      {% if person.phone %}
      <li><span>Telefon:</span> <a href="tel:{{ person.phone | replace: ' ', '' }}">{{ person.phone }}</a></li>
      {% endif %}
      {% if person.email %}
      <li><span>Email:</span> <a href="mailto:{{ person.email }}">{{ person.email }}</a></li>
      {% endif %}
    </ul>
  </article>
  {% endfor %}
</div>
{% endif %}

Har du generelle spørgsmål, kan du også skrive til [badminton@ejbyif.dk](mailto:badminton@ejbyif.dk),
hvor bestyrelsen følger op samlet.
