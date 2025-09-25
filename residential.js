// Sample residential data
const data = {
    "residential data": {
      "records": [
        {
          "median_listing_price_mm": -0.0558,
          "average_listing_price": 1249227,
          "median_days_on_market": 39,
          "average_listing_price_mm": -0.028,
          "price_increased_count_mm": null,
          "active_listing_count": 45,
          "price_increased_count": 0,
          "total_listing_count_mm": 0.0608,
          "median_days_on_market_mm": -0.0861,
          "total_listing_count": 79,
          "new_listing_count_mm": 0.2143,
          "new_listing_count": 34,
          "postal_code": 91320,
          "month_date_yyyymm": 202410,
          "active_listing_count_mm": 0.0112
        }, 
        {
            "median_listing_price_mm": -0.0558,
            "average_listing_price": 1249227,
            "median_days_on_market": 39,
            "average_listing_price_mm": -0.028,
            "price_increased_count_mm": null,
            "active_listing_count": 45,
            "price_increased_count": 0,
            "total_listing_count_mm": 0.0608,
            "median_days_on_market_mm": -0.0861,
            "total_listing_count": 79,
            "new_listing_count_mm": 0.2143,
            "new_listing_count": 34,
            "postal_code": 91320,
            "month_date_yyyymm": 202410,
            "active_listing_count_mm": 0.0112
          }
      ]
    }
};

// Extract unique keys from all records
function getUniqueKeysFromRecords(data) {
    const records = data["residential data"].records;
    const allKeys = new Set();
    
    // Iterate through all records to get all possible keys
    records.forEach(record => {
        Object.keys(record).forEach(key => {
            allKeys.add(key);
        });
    });
    
    return Array.from(allKeys).sort();
}

// Get the unique keys array
const uniqueKeys = getUniqueKeysFromRecords(data);
console.log('Unique keys:', uniqueKeys);

// For Zapier - create an object with each key as a separate field
function createZapierFields(data) {
    const records = data["residential data"].records;
    const uniqueKeys = getUniqueKeysFromRecords(data);
    
    // Create an object with each key as a separate field for the first record
    const zapierData = {};
    
    if (records.length > 0) {
        uniqueKeys.forEach(key => {
            zapierData[key] = records[0][key];
        });
    }
    
    return {
        uniqueKeys: uniqueKeys,
        firstRecordData: zapierData,
        totalRecords: records.length
    };
}

// Example usage for Zapier
const zapierOutput = createZapierFields(data);
console.log('Zapier output:', zapierOutput);

// Run the code
console.log('\n=== RUNNING EXTRACTION ===');
console.log('Total records:', data["residential data"].records.length);
console.log('Unique keys found:', uniqueKeys.length);
console.log('Keys:', uniqueKeys);
console.log('\nFirst record data for Zapier:');
console.log(zapierOutput.firstRecordData);