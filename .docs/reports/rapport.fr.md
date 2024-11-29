# Rapport d'Analyse du Projet de Développement du Réseau Social

## Introduction

Ce rapport présente une analyse approfondie du projet de développement de l'application One Pick, un réseau social destiné au grand public. L'objectif de cette analyse est d'identifier et de résoudre les problèmes techniques, d'améliorer l'expérience utilisateur, de corriger les bugs, et de suggérer des modifications pour optimiser le code et l'application en général.

> ⚠️ **Avertissement**
>
> Ce document est une suggestion pour améliorer la structure de code du projet, ainsi que les optimisations à apporter. Les éléments sont susceptibles de changer car je n’ai pas suffisamment de recul sur le projet pour les mettre en place. Cette documentation est une contribution suite à l'analyse effectuée par mes soins.

### Présentation de l'application One Pick

One Pick est un réseau social conçu pour permettre aux utilisateurs de partager des opinions, des idées, des avis, et d'échanger sur divers sujets en fonction de leurs centres d'intérêt. À l'instar de plateformes populaires telles que Twitter, Instagram, ou Facebook, One Pick offre une interface conviviale et des fonctionnalités interactives pour favoriser l'engagement et la communication entre les utilisateurs.

### Technologies utilisées

L'application One Pick est développée en utilisant les technologies suivantes:

**Ionic** : Un framework open-source pour le développement d'applications mobiles multiplateformes, offrant des performances optimales et une interface utilisateur cohérente sur Android et iOS.

**Angular** : Un framework web populaire pour la construction d'applications dynamiques et performantes, permettant une structure de code robuste et maintenable.

### Public cible

Le public cible de One Pick est le grand public, englobant une large gamme d'utilisateurs ayant des intérêts divers. L'application vise à offrir une plateforme inclusive et attrayante pour toutes les catégories d'utilisateurs, facilitant ainsi la communication et l'échange d'idées.

### Maquette de l'application

Une maquette Figma détaillant le résultat final de l'application mobile est disponible ([👉️ ici](https://example.com)). Cette maquette sert de référence visuelle pour évaluer et comparer les comportements attendus et réels de l'application, ainsi que pour identifier les améliorations nécessaires.

## Section 1 : Analyse des Problèmes Techniques

Cette section vise à identifier et à analyser les problèmes techniques rencontrés dans le développement de l'application One Pick. Le projet étant toujours en cours de développement et la première version n'étant pas encore sur le marché, il est crucial d'adresser ces problèmes dès maintenant pour assurer une expérience utilisateur optimale et une performance efficace de l'application.

L'analyse des problèmes techniques se concentre sur plusieurs aspects clés :

1. **Problèmes de Performance :** Identification des goulets d'étranglements et des zones du code nécessitant une optimisation pour garantir un chargement rapide et une fluidité d'utilisation.
2. **Bugs et Dysfonctionnements :** Détection et description des bugs présents dans l'application, accompagnés des étapes pour les reproduire et des solutions possibles.
3. **Problèmes d'Interface Utilisateur :** Évaluation de l'interface utilisateur pour repérer les éléments non fonctionnels ou mal alignés qui pourraient nuire à l'expérience utilisateur.

Cette analyse est essentielle pour mieux comprendre les besoins actuels et futurs du projet. Elle fournira des recommandations claires et actionnables pour corriger les problèmes identifiés, optimiser le code, et améliorer l'expérience utilisateur globale. En abordant ces aspects dès les phases initiales du développement, nous nous assurons que One Pick sera prêt à offrir une expérience de haute qualité lors de son lancement.

### Problèmes de Performance

Dans le développement de l'application One Pick, l'optimisation des performances est un enjeu crucial pour garantir une expérience utilisateur fluide et réactive. Les lenteurs et les goulets d'étranglement techniques peuvent gravement affecter l'engagement des utilisateurs et la performance globale de l'application. Voici un aperçu des principaux problèmes de performance rencontrés et des recommandations pour les résoudre.

#### Temps de Chargement des Images

