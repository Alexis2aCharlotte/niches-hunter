🛰️ Niche Hunter – Documentation du Workflow n8n

Version du 04/12/2025

⭐ 1. Vue d’ensemble

Niche Hunter est un pipeline automatisé intégré dans n8n + Supabase qui exécute chaque jour :

Scraping App Store

Nettoyage & filtrage

Détection des opportunités

Scoring et sélection des meilleures apps

Génération automatique d’une newsletter

Envoi de l’email aux abonnés

Gestion des nouveaux inscrits via une landing page

Le système fonctionne 100% automatiquement après configuration.

🚀 2. Workflow A – Daily Newsletter (automatique, 1×/jour)
⏱️ Déclencheur

Cron (ex : tous les jours à 08h00)

🧱 Étapes principales
2.1 Scraping App Store

Node HTTP → récupère les classements App Store US/EU

Insertion dans app_rankings

Triggers Supabase → mise à jour automatique de :

app_rankings_clean

app_opportunities

app_opportunities_ranked

2.2 Sélection des meilleures opportunités

Node Supabase → SELECT * FROM app_opportunities_ranked ORDER BY score DESC LIMIT 5

2.3 Génération de la newsletter

Node OpenAI :

Reçoit les opportunités formatées

Génère :

Un titre

Un résumé

3 insights clés

5 fiches apps

2 niches

Format HTML prêt à envoyer

2.4 Stockage de la newsletter dans Supabase

Table newsletters :

INSERT INTO newsletters (title, content_html)
VALUES (...)
RETURNING id;

2.5 Récupération des abonnés

Node Supabase :

SELECT email
FROM newsletter_subscribers
WHERE status = 'subscribed';


n8n renvoie un item par abonné, ce qui permet au node Email de s’exécuter automatiquement pour chaque adresse.

2.6 Envoi de la newsletter

Node Send Email (SMTP OVH) :

From : support@arianeconcept.fr

To : {{ $json.email }}

Subject : {{ $node["OpenAI Newsletter"].json.title }}

HTML : {{ $node["OpenAI Newsletter"].json.content_html }}

2.7 (Optionnel) Mise à jour du timestamp d’envoi
UPDATE newsletter_subscribers
SET email_sent_at = now()
WHERE email = {{ $json.email }};


🧲 3. Workflow B – New Subscriber Signup (landing page → envoi immédiat)
🎯 Objectif

Quand un utilisateur laisse son email sur la landing page :

Il est ajouté à newsletter_subscribers

Il reçoit immédiatement la newsletter du jour

Il est ajouté automatiquement à la liste des abonnés pour les prochaines éditions