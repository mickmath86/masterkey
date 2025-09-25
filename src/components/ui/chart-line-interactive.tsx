"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "An interactive line chart"

const historyValue = [
  {"t":1443596400,"v":1080099},
  {"t":1446274800,"v":1091566},
  {"t":1448870400,"v":1133289},
  {"t":1451548800,"v":1182565},
  {"t":1454227200,"v":1119504},
  {"t":1456732800,"v":1134640},
  {"t":1459407600,"v":1109015},
  {"t":1461999600,"v":1126350},
  {"t":1464678000,"v":1174367},
  {"t":1467270000,"v":1168637},
  {"t":1469948400,"v":1131449},
  {"t":1472626800,"v":981161},
  {"t":1475218800,"v":981831},
  {"t":1477897200,"v":995974},
  {"t":1480492800,"v":1012248},
  {"t":1483171200,"v":1033204},
  {"t":1485849600,"v":1061888},
  {"t":1488268800,"v":1086141},
  {"t":1490943600,"v":1085248},
  {"t":1493535600,"v":1093528},
  {"t":1496214000,"v":1078937},
  {"t":1498806000,"v":1060020},
  {"t":1501484400,"v":1032190},
  {"t":1504162800,"v":1027429},
  {"t":1506754800,"v":1033481},
  {"t":1509433200,"v":1050066},
  {"t":1512028800,"v":1059270},
  {"t":1514707200,"v":1096177},
  {"t":1517385600,"v":1136915},
  {"t":1519804800,"v":1131170},
  {"t":1522479600,"v":1158092},
  {"t":1525071600,"v":1139093},
  {"t":1527750000,"v":1136411},
  {"t":1530342000,"v":1149295},
  {"t":1533020400,"v":1151596},
  {"t":1535698800,"v":1164119},
  {"t":1538290800,"v":1196563},
  {"t":1540969200,"v":1191705},
  {"t":1543564800,"v":1201951},
  {"t":1546243200,"v":1197315},
  {"t":1548921600,"v":1199194},
  {"t":1551340800,"v":1204814},
  {"t":1554015600,"v":1221364},
  {"t":1556607600,"v":1198535},
  {"t":1559286000,"v":1195836},
  {"t":1561878000,"v":1187775},
  {"t":1564556400,"v":1158079},
  {"t":1567234800,"v":1148452},
  {"t":1569826800,"v":1157853},
  {"t":1572505200,"v":1164576},
  {"t":1575100800,"v":1172719},
  {"t":1577779200,"v":1186279},
  {"t":1580457600,"v":1190330},
  {"t":1582963200,"v":1178146},
  {"t":1585638000,"v":1183847},
  {"t":1588230000,"v":1195264},
  {"t":1590908400,"v":1211048},
  {"t":1593500400,"v":1216647},
  {"t":1596178800,"v":1246432},
  {"t":1598857200,"v":1257384},
  {"t":1601449200,"v":1246580},
  {"t":1604127600,"v":1277920},
  {"t":1606723200,"v":1309610},
  {"t":1609401600,"v":1327734},
  {"t":1612080000,"v":1330856},
  {"t":1614499200,"v":1361065},
  {"t":1617174000,"v":1399544},
  {"t":1619766000,"v":1462699},
  {"t":1622444400,"v":1411841},
  {"t":1625036400,"v":1399600},
  {"t":1627714800,"v":1408200},
  {"t":1630393200,"v":1374900},
  {"t":1632985200,"v":1358900},
  {"t":1635663600,"v":1382600},
  {"t":1638259200,"v":1384700},
  {"t":1640937600,"v":1382200},
  {"t":1643616000,"v":1397400},
  {"t":1646035200,"v":1409000},
  {"t":1648710000,"v":1540300},
  {"t":1651302000,"v":1613300},
  {"t":1653980400,"v":1651500},
  {"t":1656572400,"v":1662200},
  {"t":1659250800,"v":1650100},
  {"t":1661929200,"v":1621100},
  {"t":1664521200,"v":1613400},
  {"t":1667199600,"v":1626900},
  {"t":1669795200,"v":1591000},
  {"t":1672473600,"v":1543400},
  {"t":1675152000,"v":1534800},
  {"t":1677571200,"v":1553600},
  {"t":1680246000,"v":1601000},
  {"t":1682838000,"v":1598200},
  {"t":1685516400,"v":1611800},
  {"t":1688108400,"v":1632100},
  {"t":1690786800,"v":1634800},
  {"t":1693465200,"v":1642000},
  {"t":1696057200,"v":1644400},
  {"t":1698735600,"v":1648600},
  {"t":1701331200,"v":1642400},
  {"t":1704009600,"v":1609300},
  {"t":1706688000,"v":1605700},
  {"t":1709193600,"v":1618200},
  {"t":1711868400,"v":1667500},
  {"t":1714460400,"v":1666400},
  {"t":1717138800,"v":1696100},
  {"t":1719730800,"v":1698200},
  {"t":1722409200,"v":1679400},
  {"t":1725087600,"v":1697300},
  {"t":1727679600,"v":1693400},
  {"t":1730358000,"v":1672600},
  {"t":1732953600,"v":1667500},
  {"t":1735632000,"v":1670200},
  {"t":1738310400,"v":1679200},
  {"t":1740729600,"v":1716600},
  {"t":1743404400,"v":1746600},
  {"t":1745996400,"v":1746500},
  {"t":1748674800,"v":1742000},
  {"t":1751266800,"v":1744400},
  {"t":1753945200,"v":1781000},
  {"t":1756623600,"v":1720800},
  {"t":1758006000,"v":1701400}
]


