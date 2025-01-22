/**
 * @author George Kalyvianakis
 * @description Use this script to get all flag png images in 64x48 size from flagcdn.com
 */
import fs from "fs";
import https from "https";
import process from "process";

const PATH = "./src/assets/images/flags";
const CODES_PATH = "https://flagcdn.com/en/codes.json";
const IMAGE_SIZE = "w80";
// Delay between requests in order to prevent remote server from rejecting them. In milliseconds (ms).
const REQUEST_GAP = 10;

main();

async function main() {
  createDir(PATH);

  try {
    await getFlags();
  } catch(error) {
    console.warn(error);
  } finally {
    process.exit(0);
  }
}

async function getFlags() {
  const countryCodes = await getCountryCodes();
  const promises = countryCodes.map((code, i) => new Promise((resolve, reject) => { setTimeout(() => getCountryFlag(code, PATH).then(resolve).catch(reject), i * REQUEST_GAP) }));

  await Promise.all(promises).then(() => {
    console.log("Flags downloaded successfully.");
  }).catch(error => {
    console.log(error);
  })
}

async function getCountryCodes() {
  const result = await fetch(CODES_PATH).then(response => response.json());
  return Object.keys(result);
}

function getFlagUrl(code) {
  return `https://flagcdn.com/${IMAGE_SIZE}/${code}.png`;
}

async function getCountryFlag(code, path) {
  const url = getFlagUrl(code);
  const filePath = `${path}/${code}.png`;

  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download the image: ${response.statusCode} - ${response.statusMessage}`));
        response.resume(); // Consume response data to free up memory
        return;
      }

      const fileStream = fs.createWriteStream(filePath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close(() => {
          console.log(`Saved flag to ${filePath}`);
          resolve(filePath);
        });
      });

      fileStream.on('error', (err) => {
        fs.unlink(filePath, () => reject(`${code} ${path} ${err.message}`)); // Delete the file on error
      });
    });

    request.on('error', (err) => {
      reject(`${code} ${path} ${err.message}`);
    });
  });
}

function createDir(dir) {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  } catch (err) {
    console.error(err);
  }
}