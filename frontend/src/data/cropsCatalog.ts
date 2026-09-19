export interface CropAgronomicDetail {
  id: string;
  name: string;
  scientificName: string;
  family: string;
  category: 'Musáceas' | 'Estimulantes y Perennes' | 'Hortalizas' | 'Cereales' | 'Leguminosas';
  badge: string;
  heroImage: string;
  summary: string;
  botany: {
    origin: string;
    growthHabit: string;
    rootSystem: string;
    ediblePart: string;
  };
  climateAndSoil: {
    altitude: string;
    temperature: string;
    rainfall: string;
    humidity: string;
    soilType: string;
    soilPh: string;
    sunlight: string;
  };
  cropCycle: {
    cycleLength: string;
    plantingDensity: string;
    averageYield: string;
    harvestWindow: string;
  };
  agronomicPractices: {
    irrigation: string;
    nutrition: string;
    management: string;
  };
  biosecurityAndAlerts: {
    quarantineAlert: string;
    keyRisks: string;
    goodPractices: string[];
  };
  diseaseIds: string[];
}

export const CROPS_CATALOG: CropAgronomicDetail[] = [
  {
    id: 'platano',
    name: 'Plátano',
    scientificName: 'Musa paradisiaca L. / Musa acuminata × balbisiana',
    family: 'Musaceae',
    category: 'Musáceas',
    badge: 'Seguridad Alimentaria y Exportación',
    heroImage: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=1200&q=80',
    summary: 'El plátano es una megaforbia perenne fundamental para la economía rural y la seguridad alimentaria en el trópico. Su producción requiere monitoreo continuo de lámina foliar y rigurosa sanidad vegetal ante patógenos destructivos del suelo y follaje.',
    botany: {
      origin: 'Sudeste Asiático (Indomalasia)',
      growthHabit: 'Planta herbácea gigante monocotiledónea con pseudotallo formado por vainas foliares imbricadas.',
      rootSystem: 'Fasciculado, adventicio y superficial (el 85% de las raíces funcionales se concentran en los primeros 30 cm de suelo).',
      ediblePart: 'Dedo o fruto partenocárpico en baya climatérica rica en carbohidratos complejos y potasio.',
    },
    climateAndSoil: {
      altitude: '0 a 1,400 m.s.n.m.',
      temperature: '22°C a 30°C (óptimo fisiológico a 26°C)',
      rainfall: '1,800 a 2,500 mm anuales bien distribuidos',
      humidity: '75% a 85% de humedad relativa',
      soilType: 'Francos a franco-arcillosos, profundos (>1 m), con excelente drenaje interno y sin compactación.',
      soilPh: '5.5 a 6.8',
      sunlight: '1,500 a 2,000 horas sol/año (requiere alta luminosidad)',
    },
    cropCycle: {
      cycleLength: '10 a 12 meses desde siembra hasta recolección de racimo.',
      plantingDensity: '1,600 a 2,000 plantas/ha (en monocultivo o agroforestería).',
      averageYield: '18 a 35 toneladas/ha/año de racimo comercial.',
      harvestWindow: 'Cosecha escalonada continua a lo largo del año mediante unidades de retorno.',
    },
    agronomicPractices: {
      irrigation: 'Riego por aspersión subfoliar o goteo en períodos con déficit hídrico superior a 100 mm/mes.',
      nutrition: 'Alta demanda de Potasio (K₂O) y Nitrógeno (N), con aportes balanceados de Magnesio y Silicio para rigidez foliar.',
      management: 'Deshije sistemático (madre-hijo-nieto), deshoje fitosanitario preventivo, enfundado de racimo y desflore temprano.',
    },
    biosecurityAndAlerts: {
      quarantineAlert: 'Fusarium oxysporum f. sp. cubense Raza 4 Tropical (R4T): Amenaza cuarentenaria global de erradicación obligatoria.',
      keyRisks: 'Encharcamientos prolongados disparan asfixia radical y facilitan la dispersión vascular de bacterias (Moko).',
      goodPractices: [
        'Desinfección obligatoria de machetes y herramientas con sales de amonio cuaternario o hipoclorito entre cada planta.',
        'Siembra exclusiva de plántulas micropropagadas in vitro certificadas por entidad fitosanitaria.',
        'Establecimiento de zanjas de drenaje primarias y secundarias con mantenimiento periódico antes de lluvias.',
        'Manejo integrado de malezas para evitar microclimas de sobresaturación en la base de la cepa.',
      ],
    },
    diseaseIds: [
      'sigatoka_negra_platano',
      'mal_de_panama_platano',
      'moko_platano',
      'pudricion_corona_frutos_platano',
    ],
  },
  {
    id: 'cafe',
    name: 'Café',
    scientificName: 'Coffea arabica L.',
    family: 'Rubiaceae',
    category: 'Estimulantes y Perennes',
    badge: 'Denominación de Origen y Calidad Especial',
    heroImage: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1200&q=80',
    summary: 'Especie leñosa perenne cultivada en laderas andinas y zonas de altitud tropical. Su producción sustenta a cientos de miles de familias campesinas y su rentabilidad depende de la sanidad foliar para garantizar óptimo llenado de cerezas y atributos en taza.',
    botany: {
      origin: 'Tierras altas de Etiopía (África Oriental)',
      growthHabit: 'Arbusto perenne con ramificación dimórfica (ejes ortotrópicos verticales y ramas plagiotrópicas productivas).',
      rootSystem: 'Pivotante vigorosa (hasta 1.5 m de profundidad) con densa cabellera de raíces absorbentes superficiales.',
      ediblePart: 'Semilla tostada procedente de drupa carnosa ("cereza") con mesocarpo mucilaginoso.',
    },
    climateAndSoil: {
      altitude: '1,200 a 2,100 m.s.n.m. (franja óptima de café arábica suave)',
      temperature: '17°C a 23°C (evitar temperaturas bajo 10°C y heladas)',
      rainfall: '1,600 a 2,400 mm anuales con bimodalidad de floración',
      humidity: '70% a 85%',
      soilType: 'Andisoles o suelos de origen volcánico, porosos, sueltos, con alta materia orgánica (>6%).',
      soilPh: '5.0 a 5.8 (ligeramente ácido)',
      sunlight: '1,600 a 1,800 horas sol/año; tolera sombrío agroforestal regulado (30-40%).',
    },
    cropCycle: {
      cycleLength: 'Perenne productiva de 20+ años; ciclo de renovación por zoque cada 5 a 7 años.',
      plantingDensity: '4,500 a 7,000 plantas/ha según variedad y pendiente.',
      averageYield: '15 a 30 sacos de 60 kg de café verde pergamino seco/ha.',
      harvestWindow: 'Concentrada en cosechas principales y "mitacas" o traviesas según floración inducida por lluvias.',
    },
    agronomicPractices: {
      irrigation: 'Predominantemente secano aprovechando el régimen pluviométrico bimodal; riego por goteo en verano severo.',
      nutrition: 'Planes fraccionados basados en análisis de suelo: Nitrógeno para brotación y Potasio durante llenado del grano.',
      management: 'Deschuponado periódico, podas sanitarias post-cosecha, manejo de sombrío con leguminosas arbóreas (guamos).',
    },
    biosecurityAndAlerts: {
      quarantineAlert: 'Vigilancia permanente de mutaciones virulentas de Hemileia vastatrix (Roya) y control de Broca del café (Hypothenemus hampei).',
      keyRisks: 'Fenómenos de La Niña con exceso de nubosidad y lloviznas persistentes disparan epidemias de Ojo de Gallo y Roya.',
      goodPractices: [
        'Renovación programada de lotes viejos con variedades compuestas resistentes como Castillo o Cenicafé 1.',
        'Muestreo epidemiológico mensual de 30 ramas al azar para determinar porcentaje de incidencia foliar.',
        'Manejo de coberturas vivas nobles que protejan el suelo de erosión hídrica en laderas sin competir por nutrientes.',
        'Calibración de aspersoras y uso de boquillas de cono hueco para asegurar cobertura total del envés de las hojas.',
      ],
    },
    diseaseIds: [
      'roya_cafe',
      'ojo_de_gallo_cafe',
      'antracnosis_cafe',
    ],
  },
  {
    id: 'tomate',
    name: 'Tomate',
    scientificName: 'Solanum lycopersicum L.',
    family: 'Solanaceae',
    category: 'Hortalizas',
    badge: 'Hortaliza Estratégica de Alto Rendimiento',
    heroImage: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=1200&q=80',
    summary: 'La hortaliza de mayor valor comercial y demanda en mercados frescos y agroindustriales. Posee una alta tasa de transpiración y es sumamente vulnerable a enfermedades criptogámicas aceleradas cuando concurren alta humedad y fluctuaciones térmicas.',
    botany: {
      origin: 'Región andina de Sudamérica (domesticado en Mesoamérica)',
      growthHabit: 'Herbácea perenne cultivada como anual; hábitos de crecimiento determinado o indeterminado tutorado.',
      rootSystem: 'Pivotante ramificada con raíces secundarias abundantes que exploran los primeros 40 a 60 cm de suelo.',
      ediblePart: 'Baya carnosa multilocular con alto contenido de licopeno, vitamina C y ácidos orgánicos.',
    },
    climateAndSoil: {
      altitude: '800 a 2,200 m.s.n.m.',
      temperature: '18°C a 27°C (diurna 22-25°C, nocturna 15-18°C para óptima fertilidad polínica)',
      rainfall: '400 a 600 mm por ciclo bajo fertirriego controlado',
      humidity: '60% a 70% (evitar >85% por riesgo extremo de tizón tardío)',
      soilType: 'Francos, franco-arenosos o franco-limosos, fértiles, aireados y con excelente capacidad de drenaje.',
      soilPh: '6.0 a 6.8',
      sunlight: 'Alta demanda lumínica (mínimo 8 horas de luz solar directa diaria).',
    },
    cropCycle: {
      cycleLength: '90 a 140 días según sea determinado a campo abierto o indeterminado en invernadero.',
      plantingDensity: '20,000 a 25,000 plantas/ha con tutorado en espaldera.',
      averageYield: '40 a 80 t/ha a campo abierto; hasta 120 a 180 t/ha bajo invernadero con fertirriego.',
      harvestWindow: 'Recolección continua en racimos de 2 a 3 veces por semana durante 6 a 12 semanas.',
    },
    agronomicPractices: {
      irrigation: 'Exclusivamente goteo localizado con láminas uniformes para evitar estrés osmótico y rajado de frutos.',
      nutrition: 'Alta demanda de Calcio y Boro para prevenir pudrición apical (Blossom End Rot); equilibrio N:K = 1:2 en fructificación.',
      management: 'Tutorado continuo, podas de chupones axilares semanales, deshoje basal sanitario de hojas viejas en senescencia.',
    },
    biosecurityAndAlerts: {
      quarantineAlert: 'Monitoreo de virus emergentes transmitidos por mosca blanca (Begomovirus) y Tomato Brown Rugose Fruit Virus (ToBRFV).',
      keyRisks: 'Lluvias nocturnas combinadas con hojas mojadas por más de 6 horas aseguran la infección fulminante de Phytophthora infestans.',
      goodPractices: [
        'Rotación estricta de cultivos sin sembrar solanáceas (papa, pimentón, berenjena) durante al menos 2 a 3 campañas.',
        'Desinfección previa del sustrato o solarización del suelo para abatir inóculos fúngicos y nemátodos.',
        'Mantenimiento de invernaderos con ventilación forzada o apertura cenital para impedir condensación de rocío.',
        'Manejo de trampas cromáticas amarillas y azules para detección temprana de vectores de virus.',
      ],
    },
    diseaseIds: [
      'tizon_temprano_tomate',
      'tizon_tardio_tomate',
      'oidio_tomate',
    ],
  },
  {
    id: 'maiz',
    name: 'Maíz',
    scientificName: 'Zea mays L.',
    family: 'Poaceae',
    category: 'Cereales',
    badge: 'Cereal Básico y Prensado Agroindustrial',
    heroImage: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=1200&q=80',
    summary: 'Cereal pilar de la alimentación humana y ganadera mundial. Planta C4 con extraordinaria eficiencia fotosintética, cuyo rendimiento depende críticamente de la disponibilidad de agua y nitrógeno entre las etapas de diferenciación floral y llenado de grano.',
    botany: {
      origin: 'Tierras medias de Mesoamérica (México)',
      growthHabit: 'Planta herbácea anual monocotiledónea con tallo único macizo y nudos conspicuos.',
      rootSystem: 'Fasciculado con raíces adventicias basales ("raíces fulcreas") que brindan anclaje contra el acame.',
      ediblePart: 'Cariópside o grano agrupado en espigas femeninas axilares protegidas por brácteas ("mazorca").',
    },
    climateAndSoil: {
      altitude: '0 a 2,800 m.s.n.m. (adaptación bioclimática amplia según germoplasma)',
      temperature: '20°C a 30°C (temperatura base de crecimiento: 10°C)',
      rainfall: '500 a 800 mm bien distribuidos durante el ciclo biológico',
      humidity: '55% a 75%',
      soilType: 'Francos a franco-limosos, profundos, con alta capacidad de retención de humedad y buena aireación.',
      soilPh: '5.8 a 7.0',
      sunlight: 'Planta heliófila C4 que maximiza radiación solar alta y días largos.',
    },
    cropCycle: {
      cycleLength: '110 a 160 días dependiendo del piso térmico y ciclo del híbrido/variedad.',
      plantingDensity: '55,000 a 75,000 plantas/ha.',
      averageYield: '4.5 a 11 toneladas de grano seco/ha bajo manejo tecnificado.',
      harvestWindow: 'Cosecha mecanizada o manual al alcanzar madurez fisiológica (capa negra en el grano, 18-22% de humedad).',
    },
    agronomicPractices: {
      irrigation: 'Crítico durante floración (espigamiento y emisión de estigmas) y llenado temprano de grano.',
      nutrition: 'Aplicación fraccionada de Nitrógeno (V3 y V6-V8); Fósforo a la siembra para vigor radicular y Zinc como microelemento clave.',
      management: 'Control de malezas temprano (primeros 35 días libres de competencia), manejo de densidades para evitar volcamiento.',
    },
    biosecurityAndAlerts: {
      quarantineAlert: 'Prevención de introducción de razas hipervirulentas de carbones y complejos fúngicos de pudrición de mazorca.',
      keyRisks: 'Complejo Mancha de Asfalto (Phyllachora maydis) puede causar senescencia total del cultivo en menos de 10 días.',
      goodPractices: [
        'Siembra de híbridos certificados con tolerancia genética a complejos de manchas foliares.',
        'Incorporación de rastrojos post-cosecha para acelerar la descomposición de ascostromas y esporas invernantes.',
        'Muestreo continuo de la etapa V6 para evaluar presencia de pústulas de roya en estratos foliares inferiores.',
        'Tratamiento curativo/preventivo de semillas con fungicidas sistémicos antes de la siembra.',
      ],
    },
    diseaseIds: [
      'roya_comun_maiz',
      'tizon_foliar_norte_maiz',
      'mancha_asfalto_maiz',
    ],
  },
  {
    id: 'arroz',
    name: 'Arroz',
    scientificName: 'Oryza sativa L.',
    family: 'Poaceae',
    category: 'Cereales',
    badge: 'Cereal de Inundación y Secano Tecnificado',
    heroImage: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=1200&q=80',
    summary: 'Cereal que nutre a más de la mitad de la población del planeta. Su cultivo se realiza en ecosistemas de riego bajo inundación o secano favorecido, con un manejo preciso del agua y la nutrición mineral para optimizar el macollamiento y evitar la caída del cultivo.',
    botany: {
      origin: 'Valles de los ríos Yangtsé y Ganges (Asia)',
      growthHabit: 'Herbácea anual semiacuática con macollas múltiples y hojas lanceoladas provistas de aurículas y lígula.',
      rootSystem: 'Fasciculado con aerénquima interno especializado para el transporte de oxígeno a zonas anóxicas inundadas.',
      ediblePart: 'Cariópside envuelto en lema y pálea ("cascarilla"), procesado como arroz blanco o integral.',
    },
    climateAndSoil: {
      altitude: '0 a 1,200 m.s.n.m.',
      temperature: '24°C a 32°C (temperaturas <18°C en microsporogénesis provocan esterilidad)',
      rainfall: '1,200 a 1,600 mm (o lámina de riego permanente de 5 a 10 cm)',
      humidity: '80% a 90%',
      soilType: 'Suelos pesados arcillosos o con piso de arado impermeable que retengan lámina hídrica.',
      soilPh: '5.5 a 6.5',
      sunlight: '2,000+ horas sol anuales; vital alta luminosidad en la fase de maduración del grano.',
    },
    cropCycle: {
      cycleLength: '115 a 145 días desde emergencia hasta madurez de cosecha.',
      plantingDensity: '90 a 130 kg de semilla certificada/ha (siembra directa con sembradora).',
      averageYield: '5.5 a 9.0 toneladas de arroz paddy verde por hectárea.',
      harvestWindow: 'Cosecha combinada cuando el 85% de las espiguillas exhiben color amarillo paja y humedad de 20-22%.',
    },
    agronomicPractices: {
      irrigation: 'Manejo escalonado de lámina de agua: drenajes intermitentes para control de gases y fijación de raíces.',
      nutrition: 'Plan de 4 a 5 abonadas fraccionadas con Nitrógeno, Fósforo, Potasio y aportes sustanciales de Silicio soluble.',
      management: 'Nivelación de suelos con tecnología láser para uniformidad de lámina, control químico/mecánico de arroz rojo y malezas.',
    },
    biosecurityAndAlerts: {
      quarantineAlert: 'Vigilancia de cepas resistentes de Pyricularia oryzae y de bacterias vasculares como Xanthomonas oryzae pv. oryzae.',
      keyRisks: 'Inversiones térmicas con rocío matutino prolongado y fertilización nitrogenada desbalanceada disparan Pyricularia en panícula.',
      goodPractices: [
        'Uso exclusivo de semilla certificada con prueba de pureza varietal y tratamiento fungicida previo.',
        'Drenaje oportuno de lotes infectados con bacteriosis para interrumpir la diseminación por agua circulante.',
        'Manejo de densidades de siembra óptimas para evitar canopeos excesivamente cerrados y húmedos.',
        'Limpieza y desinfección de cosechadoras y tractores para no dispersar malezas cuarentenarias y propágulos fúngicos.',
      ],
    },
    diseaseIds: [
      'pyricularia_arroz',
      'mancha_parda_arroz',
      'tizon_bacteriano_arroz',
    ],
  },
  {
    id: 'frijol',
    name: 'Frijol',
    scientificName: 'Phaseolus vulgaris L.',
    family: 'Fabaceae',
    category: 'Leguminosas',
    badge: 'Leguminosa Proteica y Fijadora de Nitrógeno',
    heroImage: 'https://images.unsplash.com/photo-1588879460618-9249e7d947d1?auto=format&fit=crop&w=1200&q=80',
    summary: 'Leguminosa de grano indispensable para la nutrición por su alto contenido de proteína vegetal y hierro. Destaca por su simbiosis biológica con bacterias del género Rhizobium, que fijan nitrógeno atmosférico y enriquecen la fertilidad del suelo.',
    botany: {
      origin: 'América Tropical (centros de domesticación Andino y Mesoamericano)',
      growthHabit: 'Herbácea anual con hábito determinado (arbustivo erecto) o indeterminado (voluble trepador).',
      rootSystem: 'Pivotante con nódulos radiculares activos que albergan colonias fijadoras de nitrógeno.',
      ediblePart: 'Semilla seca rica en aminoácidos esenciales, hierro, zinc y fibra dietética.',
    },
    climateAndSoil: {
      altitude: '600 a 2,200 m.s.n.m. según variedades mesoamericanas o andinas',
      temperature: '16°C a 24°C (temperaturas >30°C provocan abscisión violenta de flores)',
      rainfall: '350 a 500 mm durante el ciclo; alta susceptibilidad a anegamientos',
      humidity: '65% a 75%',
      soilType: 'Francos a franco-arenosos, livianos, con excelente aireación y sin capas endurecidas.',
      soilPh: '6.0 a 7.0 (muy sensible a suelos ácidos con aluminio tóxico)',
      sunlight: 'Mediana a alta heliofanía; fotoperiodo neutro a sensible según ecotipo.',
    },
    cropCycle: {
      cycleLength: '70 a 90 días en cultivares arbustivos; 100 a 130 días en cultivares trepadores.',
      plantingDensity: '180,000 a 220,000 plantas/ha (arbustivo) / 45,000 a 60,000 plantas/ha (tutorado).',
      averageYield: '1.2 a 2.8 toneladas de grano limpio seco por hectárea.',
      harvestWindow: 'Arranque cuando las vainas alcanzan color pajizo y el grano suena suelto en su interior (14% de humedad).',
    },
    agronomicPractices: {
      irrigation: 'Riego ligero por surcos o goteo; evitar estrictamente mojar el follaje para frenar bacteriosis y antracnosis.',
      nutrition: 'Inoculación de semilla con cepas eficientes de Rhizobium leguminosarum bv. phaseoli; fertilización con fósforo disponible.',
      management: 'Aporque en etapa V3 para vigorizar el anclaje, tutorado en espalderas para variedades volubles, rotación con gramíneas.',
    },
    biosecurityAndAlerts: {
      quarantineAlert: 'Control cuarentenario de transmisión viral por semilla (Bean Common Mosaic Virus) y gorgojos de almacén (Acanthoscelides obtectus).',
      keyRisks: 'Épocas de lloviznas persistentes con temperaturas frescas de 18-20°C desatan epifitias de Antracnosis foliar y en vainas.',
      goodPractices: [
        'Utilizar exclusivamente semilla certificada libre de virus transmitidos por embrión.',
        'Prohibir labores de laboreo o tránsito de trabajadores cuando el follaje se encuentre húmedo por rocío.',
        'Rotación estricta con maíz o gramíneas para quebrar el banco de esporas de hongos fitopatógenos en el suelo.',
        'Almacenamiento hermético del grano con pastillas fosforadas o silos metálicos para evitar plagas de postcosecha.',
      ],
    },
    diseaseIds: [
      'antracnosis_frijol',
      'roya_frijol',
      'mosaico_comun_frijol',
    ],
  },
];
