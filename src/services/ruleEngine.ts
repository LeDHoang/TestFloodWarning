/**
 * @license
 * SMART ANTI-FLOOD AI - Rule Engine Service
 *
 * NOTE: Rule Engine là THUẬT TOÁN KẾT HỢP DỮ LIỆU ĐO LƯỜNG VÀ THỊ GIÁC MÁY TÍNH,
 * KHÔNG PHẢI LÀ AI. Nó thực thi logic quyết định xác định (deterministic rule-based).
 */

import { AIClassType, RiskLevel, WaterLevelCategory } from '../types';

export interface RuleEvaluationResult {
  riskLevel: RiskLevel;
  reasons: string[];
  matchedRules: string[];
  actionRecommendation: string;
  isHighRisk: boolean;
  priorityScore: number; // 1 to 4
}

export interface RuleEngineInput {
  rainMmPerHour: number;
  waterLevel: WaterLevelCategory;
  waterPercentage: number;
  aiClass: AIClassType | string;
  aiConfidence: number; // 0 to 1
  confidenceThreshold: number; // e.g. 80
  rainThresholdWatch?: number; // default 20
  rainThresholdHigh?: number; // default 50
}

export function evaluateRiskRules(input: RuleEngineInput): RuleEvaluationResult {
  const {
    rainMmPerHour,
    waterLevel,
    aiClass,
    aiConfidence,
    confidenceThreshold,
    rainThresholdWatch = 20,
    rainThresholdHigh = 50,
  } = input;

  const thresholdDecimal = confidenceThreshold / 100;
  const isConfidenceSufficient = aiConfidence >= thresholdDecimal;
  const reasons: string[] = [];
  const matchedRules: string[] = [];

  // Build descriptive reason labels
  if (rainMmPerHour >= rainThresholdHigh) {
    reasons.push(`Mưa lớn vượt ngưỡng cấp 2: ${rainMmPerHour} mm/h`);
  } else if (rainMmPerHour >= rainThresholdWatch) {
    reasons.push(`Lượng mưa sẵn sàng cảnh báo: ${rainMmPerHour} mm/h`);
  } else {
    reasons.push(`Lượng mưa bình thường: ${rainMmPerHour} mm/h`);
  }

  const confidencePct = Math.round(aiConfidence * 100);
  reasons.push(`AI nhận diện trạng thái ${aiClass} với độ tin cậy ${confidencePct}%`);
  reasons.push(`Mực nước mô phỏng: ${waterLevel}`);

  // Evaluate conditions per Section 12
  const isRainHigh = rainMmPerHour > rainThresholdHigh;
  const isRainWatch = rainMmPerHour >= rainThresholdWatch;
  const isBlocked = aiClass === 'BLOCKED';
  const isPartialBlocked = aiClass === 'PARTIAL_BLOCKED';
  const isTrashNearby = aiClass === 'TRASH_NEARBY';
  const isClear = aiClass === 'CLEAR';
  const isWaterHigh = waterLevel === 'HIGH';
  const isWaterMedium = waterLevel === 'MEDIUM';

  // Rule 4: HIGH RISK
  // Rain > 50 AND AI = BLOCKED AND Confidence >= Threshold
  // OR if water is already HIGH and drain is blocked/partially blocked
  if (isRainHigh && isBlocked && isConfidenceSufficient) {
    matchedRules.push('RULE_HIGH_RISK_01: Rain > 50 mm/h + AI = BLOCKED + Confidence >= Threshold');
    return {
      riskLevel: 'HIGH',
      reasons,
      matchedRules,
      actionRecommendation: 'Kích hoạt cảnh báo ngập khẩn cấp! Cần cử đội công nhân dọn rác cống ngay lập tức.',
      isHighRisk: true,
      priorityScore: 4,
    };
  }

  // Escalation if water is already HIGH with blocked or partial blocked drain
  if (isWaterHigh && (isBlocked || isPartialBlocked)) {
    matchedRules.push('RULE_HIGH_RISK_ESCALATED: Water = HIGH + AI = BLOCKED/PARTIAL_BLOCKED (Nước đã ứ đọng)');
    return {
      riskLevel: 'HIGH',
      reasons,
      matchedRules,
      actionRecommendation: 'Mực nước dâng mức HIGH kết hợp cống bị cản trở. Nguy cơ tràn đường trong 10-15 phút.',
      isHighRisk: true,
      priorityScore: 4,
    };
  }

  // Rule 3: WARNING
  // Rain > 50 AND AI = PARTIAL_BLOCKED OR (Rain >= 20 and AI = BLOCKED) OR Water = HIGH
  if ((isRainHigh && isPartialBlocked) || (isRainWatch && isBlocked) || isWaterHigh || (isWaterMedium && isRainHigh)) {
    matchedRules.push('RULE_WARNING_02: Mưa lớn kết hợp tắc nghẽn một phần hoặc mực nước dâng cao');
    return {
      riskLevel: 'WARNING',
      reasons,
      matchedRules,
      actionRecommendation: 'Chuẩn bị phương án bơm tiêu úng và thông cống trước khi mưa dồn dập hơn.',
      isHighRisk: false,
      priorityScore: 3,
    };
  }

  // Rule 2: WATCH
  // Rain >= 20 OR AI = TRASH_NEARBY OR AI = PARTIAL_BLOCKED
  if (isRainWatch || isTrashNearby || isPartialBlocked || isWaterMedium) {
    matchedRules.push('RULE_WATCH_03: Rain >= 20 mm/h hoặc có rác gần miệng cống cần theo dõi');
    return {
      riskLevel: 'WATCH',
      reasons,
      matchedRules,
      actionRecommendation: 'Tiếp tục duy trì camera giám sát, kiểm tra nguy cơ rác bị nước mưa cuốn vào cống.',
      isHighRisk: false,
      priorityScore: 2,
    };
  }

  // Rule 1: NORMAL
  // Rain < 20 AND AI = CLEAR
  if (!isRainWatch && isClear) {
    matchedRules.push('RULE_NORMAL_04: Rain < 20 mm/h và miệng cống hoàn toàn thông thoáng (CLEAR)');
    return {
      riskLevel: 'NORMAL',
      reasons,
      matchedRules,
      actionRecommendation: 'Hệ thống vận hành an toàn. Cống thông thoáng, khả năng thu nước đạt 100%.',
      isHighRisk: false,
      priorityScore: 1,
    };
  }

  // Fallback safe state
  return {
    riskLevel: 'NORMAL',
    reasons,
    matchedRules: ['RULE_DEFAULT_SAFE'],
    actionRecommendation: 'Hệ thống đang quan sát bình thường.',
    isHighRisk: false,
    priorityScore: 1,
  };
}
