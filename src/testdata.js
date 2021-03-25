import { v4 as uuidv4 } from 'uuid';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

const possibleSiteDescription = [
  "Market Pl Carpark, Thirsk YO7 1PZ",
  "St. Catherine's Lodge, Sindlesham RG41 5BN",
  "Bedale Hall, N End, Bedale DL8 1AA",
  "A mysterious carpark, Northallerton DL6"
]

const basicTestItems = [
  {
    PointId: uuidv4(),
    SiteDescription: possibleSiteDescription[0],
    FriendlyName: 'cute-green-cat',
    StateOfCharge: 100,
  },
  {
    PointId: uuidv4(),
    SiteDescription: possibleSiteDescription[1],
    FriendlyName: 'lazy-yellow-ox',
    StateOfCharge: 50,
  },
  {
    PointId: uuidv4(),
    SiteDescription: possibleSiteDescription[2],
    FriendlyName: 'pale-red-fish',
    StateOfCharge: 0,
  },
];

const bakeValidTestItem = function(){
  return {
    PointId: uuidv4(),
    SiteDescription: possibleSiteDescription[Math.floor(Math.random() * possibleSiteDescription.length)] ,
    FriendlyName: uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      separator: "-"
    }), // cute-blue-cat
    StateOfCharge: Math.floor(Math.random() * (100) -(0) +1) +(0) , // 0-100
  }
}

const bakeInvalidTestItem = function(){
  return {
    PointId: uuidv4(),
    SiteDescription: possibleSiteDescription[Math.floor(Math.random() * possibleSiteDescription.length)] ,
    FriendlyName: uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      separator: "-"
    }), // cute-blue-cat
    StateOfCharge: Math.floor(Math.random() * (500) -(101) +1) +(191) , // 101-500
    }
}

const bakeTestItems = function(countValid, countInvalid ) {
  const validTestItems = Array.from(Array(countValid)).map(bakeValidTestItem);
  const invalidTestItem = Array.from(Array(countInvalid)).map(bakeInvalidTestItem);
  return [...basicTestItems, ...validTestItems, ...invalidTestItem];
}

export { possibleSiteDescription, basicTestItems, bakeValidTestItem, bakeInvalidTestItem, bakeTestItems }