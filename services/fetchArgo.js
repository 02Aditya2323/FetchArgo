const { spawn } = require("child_process");
const path = require('path');
const Data = require("../model/Data.js");

async function fetchAndStoreArgoData() {
  return new Promise((resolve, reject) => {
    console.log("Starting to fetch Argo data...");
    
    // Generate a random cycle number between 1 and 100
    const cycleNumber = Math.floor(Math.random() * 100) + 1;
    console.log(`Fetching cycle number: ${cycleNumber}`);
    
    const pythonScriptPath = path.join(__dirname, 'fetch.py');
    const python = spawn("python3", [pythonScriptPath, cycleNumber.toString()]);

    let dataBuffer = "";
    let errorBuffer = "";

    python.stdout.on("data", (data) => {
      dataBuffer += data.toString();
    });

    python.stderr.on("data", (data) => {
      errorBuffer += data.toString();
      console.error("Python stderr:", data.toString());
    });

    python.on("close", async (code) => {
      if (code !== 0) {
        console.error(`Python script exited with code ${code}`);
        return reject(new Error(`Python script failed: ${errorBuffer}`));
      }

      try {
        console.log("Raw Python output:", dataBuffer);
        const parsed = JSON.parse(dataBuffer);
        console.log("Parsed data:", parsed);
        
        // Create the update object
        const updateData = {
          $set: {
            floatId: parsed.float_id,
            'location.latitude': parsed.latitude,
            'location.longitude': parsed.longitude,
            fetchedDate: new Date()
          },
          $push: {
            profiles: {
              temperature: parsed.temperature,
              salinity: parsed.salinity,
              pressure: parsed.pressure,
              cycle_number: parsed.cycle_number,
              timestamp: new Date()
            }
          }
        };
        
        // Try to update existing document or insert if it doesn't exist
        const options = { 
          upsert: true, 
          new: true, 
          setDefaultsOnInsert: true 
        };
        
        const savedData = await Data.findOneAndUpdate(
          { floatId: parsed.float_id },
          updateData,
          options
        );
        
        console.log(` Data saved/updated successfully for cycle ${parsed.cycle_number}`);
        resolve(savedData);
      } catch (e) {
        console.error("Error processing data:", e);
        reject(e);
      }
    });
  });
}

module.exports = { fetchAndStoreArgoData };