L’un des problèmes notables concerne le temps de chargement des images. Actuellement, les images mettent trop de temps à s’afficher, ce qui ralentit l’application et dégrade l’expérience utilisateur. La cause principale de cette lenteur est le manque de redimensionnement et de compression des images avant leur envoi à l’application.

Pour remédier à cette situation, il est essentiel de mettre en œuvre des techniques de compression et de redimensionnement des images dès le backend. De plus, sur le frontend, le lazy loading permettrait de charger les images uniquement lorsqu'elles deviennent visibles à l'écran, réduisant ainsi le temps de chargement initial. L'utilisation de formats d’image modernes comme WebP peut également contribuer à diminuer la taille des fichiers tout en conservant une qualité visuelle élevée.

```html
<!-- Exemple de lazy loading pour les images -->
<img [src]="post.image" alt="Paris" style="width:100%" loading="lazy">
```

#### Nombre d'Éléments Récupérés

Un autre problème de performance est lié au nombre d’éléments récupérés en une seule fois. Lorsqu'un grand nombre d'éléments est chargé simultanément, cela surcharge l'application et les serveurs, ralentissant ainsi le temps de réponse. La solution à ce problème consiste à mettre en place un système de chargement dynamique des éléments, comme le défilement infini (infinite scroll), permettant de récupérer les éléments progressivement à mesure que l’utilisateur fait défiler la page. Limiter le nombre d'éléments récupérés à chaque requête, par exemple à 25 éléments, peut également aider à réduire la charge sur les serveurs et améliorer la réactivité.

```ts
// Exemple de paramètres pour récupérer les posts avec pagination
offset = 0;
limit = 25; // Réduire le nombre d'éléments récupérés par requête
```

#### Taille du Bundle

La taille du bundle est également un problème critique. Actuellement, le bundle est excessivement lourd, ce qui ralentit le chargement initial de l'application. La taille importante du bundle peut être attribuée à l'inclusion de fonctionnalités gourmandes en ressources qui ne sont pas toujours utilisées par les utilisateurs. Pour résoudre ce problème, il est recommandé d’utiliser le code splitting pour charger les fonctionnalités lourdes uniquement lorsque cela est nécessaire. En outre, il est essentiel d'analyser et d'optimiser les dépendances pour s'assurer que seules les bibliothèques nécessaires sont incluses dans le bundle.

![Taille du bundle](./assets/image.png)

En conclusion, une attention accrue à la gestion des images, au chargement dynamique des éléments et à la taille du bundle est nécessaire pour améliorer les performances de l'application One Pick. Ces ajustements permettront d'optimiser le temps de chargement, de réduire la surcharge des serveurs et de garantir une expérience utilisateur fluide et rapide.

---

### Bugs et Dysfonctionnements

L’identification et la correction des bugs sont essentielles pour assurer une expérience utilisateur sans accroc. Dans cette section, nous examinons les problèmes majeurs rencontrés dans l'application One Pick, en mettant l'accent sur leur impact et les solutions possibles.

#### Problème de Multiples Fenêtres Modales

L’un des bugs notables concerne l'ouverture de multiples fenêtres modales lors d'une connexion lente. Lorsqu'un utilisateur clique plusieurs fois sur un bouton pendant que l'application charge, plusieurs fenêtres modales peuvent s'ouvrir simultanément, créant une confusion et une surcharge visuelle.

Ce problème survient parce que le bouton reste actif et continue à envoyer des requêtes avant que la première demande ne soit complètement traitée. Pour éviter cette situation, il est recommandé de désactiver le bouton immédiatement après le premier clic jusqu'à ce que l'action en cours soit terminée. Cette approche préviendra les clics multiples et assurera une interaction plus fluide.

![Vidéo montrant le problème](./assets/create-post-bug.gif)

#### Problème d'Affichage des Images de Profil

Un autre bug significatif concerne l’affichage des images de profil dans l’application mobile. Bien que ces images apparaissent correctement dans les navigateurs, elles ne s’affichent pas dans l’application mobile en raison d'une connexion non sécurisée (HTTP). Les systèmes Android et iOS nécessitent des connexions sécurisées (HTTPS) pour charger les ressources correctement.

