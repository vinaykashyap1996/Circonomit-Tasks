import { useState } from 'react';
import {
  runSimulation,
  getDisplayRows,
  scenarios,
  ScenarioName,
} from './simulation/dataModel';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

const scenarioKeys: ScenarioName[] = Object.keys(scenarios) as ScenarioName[];
const colors = [
  '#82ca9d',
  '#8884d8',
  '#ffc658',
  '#ff8042',
  '#0088FE',
  '#00C49F',
];

const inputFields = [
  { block: 'Production', key: 'materialCost', label: 'Material Cost (€)' },
  { block: 'Production', key: 'energyCost', label: 'Energy Cost (€)' },
  { block: 'Logistics', key: 'transportCost', label: 'Transport Cost (€)' },
] as const;

export default function App() {
  const [selectedScenarios, setSelectedScenarios] =
    useState<ScenarioName[]>(scenarioKeys);

  const [inputs, setInputs] = useState(() => {
    const base = scenarios.Base;
    return {
      materialCost: base.Production.materialCost!,
      energyCost: base.Production.energyCost!,
      transportCost: base.Logistics.transportCost!,
    };
  });

  function onInputChange(key: string, val: number) {
    setInputs((prev) => ({ ...prev, [key]: val }));
  }

  const scenarioResults = selectedScenarios.map((scenario) => {
    const prod = { ...(scenarios[scenario].Production || {}) };
    const logi = { ...(scenarios[scenario].Logistics || {}) };

    if (scenario === 'Base') {
      if ('materialCost' in prod) {
        prod.materialCost = inputs.materialCost;
      }
      if ('energyCost' in prod) {
        prod.energyCost = inputs.energyCost;
      }
      if ('transportCost' in logi) {
        logi.transportCost = inputs.transportCost;
      }
    }

    return getDisplayRows(
      runSimulation(scenario, 100, 0.001, {
        Production: prod,
        Logistics: logi,
      })
    );
  });

  const attributeLabels = scenarioResults[0]?.map((row) => row.label) || [];

  const chartData = attributeLabels.map((label, idx) => {
    const entry: Record<string, any> = { name: label };
    selectedScenarios.forEach((scenario, sIdx) => {
      entry[scenario] = scenarioResults[sIdx][idx].value;
    });
    return entry;
  });

  function handleScenarioToggle(scenario: ScenarioName) {
    setSelectedScenarios((prev) =>
      prev.includes(scenario)
        ? prev.filter((s) => s !== scenario)
        : [...prev, scenario]
    );
  }

  return (
    <div style={{ fontFamily: 'sans-serif', margin: 40, maxWidth: 900 }}>
      <h1>Simulation Multi-Scenario Comparison</h1>

      <div style={{ marginBottom: 20 }}>
        <strong>Input values</strong>
        {inputFields.map(({ key, label }) => (
          <label key={key} style={{ marginLeft: 18 }}>
            {label}:&nbsp;
            <input
              type='number'
              value={inputs[key]}
              onChange={(e) => onInputChange(key, Number(e.target.value))}
              style={{ width: 80 }}
            />
          </label>
        ))}
      </div>

      <div style={{ marginBottom: 24 }}>
        <strong>Compare scenarios:</strong>
        {scenarioKeys.map((scenario, idx) => (
          <label key={scenario} style={{ marginLeft: 18 }}>
            <input
              type='checkbox'
              checked={selectedScenarios.includes(scenario)}
              onChange={() => handleScenarioToggle(scenario)}
            />{' '}
            {scenario}
          </label>
        ))}
      </div>

      <div
        style={{
          width: '100%',
          height: 380,
          background: '#fafafa',
          borderRadius: 8,
          boxShadow: '0 2px 8px #eee',
          padding: 24,
        }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' tick={{ fontSize: 14 }} />
            <YAxis tick={{ fontSize: 14 }} />
            <Tooltip />
            <Legend />
            {selectedScenarios.map((scenario, idx) => (
              <Bar
                key={scenario}
                dataKey={scenario}
                fill={colors[idx % colors.length]}
                name={scenario}
                barSize={30 / selectedScenarios.length}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: 40 }}>
        <h2>Results Table</h2>
        <table
          style={{ borderCollapse: 'collapse', width: '100%', marginTop: 18 }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>
                Attribute
              </th>
              {selectedScenarios.map((scenario) => (
                <th
                  key={scenario}
                  style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {scenario}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attributeLabels.map((label, idx) => (
              <tr key={label}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {label}
                </td>
                {selectedScenarios.map((scenario, sIdx) => (
                  <td
                    key={scenario}
                    style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {scenarioResults[sIdx][idx].value.toFixed(3)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
