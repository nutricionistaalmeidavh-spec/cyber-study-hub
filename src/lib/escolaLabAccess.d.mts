export type LabActor = 'alice' | 'bob';
export type LabMode = 'vulnerable' | 'corrected';
export type LabStepId = 'alice-before' | 'bob-before' | 'bob-after' | 'alice-after';
export type LabStep = Readonly<{
  id: LabStepId;
  actor: LabActor;
  mode: LabMode;
  expectedStatus: 200 | 403;
  title: string;
  instruction: string;
}>;
export type LabResponse = Readonly<{
  status: 200 | 403;
  actor: LabActor;
  owner: 'alice';
  mode: LabMode;
  asset: 'F001';
  unauthorizedExposure: boolean;
  body: {id: string; owner: string; amountCents: number; fictional: true} | {error: string};
}>;
export declare const LAB_LESSON_ID: 34;
export declare const LAB_STEPS: readonly LabStep[];
export declare function simulateInvoiceAccess(actor: LabActor, mode: LabMode): LabResponse;
export declare function isExpectedLabStep(step: LabStep, actor: LabActor, mode: LabMode, result: LabResponse): boolean;
