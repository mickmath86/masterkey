/**
 * GET /api/marketpulse/sheets-data?submarket=thousand-oaks
 *
 * Fetches all 9 data sheets from the MasterKey InfoSparks Google Spreadsheet
 * and returns structured data for the requested submarket.
 *
 * Source: https://docs.google.com/spreadsheets/d/1BwqhUNOAnpYuDkA-Q_yuavcdzsfF5Pe2WvewtLMOogs
 * Sheet is public (view-only). No API key required.
 */

import { NextRequest, NextResponse } from "next/server";

const SHEET_ID = "1BwqhUNOAnpYuDkA-Q_yuavcdzsfF5Pe2WvewtLMOogs";

// GID map for each sheet tab
const SHEET_GIDS: Record<string, string> = {
  medianPrice:     "0",
  newListings:     "1887061660",
  activeListings:  "1398043834",
  closedSales:     "358801859",
  daysOnMarket:    "1867304682",
  pricePerSf:      "400114585",
  monthsSupply:    "1751376637",
  showsToContract: "968425142",
  pctOfOrigPrice:  "418736957",
};

// Column index for each city in the sheet (0-based, after the Month column)
// Header row: Month | Ventura County | Westlake Village | Thousand Oaks | Newbury Park | Oxnard | Camarillo | Ventura City
const CITY_COL: Record<string, number> = {
  "thousand-oaks": 3,
  "westlake":      2,
  "newbury-park":  4,
  "oxnard":        5,
  "camarillo":     6,
  "ventura":       7,
};

// Fetch a sheet tab and return parsed rows (skip blank/header rows, return data rows)
async function fetchSheet(gid: string): Promise<string[][]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;
  const res = await fetch(url, { next: { revalidate: 3600 } }); // cache 1hr
  if (!res.ok) return [];
  const text = await res.text();

  // Parse CSV (handle quoted values with commas)
  const rows = text.split("\n").map(line => {
    const cells: string[] = [];
    let cur = "";
    let inQ = false;
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ; }
      else if (ch === "," && !inQ) { cells.push(cur.trim()); cur = ""; }
      else { cur += ch; }
    }
    cells.push(cur.trim());
    return cells;
  });

  // Find the data rows: skip rows where Month column (first non-empty) is blank or is the header label
  const dataRows: string[][] = [];
  let foundHeader = false;
  for (const row of rows) {
    const first = row.find(c => c.trim() !== "") ?? "";
    // Header row has "Month" as the label
    if (!foundHeader) {
      if (first.toLowerCase() === "month") { foundHeader = true; }
      continue;
    }
    // Data row: first non-empty cell should be a month name
    if (first === "" || first.toLowerCase() === "month") continue;
    dataRows.push(row);
  }
  return dataRows;
}

// Clean a numeric value: strip $, commas, %, return number or null
function parseNum(v: string): number | null {
  if (!v || v === "—" || v === "-" || v.trim() === "") return null;
  const cleaned = v.replace(/[$,%]/g, "").replace(/,/g, "").trim();
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}

// Get the right column index accounting for offset (some sheets have extra leading commas)
function getColIdx(row: string[], cityColOffset: number): number {
  // Find the "Month" column position (first non-empty in the header)
  // In data rows, col 0 may be empty if there are leading blank cols
  // We derive the offset by checking how many leading empty cells there are
  let offset = 0;
  for (const cell of row) {
    if (cell.trim() !== "") break;
    offset++;
  }
  return offset + cityColOffset;
}

export interface SheetRow {
  month: string;
  value: number | null;
}

export interface SheetsDataResponse {
  submarket: string;
  medianPrice: SheetRow[];
  newListings: SheetRow[];
  activeListings: SheetRow[];
  closedSales: SheetRow[];
  daysOnMarket: SheetRow[];
  pricePerSf: SheetRow[];
  monthsSupply: SheetRow[];
  showsToContract: SheetRow[];
  pctOfOrigPrice: SheetRow[];
  // Convenience: latest values (last non-null row)
  latest: {
    medianPrice: number | null;
    activeListings: number | null;
    daysOnMarket: number | null;
    pricePerSf: number | null;
    monthsSupply: number | null;
    closedSales: number | null;
    pctOfOrigPrice: number | null;
    medianPricePrevMonth: number | null;
    medianPriceChangePct: number | null;
  };
}