Pour corriger ce problème, il est crucial d'activer HTTPS pour toutes les connexions afin d'assurer que les images de profil et autres ressources sont chargées correctement. En attendant la mise en place complète de HTTPS, l'utilisation du package [ssl-skip](https://github.com/jcesarmobile/ssl-skip) peut permettre de contourner temporairement cette restriction.

### Problèmes d'Interface Utilisateur

L’analyse de l’interface utilisateur révèle plusieurs problèmes qui peuvent nuire à l’expérience globale de l’application. Ces problèmes incluent des incohérences visuelles et des lacunes ergonomiques qui méritent une attention particulière pour améliorer l’interaction utilisateur.

#### Incohérences dans l'Espacement

Un problème récurrent est l’incohérence des espacements, notamment en ce qui concerne les padding et margins. Certains éléments de l’interface utilisateur ne présentent pas un espacement uniforme, ce qui crée une incohérence visuelle et peut perturber les utilisateurs.

Pour résoudre ce problème, il est important de revoir et de standardiser les styles CSS à travers toutes les pages et composants de l'application. L’utilisation de variables CSS ou d’un système de design peut aider à maintenir une uniformité dans les espacements et à améliorer la présentation globale.

#### Problèmes d'Ergonomie

En termes d’ergonomie, l’application présente des lacunes, notamment dans l'exécution de certaines actions fréquentes. Le système de "Pick", par exemple, nécessite actuellement deux clics : un pour sélectionner l'image et un autre pour confirmer l’action. Simplifier ce processus en un seul clic améliorerait la fluidité et l’efficacité des interactions.

De plus, dans l’onglet Clips, les actions liées aux vidéos ne sont accessibles qu’à la fin de la lecture. Pour faciliter l’interaction, il serait préférable de rendre ces actions disponibles dès le début de la lecture.

#### Problème de Contraste du Texte sur les Images

Le contraste du texte affiché sur les images est parfois insuffisant, ce qui rend la lecture difficile, surtout lorsque l’image de fond présente des couleurs similaires au texte. Pour améliorer la lisibilité, l’ajout d’un masque ou d’un fond semi-transparent derrière le texte est recommandé. L’utilisation d’algorithmes pour ajuster automatiquement le contraste en fonction des couleurs dominantes de l’image pourrait également être envisagée.

![alt text](./assets/image-1.png)

En conclusion, l’amélioration des aspects techniques liés à la performance, aux bugs, et à l’interface utilisateur est essentielle pour garantir une expérience optimale dans l’application One Pick. En abordant ces problèmes avec des solutions adaptées, nous pouvons améliorer la réactivité, la fonctionnalité et l’ergonomie de l’application, assurant ainsi un lancement réussi et une expérience utilisateur de haute qualité.

## Section 2 : Comportements Attendus vs Comportements Réels

Dans le cadre du développement de l'application One Pick, il est crucial d'évaluer les écarts entre les comportements attendus et les comportements observés. Cette analyse permet de détecter les dysfonctionnements et de proposer des améliorations pour assurer une expérience utilisateur optimale. Voici les principaux points d'observation.

### Fonctionnalités Principales

Dans le développement de l'application One Pick, la gestion des publications en temps réel joue un rôle crucial pour assurer une expérience utilisateur fluide et interactive. Actuellement, une limitation notable réside dans la nécessité de réactualiser manuellement le fil d'actualités pour voir les nouveaux contenus. Ce besoin de rafraîchir la page à chaque fois qu'un utilisateur poste du contenu ou interagit avec l'application engendre une frustration considérable et nuit à l'efficacité du flux d'information.

Les fonctionnalités de base de l'application, telles que la publication de divers types de contenu – clips vidéo à la TikTok, photos, sondages, et questionnaires – ainsi que la possibilité de commenter, liker et partager, sont essentielles pour maintenir l'engagement des utilisateurs. Cependant, un problème significatif a été identifié lors de l'ajout de nouveaux posts : la création de certains types de publications, en dehors des simples images, ne fonctionne pas comme prévu. Actuellement, l'application permet uniquement de publier des images, tandis que les autres formats de publication tels que les vidéos et les sondages restent inaccessibles.

