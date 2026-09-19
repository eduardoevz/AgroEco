import { Crop, Disease, Farm, Plot, Diagnosis, FollowUp, UserProfile } from '@/types';

export const INITIAL_CROPS: Crop[] = [
  {
    id: 'arroz',
    name: 'Arroz',
    scientificName: 'Oryza sativa',
    description: 'Gramínea cereal cultivada ampliamente en zonas tropicales y templadas bajo riego o secano.',
    active: true,
  },
  {
    id: 'maiz',
    name: 'Maíz',
    scientificName: 'Zea mays',
    description: 'Cereal básico de grano alto en almidón, sensible a sequías y patógenos foliares.',
    active: true,
  },
  {
    id: 'frijol',
    name: 'Frijol',
    scientificName: 'Phaseolus vulgaris',
    description: 'Leguminosa de ciclo corto fundamental en rotación de cultivos y seguridad alimentaria.',
    active: true,
  },
  {
    id: 'cafe',
    name: 'Café',
    scientificName: 'Coffea arabica',
    description: 'Cultivo perenne de ladera tropical, altamente susceptible a variaciones climáticas y royas.',
    active: true,
  },
  {
    id: 'tomate',
    name: 'Tomate',
    scientificName: 'Solanum lycopersicum',
    description: 'Solanácea hortícola de alto valor comercial y alta exigencia de manejo integrado de plagas y hongos.',
    active: true,
  },
  {
    id: 'platano',
    name: 'Plátano',
    scientificName: 'Musa paradisiaca',
    description: 'Musácea de fruto esencial para la economía campesina y exportación agroindustrial.',
    active: true,
  },
];

