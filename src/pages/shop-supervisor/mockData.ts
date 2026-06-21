export interface Locomotive {
  id: string;
  locoNumber: string;
  locoClass: "WAG12" | "WAP7" | "WAG9" | "WAG12G" | "WAP5";
  shop: string;
  currentTask: string;
  progress: number;
  status: "In Progress" | "On Schedule" | "Delayed" | "Completed";
  priority: "Low" | "Medium" | "High" | "Critical";
  startTime: string;
  expectedCompletion: string;
  delayReason?: string;
  delaySeverity?: "Low" | "Medium" | "High" | "Critical";
  delayDuration?: number; // in hours
  delayRemarks?: string;
  remarks_history?: { date: string; progress: number; remark: string; author: string }[];
}

export interface HistoryItem {
  id: string;
  locoNumber: string;
  locoClass: string;
  task: string;
  completionDate: string;
  duration: string; // e.g., "5 days"
  result: "Passed with Honours" | "Certified" | "Minor Rework" | "Re-calibrated" | "Passed Quality Control";
  shop: string;
}

export const SHOP_TASKS: Record<string, string[]> = {
  "Frame Fabrication Shop": [
    "Underframe Aligning & Welding",
    "Side-Wall Sub-assembly Coupling",
    "Main Bolster Weld Inspection",
    "Cab frame structural reinforcement"
  ],
  "Bogie Shop": [
    "Traction Motor Alignment & Mounting",
    "Primary Suspension Spring Calibrating",
    "Wheel Set and Axle Assembly",
    "Brake rigging setup & clearance test"
  ],
  "Shell Assembly Shop": [
    "Roof block assembly and welding",
    "Driver cabin crash-buffer positioning",
    "Superstructure outer cladding welding",
    "Piping conduit mounting & layout"
  ],
  "Electrical Assembly Shop": [
    "High-Voltage Transformer Static Testing",
    "Primary Cabin Control Console Hookup",
    "Traction Motor Wiring & Ground Alignment",
    "Central electronics rack insulation mapping"
  ],
  "Brake & Pneumatic Shop": [
    "Air reservoir auxiliary pressure testing",
    "Distributor valve sensor connection",
    "E-60 Brake control valve integration",
    "Main duct leakage rate verification"
  ],
  "Paint Shop": [
    "Undercoat rust-inhibitor priming",
    "Tri-colour high-gloss polyurethane spraying",
    "Logo decaling & retroreflective stripes",
    "Clear coat thermal curing block"
  ],
  "Testing Center": [
    "High-voltage pantograph lifting test",
    "Static insulation breakdown clearance",
    "Auxiliary converter load test",
    "Driver console diagnostic simulation"
  ],
  "Dispatch Center": [
    "Final wheel pressure load certificate",
    "Railway board regulatory tag validation",
    "Coupler mechanics manual stress test",
    "Outbound track alignment clearances"
  ]
};