Cette limitation non seulement restreint la variété de contenu que les utilisateurs peuvent partager, mais elle impacte également l'engagement global avec l'application. En effet, pour une application moderne axée sur la diversité des interactions, il est impératif que chaque type de publication soit fonctionnel et accessible.

Pour résoudre ce problème, il serait bénéfique de réévaluer le processus de gestion des types de contenu dans Angular. Une solution envisageable serait d'optimiser le code de publication pour inclure tous les formats de posts et d'implémenter un mécanisme de mise à jour en temps réel à l'aide de WebSocket. Cette approche permettrait non seulement de simplifier la gestion des publications mais aussi d'améliorer la réactivité de l'application, offrant ainsi une expérience utilisateur beaucoup plus fluide et cohérente.

En conclusion, la capacité de publier et de voir du contenu en temps réel est essentielle pour le succès de One Pick. L'amélioration de ces aspects techniques permettra de répondre aux attentes des utilisateurs et de renforcer l'interaction au sein de la plateforme. Pour avancer, il est crucial d'aborder ces défis techniques avec des solutions adaptées, garantissant que chaque fonctionnalité essentielle fonctionne comme prévu et contribue à une expérience utilisateur enrichissante.

### Navigation

La navigation au sein de l'application One Pick s’avère globalement satisfaisante, permettant aux utilisateurs de se déplacer entre les différentes sections avec une certaine fluidité. Cependant, pour élever encore davantage l'expérience utilisateur, il est essentiel d’affiner certains aspects de la navigation, notamment les animations et les transitions entre les pages.

Bien que la navigation réponde principalement aux besoins actuels, elle pourrait bénéficier d’une attention particulière sur les transitions. L’ajout d’animations plus subtiles et de transitions fluides entre les pages peut non seulement améliorer l’esthétique de l’application, mais aussi rendre l'expérience plus immersive et intuitive. Par exemple, des animations lors du passage d’une section à une autre ou des transitions visuelles entre les éléments peuvent aider à guider l’utilisateur de manière plus naturelle et agréable.

En parallèle, il serait pertinent d’examiner les délais de chargement entre les sections. L’optimisation du temps de réponse peut considérablement diminuer les temps d’attente, évitant ainsi toute impression de lenteur ou de saccades. L’utilisation de techniques telles que le chargement différé (lazy loading) pour les sections non immédiatement visibles ou la précharge de données essentielles peut aider à rendre la navigation plus fluide et réactive.

En résumé, bien que la navigation actuelle de l'application One Pick soit efficace, l'intégration de transitions visuelles raffinées et l'optimisation des temps de chargement sont des étapes clés pour améliorer l’expérience globale. Ces ajustements permettront non seulement de rendre l'application plus agréable à utiliser, mais aussi de renforcer l’engagement des utilisateurs en offrant une expérience plus fluide et attrayante.

### Interactions Utilisateur

Lorsque l'on aborde les interactions utilisateur dans One Pick, mes premières impressions n’étaient pas particulièrement enthousiastes, mais elles ne sont pas non plus catastrophiques. Bien que la base soit solide, certaines imprécisions sont venues ternir l'expérience, surtout quand on considère que l'application est destinée à un large public.

L’application offre une bonne fondation, mais mon souci du détail révèle qu'il ne manque pas grand-chose pour atteindre un niveau optimal. En tant qu'utilisateur de réseaux sociaux, je cherche avant tout à rester informé, à demander des conseils et à m'évader. Pour répondre à ces attentes, One Pick doit offrir des interactions non seulement fonctionnelles mais aussi intuitives et naturelles.

Un aspect crucial concerne le système de "Pick", qui permet aux utilisateurs de sélectionner du contenu qu'ils apprécient. Actuellement, cette action nécessite deux clics : un pour choisir l’image et un autre pour confirmer. Étant donné que cette interaction est parmi les plus fréquentes, simplifier le processus en un seul clic améliorerait considérablement l'efficacité et la fluidité de l'expérience.