export const INITIAL_DISEASES: Disease[] = [
  // ARROZ
  {
    id: 'pyricularia_arroz',
    cropId: 'arroz',
    name: 'Pyricularia',
    scientificName: 'Magnaporthe oryzae',
    type: 'fungal',
    description: 'Una de las enfermedades más destructivas del arroz, afecta hojas, nudos y panículas.',
    symptoms: [
      'Manchas en forma de rombo o huso con centro gris y bordes marrones en hojas.',
      'Lesiones oscuras en el cuello de la panícula que provocan espigas vanas.',
      'Estrés hídrico y amarillamiento progresivo.'
    ],
    recommendations: [
      'Utilizar variedades resistentes certificadas.',
      'Evitar la fertilización nitrogenada excesiva.',
      'Manejo adecuado de la lámina de agua en el lote.',
      'Aplicación oportuna de fungicidas triazoles o estrobirulinas al inicio de espigamiento si hay presión.'
    ],
    affectedParts: ['leaf', 'stem'],
    active: true,
  },
  {
    id: 'mancha_parda_arroz',
    cropId: 'arroz',
    name: 'Mancha parda',
    scientificName: 'Bipolaris oryzae',
    type: 'fungal',
    description: 'Enfermedad fúngica asociada comúnmente a suelos degradados o deficiencias nutricionales.',
    symptoms: [
      'Lesiones ovales a circulares de color castaño oscuro con halo amarillo.',
      'Decoloración y manchas oscuras en las semillas y grano.',
      'Disminución del vigor de plántulas.'
    ],
    recommendations: [
      'Corregir deficiencias de potasio, silicio y manganeso mediante análisis de suelo.',
      'Tratamiento térmico o químico de semillas antes de siembra.',
      'Rotación con leguminosas para recuperar estructura edáfica.'
    ],
    affectedParts: ['leaf', 'fruit'],
    active: true,
  },
  {
    id: 'tizon_bacteriano_arroz',
    cropId: 'arroz',
    name: 'Tizón bacteriano',
    scientificName: 'Xanthomonas oryzae pv. oryzae',
    type: 'bacterial',
    description: 'Infección vascular severa que ocasiona marchitez y secamiento foliar.',
    symptoms: [
      'Rayas longitudinales acuosas en los bordes de las hojas que avanzan hacia el centro.',
      'Hojas que se tornan blanco-amarillentas y mueren rápidamente ("kresek").',
      'Gotículas lechosas bacterianas visibles en las mañanas.'
    ],
    recommendations: [
      'Drenar temporalmente campos inundados para reducir propagación.',
      'Evitar daños mecánicos al follaje durante labores de cultivo.',
      'Desinfección estricta de herramientas de corte y maquinaria.'
    ],
    affectedParts: ['leaf'],
    active: true,
  },

  // MAÍZ
  {
    id: 'roya_comun_maiz',
    cropId: 'maiz',
    name: 'Roya común',
    scientificName: 'Puccinia sorghi',
    type: 'fungal',
    description: 'Enfermedad foliar frecuente en zonas templadas y alturas intermedias con alta humedad.',
    symptoms: [
      'Pústulas pulverulentas de color marrón canela en ambas caras de la hoja.',
      'Ruptura de la epidermis foliar y secamiento prematuro de hojas bajas.',
      'Reducción en el llenado de grano.'
    ],
    recommendations: [
      'Siembra de híbridos con tolerancia genética comprobada.',
      'Monitoreo semanal desde etapas vegetativas tempranas (V6-V8).',
      'Aplicación foliar de fungicidas sistémicos en umbral de daño económico.'
    ],
    affectedParts: ['leaf'],
    active: true,
  },
  {
    id: 'tizon_foliar_norte_maiz',
    cropId: 'maiz',
    name: 'Tizón foliar del norte',
    scientificName: 'Exserohilum turcicum',
    type: 'fungal',
    description: 'Provoca necrosis foliar extendida en climas frescos y húmedos.',
    symptoms: [
      'Lesiones elípticas grandes (2 a 15 cm) color verde grisáceo a marrón claro ("forma de cigarro").',
      'Fusión de manchas que queman franjas enteras de la hoja.',
      'Reducción drástica de área fotosintética útil.'
    ],
    recommendations: [
      'Incorporación profunda de rastrojos de cosecha anterior.',
      'Rotación de cultivos con especies no gramíneas.',
      'Fungicidas con mezclas de estrobirulinas y triazoles previo a floración.'
    ],
    affectedParts: ['leaf'],
    active: true,
  },
  {
    id: 'mancha_asfalto_maiz',
    cropId: 'maiz',
    name: 'Mancha de asfalto',
    scientificName: 'Phyllachora maydis',
    type: 'fungal',
    description: 'Complejo fúngico agresivo capaz de secar un cultivo entero en pocos días.',
    symptoms: [
      'Pequeñas protuberancias negras y brillantes como gotas de alquitrán o asfalto sobre el haz.',
      'Halo necrótico alrededor de los puntos negros conocido como "ojo de pescado".',
      'Secado violento de la planta entera.'
    ],
    recommendations: [
      'Monitoreo permanente en regiones endémicas con neblina constante.',
      'Intervención química inmediata al detectar los primeros ascostromas negros.',
      'Manejo de densidades de siembra para favorecer la circulación de aire.'
    ],
    affectedParts: ['leaf'],
    active: true,
  },

  // FRIJOL
  {
    id: 'antracnosis_frijol',
    cropId: 'frijol',
    name: 'Antracnosis',
    scientificName: 'Colletotrichum lindemuthianum',
    type: 'fungal',
    description: 'Afecta todas las partes aéreas de la planta en condiciones de humedad alta y temperatura fresca.',
    symptoms: [
      'Lesiones alargadas de color rojo oscuro a negro a lo largo de las nervaduras en el envés.',
      'Chancros hundidos con borde rojizo en tallos y vainas.',
      'Vainas deformadas con semillas manchadas.'
    ],
    recommendations: [
      'Uso exclusivo de semilla libre de patógenos.',
      'Evitar trabajar en el lote mientras el follaje esté húmedo por rocío.',
      'Tratamiento preventivo con cúpricos o fungicidas protectantes.'
    ],
    affectedParts: ['leaf', 'stem', 'fruit'],
    active: true,
  },
  {
    id: 'roya_frijol',
    cropId: 'frijol',
    name: 'Roya del frijol',
    scientificName: 'Uromyces appendiculatus',
    type: 'fungal',
    description: 'Patógeno cosmopolita que desfolia la planta durante floración y fructificación.',
    symptoms: [
      'Pústulas circulares diminutas color café rojizo en el envés rodeadas de halo clorótico.',
      'Caída prematura de hojas.',
      'Disminución del tamaño de vainas y número de granos.'
    ],
    recommendations: [
      'Variedades con genes de resistencia específicos.',
      'Eliminación de malezas hospederas y residuos de cosecha.',
      'Aplicaciones de azufre o triazoles según etapa fenológica.'
    ],
    affectedParts: ['leaf'],
    active: true,
  },
  {
    id: 'mosaico_comun_frijol',
    cropId: 'frijol',
    name: 'Mosaico común',
    scientificName: 'Bean common mosaic virus (BCMV)',
    type: 'viral',
    description: 'Enfermedad viral transmitida por pulgones y a través de semilla contaminada.',
    symptoms: [
      'Moteado verde claro y verde oscuro con deformación y arrugamiento foliar.',
      'Encrespamiento hacia abajo de los bordes de la lámina foliar.',
      'Achaparramiento general de la planta.'
    ],
    recommendations: [
      'Siembra de semilla certificada indexada para virus.',
      'Control de vectores (pulgones) con extractos botánicos o insecticidas selectivos.',
      'Eliminación y quema de plantas que muestren síntomas iniciales.'
    ],
    affectedParts: ['leaf'],
    active: true,
  },

  // CAFÉ
  {
    id: 'roya_cafe',
    cropId: 'cafe',
    name: 'Roya del café',
    scientificName: 'Hemileia vastatrix',
    type: 'fungal',
    description: 'La enfermedad más crítica de la caficultura tradicional, ocasiona defoliación severa y paloteo.',
    symptoms: [
      'Manchas amarillas translúcidas en el haz que luego generan polvo anaranjado en el envés.',
      'Caída masiva de hojas y aborto de flores/frutos.',
      'Pérdida de ramas productivas en la siguiente cosecha.'
    ],
    recommendations: [
      'Renovación con variedades resistentes (ej: Castillo, Cenicafé 1, Catimor).',
      'Poblaciones adecuadas y regulación de sombrío para reducir humedad estancada.',
      'Plan de fertilización balanceado con énfasis en nitrógeno y potasio.',
      'Calendario de aspersiones preventivas con fungicidas oxicloruro de cobre o sistémicos.'
    ],
    affectedParts: ['leaf'],
    active: true,
  },
  {
    id: 'ojo_de_gallo_cafe',
    cropId: 'cafe',
    name: 'Ojo de gallo',
    scientificName: 'Mycena citricolor',
    type: 'fungal',
    description: 'Hongo que prolifera en microclimas muy húmedos, sombreados y con baja temperatura.',
    symptoms: [
      'Manchas circulares bien delimitadas de color pardo claro que se blanquean al secarse.',
      'Pequeñas estructuras en forma de alfiler con cabeza amarilla (cabecitas) visibles sobre la mancha.',
      'Defoliación rápida de brotes nuevos y manchas en frutos verdes.'
    ],
    recommendations: [
      'Poda sanitaria de árboles de sombrío y deschuponado del cafeto.',
      'Favorecer el drenaje en pendientes y cañadas húmedas.',
      'Aplicación localizada de fungicidas cúpricos en focos iniciales.'
    ],
    affectedParts: ['leaf', 'fruit'],
    active: true,
  },
  {
    id: 'antracnosis_cafe',
    cropId: 'cafe',
    name: 'Antracnosis',
    scientificName: 'Colletotrichum coffeanum',
    type: 'fungal',
    description: 'Afecta frutos en desarrollo ("mancha de hierro") y provoca muerte descendente de ramas.',
    symptoms: [
      'Lesiones necróticas hundidas y oscuras sobre cerezas de café verdes y maduras.',
      'Muerte descendente ("die-back") de puntas de ramas desfoliadas.',
      'Pasmamiento y caída prematura de frutos.'
    ],
    recommendations: [
      'Protección contra granizadas y control de estrés fisiológico.',
      'Podas de saneamiento de ramas secas con desinfección de tijeras.',
      'Aplicación preventiva de protectores cúpricos durante llenado de fruto.'
    ],
    affectedParts: ['fruit', 'leaf', 'stem'],
    active: true,
  },

  // TOMATE
  {
    id: 'tizon_temprano_tomate',
    cropId: 'tomate',
    name: 'Tizón temprano',
    scientificName: 'Alternaria solani',
    type: 'fungal',
    description: 'Común en hojas senescentes y plantas bajo estrés por sequía o carga frutal.',
    symptoms: [
      'Manchas circulares oscuras con anillos concéntricos concéntricos ("diana").',
      'Amarillamiento del tejido sano circundante.',
      'Cancros oscuros en tallos de plántulas y lesiones cóncavas en la inserción del pedúnculo del fruto.'
    ],
    recommendations: [
      'Eliminar hojas bajas envejecidas (deshoje sanitario).',
      'Riego por goteo evitando mojar el follaje.',
      'Rotación de cultivos sin otras solanáceas por 2 a 3 años.'
    ],
    affectedParts: ['leaf', 'stem', 'fruit'],
    active: true,
  },
  {
    id: 'tizon_tardio_tomate',
    cropId: 'tomate',
    name: 'Tizón tardío',
    scientificName: 'Phytophthora infestans',
    type: 'fungal',
    description: 'Oomiceto extremadamente veloz y devastador en épocas lluviosas y frías.',
    symptoms: [
      'Manchas acuosas verde oscuro irregulares que viran a negro y parecen quemaduras por helada.',
      'Moho blanquecino en el envés de la hoja bajo alta humedad.',
      'Frutos con manchas pardo oscuras firmes de superficie rugosa.'
    ],
    recommendations: [
      'Monitoreo diario bajo condiciones de niebla o llovizna constante.',
      'Aplicaciones preventivas de fungicidas de contacto (mancozeb, clorotalonil, cobre).',
      'Destrucción inmediata de plantas con focos incontrolables.'
    ],
    affectedParts: ['leaf', 'fruit', 'stem'],
    active: true,
  },
  {
    id: 'oidio_tomate',
    cropId: 'tomate',
    name: 'Oídio',
    scientificName: 'Oidium neolycopersici',
    type: 'fungal',
    description: 'Hongo polvoriento que prospera en condiciones de invernadero y veranos cálidos secos.',
    symptoms: [
      'Polvillo blanco ceniciento que recubre el haz de las hojas.',
      'Amarillamiento y necrosis foliar bajo el polvillo.',
      'Reducción de tamaño de frutos por pérdida de follaje.'
    ],
    recommendations: [
      'Mejorar ventilación en invernaderos y microtúneles.',
      'Tratamientos con azufre soluble o bicarbonato de potasio.',
      'Biofungicidas a base de Bacillus subtilis.'
    ],
    affectedParts: ['leaf', 'stem'],
    active: true,
  },

  // PLÁTANO
  {
    id: 'sigatoka_negra_platano',
    cropId: 'platano',
    name: 'Sigatoka negra',
    scientificName: 'Pseudocercospora fijiensis',
    type: 'fungal',
    description: 'Es una de las enfermedades más importantes y destructivas del plátano a nivel global.',
    symptoms: [
      'Manchas oscuras en las hojas que evolucionan de rayas rojizas a estrías negras.',
      'Reducción drástica del área foliar fotosintética funcional.',
      'Puede disminuir severamente el tamaño y peso de los racimos y provocar maduración prematura.'
    ],
    recommendations: [
      'Deshoje fitosanitario temprano y oportuno cortando estrías antes de que esporulen.',
      'Mantenimiento de canales de drenaje para abatir la humedad ambiental en la plantación.',
      'Control de malezas y fertilización rica en silicio y potasio.',
      'Programa de rotación de fungicidas protectores y sistémicos respetando periodos de carencia.'
    ],
    affectedParts: ['leaf'],
    active: true,
  },
  {
    id: 'mal_de_panama_platano',
    cropId: 'platano',
    name: 'Mal de Panamá',
    scientificName: 'Fusarium oxysporum f. sp. cubense',
    type: 'fungal',
    description: 'Hongo del suelo letal y persistente que coloniza los haces vasculares de la planta.',
    symptoms: [
      'Amarillamiento progresivo de las hojas más viejas hacia las más jóvenes.',
      'Marchitez foliar con doblamiento de pecíolos formando una "falda" alrededor del pseudotallo.',
      'Decoloración vascular pardo-rojiza en cortes transversales del pseudotallo.',
      'Puede causar la muerte completa de la planta.'
    ],
    recommendations: [
      'Cuarentena estricta y bioseguridad en fincas (pediluvios con desinfectantes amonio cuaternario).',
      'Utilizar únicamente material de siembra libre de patógenos (vitroplantas).',
      'No movilizar suelo, calzado o maquinaria desde lotes sospechosos.',
      'Erradicación y aislamiento de plantas enfermas según protocolo oficial del ICA/entidad fitosanitaria.'
    ],
    affectedParts: ['stem', 'leaf'],
    active: true,
  },
  {
    id: 'moko_platano',
    cropId: 'platano',
    name: 'Moko del plátano',
    scientificName: 'Ralstonia solanacearum',
    type: 'bacterial',
    description: 'Enfermedad bacteriana devastadora y de rápida diseminación en el cultivo de plátano.',
    symptoms: [
      'Marchitez foliar acelerada y amarillamiento de la hoja bandera o brotes tiernos.',
      'Deterioro, pudrición seca y necrosis de tejidos internos vasculares del pseudotallo.',
      'Frutos con pulpa ennegrecida, seca o podrida interiormente antes de madurar.',
      'Exudado bacteriano al sumergir un segmento de tallo en agua limpia.'
    ],
    recommendations: [
      'Desinfección rigurosa de herramientas de corte (machetes, deshijadores) entre mata y mata con formol al 5% o cloro.',
      'Enfundado prematuro de racimos y desflore temprano para evitar transmisión por insectos polinizadores.',
      'Detección temprana e inyección de glifosato para erradicación in situ de la planta afectada y vecinas.',
      'Control riguroso de fuentes de agua de escorrentía que puedan arrastrar la bacteria.'
    ],
    affectedParts: ['stem', 'fruit', 'leaf'],
    active: true,
  },
  {
    id: 'pudricion_corona_frutos_platano',
    cropId: 'platano',
    name: 'Pudrición de corona y frutos',
    scientificName: 'Complejo fúngico postcosecha (Fusarium, Colletotrichum, Lasiodiplodia)',
    type: 'fungal',
    description: 'Afecta la calidad comercial del racimo y puede aparecer principalmente después de la cosecha.',
    symptoms: [
      'Oscurecimiento y pudrición blanda o seca de los tejidos del corte de la corona.',
      'Desprendimiento prematuro de los dedos del racimo durante transporte y almacenamiento.',
      'Favorecida por heridas mecánicas, desmane defectuoso y condiciones de alta humedad relativa.'
    ],
    recommendations: [
      'Cortes limpios y uniformes al momento del desmane con cuchillos curvos afilados.',
      'Lavado inmediato de racimos con agua clorada limpia para retirar látex.',
      'Tratamiento de la corona con pasta cicatrizante o fungicidas postcosecha autorizados.',
      'Transporte en condiciones óptimas de ventilación y temperatura.'
    ],
    affectedParts: ['fruit'],
    active: true,
  },
  {
    id: 'antracnosis_platano',
    cropId: 'platano',
    name: 'Antracnosis',
    scientificName: 'Colletotrichum spp.',
    type: 'fungal',
    description: 'Enfermedad que ataca la cáscara del fruto, disminuyendo radicalmente su valor comercial.',
    symptoms: [
      'Lesiones oscuras, redondeadas y deprimidas en la cáscara de los frutos.',
      'Masas mucilaginosas color rosado o salmón en el centro de las manchas con alta humedad.',
      'Puede desarrollarse y acelerarse durante las fases de maduración y almacenamiento.'
    ],
    recommendations: [
      'Enfundado de racimos con bolsas perforadas tratadas en fases tempranas.',
      'Evitar raspaduras y golpes durante la cosecha y embalaje.',
      'Almacenar frutos en lugares frescos, secos y bien ventilados.'
    ],
    affectedParts: ['fruit'],
    active: true,
  },
];

