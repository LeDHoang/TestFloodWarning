/**
 * Verifies that every Demo Mode step's expectedRisk matches what the rule engine
 * actually outputs for that step's preset. Run with: npm test
 */
import { DEMO_STEPS } from '../src/context/AppContext';
import { DEFAULT_SETTINGS } from '../src/services/storage';
import { evaluateRiskRules } from '../src/services/ruleEngine';
import { generateMockPrediction } from '../src/services/teachableMachine';

let failures = 0;
let state = { rain: 55, water: 'LOW' as 'LOW' | 'MEDIUM' | 'HIGH', ai: 'CLEAR' as const as string };

for (const step of DEMO_STEPS) {
  state = {
    rain: step.targetRain ?? state.rain,
    water: step.targetWater ?? state.water,
    ai: step.targetAI ?? state.ai,
  };
  if (!step.expectedRisk) continue;
  const pred = generateMockPrediction(state.ai as any);
  const { riskLevel } = evaluateRiskRules({
    rainMmPerHour: state.rain,
    waterLevel: state.water,
    waterPercentage: 0,
    aiClass: pred.topClass,
    aiConfidence: pred.confidence,
    confidenceThreshold: DEFAULT_SETTINGS.confidenceThreshold,
    rainThresholdWatch: DEFAULT_SETTINGS.rainThresholdWatch,
    rainThresholdHigh: DEFAULT_SETTINGS.rainThresholdHigh,
  });
  const ok = riskLevel === step.expectedRisk;
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  step ${step.step}: rain=${state.rain} water=${state.water} ai=${state.ai} -> ${riskLevel} (expected ${step.expectedRisk})`);
}

if (failures) {
  console.error(`\n${failures} demo step(s) disagree with the rule engine.`);
  process.exit(1);
}
console.log('\nAll demo steps match the rule engine.');