De plus, dans l'onglet Clips, les fonctionnalités liées aux vidéos – telles que les commentaires et les partages – ne sont disponibles qu'à la fin de la lecture. Cette restriction ralentit les interactions et peut diminuer l’engagement. Rendre ces actions accessibles dès le début de la lecture serait bénéfique pour maintenir l'intérêt des utilisateurs et faciliter leur interaction avec le contenu.

Un autre point à améliorer est la lisibilité du texte superposé aux images. Parfois, le contraste entre le texte et l'image de fond est insuffisant, rendant la lecture difficile. L'ajout d'un masque ou d'un fond semi-transparent derrière le texte pourrait résoudre ce problème, rendant les informations plus claires et accessibles.

En somme, bien que la base des interactions utilisateur dans One Pick soit prometteuse, quelques ajustements peuvent grandement améliorer l'expérience. En simplifiant les processus, en rendant les actions plus accessibles et en améliorant la lisibilité, l'application peut offrir une expérience plus fluide et agréable, répondant ainsi aux besoins variés des utilisateurs de manière cohérente et naturelle.

## Conclusion

L'analyse approfondie de l'application One Pick a mis en évidence plusieurs domaines nécessitant une attention immédiate pour améliorer l'expérience utilisateur et la performance globale. Les problèmes identifiés se répartissent principalement en quatre catégories : les problèmes de performance, les bugs et dysfonctionnements, les incohérences dans l'interface utilisateur, et les difficultés liées aux interactions.

**Résumé des principaux problèmes identifiés :**

- **Performance :** Des temps de chargement des images trop longs, un nombre élevé d’éléments récupérés simultanément, et une taille de bundle excessive ont été constatés. Ces problèmes impactent négativement la fluidité et la rapidité de l’application.
- **Bugs et Dysfonctionnements :** Des fenêtres modales multiples s’ouvrent lors d’une connexion lente, et les images de profil ne s’affichent pas correctement sur les appareils mobiles en raison de problèmes de connexion non sécurisée.
- **Interface Utilisateur :** Des incohérences dans l’espacement des éléments, des lacunes ergonomiques dans les interactions utilisateur, et un contraste insuffisant du texte sur certaines images sont présents.
- **Interactions Utilisateur :** Les processus de sélection de contenu et d'accès aux actions vidéo nécessitent des améliorations pour offrir une expérience plus fluide et intuitive.

**Priorisation des solutions :**

1. **Résolution des problèmes de performance :** La priorité doit être donnée à l’optimisation du temps de chargement des images, à la mise en place du chargement dynamique des éléments, et à la réduction de la taille du bundle. Ces améliorations auront un impact direct sur la réactivité de l’application et la satisfaction des utilisateurs.

2. **Correction des bugs critiques :** Les problèmes liés aux fenêtres modales multiples et aux images de profil doivent être résolus rapidement pour éviter des interruptions dans l’utilisation et garantir une expérience utilisateur cohérente sur toutes les plateformes.

3. **Amélioration de l’interface utilisateur :** Standardiser les espacements, améliorer l’ergonomie des interactions, et ajuster le contraste du texte sur les images sont des actions importantes pour renforcer la convivialité et l’accessibilité de l’application.

4. **Optimisation des interactions utilisateur :** Simplifier les processus de sélection de contenu et rendre les actions vidéo immédiatement accessibles sont des ajustements nécessaires pour une meilleure fluidité des interactions.

**Recommandations générales :**

Pour assurer un développement réussi à long terme, il est recommandé de continuer à surveiller et à évaluer les performances de l’application tout au long de son cycle de vie. Il est essentiel de maintenir une approche proactive en matière de tests et de retours utilisateurs pour détecter et résoudre les problèmes rapidement. De plus, il est conseillé de mettre en place des mécanismes de suivi et de mise à jour régulière pour garantir que l’application reste à la pointe des attentes et des normes technologiques.

Enfin, bien que cette analyse ait couvert plusieurs aspects cruciaux, il est important de noter que les inspections ne sont pas encore terminées. D’autres points pourront être identifiés et nécessiteront des ajustements supplémentaires pour perfectionner l’application. La poursuite de l’évaluation et de l’amélioration continue sera clé pour le succès à long terme de One Pick.
