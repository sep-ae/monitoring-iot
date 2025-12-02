import fs from "fs";

const WA_FILE = "./data/wa_numbers.json";

export function loadWaNumbers() {
  try {
    if (!fs.existsSync(WA_FILE)) return [];

    const content = fs.readFileSync(WA_FILE, "utf8").trim();

    if (!content) return [];      

    return JSON.parse(content);    
  } catch (err) {
    console.error("Error reading WA numbers:", err);
    return []; 
  }
}

export function saveWaNumbers(numbers) {
  try {
    fs.writeFileSync(WA_FILE, JSON.stringify(numbers, null, 2));
  } catch (err) {
    console.error("Error writing WA numbers:", err);
  }
}
