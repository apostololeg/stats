export function timezoneCity2Country(timeZone) {
  if (!timeZone) return null;

  const city = timeZone.split('/').slice(-1)[0];
  const country = Object.entries(MAP).find(([country, cities]) =>
    cities.includes(city)
  )?.[0];

  return country;
}

const MAP = {
  Andorra: ['Andorra'],
  'United Arab Emirates': ['Dubai'],
  Afghanistan: ['Kabul'],
  Albania: ['Tirane'],
  Armenia: ['Yerevan'],
  Antarctica: [
    'Casey',
    'Davis',
    'Mawson',
    'Palmer',
    'Rothera',
    'Troll',
    'Vostok',
    'McMurdo',
    'DumontDUrville',
    'Syowa',
  ],
  Argentina: [
    'Buenos_Aires',
    'Cordoba',
    'Salta',
    'Jujuy',
    'Tucuman',
    'Catamarca',
    'La_Rioja',
    'San_Juan',
    'Mendoza',
    'San_Luis',
    'Rio_Gallegos',
    'Ushuaia',
  ],
  'Samoa (American)': ['Pago_Pago'],
  Austria: ['Vienna'],
  Australia: [
    'Lord_Howe',
    'Macquarie',
    'Hobart',
    'Melbourne',
    'Sydney',
    'Broken_Hill',
    'Brisbane',
    'Lindeman',
    'Adelaide',
    'Darwin',
    'Perth',
    'Eucla',
  ],
  Azerbaijan: ['Baku'],
  Barbados: ['Barbados'],
  Bangladesh: ['Dhaka'],
  Belgium: ['Brussels'],
  Bulgaria: ['Sofia'],
  Bermuda: ['Bermuda'],
  Brunei: ['Brunei'],
  Bolivia: ['La_Paz'],
  Brazil: [
    'Noronha',
    'Belem',
    'Fortaleza',
    'Recife',
    'Araguaina',
    'Maceio',
    'Bahia',
    'Sao_Paulo',
    'Campo_Grande',
    'Cuiaba',
    'Santarem',
    'Porto_Velho',
    'Boa_Vista',
    'Manaus',
    'Eirunepe',
    'Rio_Branco',
  ],
  Bhutan: ['Thimphu'],
  Belarus: ['Minsk'],
  Belize: ['Belize'],
  Canada: [
    'St_Johns',
    'Halifax',
    'Glace_Bay',
    'Moncton',
    'Goose_Bay',
    'Toronto',
    'Nipigon',
    'Thunder_Bay',
    'Iqaluit',
    'Pangnirtung',
    'Winnipeg',
    'Rainy_River',
    'Resolute',
    'Rankin_Inlet',
    'Regina',
    'Swift_Current',
    'Edmonton',
    'Cambridge_Bay',
    'Yellowknife',
    'Inuvik',
    'Dawson_Creek',
    'Fort_Nelson',
    'Whitehorse',
    'Dawson',
    'Vancouver',
    'Blanc-Sablon',
    'Atikokan',
    'Creston',
  ],
  'Cocos (Keeling) Islands': ['Cocos'],
  Switzerland: ['Zurich'],
  "Côte d'Ivoire": ['Abidjan'],
  'Cook Islands': ['Rarotonga'],
  Chile: ['Santiago', 'Punta_Arenas', 'Easter'],
  China: ['Shanghai', 'Urumqi'],
  Colombia: ['Bogota'],
  'Costa Rica': ['Costa_Rica'],
  Cuba: ['Havana'],
  'Cape Verde': ['Cape_Verde'],
  'Christmas Island': ['Christmas'],
  Cyprus: ['Nicosia', 'Famagusta'],
  'Czech Republic': ['Prague'],
  Germany: ['Berlin', 'Busingen'],
  Denmark: ['Copenhagen'],
  'Dominican Republic': ['Santo_Domingo'],
  Algeria: ['Algiers'],
  Ecuador: ['Guayaquil', 'Galapagos'],
  Estonia: ['Tallinn'],
  Egypt: ['Cairo'],
  'Western Sahara': ['El_Aaiun'],
  Spain: ['Madrid', 'Ceuta', 'Canary'],
  Finland: ['Helsinki'],
  Fiji: ['Fiji'],
  'Falkland Islands': ['Stanley'],
  Micronesia: ['Chuuk', 'Pohnpei', 'Kosrae'],
  'Faroe Islands': ['Faroe'],
  France: ['Paris'],
  'Britain (UK)': ['London'],
  Georgia: ['Tbilisi'],
  'French Guiana': ['Cayenne'],
  Gibraltar: ['Gibraltar'],
  Greenland: ['Nuuk', 'Danmarkshavn', 'Scoresbysund', 'Thule'],
  Greece: ['Athens'],
  'South Georgia & the South Sandwich Islands': ['South_Georgia'],
  Guatemala: ['Guatemala'],
  Guam: ['Guam'],
  'Guinea-Bissau': ['Bissau'],
  Guyana: ['Guyana'],
  'Hong Kong': ['Hong_Kong'],
  Honduras: ['Tegucigalpa'],
  Haiti: ['Port-au-Prince'],
  Hungary: ['Budapest'],
  Indonesia: ['Jakarta', 'Pontianak', 'Makassar', 'Jayapura'],
  Ireland: ['Dublin'],
  Israel: ['Jerusalem'],
  India: ['Kolkata'],
  'British Indian Ocean Territory': ['Chagos'],
  Iraq: ['Baghdad'],
  Iran: ['Tehran'],
  Iceland: ['Reykjavik'],
  Italy: ['Rome'],
  Jamaica: ['Jamaica'],
  Jordan: ['Amman'],
  Japan: ['Tokyo'],
  Kenya: ['Nairobi'],
  Kyrgyzstan: ['Bishkek'],
  Kiribati: ['Tarawa', 'Kanton', 'Kiritimati'],
  'Korea (North)': ['Pyongyang'],
  'Korea (South)': ['Seoul'],
  Kazakhstan: [
    'Almaty',
    'Qyzylorda',
    'Qostanay',
    'Aqtobe',
    'Aqtau',
    'Atyrau',
    'Oral',
  ],
  Lebanon: ['Beirut'],
  'Sri Lanka': ['Colombo'],
  Liberia: ['Monrovia'],
  Lithuania: ['Vilnius'],
  Luxembourg: ['Luxembourg'],
  Latvia: ['Riga'],
  Libya: ['Tripoli'],
  Morocco: ['Casablanca'],
  Monaco: ['Monaco'],
  Moldova: ['Chisinau'],
  'Marshall Islands': ['Majuro', 'Kwajalein'],
  'Myanmar (Burma)': ['Yangon'],
  Mongolia: ['Ulaanbaatar', 'Hovd', 'Choibalsan'],
  Macau: ['Macau'],
  Martinique: ['Martinique'],
  Malta: ['Malta'],
  Mauritius: ['Mauritius'],
  Maldives: ['Maldives'],
  Mexico: [
    'Mexico_City',
    'Cancun',
    'Merida',
    'Monterrey',
    'Matamoros',
    'Mazatlan',
    'Chihuahua',
    'Ojinaga',
    'Hermosillo',
    'Tijuana',
    'Bahia_Banderas',
  ],
  Malaysia: ['Kuala_Lumpur', 'Kuching'],
  Mozambique: ['Maputo'],
  Namibia: ['Windhoek'],
  'New Caledonia': ['Noumea'],
  'Norfolk Island': ['Norfolk'],
  Nigeria: ['Lagos'],
  Nicaragua: ['Managua'],
  Netherlands: ['Amsterdam'],
  Norway: ['Oslo'],
  Nepal: ['Kathmandu'],
  Nauru: ['Nauru'],
  Niue: ['Niue'],
  'New Zealand': ['Auckland', 'Chatham'],
  Panama: ['Panama'],
  Peru: ['Lima'],
  'French Polynesia': ['Tahiti', 'Marquesas', 'Gambier'],
  'Papua New Guinea': ['Port_Moresby', 'Bougainville'],
  Philippines: ['Manila'],
  Pakistan: ['Karachi'],
  Poland: ['Warsaw'],
  'St Pierre & Miquelon': ['Miquelon'],
  Pitcairn: ['Pitcairn'],
  'Puerto Rico': ['Puerto_Rico'],
  Palestine: ['Gaza', 'Hebron'],
  Portugal: ['Lisbon', 'Madeira', 'Azores'],
  Palau: ['Palau'],
  Paraguay: ['Asuncion'],
  Qatar: ['Qatar'],
  Réunion: ['Reunion'],
  Romania: ['Bucharest'],
  Serbia: ['Belgrade'],
  Russia: [
    'Kaliningrad',
    'Moscow',
    'Simferopol',
    'Kirov',
    'Volgograd',
    'Astrakhan',
    'Saratov',
    'Ulyanovsk',
    'Samara',
    'Yekaterinburg',
    'Omsk',
    'Novosibirsk',
    'Barnaul',
    'Tomsk',
    'Novokuznetsk',
    'Krasnoyarsk',
    'Irkutsk',
    'Chita',
    'Yakutsk',
    'Khandyga',
    'Vladivostok',
    'Ust-Nera',
    'Magadan',
    'Sakhalin',
    'Srednekolymsk',
    'Kamchatka',
    'Anadyr',
  ],
  'Saudi Arabia': ['Riyadh'],
  'Solomon Islands': ['Guadalcanal'],
  Seychelles: ['Mahe'],
  Sudan: ['Khartoum'],
  Sweden: ['Stockholm'],
  Singapore: ['Singapore'],
  Suriname: ['Paramaribo'],
  'South Sudan': ['Juba'],
  'Sao Tome & Principe': ['Sao_Tome'],
  'El Salvador': ['El_Salvador'],
  Syria: ['Damascus'],
  'Turks & Caicos Is': ['Grand_Turk'],
  Chad: ['Ndjamena'],
  'French Southern & Antarctic Lands': ['Kerguelen'],
  Thailand: ['Bangkok'],
  Tajikistan: ['Dushanbe'],
  Tokelau: ['Fakaofo'],
  'East Timor': ['Dili'],
  Turkmenistan: ['Ashgabat'],
  Tunisia: ['Tunis'],
  Tonga: ['Tongatapu'],
  Turkey: ['Istanbul'],
  Tuvalu: ['Funafuti'],
  Taiwan: ['Taipei'],
  Ukraine: ['Kiev', 'Uzhgorod', 'Zaporozhye'],
  'US minor outlying islands': ['Wake', 'Midway'],
  'United States': [
    'New_York',
    'Detroit',
    'Louisville',
    'Monticello',
    'Indianapolis',
    'Vincennes',
    'Winamac',
    'Marengo',
    'Petersburg',
    'Vevay',
    'Chicago',
    'Tell_City',
    'Knox',
    'Menominee',
    'Center',
    'New_Salem',
    'Beulah',
    'Denver',
    'Boise',
    'Phoenix',
    'Los_Angeles',
    'Anchorage',
    'Juneau',
    'Sitka',
    'Metlakatla',
    'Yakutat',
    'Nome',
    'Adak',
    'Honolulu',
  ],
  Uruguay: ['Montevideo'],
  Uzbekistan: ['Samarkand', 'Tashkent'],
  Venezuela: ['Caracas'],
  Vietnam: ['Ho_Chi_Minh'],
  Vanuatu: ['Efate'],
  'Wallis & Futuna': ['Wallis'],
  'Samoa (western)': ['Apia'],
  'South Africa': ['Johannesburg'],
  'Antigua & Barbuda': ['Antigua'],
  Anguilla: ['Anguilla'],
  Angola: ['Luanda'],
  Aruba: ['Aruba'],
  'Åland Islands': ['Mariehamn'],
  'Bosnia & Herzegovina': ['Sarajevo'],
  'Burkina Faso': ['Ouagadougou'],
  Bahrain: ['Bahrain'],
  Burundi: ['Bujumbura'],
  Benin: ['Porto-Novo'],
  'St Barthelemy': ['St_Barthelemy'],
  'Caribbean NL': ['Kralendijk'],
  Bahamas: ['Nassau'],
  Botswana: ['Gaborone'],
  'Congo (Dem. Rep.)': ['Kinshasa', 'Lubumbashi'],
  'Central African Rep.': ['Bangui'],
  'Congo (Rep.)': ['Brazzaville'],
  Cameroon: ['Douala'],
  Curaçao: ['Curacao'],
  Djibouti: ['Djibouti'],
  Dominica: ['Dominica'],
  Eritrea: ['Asmara'],
  Ethiopia: ['Addis_Ababa'],
  Gabon: ['Libreville'],
  Grenada: ['Grenada'],
  Guernsey: ['Guernsey'],
  Ghana: ['Accra'],
  Gambia: ['Banjul'],
  Guinea: ['Conakry'],
  Guadeloupe: ['Guadeloupe'],
  'Equatorial Guinea': ['Malabo'],
  Croatia: ['Zagreb'],
  'Isle of Man': ['Isle_of_Man'],
  Jersey: ['Jersey'],
  Cambodia: ['Phnom_Penh'],
  Comoros: ['Comoro'],
  'St Kitts & Nevis': ['St_Kitts'],
  Kuwait: ['Kuwait'],
  'Cayman Islands': ['Cayman'],
  Laos: ['Vientiane'],
  'St Lucia': ['St_Lucia'],
  Liechtenstein: ['Vaduz'],
  Lesotho: ['Maseru'],
  Montenegro: ['Podgorica'],
  'St Martin (French)': ['Marigot'],
  Madagascar: ['Antananarivo'],
  'North Macedonia': ['Skopje'],
  Mali: ['Bamako'],
  'Northern Mariana Islands': ['Saipan'],
  Mauritania: ['Nouakchott'],
  Montserrat: ['Montserrat'],
  Malawi: ['Blantyre'],
  Niger: ['Niamey'],
  Oman: ['Muscat'],
  Rwanda: ['Kigali'],
  'St Helena': ['St_Helena'],
  Slovenia: ['Ljubljana'],
  'Svalbard & Jan Mayen': ['Longyearbyen'],
  Slovakia: ['Bratislava'],
  'Sierra Leone': ['Freetown'],
  'San Marino': ['San_Marino'],
  Senegal: ['Dakar'],
  Somalia: ['Mogadishu'],
  'St Maarten (Dutch)': ['Lower_Princes'],
  'Eswatini (Swaziland)': ['Mbabane'],
  Togo: ['Lome'],
  'Trinidad & Tobago': ['Port_of_Spain'],
  Tanzania: ['Dar_es_Salaam'],
  Uganda: ['Kampala'],
  'Vatican City': ['Vatican'],
  'St Vincent': ['St_Vincent'],
  'Virgin Islands (UK)': ['Tortola'],
  'Virgin Islands (US)': ['St_Thomas'],
  Yemen: ['Aden'],
  Mayotte: ['Mayotte'],
  Zambia: ['Lusaka'],
  Zimbabwe: ['Harare'],
};
