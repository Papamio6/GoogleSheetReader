import puppeteer from "puppeteer";


export async function scrapeSheet(url){
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Charge la page et attend le chargement complet
  await page.goto(url, { waitUntil: "networkidle2" });

  // Attend que l'iframe soit disponible
  await page.waitForSelector("iframe#pageswitcher-content");
  console.log("frame trouvée");
  // Récupère la frame associée à l'iframe
  const elementHandle = await page.$("iframe#pageswitcher-content");
  const frame = await elementHandle.contentFrame();
  console.log("frame sélectionnée");

    // Attendre que la table soit présente
  const table = await frame.$(".waffle");
  const lim = 10;
    
  while((!table) && (lim>0)){
      
      table = await frame.$(".waffle");
      if (!table) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // pause côté Node
        lim = lim-1;
      }
    }
  console.log("table trouvée");
  // Extrait les données et les couleurs
    const result = await frame.evaluate(() => {
          
    if (!table) return { data: [], colors: [] };

    const rows = Array.from(table.querySelectorAll("tr"));

    const data = [];
    const colors = [];

    for (const row of rows) {
        const cells = Array.from(row.querySelectorAll("td, th"));
        data.push(cells.map(cell => cell.innerText.trim().replace(/\s*\n\s*/g, " ")).splice(1));
        colors.push(cells.map(cell => getComputedStyle(cell).backgroundColor).splice(1));
    }

    return {data, colors};
});
  console.log("fini");
  await browser.close();
  return result;

}