const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-11", desktop: 327, mobile: 350 },
  { date: "2024-04-12", desktop: 292, mobile: 210 },
  { date: "2024-04-13", desktop: 342, mobile: 380 },
  { date: "2024-04-14", desktop: 137, mobile: 220 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-16", desktop: 138, mobile: 190 },
  { date: "2024-04-17", desktop: 446, mobile: 360 },
  { date: "2024-04-18", desktop: 364, mobile: 410 },
  { date: "2024-04-19", desktop: 243, mobile: 180 },
  { date: "2024-04-20", desktop: 89, mobile: 150 },
  { date: "2024-04-21", desktop: 137, mobile: 200 },
  { date: "2024-04-22", desktop: 224, mobile: 170 },
  { date: "2024-04-23", desktop: 138, mobile: 230 },
  { date: "2024-04-24", desktop: 387, mobile: 290 },
  { date: "2024-04-25", desktop: 215, mobile: 250 },
  { date: "2024-04-26", desktop: 75, mobile: 130 },
  { date: "2024-04-27", desktop: 383, mobile: 420 },
  { date: "2024-04-28", desktop: 122, mobile: 180 },
  { date: "2024-04-29", desktop: 315, mobile: 240 },
  { date: "2024-04-30", desktop: 454, mobile: 380 },
  { date: "2024-05-01", desktop: 165, mobile: 220 },
  { date: "2024-05-02", desktop: 293, mobile: 310 },
  { date: "2024-05-03", desktop: 247, mobile: 190 },
  { date: "2024-05-04", desktop: 385, mobile: 420 },
  { date: "2024-05-05", desktop: 481, mobile: 390 },
  { date: "2024-05-06", desktop: 498, mobile: 520 },
  { date: "2024-05-07", desktop: 388, mobile: 300 },
  { date: "2024-05-08", desktop: 149, mobile: 210 },
  { date: "2024-05-09", desktop: 227, mobile: 180 },
  { date: "2024-05-10", desktop: 293, mobile: 330 },
  { date: "2024-05-11", desktop: 335, mobile: 270 },
  { date: "2024-05-12", desktop: 197, mobile: 240 },
  { date: "2024-05-13", desktop: 197, mobile: 160 },
  { date: "2024-05-14", desktop: 448, mobile: 490 },
  { date: "2024-05-15", desktop: 473, mobile: 380 },
  { date: "2024-05-16", desktop: 338, mobile: 400 },
  { date: "2024-05-17", desktop: 499, mobile: 420 },
  { date: "2024-05-18", desktop: 315, mobile: 350 },
  { date: "2024-05-19", desktop: 235, mobile: 180 },
  { date: "2024-05-20", desktop: 177, mobile: 230 },
  { date: "2024-05-21", desktop: 82, mobile: 140 },
  { date: "2024-05-22", desktop: 81, mobile: 120 },
  { date: "2024-05-23", desktop: 252, mobile: 290 },
  { date: "2024-05-24", desktop: 294, mobile: 220 },
  { date: "2024-05-25", desktop: 201, mobile: 250 },
  { date: "2024-05-26", desktop: 213, mobile: 170 },
  { date: "2024-05-27", desktop: 420, mobile: 460 },
  { date: "2024-05-28", desktop: 233, mobile: 190 },
  { date: "2024-05-29", desktop: 78, mobile: 130 },
  { date: "2024-05-30", desktop: 340, mobile: 280 },
  { date: "2024-05-31", desktop: 178, mobile: 230 },
  { date: "2024-06-01", desktop: 178, mobile: 200 },
  { date: "2024-06-02", desktop: 470, mobile: 410 },
  { date: "2024-06-03", desktop: 103, mobile: 160 },
  { date: "2024-06-04", desktop: 439, mobile: 380 },
  { date: "2024-06-05", desktop: 88, mobile: 140 },
  { date: "2024-06-06", desktop: 294, mobile: 250 },
  { date: "2024-06-07", desktop: 323, mobile: 370 },
  { date: "2024-06-08", desktop: 385, mobile: 320 },
  { date: "2024-06-09", desktop: 438, mobile: 480 },
  { date: "2024-06-10", desktop: 155, mobile: 200 },
  { date: "2024-06-11", desktop: 92, mobile: 150 },
  { date: "2024-06-12", desktop: 492, mobile: 420 },
  { date: "2024-06-13", desktop: 81, mobile: 130 },
  { date: "2024-06-14", desktop: 426, mobile: 380 },
  { date: "2024-06-15", desktop: 307, mobile: 350 },
  { date: "2024-06-16", desktop: 371, mobile: 310 },
  { date: "2024-06-17", desktop: 475, mobile: 520 },
  { date: "2024-06-18", desktop: 107, mobile: 170 },
  { date: "2024-06-19", desktop: 341, mobile: 290 },
  { date: "2024-06-20", desktop: 408, mobile: 450 },
  { date: "2024-06-21", desktop: 169, mobile: 210 },
  { date: "2024-06-22", desktop: 317, mobile: 270 },
  { date: "2024-06-23", desktop: 480, mobile: 530 },
  { date: "2024-06-24", desktop: 132, mobile: 180 },
  { date: "2024-06-25", desktop: 141, mobile: 190 },
  { date: "2024-06-26", desktop: 434, mobile: 380 },
  { date: "2024-06-27", desktop: 448, mobile: 490 },
  { date: "2024-06-28", desktop: 149, mobile: 200 },
  { date: "2024-06-29", desktop: 103, mobile: 160 },
  { date: "2024-06-30", desktop: 446, mobile: 400 },
]