export const DEMO_USER: UserProfile = {
  id: 'demo-producer-1',
  name: 'Carlos Mendoza',
  email: 'carlos.mendoza@agrodemo.com',
  phone: '+57 312 456 7890',
  role: 'productor',
  createdAt: '2026-08-01T08:00:00.000Z',
  updatedAt: '2026-08-01T08:00:00.000Z',
};

export const INITIAL_FARMS: Farm[] = [
  {
    id: 'finca-el-paraiso',
    ownerId: 'demo-producer-1',
    name: 'Finca El Paraíso',
    description: 'Finca dedicada al cultivo tecnificado de plátano y café en ladera.',
    department: 'Quindío',
    municipality: 'Armenia',
    area: 18.5,
    areaUnit: 'ha',
    latitude: 4.5389,
    longitude: -75.6757,
    createdAt: '2026-08-10T10:00:00.000Z',
    updatedAt: '2026-08-10T10:00:00.000Z',
  },
  {
    id: 'finca-la-esmeralda',
    ownerId: 'demo-producer-1',
    name: 'Hacienda La Esmeralda',
    description: 'Lotes de producción de maíz y frijol bajo rotación de cultivos.',
    department: 'Valle del Cauca',
    municipality: 'Palmira',
    area: 32.0,
    areaUnit: 'ha',
    latitude: 3.5394,
    longitude: -76.3036,
    createdAt: '2026-08-15T09:30:00.000Z',
    updatedAt: '2026-08-15T09:30:00.000Z',
  },
];

