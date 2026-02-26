import { GuideTheme, GuideCard, CountryGuideEntry, CountryDestination } from '@/types';

export const guideThemes: GuideTheme[] = [
  { id: 'visa-admin', label: 'Visa & Démarches', icon: '📋', description: 'Visas, permis de travail, inscriptions consulaires...' },
  { id: 'logement', label: 'Logement', icon: '🏠', description: 'Trouver un logement, sites, colocation, baux...' },
  { id: 'budget-banque', label: 'Budget & Banque', icon: '💳', description: 'Ouvrir un compte, transferts, budget étudiant...' },
  { id: 'sante-assurance', label: 'Santé & Assurance', icon: '🏥', description: 'Assurance santé, systèmes de soins, mutuelles...' },
  { id: 'vie-quotidienne', label: 'Vie quotidienne', icon: '🍽️', description: 'Courses, téléphonie, culture locale, bons plans...' },
  { id: 'transport', label: 'Transport', icon: '🚇', description: 'Transports en commun, vélo, permis de conduire...' },
];

// === DESTINATIONS ===

export const destinations: CountryDestination[] = [
  { country: 'Royaume-Uni', flag: '🇬🇧', description: 'Londres, Manchester, Édimbourg...' },
  { country: 'Espagne', flag: '🇪🇸', description: 'Barcelone, Madrid, Valence...' },
  { country: 'Allemagne', flag: '🇩🇪', description: 'Berlin, Munich, Hambourg...' },
  { country: 'États-Unis', flag: '🇺🇸', description: 'New York, Los Angeles, Boston...' },
  { country: 'Chine', flag: '🇨🇳', description: 'Shanghai, Pékin, Shenzhen...' },
  { country: 'Australie', flag: '🇦🇺', description: 'Sydney, Melbourne, Brisbane...' },
  { country: 'Canada', flag: '🇨🇦', description: 'Montréal, Toronto, Vancouver...' },
  { country: 'Corée du Sud', flag: '🇰🇷', description: 'Séoul, Busan, Daegu...' },
  { country: 'Pays-Bas', flag: '🇳🇱', description: 'Amsterdam, Rotterdam, La Haye...' },
  { country: 'Irlande', flag: '🇮🇪', description: 'Dublin, Cork, Galway...' },
  { country: 'Japon', flag: '🇯🇵', description: 'Tokyo, Osaka, Kyoto...' },
  { country: 'Portugal', flag: '🇵🇹', description: 'Lisbonne, Porto, Faro...' },
  { country: 'Uruguay', flag: '🇺🇾', description: 'Montevideo, Punta del Este, Colonia...' },
  { country: 'Finlande', flag: '🇫🇮', description: 'Helsinki, Tampere, Turku...' },
  { country: 'Afrique du Sud', flag: '🇿🇦', description: 'Le Cap, Johannesburg, Durban...' },
  { country: 'Belgique', flag: '🇧🇪', description: 'Bruxelles, Louvain-la-Neuve, Gand...' },
];

// === GUIDES PAR PAYS (contenu principal) ===