const chartConfig = {
  views: {
    label: "Market Data",
  },
  averagePrice: {
    label: "Average Price",
    color: "var(--chart-1)",
  },
  medianPrice: {
    label: "Median Price",
    color: "var(--chart-2)",
  },
  pricePerSqFt: {
    label: "Price per Sq Ft",
    color: "var(--chart-3)",
  },
  daysOnMarket: {
    label: "Days on Market",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

interface MarketHistoryData {
  [key: string]: {
    date: string;
    averagePrice?: number;
    medianPrice?: number;
    averagePricePerSquareFoot?: number;
    averageDaysOnMarket?: number;
    totalListings?: number;
  }
}

interface ChartLineInteractiveProps {
  data?: MarketHistoryData;
  title?: string;
  description?: string;
}

export function ChartLineInteractive({ 
  data, 
  title = "Market Trends", 
  description = "Property market data over time" 
}: ChartLineInteractiveProps) {
  // Transform market data to chart format
  const transformedData = React.useMemo(() => {
    if (!data) {
      // Convert sample data to market format
      return chartData.map(item => ({
        date: item.date,
        averagePrice: item.desktop * 1000, // Convert to price-like values
        medianPrice: item.mobile * 1000,
        pricePerSqFt: item.desktop,
        daysOnMarket: Math.floor(item.mobile / 10),
      }));
    }
    
    return Object.entries(data).map(([key, value]) => ({
      date: value.date,
      averagePrice: value.averagePrice || 0,
      medianPrice: value.medianPrice || 0,
      pricePerSqFt: value.averagePricePerSquareFoot || 0,
      daysOnMarket: value.averageDaysOnMarket || 0,
    }));
  }, [data]);

  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("averagePrice")

  const total = React.useMemo(
    () => ({
      averagePrice: transformedData.reduce((acc, curr) => acc + (curr.averagePrice || 0), 0),
      medianPrice: transformedData.reduce((acc, curr) => acc + (curr.medianPrice || 0), 0),
    }),
    [transformedData]
  )

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </div>
        <div className="flex">
          {["averagePrice", "medianPrice"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {key.includes('Price') ? 
                    `$${Math.round(total[key as keyof typeof total] / transformedData.length).toLocaleString()}` :
                    total[key as keyof typeof total].toLocaleString()
                  }
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={transformedData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  }}
                  formatter={(value, name) => {
                    if (typeof name === 'string' && (name.includes('Price') || name.includes('pricePerSqFt'))) {
                      return [`$${Number(value).toLocaleString()}`, name];
                    }
                    return [value, name];
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