// Initial 20 Sample Locomotives
export const INITIAL_LOCOMOTIVES: Locomotive[] = [
  // Electrical Assembly Shop
  {
    id: "LOCO-2026-001",
    locoNumber: "WAG12-20512",
    locoClass: "WAG12",
    shop: "Electrical Assembly Shop",
    currentTask: "High-Voltage Transformer Static Testing",
    progress: 85,
    status: "On Schedule",
    priority: "High",
    startTime: "2026-06-12 08:00",
    expectedCompletion: "2026-06-21 16:00",
    remarks_history: [
      { date: "2026-06-12", progress: 10, remark: "Underframe assembly routed to Electrical bay.", author: "Suresh S." },
      { date: "2026-06-15", progress: 50, remark: "HV unit installed. Insulation resistance measured at 120 MOhms.", author: "Suresh S." }
    ]
  },
  {
    id: "LOCO-2026-002",
    locoNumber: "WAG12-20513",
    locoClass: "WAG12",
    shop: "Electrical Assembly Shop",
    currentTask: "Primary Cabin Control Console Hookup",
    progress: 42,
    status: "In Progress",
    priority: "Medium",
    startTime: "2026-06-15 09:30",
    expectedCompletion: "2026-06-24 17:00",
    remarks_history: [
      { date: "2026-06-15", progress: 15, remark: "Cabin consoles positioned; routing harness.", author: "Suresh S." }
    ]
  },
  {
    id: "LOCO-2026-003",
    locoNumber: "WAP7-10814",
    locoClass: "WAP7",
    shop: "Electrical Assembly Shop",
    currentTask: "Traction Motor Wiring & Ground Alignment",
    progress: 95,
    status: "On Schedule",
    priority: "Critical",
    startTime: "2026-06-10 07:00",
    expectedCompletion: "2026-06-20 18:00",
    remarks_history: [
      { date: "2026-06-10", progress: 20, remark: "Alignment initiated. Spline tolerance verified.", author: "Suresh S." },
      { date: "2526-06-16", progress: 75, remark: "Traction cables fully bolted and insulated.", author: "Suresh S." }
    ]
  },
  {
    id: "LOCO-2026-004",
    locoNumber: "WAG9-31252",
    locoClass: "WAG9",
    shop: "Electrical Assembly Shop",
    currentTask: "Central electronics rack insulation mapping",
    progress: 25,
    status: "Delayed",
    priority: "High",
    startTime: "2026-06-16 08:30",
    expectedCompletion: "2026-06-22 17:00",
    delayReason: "Material Shortage",
    delaySeverity: "High",
    delayDuration: 24,
    delayRemarks: "Solder lead terminal connectors delayed from transit warehouse.",
    remarks_history: [
      { date: "2026-06-16", progress: 20, remark: "Started sub-rack layout.", author: "Suresh S." }
    ]
  },
  // Frame Fabrication Shop
  {
    id: "LOCO-2026-005",
    locoNumber: "WAG12G-60012",
    locoClass: "WAG12G",
    shop: "Frame Fabrication Shop",
    currentTask: "Underframe Aligning & Welding",
    progress: 90,
    status: "On Schedule",
    priority: "High",
    startTime: "2026-06-14 07:00",
    expectedCompletion: "2026-06-21 15:00",
    remarks_history: [
      { date: "2026-06-14", progress: 30, remark: "Underframe centered on robotic gig.", author: "Aditya P." }
    ]
  },
  {
    id: "LOCO-2026-006",
    locoNumber: "WAP5-30045",
    locoClass: "WAP5",
    shop: "Frame Fabrication Shop",
    currentTask: "Side-Wall Sub-assembly Coupling",
    progress: 15,
    status: "In Progress",
    priority: "Low",
    startTime: "2026-06-18 08:00",
    expectedCompletion: "2026-06-28 17:00"
  },
  {
    id: "LOCO-2026-007",
    locoNumber: "WAP7-10825",
    locoClass: "WAP7",
    shop: "Frame Fabrication Shop",
    currentTask: "Main Bolster Weld Inspection",
    progress: 60,
    status: "Delayed",
    priority: "Critical",
    startTime: "2026-06-12 09:00",
    expectedCompletion: "2026-06-19 12:00",
    delayReason: "Machine Breakdown",
    delaySeverity: "Critical",
    delayDuration: 48,
    delayRemarks: "X-Ray Weld Defect Scanner alignment mirror fractured. Support technician deployed.",
    remarks_history: [
      { date: "2026-06-12", progress: 40, remark: "First bolsters welded.", author: "Aditya P." }
    ]
  },
  // Bogie Shop
  {
    id: "LOCO-2026-008",
    locoNumber: "WAG9-31260",
    locoClass: "WAG9",
    shop: "Bogie Shop",
    currentTask: "Traction Motor Alignment & Mounting",
    progress: 78,
    status: "On Schedule",
    priority: "Medium",
    startTime: "2026-06-13 08:00",
    expectedCompletion: "2026-06-22 17:00"
  },
  {
    id: "LOCO-2026-009",
    locoNumber: "WAP7-10830",
    locoClass: "WAP7",
    shop: "Bogie Shop",
    currentTask: "Primary Suspension Spring Calibrating",
    progress: 30,
    status: "In Progress",
    priority: "High",
    startTime: "2026-06-17 07:30",
    expectedCompletion: "2026-06-25 15:00"
  },
  // Shell Assembly Shop
  {
    id: "LOCO-2026-010",
    locoNumber: "WAG12-20514",
    locoClass: "WAG12",
    shop: "Shell Assembly Shop",
    currentTask: "Roof block assembly and welding",
    progress: 88,
    status: "On Schedule",
    priority: "High",
    startTime: "2026-06-11 08:00",
    expectedCompletion: "2026-06-20 16:00"
  },
  {
    id: "LOCO-2026-011",
    locoNumber: "WAG12G-60020",
    locoClass: "WAG12G",
    shop: "Shell Assembly Shop",
    currentTask: "Driver cabin crash-buffer positioning",
    progress: 50,
    status: "Delayed",
    priority: "Medium",
    startTime: "2026-06-15 08:00",
    expectedCompletion: "2026-06-22 17:00",
    delayReason: "Manpower Issue",
    delaySeverity: "Medium",
    delayDuration: 12,
    delayRemarks: "Specialist gas welders dispatched to heavy crane crash-bogie project."
  },
  // Brake & Pneumatic Shop
  {
    id: "LOCO-2026-012",
    locoNumber: "WAP5-30050",
    locoClass: "WAP5",
    shop: "Brake & Pneumatic Shop",
    currentTask: "Air reservoir auxiliary pressure testing",
    progress: 95,
    status: "On Schedule",
    priority: "Critical",
    startTime: "2026-06-15 08:00",
    expectedCompletion: "2026-06-20 12:00"
  },
  {
    id: "LOCO-2026-013",
    locoNumber: "WAG9-31275",
    locoClass: "WAG9",
    shop: "Brake & Pneumatic Shop",
    currentTask: "Distributor valve sensor connection",
    progress: 20,
    status: "In Progress",
    priority: "Medium",
    startTime: "2026-06-18 09:00",
    expectedCompletion: "2026-06-27 17:00"
  },
  // Paint Shop
  {
    id: "LOCO-2026-014",
    locoNumber: "WAG12-20515",
    locoClass: "WAG12",
    shop: "Paint Shop",
    currentTask: "Undercoat rust-inhibitor priming",
    progress: 100,
    status: "Completed",
    priority: "High",
    startTime: "2026-06-14 08:00",
    expectedCompletion: "2026-06-19 18:00"
  },
  {
    id: "LOCO-2026-015",
    locoNumber: "WAP7-10836",
    locoClass: "WAP7",
    shop: "Paint Shop",
    currentTask: "Tri-colour high-gloss polyurethane spraying",
    progress: 65,
    status: "On Schedule",
    priority: "High",
    startTime: "2026-06-16 08:00",
    expectedCompletion: "2026-06-22 17:00"
  },
  // Testing Center
  {
    id: "LOCO-2026-016",
    locoNumber: "WAG9-31280",
    locoClass: "WAG9",
    shop: "Testing Center",
    currentTask: "High-voltage pantograph lifting test",
    progress: 40,
    status: "Delayed",
    priority: "High",
    startTime: "2026-06-15 09:00",
    expectedCompletion: "2026-06-21 16:00",
    delayReason: "Testing Failure",
    delaySeverity: "High",
    delayDuration: 18,
    delayRemarks: "Pantograph spring resistance failed safety margin threshold on iteration #2."
  },
  {
    id: "LOCO-2026-017",
    locoNumber: "WAP5-30060",
    locoClass: "WAP5",
    shop: "Testing Center",
    currentTask: "Static insulation breakdown clearance",
    progress: 98,
    status: "On Schedule",
    priority: "Medium",
    startTime: "2026-06-16 08:00",
    expectedCompletion: "2026-06-20 17:00"
  },
  // Dispatch Center
  {
    id: "LOCO-2026-018",
    locoNumber: "WAG12-20516",
    locoClass: "WAG12",
    shop: "Dispatch Center",
    currentTask: "Final wheel pressure load certificate",
    progress: 100,
    status: "Completed",
    priority: "Critical",
    startTime: "2026-06-13 08:00",
    expectedCompletion: "2026-06-18 12:00"
  },
  {
    id: "LOCO-2026-019",
    locoNumber: "WAP7-10842",
    locoClass: "WAP7",
    shop: "Dispatch Center",
    currentTask: "Railway board regulatory tag validation",
    progress: 70,
    status: "On Schedule",
    priority: "High",
    startTime: "2026-06-17 08:00",
    expectedCompletion: "2026-06-22 12:00"
  },
  {
    id: "LOCO-2026-020",
    locoNumber: "WAG12G-60035",
    locoClass: "WAG12G",
    shop: "Bogie Shop",
    currentTask: "Wheel Set and Axle Assembly",
    progress: 12,
    status: "In Progress",
    priority: "Low",
    startTime: "2026-06-19 10:00",
    expectedCompletion: "2026-06-29 17:00"
  }
];

