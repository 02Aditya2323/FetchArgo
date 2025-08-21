from argopy import DataFetcher
import json
import sys
import random
import numpy as np
import pandas as pd

try:
    cycle_number = random.randint(1, 100)
    
    print(f"Fetching data for cycle number: {cycle_number}", file=sys.stderr)
    
    # Initialize the fetcher
    fetcher = DataFetcher(src='erddap', cache=False)
    
    # Fetch data for a specific float, then filter by cycle number if available
    ds = fetcher.float(6902746).to_xarray()
    # Filter by cycle number if available
    if "CYCLE_NUMBER" in ds:
        mask = ds.CYCLE_NUMBER.values == cycle_number
        if mask.any():
            ds = ds.isel(N_POINTS=np.where(mask)[0])
    
    # Handle numpy arrays safely
    temperature = ds.TEMP.values
    salinity = ds.PSAL.values
    pressure = ds.PRES.values
    
    # Prepare the data
    data = {
        'float_id': int(ds.PLATFORM_NUMBER.values[0]),
        'cycle_number': cycle_number,  # Use the actual cycle number we fetched
        'temperature': float(np.ravel(temperature)[0]) if temperature.size > 0 else None,
        'salinity': float(np.ravel(salinity)[0]) if salinity.size > 0 else None,
        'pressure': float(np.ravel(pressure)[0]) if pressure.size > 0 else None,
        'latitude': float(ds.LATITUDE.values[0]),
        'longitude': float(ds.LONGITUDE.values[0]),
        'fetchedDate': str(ds.TIME.values[0]) if 'TIME' in ds else str(pd.Timestamp.now())
    }
    
    print(json.dumps(data))

except Exception as e:
    print(f"Error: {str(e)}", file=sys.stderr)
    sys.exit(1)