export const countryGuideCards: Record<string, GuideCard[]> = {
  'Royaume-Uni': [
    {
      id: 'uk-visa', themeId: 'visa-admin', title: 'Visa étudiant (Student Visa)', icon: '🛂',
      description: 'Depuis le Brexit, un visa est obligatoire pour étudier au Royaume-Uni.',
      tips: [
        'Obtenez d\'abord votre CAS (Confirmation of Acceptance for Studies) de l\'université',
        'Demande en ligne sur le site UKVI, puis RDV biométrique au centre VFS',
        'Coût : ~£490 + Immigration Health Surcharge (~£776/an)',
        'Délai : 3-6 semaines, commencez tôt',
      ],
      resources: [
        { title: 'UKVI — Student Visa', url: 'https://www.gov.uk/student-visa', type: 'officiel' },
        { title: 'VFS Global UK', url: 'https://www.vfsglobal.co.uk/', type: 'site' },
      ],
    },
    {
      id: 'uk-logement', themeId: 'logement', title: 'Se loger au Royaume-Uni', icon: '🏠',
      description: 'Le marché locatif britannique est compétitif, surtout à Londres.',
      tips: [
        'SpareRoom est le n°1 pour les colocations',
        'Rightmove et Zoopla pour les locations classiques',
        'Budget colocation Londres : 700-1200£/mois, hors Londres : 400-700£',
        'Attention au council tax (exonération possible pour les étudiants)',
      ],
      resources: [
        { title: 'SpareRoom', url: 'https://www.spareroom.co.uk/', type: 'site' },
        { title: 'Rightmove', url: 'https://www.rightmove.co.uk/', type: 'site' },
      ],
    },
    {
      id: 'uk-banque', themeId: 'budget-banque', title: 'Banque & budget au UK', icon: '💳',
      description: 'Ouvrir un compte et gérer ses finances en livres sterling.',
      tips: [
        'Monzo ou Revolut pour un compte immédiat sans proof of address',
        'Barclays et HSBC proposent des comptes étudiants internationaux',
        'Wise pour les transferts EUR ↔ GBP sans frais cachés',
        'Budget étudiant moyen : 1000-1500£/mois à Londres',
      ],
      resources: [
        { title: 'Monzo', url: 'https://monzo.com/', type: 'app' },
        { title: 'Wise', url: 'https://wise.com/', type: 'app' },
      ],
    },
    {
      id: 'uk-sante', themeId: 'sante-assurance', title: 'Santé & NHS', icon: '🏥',
      description: 'Le NHS couvre les soins de base grâce à l\'IHS payée avec le visa.',
      tips: [
        'L\'IHS (Immigration Health Surcharge) est payée lors de la demande de visa',
        'Inscrivez-vous chez un GP (médecin généraliste) dès l\'arrivée',
        'Urgences (A&E) accessibles gratuitement',
        'Soins dentaires et optiques : partiellement couverts, prévoir un budget',
      ],
      resources: [
        { title: 'NHS — Find a GP', url: 'https://www.nhs.uk/service-search/find-a-gp', type: 'officiel' },
      ],
    },
    {
      id: 'uk-transport', themeId: 'transport', title: 'Se déplacer au UK', icon: '🚇',
      description: 'Transport en commun efficace mais coûteux, surtout à Londres.',
      tips: [
        'Oyster Card ou paiement sans contact pour le métro londonien',
        '18+ Student Oyster : 30% de réduction sur les abonnements',
        'National Rail : 16-25 Railcard pour 1/3 de réduction sur les trains',
        'Megabus et National Express pour les trajets longue distance pas chers',
      ],
      resources: [
        { title: 'TfL — Oyster', url: 'https://tfl.gov.uk/fares/free-and-discounted-travel/18-plus-student-oyster-photocard', type: 'officiel' },
        { title: '16-25 Railcard', url: 'https://www.16-25railcard.co.uk/', type: 'site' },
      ],
    },
  ],

  'Espagne': [
    {
      id: 'es-visa', themeId: 'visa-admin', title: 'NIE & démarches administratives', icon: '📋',
      description: 'Le NIE est le sésame pour toute vie administrative en Espagne.',
      tips: [
        'Le NIE (Número de Identidad de Extranjero) est obligatoire pour tout',
        'RDV en ligne sur sede.administracionespublicas.gob.es',
        'Apportez : passeport, justificatif de domicile, formulaire EX-15',
        'Empadronamiento (inscription municipale) à faire en parallèle',
      ],
      resources: [
        { title: 'Sede Electrónica — NIE', url: 'https://sede.administracionespublicas.gob.es/', type: 'officiel' },
      ],
    },
    {
      id: 'es-logement', themeId: 'logement', title: 'Se loger en Espagne', icon: '🏠',
      description: 'Marché accessible mais attention aux arnaques dans les grandes villes.',
      tips: [
        'Idealista est la référence n°1 pour la recherche',
        'Fotocasa et Milanuncios en complément',
        'Budget colocation Barcelone/Madrid : 400-700€/mois',
        'Ne payez JAMAIS avant d\'avoir visité (même en visio)',
      ],
      resources: [
        { title: 'Idealista', url: 'https://www.idealista.com/', type: 'site' },
        { title: 'Fotocasa', url: 'https://www.fotocasa.es/', type: 'site' },
      ],
    },
    {
      id: 'es-banque', themeId: 'budget-banque', title: 'Banque & budget en Espagne', icon: '💳',
      description: 'Ouvrir un compte est simple une fois le NIE obtenu.',
      tips: [
        'Sabadell, BBVA et CaixaBank : comptes jeunes sans frais',
        'Ouverture possible avec NIE + passeport',
        'Revolut et N26 fonctionnent très bien en Espagne',
        'Budget étudiant moyen : 800-1200€/mois selon la ville',
      ],
      resources: [
        { title: 'BBVA — Compte jeune', url: 'https://www.bbva.es/', type: 'site' },
      ],
    },
    {
      id: 'es-vie', themeId: 'vie-quotidienne', title: 'Vie quotidienne en Espagne', icon: '🍽️',
      description: 'Un rythme de vie différent qu\'il faut apprivoiser.',
      tips: [
        'Horaires décalés : déjeuner 14h-15h, dîner 21h-22h',
        'Mercadona, Lidl et Dia pour les courses pas chères',
        'La sieste est réelle : beaucoup de commerces ferment 14h-17h',
        'Vie nocturne intense : les Espagnols sortent tard (minuit+)',
      ],
      resources: [
        { title: 'Mercadona', url: 'https://www.mercadona.es/', type: 'site' },
      ],
    },
  ],

  'Allemagne': [
    {
      id: 'de-visa', themeId: 'visa-admin', title: 'Anmeldung & démarches', icon: '📋',
      description: 'L\'Anmeldung est LA démarche prioritaire à votre arrivée.',
      tips: [
        'Anmeldung obligatoire dans les 14 jours au Bürgeramt',
        'Prenez RDV en ligne (les créneaux partent vite à Berlin)',
        'Apportez : passeport, contrat de bail, formulaire Anmeldung',
        'Le Meldebescheinigung est nécessaire pour ouvrir un compte bancaire',
      ],
      resources: [
        { title: 'Berlin.de — Anmeldung', url: 'https://service.berlin.de/dienstleistung/120686/', type: 'officiel' },
      ],
    },
    {
      id: 'de-logement', themeId: 'logement', title: 'Se loger en Allemagne', icon: '🏠',
      description: 'Le marché est très tendu dans les grandes villes, surtout Berlin et Munich.',
      tips: [
        'WG-Gesucht est LE site pour les colocations (WG)',
        'Préparez un dossier complet : SCHUFA, fiches de paie, pièce d\'identité',
        'Budget colocation Berlin : 500-800€, Munich : 600-1000€',
        'Les Studentenwohnheime (résidences étudiantes) sont les moins chères',
      ],
      resources: [
        { title: 'WG-Gesucht', url: 'https://www.wg-gesucht.de/', type: 'site' },
        { title: 'Studierendenwerk', url: 'https://www.studierendenwerke.de/', type: 'officiel' },
      ],
    },
    {
      id: 'de-banque', themeId: 'budget-banque', title: 'Banque & budget en Allemagne', icon: '💳',
      description: 'L\'Allemagne utilise encore beaucoup le cash, mais les néo-banques changent la donne.',
      tips: [
        'N26 est basée à Berlin : ouverture 100% en ligne',
        'Deutsche Bank et Sparkasse avec le Meldebescheinigung',
        'Beaucoup de commerces n\'acceptent que le cash (EC-Karte)',
        'Budget étudiant moyen : 900-1300€/mois',
      ],
      resources: [
        { title: 'N26', url: 'https://n26.com/', type: 'app' },
      ],
    },
    {
      id: 'de-transport', themeId: 'transport', title: 'Se déplacer en Allemagne', icon: '🚇',
      description: 'Un réseau de transport excellent et un ticket national à prix fixe.',
      tips: [
        'Deutschlandticket : 49€/mois pour TOUS les transports régionaux',
        'BVG (Berlin), MVG (Munich) pour les transports locaux',
        'FlixBus et FlixTrain pour les longues distances pas cher',
        'Le vélo est très courant : Swapfiets pour la location longue durée',
      ],
      resources: [
        { title: 'Deutschlandticket', url: 'https://deutschlandticket.de/', type: 'officiel' },
        { title: 'Swapfiets', url: 'https://swapfiets.de/', type: 'site' },
      ],
    },
  ],

  'États-Unis': [
    {
      id: 'us-visa', themeId: 'visa-admin', title: 'Visa F-1 / J-1', icon: '🛂',
      description: 'Deux types de visa selon votre mobilité : études ou stage.',
      tips: [
        'F-1 pour les études universitaires, J-1 pour les stages/échanges',
        'Entretien obligatoire à l\'ambassade US à Paris',
        'Formulaire DS-160 + frais SEVIS ($350) + frais visa ($185)',
        'Commencez 4-6 mois avant le départ',
      ],
      resources: [
        { title: 'Ambassade US — Visas étudiants', url: 'https://fr.usembassy.gov/fr/visas-fr/etudier/', type: 'officiel' },
      ],
    },
    {
      id: 'us-logement', themeId: 'logement', title: 'Se loger aux États-Unis', icon: '🏠',
      description: 'Un marché très variable selon la ville. New York et SF sont les plus chers.',
      tips: [
        'Craigslist, StreetEasy (NYC), Zillow pour les recherches',
        'Les dorms universitaires : chers mais pratiques la 1ère année',
        'Budget colocation NYC : 1200-2000$/mois, autres villes : 600-1200$',
        'Le lease (bail) est généralement de 12 mois minimum',
      ],
      resources: [
        { title: 'Zillow', url: 'https://www.zillow.com/', type: 'site' },
        { title: 'StreetEasy (NYC)', url: 'https://streeteasy.com/', type: 'site' },
      ],
    },
    {
      id: 'us-sante', themeId: 'sante-assurance', title: 'Santé & assurance aux USA', icon: '🏥',
      description: 'AUCUNE couverture publique pour les étudiants. L\'assurance est OBLIGATOIRE.',
      tips: [
        'Votre université propose souvent une assurance (vérifiez les tarifs)',
        'Sinon : ISO, IMG ou assurance française type Chapka Cap Student',
        'Une visite aux urgences peut coûter 1000-5000$ sans assurance',
        'Emportez vos ordonnances traduites en anglais',
      ],
      resources: [
        { title: 'ISO — International Student Insurance', url: 'https://www.isoa.org/', type: 'site' },
        { title: 'Chapka — Cap Student', url: 'https://www.chapkadirect.fr/cap-student.html', type: 'site' },
      ],
    },
    {
      id: 'us-banque', themeId: 'budget-banque', title: 'Banque & budget aux USA', icon: '💳',
      description: 'Ouvrir un compte est facile, même sans SSN.',
      tips: [
        'Chase ou Bank of America : ouverture avec passeport + adresse US',
        'SSN non obligatoire pour ouvrir un compte basique',
        'Le système de credit score est important : commencez à le construire',
        'Budget étudiant moyen : 1500-3000$/mois selon la ville',
      ],
      resources: [
        { title: 'Chase — Student Checking', url: 'https://www.chase.com/personal/checking/student-checking', type: 'site' },
      ],
    },
  ],

  'Chine': [
    {
      id: 'cn-visa', themeId: 'visa-admin', title: 'Visa X1/X2 pour la Chine', icon: '🛂',
      description: 'Un visa spécifique études et un permis de résidence à obtenir sur place.',
      tips: [
        'Visa X1 pour études > 6 mois, X2 pour < 6 mois',
        'Demande au centre de visa chinois à Paris',
        'Permis de résidence à obtenir dans les 30 jours après l\'arrivée',
        'Examen médical obligatoire (peut être fait en France ou sur place)',
      ],
      resources: [
        { title: 'Centre de visa chinois Paris', url: 'https://www.visaforchina.cn/', type: 'officiel' },
      ],
    },
    {
      id: 'cn-vie', themeId: 'vie-quotidienne', title: 'Vie quotidienne en Chine', icon: '📱',
      description: 'Un écosystème digital unique au monde qu\'il faut maîtriser.',
      tips: [
        'WeChat est INDISPENSABLE : messagerie, paiement, réseaux sociaux, tout',
        'Installez un VPN AVANT de partir (Google, WhatsApp, Instagram bloqués)',
        'Alipay et WeChat Pay dominent : le cash est quasi mort en ville',
        'Taobao pour les achats en ligne, Meituan pour la livraison de repas',
      ],
      resources: [
        { title: 'ExpressVPN', url: 'https://www.expressvpn.com/', type: 'app' },
        { title: 'WeChat', url: 'https://www.wechat.com/', type: 'app' },
      ],
    },
    {
      id: 'cn-banque', themeId: 'budget-banque', title: 'Banque & paiement en Chine', icon: '💳',
      description: 'Le paiement mobile est roi. Un compte local est quasi indispensable.',
      tips: [
        'Ouvrez un compte Bank of China ou ICBC sur le campus',
        'Liez votre compte à WeChat Pay et Alipay',
        'Les cartes Visa/Mastercard ne sont pas acceptées partout',
        'Budget étudiant moyen : 3000-6000 CNY/mois (400-800€)',
      ],
      resources: [
        { title: 'Bank of China', url: 'https://www.boc.cn/en/', type: 'site' },
      ],
    },
    {
      id: 'cn-transport', themeId: 'transport', title: 'Se déplacer en Chine', icon: '🚇',
      description: 'Transports modernes, efficaces et très abordables.',
      tips: [
        'Métro ultra-moderne dans toutes les grandes villes (2-7 CNY/trajet)',
        'DiDi (le Uber chinois) pour les taxis',
        'Train à grande vitesse (Gaotie) pour voyager entre les villes',
        'App Amap (高德地图) pour la navigation locale',
      ],
      resources: [
        { title: 'DiDi', url: 'https://www.didiglobal.com/', type: 'app' },
        { title: 'Trip.com — Trains', url: 'https://www.trip.com/trains/', type: 'site' },
      ],
    },
  ],

  'Australie': [
    {
      id: 'au-visa', themeId: 'visa-admin', title: 'Visa étudiant (Subclass 500)', icon: '🛂',
      description: 'Le visa étudiant australien inclut le droit de travailler 48h/quinzaine.',
      tips: [
        'Demande en ligne sur ImmiAccount',
        'CoE (Confirmation of Enrolment) nécessaire de l\'université',
        'OSHC (assurance santé) obligatoire pour la demande',
        'WHV (Subclass 462) : alternative pour les stages courts (< 6 mois)',
      ],
      resources: [
        { title: 'ImmiAccount — Visa 500', url: 'https://immi.homeaffairs.gov.au/', type: 'officiel' },
      ],
    },
    {
      id: 'au-logement', themeId: 'logement', title: 'Se loger en Australie', icon: '🏠',
      description: 'Marché locatif en tension, surtout à Sydney et Melbourne.',
      tips: [
        'Domain.com.au et Flatmates.com.au pour la recherche',
        'Les loyers se paient à la SEMAINE en Australie',
        'Budget colocation Sydney : 250-400 AUD/semaine',
        'Inspections de groupe le samedi : arrivez tôt et avec votre dossier',
      ],
      resources: [
        { title: 'Domain', url: 'https://www.domain.com.au/', type: 'site' },
        { title: 'Flatmates', url: 'https://flatmates.com.au/', type: 'site' },
      ],
    },
    {
      id: 'au-sante', themeId: 'sante-assurance', title: 'OSHC & santé en Australie', icon: '🏥',
      description: 'L\'OSHC est obligatoire pour obtenir votre visa étudiant.',
      tips: [
        'OSHC obligatoire pour toute la durée du visa',
        'Fournisseurs populaires : Allianz, Medibank, Bupa',
        'Couvre les consultations GP, hôpitaux et prescriptions de base',
        'Coût : ~500-600 AUD/an',
      ],
      resources: [
        { title: 'OSHC Allianz', url: 'https://www.oshcallianzassistance.com.au/', type: 'site' },
      ],
    },
    {
      id: 'au-vie', themeId: 'vie-quotidienne', title: 'Vie quotidienne en Australie', icon: '🍽️',
      description: 'Coût de la vie élevé mais qualité de vie exceptionnelle.',
      tips: [
        'Woolworths et Coles : les deux supermarchés principaux',
        'Aldi pour économiser (même marques qu\'en Europe)',
        'Le salaire minimum est élevé (~$23 AUD/h) : le job étudiant aide',
        'Attention au soleil : crème solaire indispensable toute l\'année',
      ],
      resources: [
        { title: 'Fair Work — Salaire minimum', url: 'https://www.fairwork.gov.au/', type: 'officiel' },
      ],
    },
  ],

  'Canada': [
    {
      id: 'ca-visa', themeId: 'visa-admin', title: 'Permis d\'études canadien', icon: '📋',
      description: 'Demande en ligne avec des délais variables. CAQ obligatoire pour le Québec.',
      tips: [
        'Demande sur le site d\'IRCC (Immigration, Réfugiés et Citoyenneté Canada)',
        'CAQ (Certificat d\'Acceptation du Québec) obligatoire AVANT le permis d\'études',
        'Données biométriques à fournir au centre VFS',
        'Délai : 8-16 semaines, anticipez !',
      ],
      resources: [
        { title: 'IRCC — Permis d\'études', url: 'https://www.canada.ca/fr/immigration-refugies-citoyennete/services/etudier-canada.html', type: 'officiel' },
      ],
    },
    {
      id: 'ca-logement', themeId: 'logement', title: 'Se loger au Canada', icon: '🏠',
      description: 'Le marché varie énormément entre Montréal (abordable) et Toronto/Vancouver (cher).',
      tips: [
        'Kijiji et Facebook Marketplace pour Montréal',
        'PadMapper et Rentals.ca pour Toronto/Vancouver',
        'Montréal : le 1er juillet = jour du déménagement (tradition québécoise)',
        'Budget colocation : Montréal 500-800 CAD, Toronto 800-1500 CAD',
      ],
      resources: [
        { title: 'Kijiji', url: 'https://www.kijiji.ca/', type: 'site' },
        { title: 'PadMapper', url: 'https://www.padmapper.com/', type: 'site' },
      ],
    },
    {
      id: 'ca-banque', themeId: 'budget-banque', title: 'Banque & budget au Canada', icon: '💳',
      description: 'Les banques canadiennes offrent des comptes étudiants avantageux.',
      tips: [
        'Desjardins (Québec) ou TD/RBC : comptes étudiants sans frais',
        'Ouverture possible dès l\'arrivée avec permis d\'études',
        'Le pourboire (15-20%) est obligatoire au restaurant',
        'Budget étudiant moyen : 1200-2000 CAD/mois',
      ],
      resources: [
        { title: 'Desjardins — Étudiants', url: 'https://www.desjardins.com/', type: 'site' },
      ],
    },
    {
      id: 'ca-sante', themeId: 'sante-assurance', title: 'RAMQ & santé au Canada', icon: '🏥',
      description: 'Les étudiants français au Québec bénéficient de la RAMQ grâce à un accord bilatéral.',
      tips: [
        'Au Québec : formulaire SE-401-Q-106 de la CPAM AVANT de partir',
        'Hors Québec : assurance privée obligatoire (UHIP en Ontario)',
        'Pharmacies : Pharmaprix/Shoppers Drug Mart partout',
        'Le formulaire RAMQ est gratuit mais les délais sont longs',
      ],
      resources: [
        { title: 'RAMQ — Étudiants français', url: 'https://www.ramq.gouv.qc.ca/', type: 'officiel' },
      ],
    },
  ],

  'Corée du Sud': [
    {
      id: 'kr-visa', themeId: 'visa-admin', title: 'Visa D-2 & ARC', icon: '📋',
      description: 'Visa d\'études et carte de résident étranger à obtenir sur place.',
      tips: [
        'Visa D-2 pour études universitaires, demande au consulat coréen',
        'ARC (Alien Registration Card) à obtenir dans les 90 jours',
        'L\'ARC est nécessaire pour : banque, téléphone, location',
        'Rendez-vous à l\'Immigration Office le plus proche de votre campus',
      ],
      resources: [
        { title: 'HiKorea — Immigration', url: 'https://www.hikorea.go.kr/', type: 'officiel' },
      ],
    },
    {
      id: 'kr-vie', themeId: 'vie-quotidienne', title: 'Vie quotidienne en Corée', icon: '🍽️',
      description: 'Une culture fascinante avec des codes sociaux uniques.',
      tips: [
        'KakaoTalk est l\'app de messagerie n°1 (l\'équivalent de WhatsApp)',
        'Carte T-money pour le métro, bus et convenience stores',
        'Les convenience stores (CU, GS25) sont ouverts 24h/24',
        'La street food est délicieuse et très abordable (2000-5000 KRW)',
      ],
      resources: [
        { title: 'KakaoTalk', url: 'https://www.kakaocorp.com/page/service/service/KakaoTalk', type: 'app' },
      ],
    },
    {
      id: 'kr-logement', themeId: 'logement', title: 'Se loger en Corée du Sud', icon: '🏠',
      description: 'Un système locatif unique au monde avec le Jeonse et le Wolse.',
      tips: [
        'Goshiwon : petites chambres meublées, économiques (300-500K KRW/mois)',
        'Oneroom : studios classiques (500-800K KRW/mois)',
        'Système Jeonse : grosse caution (pas de loyer), peu adapté aux étudiants',
        'Dabang et Zigbang : apps de recherche immobilière',
      ],
      resources: [
        { title: 'Dabang', url: 'https://www.dabangapp.com/', type: 'app' },
      ],
    },
    {
      id: 'kr-banque', themeId: 'budget-banque', title: 'Banque & budget en Corée', icon: '💳',
      description: 'L\'ARC est nécessaire pour ouvrir un compte bancaire.',
      tips: [
        'KEB Hana Bank et Woori Bank : agences proches des campus',
        'ARC obligatoire pour ouvrir un compte',
        'Kakao Bank : 100% en ligne une fois le compte ouvert',
        'Budget étudiant moyen : 800K-1.5M KRW/mois (550-1000€)',
      ],
      resources: [
        { title: 'KEB Hana Bank', url: 'https://www.kebhana.com/', type: 'site' },
      ],
    },
  ],

  'Pays-Bas': [
    {
      id: 'nl-visa', themeId: 'visa-admin', title: 'BSN & démarches aux Pays-Bas', icon: '📋',
      description: 'Le BSN est le numéro indispensable pour toute vie administrative.',
      tips: [
        'BSN (Burgerservicenummer) : RDV à la municipalité dès l\'arrivée',
        'Nécessaire pour : banque, assurance, travail, téléphone',
        'Délai d\'obtention : 1-2 semaines après le RDV',
        'Les citoyens UE n\'ont pas besoin de visa mais doivent s\'enregistrer',
      ],
      resources: [
        { title: 'Gemeente Amsterdam — BSN', url: 'https://www.amsterdam.nl/en/civil-affairs/first-registration/', type: 'officiel' },
      ],
    },
    {
      id: 'nl-logement', themeId: 'logement', title: 'Se loger aux Pays-Bas', icon: '🏠',
      description: 'Le marché est extrêmement tendu, surtout à Amsterdam.',
      tips: [
        'Kamernet est la plateforme principale pour les chambres étudiantes',
        'Pararius pour les locations complètes',
        'Budget Amsterdam : 700-1200€/mois, autres villes : 400-800€',
        'Inscrivez-vous sur les listes d\'attente des résidences étudiantes tôt',
      ],
      resources: [
        { title: 'Kamernet', url: 'https://kamernet.nl/', type: 'site' },
        { title: 'Pararius', url: 'https://www.pararius.nl/', type: 'site' },
      ],
    },
    {
      id: 'nl-transport', themeId: 'transport', title: 'Se déplacer aux Pays-Bas', icon: '🚲',
      description: 'Le vélo est ROI aux Pays-Bas. C\'est le moyen de transport n°1.',
      tips: [
        'Achetez un vélo dès le premier jour (occasion : 50-150€)',
        'Swapfiets : location de vélo à 17€/mois',
        'OV-chipkaart pour les transports en commun (train, tram, bus)',
        'NS (train) offre des réductions le week-end et en heures creuses',
      ],
      resources: [
        { title: 'Swapfiets', url: 'https://swapfiets.nl/', type: 'site' },
        { title: 'NS — Trains', url: 'https://www.ns.nl/', type: 'officiel' },
      ],
    },
    {
      id: 'nl-sante', themeId: 'sante-assurance', title: 'Assurance santé aux Pays-Bas', icon: '🏥',
      description: 'L\'assurance santé locale est obligatoire si vous travaillez aux Pays-Bas.',
      tips: [
        'Si vous travaillez : assurance locale obligatoire (~120€/mois)',
        'Si vous êtes uniquement étudiant : la CEAM peut suffire',
        'Fournisseurs populaires : Zilveren Kruis, CZ, VGZ',
        'Huisarts (médecin traitant) : inscription obligatoire pour consulter',
      ],
      resources: [
        { title: 'Zilveren Kruis', url: 'https://www.zilverenkruis.nl/', type: 'site' },
      ],
    },
  ],

  'Irlande': [
    {
      id: 'ie-visa', themeId: 'visa-admin', title: 'PPS Number & démarches', icon: '📋',
      description: 'Le PPS Number est le premier document à obtenir en Irlande.',
      tips: [
        'PPS Number : indispensable pour travailler, demande au Social Welfare Office',
        'Citoyens UE : pas de visa nécessaire',
        'GNIB/IRP pour les non-UE : carte de séjour obligatoire',
        'Apportez : passeport, preuve d\'adresse, lettre d\'admission',
      ],
      resources: [
        { title: 'MyWelfare — PPS', url: 'https://www.mywelfare.ie/', type: 'officiel' },
      ],
    },
    {
      id: 'ie-logement', themeId: 'logement', title: 'Se loger en Irlande', icon: '🏠',
      description: 'Dublin est en crise du logement. Commencez vos recherches très tôt.',
      tips: [
        'Daft.ie est LA référence pour la recherche',
        'Budget colocation Dublin : 800-1400€/mois',
        'Les villes comme Cork ou Galway sont plus abordables',
        'Méfiez-vous des annonces trop belles : arnaques fréquentes',
      ],
      resources: [
        { title: 'Daft.ie', url: 'https://www.daft.ie/', type: 'site' },
      ],
    },
    {
      id: 'ie-banque', themeId: 'budget-banque', title: 'Banque & budget en Irlande', icon: '💳',
      description: 'Ouverture de compte facile avec le PPS Number.',
      tips: [
        'AIB ou Bank of Ireland : comptes étudiants gratuits',
        'Revolut est très utilisé en Irlande (même entre irlandais)',
        'PPS Number nécessaire pour l\'ouverture de compte',
        'Budget étudiant moyen : 1200-1800€/mois à Dublin',
      ],
      resources: [
        { title: 'AIB — Student Account', url: 'https://aib.ie/', type: 'site' },
      ],
    },
    {
      id: 'ie-vie', themeId: 'vie-quotidienne', title: 'Vie quotidienne en Irlande', icon: '🍽️',
      description: 'Ambiance chaleureuse et pub culture, mais coût de la vie élevé.',
      tips: [
        'Tesco, Aldi et Lidl pour les courses',
        'Leap Card pour les transports de Dublin (bus, Luas, DART)',
        'La culture du pub est centrale : c\'est là qu\'on socialise',
        'La météo est imprévisible : investissez dans un bon imperméable',
      ],
      resources: [
        { title: 'Leap Card', url: 'https://www.leapcard.ie/', type: 'site' },
      ],
    },
  ],

  'Japon': [
    {
      id: 'jp-visa', themeId: 'visa-admin', title: 'Visa étudiant & COE', icon: '🛂',
      description: 'L\'université obtient votre COE, puis vous demandez le visa au consulat.',
      tips: [
        'L\'université demande le COE (Certificate of Eligibility) pour vous',
        'Avec le COE, demandez le visa au consulat du Japon en France',
        'Inscription à la mairie (役所) dans les 14 jours après l\'arrivée',
        'Carte de résident (在留カード) délivrée à l\'aéroport',
      ],
      resources: [
        { title: 'Ambassade du Japon — Visas', url: 'https://www.fr.emb-japan.go.jp/itpr_fr/visa.html', type: 'officiel' },
      ],
    },
    {
      id: 'jp-vie', themeId: 'vie-quotidienne', title: 'Vie quotidienne au Japon', icon: '🍜',
      description: 'Un pays fascinant avec ses propres codes et un quotidien très organisé.',
      tips: [
        'Les konbini (7-Eleven, Lawson, FamilyMart) sont vos meilleurs amis',
        'Le Japon fonctionne encore beaucoup en cash',
        'Les poubelles publiques sont rares : gardez vos déchets avec vous',
        'Ponctualité absolue : le train part à la seconde près',
      ],
      resources: [
        { title: 'Japan Guide', url: 'https://www.japan-guide.com/', type: 'site' },
      ],
    },
    {
      id: 'jp-logement', themeId: 'logement', title: 'Se loger au Japon', icon: '🏠',
      description: 'Un système unique avec des frais d\'entrée élevés.',
      tips: [
        'GaijinPot Apartments : le site adapté aux étrangers',
        'Suumo et Homes.co.jp : sites japonais (en japonais)',
        'Reikin (cadeau au propriétaire) + Shikikin (caution) : 2-4 mois de loyer',
        'Les résidences étudiantes universitaires évitent ces frais',
      ],
      resources: [
        { title: 'GaijinPot Apartments', url: 'https://apartments.gaijinpot.com/', type: 'site' },
      ],
    },
    {
      id: 'jp-transport', themeId: 'transport', title: 'Se déplacer au Japon', icon: '🚄',
      description: 'Le réseau ferroviaire japonais est le meilleur au monde.',
      tips: [
        'Carte Suica ou Pasmo pour le métro et les trains locaux',
        'Japan Rail Pass pour voyager dans le pays (si éligible)',
        'Google Maps fonctionne parfaitement pour les horaires de train',
        'Le vélo est très courant pour les trajets quotidiens',
      ],
      resources: [
        { title: 'Japan Rail Pass', url: 'https://www.japanrailpass.net/', type: 'site' },
        { title: 'Suica', url: 'https://www.jreast.co.jp/e/pass/suica.html', type: 'officiel' },
      ],
    },
  ],

  'Portugal': [
    {
      id: 'pt-visa', themeId: 'visa-admin', title: 'NIF & démarches au Portugal', icon: '📋',
      description: 'Le NIF est le numéro fiscal indispensable pour toute démarche.',
      tips: [
        'NIF (Número de Identificação Fiscal) : demande aux Finanças',
        'Nécessaire pour : louer, travailler, ouvrir un compte bancaire',
        'Citoyens UE : pas de visa, mais inscription au SEF recommandée',
        'Le NIF peut être obtenu en ligne ou en personne',
      ],
      resources: [
        { title: 'Portal das Finanças', url: 'https://www.portaldasfinancas.gov.pt/', type: 'officiel' },
      ],
    },
    {
      id: 'pt-logement', themeId: 'logement', title: 'Se loger au Portugal', icon: '🏠',
      description: 'Les prix ont explosé ces dernières années, surtout à Lisbonne.',
      tips: [
        'Idealista est la plateforme principale',
        'OLX et Imovirtual en complément',
        'Budget colocation Lisbonne : 500-900€/mois',
        'Porto est plus abordable : 350-600€/mois en colocation',
      ],
      resources: [
        { title: 'Idealista Portugal', url: 'https://www.idealista.pt/', type: 'site' },
        { title: 'OLX', url: 'https://www.olx.pt/', type: 'site' },
      ],
    },
    {
      id: 'pt-banque', themeId: 'budget-banque', title: 'Banque & budget au Portugal', icon: '💳',
      description: 'Des banques accessibles et un coût de la vie encore raisonnable.',
      tips: [
        'ActivoBank : compte gratuit, 100% en ligne',
        'Millennium BCP : la plus grande banque portugaise',
        'NIF obligatoire pour ouvrir un compte',
        'Budget étudiant moyen : 700-1100€/mois',
      ],
      resources: [
        { title: 'ActivoBank', url: 'https://www.activobank.pt/', type: 'site' },
      ],
    },
    {
      id: 'pt-vie', themeId: 'vie-quotidienne', title: 'Vie quotidienne au Portugal', icon: '🍽️',
      description: 'Un cadre de vie agréable avec un coût plus bas qu\'en France.',
      tips: [
        'Pingo Doce et Continente : les supermarchés principaux',
        'Lidl et Auchan pour les bons plans',
        'La cuisine portugaise est généreuse et pas chère (menu du jour ~7-10€)',
        'Le café (un expresso) coûte ~0.70€ au comptoir',
      ],
      resources: [
        { title: 'Pingo Doce', url: 'https://www.pingodoce.pt/', type: 'site' },
      ],
    },
  ],

  'Uruguay': [
    {
      id: 'uy-visa', themeId: 'visa-admin', title: 'Visa & démarches en Uruguay', icon: '📋',
      description: 'L\'Uruguay est très ouvert aux étudiants étrangers, les formalités sont simples.',
      tips: [
        'Les citoyens français peuvent rester 90 jours sans visa (tourisme)',
        'Pour un séjour long : demander la cédula provisoire à la Dirección Nacional de Migración',
        'Inscription consulaire recommandée à l\'ambassade de France à Montevideo',
        'L\'apostille de La Haye est souvent demandée pour les diplômes',
      ],
      resources: [
        { title: 'Dirección Nacional de Migración', url: 'https://www.gub.uy/direccion-nacional-migracion/', type: 'officiel' },
      ],
    },
    {
      id: 'uy-logement', themeId: 'logement', title: 'Se loger en Uruguay', icon: '🏠',
      description: 'Marché locatif accessible, surtout à Montevideo.',
      tips: [
        'Infocasas et MercadoLibre immuebles : les sites de référence',
        'Colocation à Montevideo : 300-600 USD/mois',
        'Les quartiers Pocitos, Cordón et Parque Rodó sont prisés par les étudiants',
        'Le dépôt de garantie est généralement d\'un mois de loyer',
      ],
      resources: [
        { title: 'Infocasas', url: 'https://www.infocasas.com.uy/', type: 'site' },
        { title: 'MercadoLibre Inmuebles', url: 'https://inmuebles.mercadolibre.com.uy/', type: 'site' },
      ],
    },
    {
      id: 'uy-banque', themeId: 'budget-banque', title: 'Banque & budget en Uruguay', icon: '💳',
      description: 'Un pays dollarisé où le peso uruguayen coexiste avec le dollar.',
      tips: [
        'BROU (Banco República) : la banque publique, la plus courante',
        'Prex et Midinero : cartes prépayées sans compte bancaire',
        'Beaucoup de transactions se font en dollars US',
        'Budget étudiant moyen : 800-1200 USD/mois à Montevideo',
      ],
      resources: [
        { title: 'BROU', url: 'https://www.brou.com.uy/', type: 'site' },
      ],
    },
    {
      id: 'uy-vie', themeId: 'vie-quotidienne', title: 'Vie quotidienne en Uruguay', icon: '🍽️',
      description: 'Un pays tranquille avec une culture du maté et de l\'asado.',
      tips: [
        'Le maté est partout : c\'est un rituel social incontournable',
        'Asado le dimanche : tradition sacrée des Uruguayens',
        'Tienda Inglesa, Devoto et Ta-Ta pour les courses',
        'Le pays est très sûr comparé au reste de l\'Amérique latine',
      ],
      resources: [
        { title: 'Guide Uruguay — France Diplomatie', url: 'https://www.diplomatie.gouv.fr/fr/conseils-aux-voyageurs/conseils-par-pays-destination/uruguay/', type: 'officiel' },
      ],
    },
  ],

  'Finlande': [
    {
      id: 'fi-visa', themeId: 'visa-admin', title: 'Permis de séjour & démarches', icon: '📋',
      description: 'Les citoyens UE peuvent s\'installer librement, mais l\'enregistrement est recommandé.',
      tips: [
        'Citoyens UE : enregistrement auprès du DVV (Digital and Population Data Services Agency)',
        'Le personal identity code (henkilötunnus) est indispensable pour tout',
        'Non-UE : permis de séjour étudiant sur le Finnish Immigration Service (Migri)',
        'Inscription à la Kela (sécurité sociale) possible après 2 ans de résidence',
      ],
      resources: [
        { title: 'DVV — Enregistrement', url: 'https://dvv.fi/en/', type: 'officiel' },
        { title: 'Migri — Permis de séjour', url: 'https://migri.fi/en/', type: 'officiel' },
      ],
    },
    {
      id: 'fi-logement', themeId: 'logement', title: 'Se loger en Finlande', icon: '🏠',
      description: 'Des résidences étudiantes abordables gérées par des fondations.',
      tips: [
        'HOAS (Helsinki), TYS (Turku), TOAS (Tampere) : résidences étudiantes subventionnées',
        'Budget étudiant Helsinki : 400-700€/mois en résidence',
        'Oikotie.fi et Vuokraovi.com pour les locations privées',
        'Postulez aux résidences étudiantes dès l\'acceptation dans l\'université',
      ],
      resources: [
        { title: 'HOAS', url: 'https://www.hoas.fi/en/', type: 'site' },
        { title: 'Oikotie', url: 'https://www.oikotie.fi/', type: 'site' },
      ],
    },
    {
      id: 'fi-banque', themeId: 'budget-banque', title: 'Banque & budget en Finlande', icon: '💳',
      description: 'Un pays très digitalisé où le cash est quasiment inexistant.',
      tips: [
        'Nordea et OP sont les banques principales pour les étudiants',
        'Le personal identity code est obligatoire pour ouvrir un compte',
        'MobilePay est très utilisé pour les paiements entre particuliers',
        'Budget étudiant moyen : 800-1200€/mois (Helsinki plus cher)',
      ],
      resources: [
        { title: 'Nordea', url: 'https://www.nordea.fi/', type: 'site' },
      ],
    },
    {
      id: 'fi-vie', themeId: 'vie-quotidienne', title: 'Vie quotidienne en Finlande', icon: '🍽️',
      description: 'Le pays du sauna, de la nature et des repas étudiants subventionnés.',
      tips: [
        'Les cantines étudiantes (Unicafe, Juvenes) : repas complet à 2.95€ !',
        'Le sauna fait partie de la culture : votre résidence en aura sûrement un',
        'S-Market et K-Market pour les courses, Lidl pour économiser',
        'L\'hiver est long et sombre : investissez dans de la vitamine D et un bon manteau',
      ],
      resources: [
        { title: 'Frank App — Carte étudiant', url: 'https://frank.fi/', type: 'app' },
      ],
    },
    {
      id: 'fi-transport', themeId: 'transport', title: 'Se déplacer en Finlande', icon: '🚇',
      description: 'Transports efficaces et réduction étudiante significative.',
      tips: [
        'HSL (Helsinki) : pass étudiant avec réduction de ~50%',
        'VR (trains nationaux) : réductions étudiantes sur tous les trajets',
        'Le vélo est très courant même en hiver (pistes dégagées)',
        'Onnibus pour les trajets longue distance pas chers',
      ],
      resources: [
        { title: 'HSL — Helsinki', url: 'https://www.hsl.fi/en/', type: 'officiel' },
        { title: 'VR — Trains', url: 'https://www.vr.fi/en/', type: 'officiel' },
      ],
    },
  ],

  'Afrique du Sud': [
    {
      id: 'za-visa', themeId: 'visa-admin', title: 'Visa d\'études pour l\'Afrique du Sud', icon: '🛂',
      description: 'Un visa spécifique est obligatoire pour les études.',
      tips: [
        'Visa d\'études (Study Visa) demandé à l\'ambassade d\'Afrique du Sud à Paris',
        'Documents : lettre d\'admission, preuve financière, certificat médical, casier judiciaire',
        'Délai : 4-8 semaines, anticipez bien',
        'Renouvellement possible sur place au Department of Home Affairs',
      ],
      resources: [
        { title: 'VFS Global — Afrique du Sud', url: 'https://www.vfsglobal.com/southafrica/france/', type: 'officiel' },
      ],
    },
    {
      id: 'za-logement', themeId: 'logement', title: 'Se loger en Afrique du Sud', icon: '🏠',
      description: 'Un marché abordable mais il faut bien choisir son quartier.',
      tips: [
        'Property24 et Gumtree SA pour la recherche',
        'Budget colocation Le Cap : 3000-6000 ZAR/mois (150-300€)',
        'Quartiers prisés au Cap : Observatory, Rondebosch, Mowbray (proches de UCT)',
        'Sécurité : privilégiez les complexes sécurisés avec gardien',
      ],
      resources: [
        { title: 'Property24', url: 'https://www.property24.com/', type: 'site' },
        { title: 'Gumtree SA', url: 'https://www.gumtree.co.za/', type: 'site' },
      ],
    },
    {
      id: 'za-banque', themeId: 'budget-banque', title: 'Banque & budget en Afrique du Sud', icon: '💳',
      description: 'Coût de la vie très avantageux pour les étudiants européens.',
      tips: [
        'FNB, Nedbank ou Capitec : comptes étudiants faciles à ouvrir',
        'TymeBank : 100% digital, sans frais de tenue de compte',
        'Le rand sud-africain (ZAR) rend la vie très abordable',
        'Budget étudiant moyen : 6000-10000 ZAR/mois (300-500€)',
      ],
      resources: [
        { title: 'FNB', url: 'https://www.fnb.co.za/', type: 'site' },
        { title: 'Capitec', url: 'https://www.capitecbank.co.za/', type: 'site' },
      ],
    },
    {
      id: 'za-vie', themeId: 'vie-quotidienne', title: 'Vie quotidienne en Afrique du Sud', icon: '🍽️',
      description: 'Un pays incroyable entre nature, diversité culturelle et braai.',
      tips: [
        'Le braai (barbecue sud-africain) est une institution : soyez prêt !',
        'Pick n Pay, Woolworths et Checkers pour les courses',
        'Load shedding (coupures d\'électricité planifiées) : téléchargez l\'app EskomSePush',
        '11 langues officielles mais l\'anglais est parlé partout',
      ],
      resources: [
        { title: 'EskomSePush', url: 'https://sepush.co.za/', type: 'app' },
      ],
    },
    {
      id: 'za-transport', themeId: 'transport', title: 'Se déplacer en Afrique du Sud', icon: '🚗',
      description: 'Le transport en commun est limité, Uber est votre meilleur allié.',
      tips: [
        'Uber et Bolt sont abordables et le moyen le plus sûr de se déplacer',
        'MyCiTi Bus au Cap : réseau fiable et sécurisé',
        'Gautrain à Johannesburg : train rapide vers l\'aéroport et Pretoria',
        'Évitez les minibus taxis si vous ne connaissez pas bien les itinéraires',
      ],
      resources: [
        { title: 'MyCiTi', url: 'https://www.myciti.org.za/', type: 'officiel' },
        { title: 'Gautrain', url: 'https://www.gautrain.co.za/', type: 'officiel' },
      ],
    },
  ],

  'Belgique': [
    {
      id: 'be-visa', themeId: 'visa-admin', title: 'Démarches administratives en Belgique', icon: '📋',
      description: 'En tant que citoyen UE, les formalités sont simplifiées mais l\'inscription communale est obligatoire.',
      tips: [
        'Inscription à la commune obligatoire dans les 8 jours après l\'arrivée',
        'Apportez : passeport/carte d\'identité, contrat de bail, preuve d\'inscription universitaire',
        'Vous recevrez une carte de séjour (Annexe 8) valable 5 ans',
        'Le numéro de registre national est nécessaire pour banque, mutuelle et téléphone',
      ],
      resources: [
        { title: 'Belgium.be — Inscription', url: 'https://www.belgium.be/fr/famille/identite/inscription', type: 'officiel' },
      ],
    },
    {
      id: 'be-logement', themeId: 'logement', title: 'Se loger en Belgique', icon: '🏠',
      description: 'Un marché locatif accessible avec des kots étudiants typiquement belges.',
      tips: [
        'Le "kot" est la chambre étudiante belge : meublé, partagé, abordable',
        'Immoweb et BruxellesEtudiant pour la recherche',
        'Budget kot Bruxelles : 400-650€/mois charges comprises',
        'Louvain-la-Neuve : ville 100% étudiante, kots à partir de 350€',
        'La garantie locative est de 2-3 mois de loyer, souvent sur un compte bloqué',
      ],
      resources: [
        { title: 'Immoweb', url: 'https://www.immoweb.be/', type: 'site' },
        { title: 'Kot.brussels', url: 'https://www.bruxelles-logement.be/', type: 'officiel' },
      ],
    },
    {
      id: 'be-banque', themeId: 'budget-banque', title: 'Banque & budget en Belgique', icon: '💳',
      description: 'Ouvrir un compte est simple et le coût de la vie est raisonnable.',
      tips: [
        'ING, KBC et Belfius proposent des comptes étudiants gratuits',
        'Numéro de registre national nécessaire pour l\'ouverture',
        'Bancontact/Payconiq est le moyen de paiement local (pas Visa partout)',
        'Budget étudiant moyen : 800-1100€/mois à Bruxelles',
      ],
      resources: [
        { title: 'KBC — Compte étudiant', url: 'https://www.kbc.be/', type: 'site' },
        { title: 'Payconiq by Bancontact', url: 'https://www.payconiq.be/', type: 'app' },
      ],
    },
    {
      id: 'be-sante', themeId: 'sante-assurance', title: 'Santé & mutuelle en Belgique', icon: '🏥',
      description: 'Le système belge rembourse environ 75% des frais médicaux via la mutuelle.',
      tips: [
        'Inscription à une mutuelle obligatoire (Partenamut, Mutualité Chrétienne, Solidaris...)',
        'La CEAM française couvre les soins de base mais une mutuelle belge est recommandée',
        'Consultation chez le médecin : ~25€, remboursée à ~75%',
        'Les pharmacies de garde fonctionnent 24h/24 le week-end',
      ],
      resources: [
        { title: 'Partenamut', url: 'https://www.partenamut.be/', type: 'site' },
        { title: 'INAMI', url: 'https://www.inami.fgov.be/', type: 'officiel' },
      ],
    },
    {
      id: 'be-vie', themeId: 'vie-quotidienne', title: 'Vie quotidienne en Belgique', icon: '🍟',
      description: 'Frites, bières, gaufres et convivialité : la Belgique a un charme fou.',
      tips: [
        'Colruyt, Delhaize et Aldi pour les courses (Colruyt est le moins cher)',
        'La culture des cafés et brasseries est incontournable : 1500+ bières belges !',
        'Le folklore étudiant est très présent : baptêmes, guindailles, cercles',
        'La Belgique est trilingue : français à Bruxelles/Wallonie, néerlandais en Flandre',
      ],
      resources: [
        { title: 'Visit Brussels', url: 'https://www.visit.brussels/', type: 'site' },
      ],
    },
    {
      id: 'be-transport', themeId: 'transport', title: 'Se déplacer en Belgique', icon: '🚆',
      description: 'Un petit pays très bien desservi en transports en commun.',
      tips: [
        'STIB (Bruxelles) : abonnement étudiant ~50€/an via l\'université',
        'SNCB : Go Pass 10 trajets pour 53€ (pour les -26 ans)',
        'TEC (Wallonie) et De Lijn (Flandre) pour les bus régionaux',
        'Le pays est petit : Bruxelles-Gand en 30 min, Bruxelles-Liège en 50 min',
      ],
      resources: [
        { title: 'STIB — Bruxelles', url: 'https://www.stib-mivb.be/', type: 'officiel' },
        { title: 'SNCB — Go Pass', url: 'https://www.belgiantrain.be/fr/tickets-and-railcards/gopass1', type: 'officiel' },
      ],
    },
  ],
};

