"use client";

import { Modal, Select, Input } from "antd";
import { useState } from "react";

interface ConverterModalProps {
  visible: boolean;
  onCancel: () => void;
}

type ConversionCategory =
  | "length"
  | "area"
  | "volume"
  | "weight"
  | "temperature"
  | "speed"
  | "time"
  | "digital"
  | "currency";

export const ConverterModal = ({ visible, onCancel }: ConverterModalProps) => {
  const [category, setCategory] = useState<ConversionCategory>("length");
  const [fromUnit, setFromUnit] = useState<string>("meter");
  const [toUnit, setToUnit] = useState<string>("kilometer");
  const [fromValue, setFromValue] = useState<number>(1);
  const [toValue, setToValue] = useState<number>(0.001);

  const conversionFactors: Record<
    ConversionCategory,
    Record<string, number>
  > = {
    length: {
      meter: 1,
      kilometer: 0.001,
      centimeter: 100,
      millimeter: 1000,
      micrometer: 1e6,
      nanometer: 1e9,
      mile: 0.000621371,
      yard: 1.09361,
      foot: 3.28084,
      inch: 39.3701,
      nauticalMile: 0.000539957,
    },
    area: {
      squareMeter: 1,
      squareKilometer: 1e-6,
      squareMile: 3.861e-7,
      squareYard: 1.19599,
      squareFoot: 10.7639,
      squareInch: 1550,
      hectare: 0.0001,
      acre: 0.000247105,
    },
    volume: {
      liter: 1,
      milliliter: 1000,
      cubicMeter: 0.001,
      cubicCentimeter: 1000,
      cubicInch: 61.0237,
      cubicFoot: 0.0353147,
      gallon: 0.264172,
      quart: 1.05669,
      pint: 2.11338,
      cup: 4.22675,
      tablespoon: 67.628,
      teaspoon: 202.884,
      fluidOunce: 33.814,
    },
    weight: {
      kilogram: 1,
      gram: 1000,
      milligram: 1e6,
      metricTon: 0.001,
      pound: 2.20462,
      ounce: 35.274,
      stone: 0.157473,
      ton: 0.00110231,
    },
    temperature: {
      celsius: 1,
      fahrenheit: 33.8,
      kelvin: 274.15,
    },
    speed: {
      meterPerSecond: 1,
      kilometerPerHour: 3.6,
      milePerHour: 2.23694,
      knot: 1.94384,
      footPerSecond: 3.28084,
    },
    time: {
      second: 1,
      millisecond: 1000,
      microsecond: 1e6,
      nanosecond: 1e9,
      minute: 1 / 60,
      hour: 1 / 3600,
      day: 1 / 86400,
      week: 1 / 604800,
      month: 1 / 2.628e6,
      year: 1 / 3.154e7,
    },
    digital: {
      bit: 8,
      byte: 1,
      kilobyte: 0.000976562,
      megabyte: 9.53674e-7,
      gigabyte: 9.31323e-10,
      terabyte: 9.09495e-13,
      petabyte: 8.88178e-16,
      kilobit: 0.0078125,
      megabit: 7.62939e-6,
      gigabit: 7.45058e-9,
      terabit: 7.27596e-12,
    },
    currency: {
      usd: 1,
      eur: 0.93,
      gbp: 0.8,
      jpy: 151.5,
      aud: 1.52,
      cad: 1.36,
      cny: 7.23,
      inr: 83.3,
      // Note: Currency rates should be fetched from an API in a real application
    },
  };

  const unitLabels: Record<ConversionCategory, Record<string, string>> = {
    length: {
      meter: "Meter (m)",
      kilometer: "Kilometer (km)",
      centimeter: "Centimeter (cm)",
      millimeter: "Millimeter (mm)",
      micrometer: "Micrometer (µm)",
      nanometer: "Nanometer (nm)",
      mile: "Mile (mi)",
      yard: "Yard (yd)",
      foot: "Foot (ft)",
      inch: "Inch (in)",
      nauticalMile: "Nautical Mile",
    },
    area: {
      squareMeter: "Square Meter (m²)",
      squareKilometer: "Square Kilometer (km²)",
      squareMile: "Square Mile (mi²)",
      squareYard: "Square Yard (yd²)",
      squareFoot: "Square Foot (ft²)",
      squareInch: "Square Inch (in²)",
      hectare: "Hectare (ha)",
      acre: "Acre",
    },
    volume: {
      liter: "Liter (L)",
      milliliter: "Milliliter (mL)",
      cubicMeter: "Cubic Meter (m³)",
      cubicCentimeter: "Cubic Centimeter (cm³)",
      cubicInch: "Cubic Inch (in³)",
      cubicFoot: "Cubic Foot (ft³)",
      gallon: "Gallon (gal)",
      quart: "Quart (qt)",
      pint: "Pint (pt)",
      cup: "Cup",
      tablespoon: "Tablespoon (tbsp)",
      teaspoon: "Teaspoon (tsp)",
      fluidOunce: "Fluid Ounce (fl oz)",
    },
    weight: {
      kilogram: "Kilogram (kg)",
      gram: "Gram (g)",
      milligram: "Milligram (mg)",
      metricTon: "Metric Ton (t)",
      pound: "Pound (lb)",
      ounce: "Ounce (oz)",
      stone: "Stone",
      ton: "Ton (short)",
    },
    temperature: {
      celsius: "Celsius (°C)",
      fahrenheit: "Fahrenheit (°F)",
      kelvin: "Kelvin (K)",
    },
    speed: {
      meterPerSecond: "Meter/Second (m/s)",
      kilometerPerHour: "Kilometer/Hour (km/h)",
      milePerHour: "Mile/Hour (mph)",
      knot: "Knot (kt)",
      footPerSecond: "Foot/Second (ft/s)",
    },
    time: {
      second: "Second (s)",
      millisecond: "Millisecond (ms)",
      microsecond: "Microsecond (µs)",
      nanosecond: "Nanosecond (ns)",
      minute: "Minute (min)",
      hour: "Hour (hr)",
      day: "Day",
      week: "Week",
      month: "Month",
      year: "Year",
    },
    digital: {
      bit: "Bit (b)",
      byte: "Byte (B)",
      kilobyte: "Kilobyte (KB)",
      megabyte: "Megabyte (MB)",
      gigabyte: "Gigabyte (GB)",
      terabyte: "Terabyte (TB)",
      petabyte: "Petabyte (PB)",
      kilobit: "Kilobit (Kb)",
      megabit: "Megabit (Mb)",
      gigabit: "Gigabit (Gb)",
      terabit: "Terabit (Tb)",
    },
    currency: {
      usd: "US Dollar (USD)",
      eur: "Euro (EUR)",
      gbp: "British Pound (GBP)",
      jpy: "Japanese Yen (JPY)",
      aud: "Australian Dollar (AUD)",
      cad: "Canadian Dollar (CAD)",
      cny: "Chinese Yuan (CNY)",
      inr: "Indian Rupee (INR)",
    },
  };

  const categories = [
    { value: "length", label: "Length" },
    { value: "area", label: "Area" },
    { value: "volume", label: "Volume" },
    { value: "weight", label: "Weight" },
    { value: "temperature", label: "Temperature" },
    { value: "speed", label: "Speed" },
    { value: "time", label: "Time" },
    { value: "digital", label: "Digital Storage" },
    { value: "currency", label: "Currency" },
  ];

  const handleCategoryChange = (value: ConversionCategory) => {
    setCategory(value);
    const units = Object.keys(conversionFactors[value]);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
    setFromValue(1);
    calculateToValue(1, units[0], units[1] || units[0], value);
  };

  const handleFromUnitChange = (value: string) => {
    setFromUnit(value);
    calculateToValue(fromValue, value, toUnit, category);
  };

  const handleToUnitChange = (value: string) => {
    setToUnit(value);
    calculateToValue(fromValue, fromUnit, value, category);
  };

  const handleFromValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setFromValue(value);
    calculateToValue(value, fromUnit, toUnit, category);
  };

  const handleToValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setToValue(value);
    // For reverse calculation, we need to invert the conversion
    if (category === "temperature") {
      // Temperature requires special handling
      const newFromValue = convertTemperature(value, toUnit, fromUnit);
      setFromValue(newFromValue);
    } else {
      const fromFactor = conversionFactors[category][fromUnit];
      const toFactor = conversionFactors[category][toUnit];
      setFromValue(value * (fromFactor / toFactor));
    }
  };

  const calculateToValue = (
    value: number,
    from: string,
    to: string,
    cat: ConversionCategory
  ) => {
    if (cat === "temperature") {
      setToValue(convertTemperature(value, from, to));
    } else {
      const fromFactor = conversionFactors[cat][from];
      const toFactor = conversionFactors[cat][to];
      setToValue(value * (toFactor / fromFactor));
    }
  };

  const convertTemperature = (
    value: number,
    from: string,
    to: string
  ): number => {
    // Convert to Celsius first
    let celsius;
    if (from === "celsius") {
      celsius = value;
    } else if (from === "fahrenheit") {
      celsius = ((value - 32) * 5) / 9;
    } else if (from === "kelvin") {
      celsius = value - 273.15;
    } else {
      celsius = value;
    }

    // Convert from Celsius to target unit
    if (to === "celsius") {
      return celsius;
    } else if (to === "fahrenheit") {
      return (celsius * 9) / 5 + 32;
    } else if (to === "kelvin") {
      return celsius + 273.15;
    } else {
      return celsius;
    }
  };

  const getUnitOptions = () => {
    return Object.keys(conversionFactors[category]).map((unit) => ({
      value: unit,
      label: unitLabels[category][unit],
    }));
  };

  return (
    <Modal
      title="Unit Converter"
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
      width={450}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <Select
            className="w-full"
            value={category}
            onChange={handleCategoryChange}
            options={categories}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">From</label>
            <Select
              className="w-full mb-2"
              value={fromUnit}
              onChange={handleFromUnitChange}
              options={getUnitOptions()}
            />
            <Input
              type="number"
              value={fromValue}
              onChange={handleFromValueChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">To</label>
            <Select
              className="w-full mb-2"
              value={toUnit}
              onChange={handleToUnitChange}
              options={getUnitOptions()}
            />
            <Input
              type="number"
              value={toValue}
              onChange={handleToValueChange}
            />
          </div>
        </div>

        {category === "temperature" && (
          <div className="text-xs text-gray-500">
            Note: Temperature conversions use exact formulas, not multiplicative
            factors.
          </div>
        )}

        {category === "currency" && (
          <div className="text-xs text-gray-500">
            Note: Currency rates are approximate and may not be current. For
            accurate rates, use a financial service.
          </div>
        )}
      </div>
    </Modal>
  );
};