export const INITIAL_PLOTS: Plot[] = [
  {
    id: 'lote-platano-1',
    farmId: 'finca-el-paraiso',
    ownerId: 'demo-producer-1',
    name: 'Lote Dominico Hartón',
    description: 'Plátano en etapa reproductiva media',
    cropId: 'platano',
    area: 8.5,
    areaUnit: 'ha',
    latitude: 4.5395,
    longitude: -75.6749,
    createdAt: '2026-08-11T11:00:00.000Z',
    updatedAt: '2026-08-11T11:00:00.000Z',
  },
  {
    id: 'lote-cafe-1',
    farmId: 'finca-el-paraiso',
    ownerId: 'demo-producer-1',
    name: 'Lote Café Castillo',
    description: 'Café en primer ciclo de zoca con sombrío de guamo',
    cropId: 'cafe',
    area: 10.0,
    areaUnit: 'ha',
    latitude: 4.5382,
    longitude: -75.6765,
    createdAt: '2026-08-11T11:30:00.000Z',
    updatedAt: '2026-08-11T11:30:00.000Z',
  },
  {
    id: 'lote-maiz-1',
    farmId: 'finca-la-esmeralda',
    ownerId: 'demo-producer-1',
    name: 'Parcela Maíz Híbrido',
    description: 'Maíz blanco para choclo',
    cropId: 'maiz',
    area: 20.0,
    areaUnit: 'ha',
    latitude: 3.5410,
    longitude: -76.3020,
    createdAt: '2026-08-16T14:00:00.000Z',
    updatedAt: '2026-08-16T14:00:00.000Z',
  },
];