// === GUIDES UNIVERSELS (valables pour tous les pays) ===

export const universalGuides: GuideCard[] = [
  {
    id: 'univ-1', themeId: 'visa-admin', title: 'Inscription consulaire', icon: '🏛️',
    description: 'Inscrivez-vous au registre des Français établis hors de France.',
    tips: [
      'Inscription gratuite et facultative mais fortement recommandée',
      'Nécessaire pour voter depuis l\'étranger',
      'Facilite le renouvellement de papiers d\'identité',
    ],
    resources: [
      { title: 'Service-public.fr', url: 'https://www.service-public.fr/particuliers/vosdroits/F33307', type: 'officiel' },
    ],
  },
  {
    id: 'univ-2', themeId: 'budget-banque', title: 'Bourses & aides financières', icon: '💰',
    description: 'Les principales aides pour financer sa mobilité internationale.',
    tips: [
      'Bourse Erasmus+ : jusqu\'à 600€/mois selon la destination',
      'Aide à la mobilité internationale (AMI) : 400€/mois',
      'Vérifiez les aides de votre région et de votre école',
    ],
    resources: [
      { title: 'Erasmus+', url: 'https://erasmus-plus.ec.europa.eu/', type: 'officiel' },
      { title: 'Bourses du MESR', url: 'https://www.etudiant.gouv.fr/fr/bourses-et-aides-financieres-702', type: 'officiel' },
    ],
  },
  {
    id: 'univ-3', themeId: 'sante-assurance', title: 'CEAM (Europe)', icon: '💊',
    description: 'Carte Européenne d\'Assurance Maladie : gratuite et indispensable en Europe.',
    tips: [
      'Demandez-la sur ameli.fr 2 semaines avant le départ',
      'Valable dans l\'UE + Suisse, Norvège, Islande',
      'Ne couvre pas tout : une complémentaire reste recommandée',
    ],
    resources: [
      { title: 'Commander sa CEAM', url: 'https://www.ameli.fr/assure/droits-demarches/europe-international/carte-europeenne-assurance-maladie-ceam/carte-europeenne-assurance-maladie-ceam', type: 'officiel' },
    ],
  },
  {
    id: 'univ-4', themeId: 'vie-quotidienne', title: 'Apps indispensables', icon: '⚡',
    description: 'Les applications utiles quel que soit votre pays de destination.',
    tips: [
      'Google Translate : téléchargez les langues hors-ligne',
      'XE Currency : conversion de devises en temps réel',
      'Meetup : rencontrer des gens partout dans le monde',
    ],
    resources: [
      { title: 'Google Translate', url: 'https://translate.google.com/', type: 'app' },
      { title: 'Meetup', url: 'https://www.meetup.com/', type: 'app' },
    ],
  },
  {
    id: 'univ-5', themeId: 'transport', title: 'Voyager en Europe pas cher', icon: '✈️',
    description: 'Bus, train, avion : les bons plans pour se déplacer.',
    tips: [
      'FlixBus et BlaBlaCar pour les trajets inter-villes',
      'Le pass Interrail est rentable pour 4+ trajets en train',
      'Omio compare tous les modes de transport',
    ],
    resources: [
      { title: 'Omio', url: 'https://www.omio.com/', type: 'site' },
      { title: 'Interrail', url: 'https://www.interrail.eu/fr', type: 'site' },
    ],
  },
];

// === DONNÉES CONTEXTUELLES (pour le modal parrain) ===

export const countryGuides: CountryGuideEntry[] = destinations.map((dest) => {
  const cards = countryGuideCards[dest.country] || [];
  return {
    country: dest.country,
    tips: cards.slice(0, 4).map((card) => ({
      themeId: card.themeId,
      icon: card.icon,
      title: card.title,
      shortText: card.description,
    })),
  };
});

export function getCountryGuide(country: string): CountryGuideEntry | undefined {
  return countryGuides.find((g) => g.country === country);
}
