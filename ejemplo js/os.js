const os = require('os');

const memoriaLibreBytes = os.freemem();
const memoriaTotalBytes = os.totalmem();

// Conversión a Gigabytes (Dividiendo entre 1024^3)
const memoriaLibreGB = (memoriaLibreBytes / (1024 ** 3)).toFixed(2);
const memoriaTotalGB = (memoriaTotalBytes / (1024 ** 3)).toFixed(2);

console.log(`Memoria Libre: ${memoriaLibreGB} GB`);
console.log(`Memoria Total: ${memoriaTotalGB} GB`);