// Initial finished and logged history items for Page 5 (History)
export const INITIAL_HISTORY: HistoryItem[] = [
  { id: "HIST-001", locoNumber: "WAG12-20510", locoClass: "WAG12", task: "HV Static Power Test Run", completionDate: "2026-06-10", duration: "4 days", result: "Passed with Honours", shop: "Electrical Assembly Shop" },
  { id: "HIST-002", locoNumber: "WAP7-10810", locoClass: "WAP7", task: "Underframe Welding Alignment Check", completionDate: "2026-06-12", duration: "5 days", result: "Passed Quality Control", shop: "Frame Fabrication Shop" },
  { id: "HIST-003", locoNumber: "WAG9-31245", locoClass: "WAG9", task: "Bogie Suspension Calibrator Setup", completionDate: "2026-06-13", duration: "3 days", result: "Certified", shop: "Bogie Shop" },
  { id: "HIST-004", locoNumber: "WAP5-30030", locoClass: "WAP5", task: "Main Boiler Shell Pressure Outlay", completionDate: "2026-06-14", duration: "6 days", result: "Passed Quality Control", shop: "Shell Assembly Shop" },
  { id: "HIST-005", locoNumber: "WAG12-20509", locoClass: "WAG12", task: "Pneumatic Air Leakage Compression Run", completionDate: "2026-06-15", duration: "2 days", result: "Certified", shop: "Brake & Pneumatic Shop" },
  { id: "HIST-006", locoNumber: "WAP7-10811", locoClass: "WAP7", task: "Tri-Coat High-Gloss Polyurethane Coating", completionDate: "2026-06-16", duration: "4 days", result: "Passed with Honours", shop: "Paint Shop" },
  { id: "HIST-007", locoNumber: "WAG9-31240", locoClass: "WAG9", task: "Driver Console Signal Simulator Stress Check", completionDate: "2026-06-17", duration: "2 days", result: "Passed Quality Control", shop: "Testing Center" },
  { id: "HIST-008", locoNumber: "WAG12-20508", locoClass: "WAG12", task: "Railway Regulatory Acceptance Validation", completionDate: "2026-06-18", duration: "1 day", result: "Certified", shop: "Dispatch Center" },
  { id: "HIST-009", locoNumber: "WAP7-10808", locoClass: "WAP7", task: "Insulation Breakdown Clearance Unit 1", completionDate: "2026-06-15", duration: "4 days", result: "Re-calibrated", shop: "Testing Center" },
  { id: "HIST-010", locoNumber: "WAG9-31241", locoClass: "WAG9", task: "Auxiliary Braking Dual Distributor Connection", completionDate: "2026-06-14", duration: "5 days", result: "Minor Rework", shop: "Brake & Pneumatic Shop" },
];

