---
title: Bestyrelsen
layout: page
permalink: "/bestyrelse/"
description: Mød bestyrelsen i Ejby IF Badminton
full_width: true
intro_image_hide_on_mobile: true
---

# Bestyrelsen i Ejby IF Badminton

Vi bygger klubben på frivilligt engagement. Her finder du det nuværende hold i
bestyrelsen, så du hurtigt kan kontakte den rette person om økonomi,
træningstilbud eller nye idéer.

{% assign board = site.data.board %}
{% if board %}
<div class="board-grid">
  {% for entry in board %}
  <article class="board-card">
    <p class="board-card__role">{{ entry.role }}</p>
    {% if entry.description %}
    <p class="board-card__description">{{ entry.description }}</p>
    {% endif %}
    <div class="board-card__people">
      {% for person in entry.people %}
      <div class="board-person">
        <h3 class="board-person__name">{{ person.name }}</h3>
        <ul class="board-person__meta">
          {% if person.phone %}
          <li><span>Telefon:</span> <a href="tel:{{ person.phone | replace: ' ', '' }}">{{ person.phone }}</a></li>
          {% endif %}
          {% if person.email %}
          <li><span>Email:</span> <a href="mailto:{{ person.email }}">{{ person.email }}</a></li>
          {% endif %}
        </ul>
      </div>
      {% endfor %}
    </div>
  </article>
  {% endfor %}
</div>
{% endif %}

Har du generelle spørgsmål, kan du også skrive til [badminton@ejbyif.dk](mailto:badminton@ejbyif.dk),
hvor bestyrelsen følger op samlet.
