// pages/page3.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";

const Page = () => {
  const [selectedBridge, setSelectedBridge] = useState("bridge1");
  const [selectedTime, setSelectedTime] = useState("time1");
  const [selectedMetric, setSelectedMetric] = useState("metric1");
  const [selectedType, setSelectedType] = useState("type1");
  const [selectedThreshold, setSelectedThreshold] = useState("threshold1");
  const [selectedExtension, setSelectedExtension] = useState("extension1");

  return (
    <div className="flex h-screen">

      <div className="w-1/4 p-4 border-r transition-all duration-300 ease-in-out border-gray-700 ">
        <Card className="">
          <CardHeader>
            <CardTitle>Create project</CardTitle>
            <CardDescription>
              Deploy your new project in one-click.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="framework">Framework</Label>
                  <Select>
                    <SelectTrigger id="framework">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="next">Next.js</SelectItem>
                      <SelectItem value="sveltekit">SvelteKit</SelectItem>
                      <SelectItem value="astro">Astro</SelectItem>
                      <SelectItem value="nuxt">Nuxt.js</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="framework">Framework</Label>
                  <Select>
                    <SelectTrigger id="framework">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="next">Next.js</SelectItem>
                      <SelectItem value="sveltekit">SvelteKit</SelectItem>
                      <SelectItem value="astro">Astro</SelectItem>
                      <SelectItem value="nuxt">Nuxt.js</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="w-3/4 p-4">
        <div className="h-1/2">
          <Card>
            <CardHeader>
              <CardTitle>原始数据</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Placeholder for the first line chart */}
              <div className="h-64 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-500">折线图1</span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="h-1/2 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>模型输出</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Placeholder for the second line chart */}
              <div className="h-64 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-500">折线图2</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