// In-memory cache — 10 min TTL
const cache = new Map<string, { data: SheetsDataResponse; ts: number }>();
const TTL = 1000 * 60 * 10;

export async function GET(req: NextRequest) {
  const submarket = req.nextUrl.searchParams.get("submarket") ?? "thousand-oaks";
  const validKeys = Object.keys(CITY_COL);
  if (!validKeys.includes(submarket)) {
    return NextResponse.json({ error: "Invalid submarket" }, { status: 400 });
  }

  // Check memory cache
  const cached = cache.get(submarket);
  if (cached && Date.now() - cached.ts < TTL) {
    return NextResponse.json(cached.data);
  }

  const cityIdx = CITY_COL[submarket];

  // Helper: fetch one sheet and extract rows for this city
  async function extract(gid: string): Promise<SheetRow[]> {
    const rows = await fetchSheet(gid);
    return rows.map(row => {
      // Find month: first non-empty cell
      const monthOffset = row.findIndex(c => c.trim() !== "");
      const month = monthOffset >= 0 ? row[monthOffset].trim() : "";
      // City value: month column + cityIdx (relative)
      const valueRaw = row[monthOffset + cityIdx] ?? "";
      return { month, value: parseNum(valueRaw) };
    }).filter(r => r.month !== "");
  }

  try {
    const [
      medianPrice,
      newListings,
      activeListings,
      closedSales,
      daysOnMarket,
      pricePerSf,
      monthsSupply,
      showsToContract,
      pctOfOrigPrice,
    ] = await Promise.all([
      extract(SHEET_GIDS.medianPrice),
      extract(SHEET_GIDS.newListings),
      extract(SHEET_GIDS.activeListings),
      extract(SHEET_GIDS.closedSales),
      extract(SHEET_GIDS.daysOnMarket),
      extract(SHEET_GIDS.pricePerSf),
      extract(SHEET_GIDS.monthsSupply),
      extract(SHEET_GIDS.showsToContract),
      extract(SHEET_GIDS.pctOfOrigPrice),
    ]);

    // Latest non-null value helper
    function lastVal(rows: SheetRow[]): number | null {
      for (let i = rows.length - 1; i >= 0; i--) {
        if (rows[i].value !== null) return rows[i].value;
      }
      return null;
    }

    const latestPrice = lastVal(medianPrice);
    // Previous month price (second to last non-null)
    let prevPrice: number | null = null;
    let foundLast = false;
    for (let i = medianPrice.length - 1; i >= 0; i--) {
      if (medianPrice[i].value !== null) {
        if (!foundLast) { foundLast = true; continue; }
        prevPrice = medianPrice[i].value;
        break;
      }
    }

    const changePct = latestPrice !== null && prevPrice !== null && prevPrice > 0
      ? ((latestPrice - prevPrice) / prevPrice) * 100
      : null;

    const data: SheetsDataResponse = {
      submarket,
      medianPrice,
      newListings,
      activeListings,
      closedSales,
      daysOnMarket,
      pricePerSf,
      monthsSupply,
      showsToContract,
      pctOfOrigPrice,
      latest: {
        medianPrice: latestPrice,
        activeListings: lastVal(activeListings),
        daysOnMarket: lastVal(daysOnMarket),
        pricePerSf: lastVal(pricePerSf),
        monthsSupply: lastVal(monthsSupply),
        closedSales: lastVal(closedSales),
        pctOfOrigPrice: lastVal(pctOfOrigPrice),
        medianPricePrevMonth: prevPrice,
        medianPriceChangePct: changePct !== null ? Math.round(changePct * 10) / 10 : null,
      },
    };

    cache.set(submarket, { data, ts: Date.now() });
    return NextResponse.json(data);
  } catch (err) {
    console.error("[sheets-data] error:", err);
    return NextResponse.json({ error: "Failed to fetch sheet data" }, { status: 500 });
  }
}
