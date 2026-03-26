import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const zip = new URL(request.url).searchParams.get("zip") ?? "91360";
  const apiKey = process.env.RENTCAST_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "no key" }, { status: 500 });

  const res = await fetch(
    `https://api.rentcast.io/v1/markets?zipCode=${zip}&dataType=Sale&historyRange=12`,
    { headers: { "X-Api-Key": apiKey, Accept: "application/json" } }
  );
  const raw = await res.json();
  const sale = raw?.saleData ?? {};

  return NextResponse.json({
    topLevelKeys: Object.keys(raw),
    saleDataKeys: Object.keys(sale),
    numericFields: {
      totalSales: sale.totalSales,
      totalListings: sale.totalListings,
      averageDaysOnMarket: sale.averageDaysOnMarket,
      medianPrice: sale.medianPrice,
      averagePrice: sale.averagePrice,
      newListings: sale.newListings,
    },
    historyType: Array.isArray(sale.history) ? "array" : typeof sale.history,
    historyLength: Array.isArray(sale.history)
      ? sale.history.length
      : sale.history
      ? Object.keys(sale.history).length
      : 0,
    historyFirstEntry: Array.isArray(sale.history)
      ? sale.history[0]
      : sale.history
      ? Object.entries(sale.history as object)[0]
      : null,
    historyLastEntry: Array.isArray(sale.history)
      ? sale.history[sale.history.length - 1]
      : sale.history
      ? Object.entries(sale.history as object).slice(-1)[0]
      : null,
    dataByPropertyType: sale.dataByPropertyType ?? null,
  });
}