export const INITIAL_DIAGNOSES: Diagnosis[] = [
  {
    id: 'diag-001',
    userId: 'demo-producer-1',
    farmId: 'finca-el-paraiso',
    plotId: 'lote-platano-1',
    cropId: 'platano',
    plantPart: 'leaf',
    imageUrl: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=800&auto=format&fit=crop&q=80',
    predictedDiseaseId: 'sigatoka_negra_platano',
    predictedDiseaseName: 'Sigatoka negra',
    confidence: 0.93,
    severity: 'high',
    latitude: 4.5396,
    longitude: -75.6748,
    gpsAccuracy: 4.2,
    status: 'monitoring',
    aiModelVersion: 'mock-v1.0.0',
    notes: 'Manchas rojizas oscuras observadas en las hojas 3 y 4 de la planta.',
    createdAt: '2026-09-08T10:15:00.000Z',
    updatedAt: '2026-09-09T14:00:00.000Z',
  },
  {
    id: 'diag-002',
    userId: 'demo-producer-1',
    farmId: 'finca-el-paraiso',
    plotId: 'lote-cafe-1',
    cropId: 'cafe',
    plantPart: 'leaf',
    imageUrl: 'https://images.unsplash.com/photo-1524350876685-274059332603?w=800&auto=format&fit=crop&q=80',
    predictedDiseaseId: 'roya_cafe',
    predictedDiseaseName: 'Roya del café',
    confidence: 0.89,
    severity: 'moderate',
    latitude: 4.5381,
    longitude: -75.6766,
    gpsAccuracy: 3.8,
    status: 'treated',
    aiModelVersion: 'mock-v1.0.0',
    notes: 'Presencia de pústulas anaranjadas en borde superior del lote.',
    createdAt: '2026-09-05T09:20:00.000Z',
    updatedAt: '2026-09-10T16:30:00.000Z',
  },
  {
    id: 'diag-003',
    userId: 'demo-producer-1',
    farmId: 'finca-el-paraiso',
    plotId: 'lote-platano-1',
    cropId: 'platano',
    plantPart: 'fruit',
    imageUrl: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=800&auto=format&fit=crop&q=80',
    predictedDiseaseId: 'antracnosis_platano',
    predictedDiseaseName: 'Antracnosis',
    confidence: 0.91,
    severity: 'moderate',
    latitude: 4.5401,
    longitude: -75.6742,
    gpsAccuracy: 5.0,
    status: 'controlled',
    aiModelVersion: 'mock-v1.0.0',
    notes: 'Lesiones oscuras superficiales en dedos del racimo.',
    createdAt: '2026-08-28T11:40:00.000Z',
    updatedAt: '2026-09-04T08:00:00.000Z',
  },
  {
    id: 'diag-004',
    userId: 'demo-producer-1',
    farmId: 'finca-la-esmeralda',
    plotId: 'lote-maiz-1',
    cropId: 'maiz',
    plantPart: 'leaf',
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop&q=80',
    predictedDiseaseId: 'mancha_asfalto_maiz',
    predictedDiseaseName: 'Mancha de asfalto',
    confidence: 0.95,
    severity: 'severe',
    latitude: 3.5412,
    longitude: -76.3018,
    gpsAccuracy: 3.1,
    status: 'detected',
    aiModelVersion: 'mock-v1.0.0',
    notes: 'Puntos negros tipo alquitrán en hojas del estrato medio.',
    createdAt: '2026-09-12T08:30:00.000Z',
    updatedAt: '2026-09-12T08:30:00.000Z',
  },
];

