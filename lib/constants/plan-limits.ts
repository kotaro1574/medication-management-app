export type PlanLimits = {
  [key: string]: {
    userLimit: number
    patientLimit: number
  }
}

export const PLAN_LIMITS: PlanLimits = {
  プラン１: { userLimit: 20, patientLimit: 20 },
  プラン２: { userLimit: 30, patientLimit: 50 },
  プラン３: { userLimit: 50, patientLimit: 100 },
  プラン４: { userLimit: 70, patientLimit: 150 },
}
