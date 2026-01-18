"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"
import axios from "axios"

export const description = "A bar chart with a custom label"

 
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-2)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
  label: {
    color: "var(--background)",
  },
} satisfies ChartConfig

export default function ChartBarLabelCustom() {
   const [chartData,setChartData]=useState([])
  const fetchProduct= async()=>{
    const {data}=await axios.get(' https://api.escuelajs.co/api/v1/products')
    const categoryMap={}
    data.map((item)=>{
      if(categoryMap[item.category.name]){
        categoryMap[item.category.name]++
      }else{
        categoryMap[item.category.name]=1
      }
    })
    const output = Object.entries(categoryMap).map(item=>{
       return {category:item[0] ,productQuantity:item[1]}
    })

    setChartData(output)
  }

  useEffect(()=>{
    fetchProduct()
  },[])
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Custom Label</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="productQuantity" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="productQuantity"
              layout="vertical"
              fill="var(--color-desktop)"
              radius={4}
            >
              <LabelList
                dataKey="category"
                position="insideLeft"
                offset={8}
                className="fill-(--color-label)"
                fontSize={12}
              />
              <LabelList
                dataKey="productQuantity"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
