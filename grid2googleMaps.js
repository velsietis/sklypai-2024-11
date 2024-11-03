function grid2googleMaps({ x: southToNorth, y: westToEast }) {

  const gridScale = 1;
  const k = 0.9998;
  const a = 6378137;
  const f = 1 / 298.257223563;
  const nOffset = 0;
  const eOffset = 500000;

  const b = a * (1 - f);
  const e2 = (a * a - b * b) / (a * a);
  const n = (a - b) / (a + b);
  const G = a * (1 - n) * (1 - n * n) * (1 + (9 / 4) * n * n + (255 / 64) * Math.pow(n, 4)) * (Math.PI / 180);

  // Normalize the grid coordinates
  const north = (southToNorth - nOffset) * gridScale;
  const east = (westToEast - eOffset) * gridScale;

  // Transform from grid to lat/lang
  // Common paramters
  const m = north / k;
  const sigma = (m * Math.PI) / (180 * G);

  const footlat = sigma
    + ((3 * n / 2) - (27 * Math.pow(n, 3) / 32)) * Math.sin(2 * sigma)
    + ((21 * n * n / 16) - (55 * Math.pow(n, 4) / 32)) * Math.sin(4 * sigma)
    + (151 * Math.pow(n, 3) / 96) * Math.sin(6 * sigma)
    + (1097 * Math.pow(n, 4) / 512) * Math.sin(8 * sigma);


  const rho = a * (1 - e2) / Math.pow(1 - (e2 * Math.sin(footlat) * Math.sin(footlat)), (3 / 2));
  const nu = a / Math.sqrt(1 - (e2 * Math.sin(footlat) * Math.sin(footlat)));
  const psi = nu / rho;
  const t = Math.tan(footlat);
  const xi = east / (k * nu);

  // Calculate Latitude (north-south, +/-90 degrees)
  const seclat = 1 / Math.cos(footlat);
  const laterm1 = (t / (k * rho)) * (east * xi / 2);
  const laterm2 = (t / (k * rho)) * (east * Math.pow(xi, 3) / 24) * (-4 * psi * psi + 9 * psi * (1 - t * t) + 12 * t * t);
  const laterm3 = (t / (k * rho)) * (east * Math.pow(xi, 5) / 720) * (8 * Math.pow(psi, 4) * (11 - 24 * t * t) - 12 * Math.pow(psi, 3) * (21 - 71 * t * t) + 15 * psi * psi * (15 - 98 * t * t + 15 * Math.pow(t, 4)) + 180 * psi * (5 * t * t - 3 * Math.pow(t, 4)) + 360 * Math.pow(t, 4));
  const laterm4 = (t / (k * rho)) * (east * Math.pow(xi, 7) / 40320) * (1385 + 3633 * t * t + 4095 * Math.pow(t, 4) + 1575 * Math.pow(t, 6));
  const latrad = footlat - laterm1 + laterm2 - laterm3 + laterm4;
  const lat_deg = radToDeg(latrad);

  // Calculate Longitude (east-west, +/-180 degrees) 
  const loterm1 = xi * seclat;
  const loterm2 = (Math.pow(xi, 3) / 6) * seclat * (psi + 2 * t * t);
  const loterm3 = (Math.pow(xi, 5) / 120) * seclat * (-4 * Math.pow(psi, 3) * (1 - 6 * t * t) + psi * psi * (9 - 68 * t * t) + 72 * psi * t * t + 24 * Math.pow(t, 4));
  const loterm4 = (Math.pow(xi, 7) / 5040) * seclat * (61 + 662 * t * t + 1320 * Math.pow(t, 4) + 720 * Math.pow(t, 6));
  const w = loterm1 - loterm2 + loterm3 - loterm4;
  const longrad = degToRad(24) + w;
  const lon_deg = radToDeg(longrad);

  return { lat: lat_deg, lng: lon_deg };
}

function radToDeg(radians) {
  return radians * (180 / Math.PI);
}

function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}


export { grid2googleMaps }