const fs = require('fs');
const path = require('path');

// Read the farmdata.json file
const filePath = path.join(__dirname, 'public/data/farmdata.json');
const outputPath = path.join(__dirname, 'public/data/farmdata-sorted.json');

console.log('Reading farmdata.json...');
const rawData = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(rawData);

console.log(`Found ${data.length} records`);

// Sort by Carrier Route
console.log('Sorting by Carrier Route...');
const sortedData = data.sort((a, b) => {
  const routeA = a['Carrier Route'] || '';
  const routeB = b['Carrier Route'] || '';
  return routeA.localeCompare(routeB);
});

// Group by carrier route for statistics
const routeGroups = {};
sortedData.forEach(record => {
  const route = record['Carrier Route'] || 'Unknown';
  if (!routeGroups[route]) {
    routeGroups[route] = 0;
  }
  routeGroups[route]++;
});

console.log('\nCarrier Route Distribution:');
Object.keys(routeGroups)
  .sort()
  .forEach(route => {
    console.log(`${route}: ${routeGroups[route]} properties`);
  });

// Write sorted data to new file
console.log('\nWriting sorted data to farmdata-sorted.json...');
fs.writeFileSync(outputPath, JSON.stringify(sortedData, null, 2));

console.log('✅ Complete! Sorted data saved to farmdata-sorted.json');