export const INITIAL_FOLLOWUPS: FollowUp[] = [
  {
    id: 'fol-001',
    diagnosisId: 'diag-001',
    userId: 'demo-producer-1',
    status: 'detected',
    notes: 'Detección inicial durante recorrido rutinario en Lote Dominico.',
    createdAt: '2026-09-08T10:15:00.000Z',
  },
  {
    id: 'fol-002',
    diagnosisId: 'diag-001',
    userId: 'demo-producer-1',
    status: 'monitoring',
    notes: 'Se marcó la planta con cinta testigo y se programó deshoje sanitario fitosanitario.',
    createdAt: '2026-09-09T14:00:00.000Z',
  },
  {
    id: 'fol-003',
    diagnosisId: 'diag-002',
    userId: 'demo-producer-1',
    status: 'detected',
    notes: 'Aparición de pústulas amarillentas en hojas del cafeto.',
    createdAt: '2026-09-05T09:20:00.000Z',
  },
  {
    id: 'fol-004',
    diagnosisId: 'diag-002',
    userId: 'demo-producer-1',
    status: 'treated',
    notes: 'Aplicación foliar de biofungicida a base de sales de cobre y balance nutricional.',
    createdAt: '2026-09-10T16:30:00.000Z',
  },
  {
    id: 'fol-005',
    diagnosisId: 'diag-003',
    userId: 'demo-producer-1',
    status: 'controlled',
    notes: 'Enfundado precoz de racimos y desmane limpio. Lesiones detenidas.',
    createdAt: '2026-09-04T08:00:00.000Z',
  },
];