export function getLocomotives(): Locomotive[] {
  const data = localStorage.getItem("blw_assigned_locomotives");
  if (!data) {
    localStorage.setItem("blw_assigned_locomotives", JSON.stringify(INITIAL_LOCOMOTIVES));
    return INITIAL_LOCOMOTIVES;
  }
  return JSON.parse(data);
}

export function saveLocomotives(locos: Locomotive[]): void {
  localStorage.setItem("blw_assigned_locomotives", JSON.stringify(locos));
}

export function getHistory(): HistoryItem[] {
  const data = localStorage.getItem("blw_production_history");
  if (!data) {
    localStorage.setItem("blw_production_history", JSON.stringify(INITIAL_HISTORY));
    return INITIAL_HISTORY;
  }
  return JSON.parse(data);
}

export function saveHistory(hist: HistoryItem[]): void {
  localStorage.setItem("blw_production_history", JSON.stringify(hist));
}

export function getPendingActivities(shopName: string) {
  // Generate pending activities realistically based on current locomotives
  const locos = getLocomotives();
  const shopLocos = locos.filter(l => l.shop === shopName);
  
  const activities = [
    { id: "act-1", task: "Verify weld integrity on traction brackets", target: "Safety Scan", priority: "High" },
    { id: "act-2", task: "Sign-off secondary auxiliary circuits cable log", target: "Documentation", priority: "Medium" },
    { id: "act-3", task: "Environmental calibration validation on test-rig", target: "Routine Inspection", priority: "Low" },
  ];

  // Map to something custom depending on shop
  if (shopLocos.length > 0) {
    return [
      { id: `act-${shopLocos[0].id}`, task: `Approval required for structural stage completion on ${shopLocos[0].locoNumber}`, target: shopLocos[0].currentTask, priority: shopLocos[0].priority },
      ...activities
    ];
  }
  return activities;
}

export function getRecentActivities(shopName: string) {
  return [
    { id: "rec-1", text: "Material inventory requisition submitted for coupler assembly", time: "10 minutes ago", user: "Gavin D." },
    { id: "rec-2", text: "Calibration clearance completed on Primary Rig #3", time: "1 hour ago", user: "Rajesh S." },
    { id: "rec-3", text: "Shift crossover checklist confirmed and logged out", time: "3 hours ago", user: "Suresh S." },
    { id: "rec-4", text: "Quality inspector completed high-voltage audit path", time: "Yesterday", user: "Inspector Praveen" }
  ];
}
