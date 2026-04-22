const REQUIRED_HEADERS = [
  "student_id",
  "student_name",
  "grade_level",
  "class_name",
  "attendance_percent",
  "missing_assignments",
  "late_submissions",
  "participation_score",
  "behavior_concern",
  "recent_quiz_avg",
  "recent_test_avg",
  "score_trend",
  "last_intervention_days_ago",
  "teacher_notes",
];

const OPTIONAL_HEADERS = ["advisor_email", "parent_email"];

const SAMPLE_HEADERS = [...REQUIRED_HEADERS, ...OPTIONAL_HEADERS];

const SAMPLE_IMPORT_TEXT = `${SAMPLE_HEADERS.join(",")}
S-1001,Mina Patel,10,Algebra II,91,3,2,2,medium,74,69,down,34,"Missed the last checkpoint and has been quiet during partner practice.",advisor.mina@school.org,family.mina@example.com
S-1002,Jordan Lee,11,AP Computer Science,97,1,1,4,low,88,84,flat,12,"Strong verbal reasoning but written explanations stay rushed.",advisor.jordan@school.org,
S-1003,Sofia Ramirez,9,Biology,88,2,3,3,medium,79,76,down,29,"Attendance gaps are slowing lab confidence and follow-through.",advisor.sofia@school.org,family.sofia@example.com`;

const sampleStudents = [
  {
    student_id: "S-1001",
    student_name: "Mina Patel",
    grade_level: "10",
    class_name: "Algebra II",
    attendance_percent: 91,
    missing_assignments: 3,
    late_submissions: 2,
    participation_score: 2,
    behavior_concern: "medium",
    recent_quiz_avg: 74,
    recent_test_avg: 69,
    score_trend: "down",
    last_intervention_days_ago: 34,
    teacher_notes: "Missed the last checkpoint and has been quiet during partner practice.",
    advisor_email: "advisor.mina@school.org",
    parent_email: "family.mina@example.com",
  },
  {
    student_id: "S-1002",
    student_name: "Jordan Lee",
    grade_level: "11",
    class_name: "AP Computer Science",
    attendance_percent: 97,
    missing_assignments: 1,
    late_submissions: 1,
    participation_score: 4,
    behavior_concern: "low",
    recent_quiz_avg: 88,
    recent_test_avg: 84,
    score_trend: "flat",
    last_intervention_days_ago: 12,
    teacher_notes: "Strong verbal reasoning but written explanations stay rushed.",
    advisor_email: "advisor.jordan@school.org",
    parent_email: "",
  },
  {
    student_id: "S-1003",
    student_name: "Sofia Ramirez",
    grade_level: "9",
    class_name: "Biology",
    attendance_percent: 88,
    missing_assignments: 2,
    late_submissions: 3,
    participation_score: 3,
    behavior_concern: "medium",
    recent_quiz_avg: 79,
    recent_test_avg: 76,
    score_trend: "down",
    last_intervention_days_ago: 29,
    teacher_notes: "Attendance gaps are slowing lab confidence and follow-through.",
    advisor_email: "advisor.sofia@school.org",
    parent_email: "family.sofia@example.com",
  },
];

const authShell = document.querySelector("#auth-shell");
const signInTab = document.querySelector("#sign-in-tab");
const createAccountTab = document.querySelector("#create-account-tab");
const resetTab = document.querySelector("#reset-tab");
const signInForm = document.querySelector("#sign-in-form");
const createAccountForm = document.querySelector("#create-account-form");
const resetRequestForm = document.querySelector("#reset-request-form");
const resetConfirmForm = document.querySelector("#reset-confirm-form");
const googleSignInButton = document.querySelector("#google-sign-in-button");
const googleCreateButton = document.querySelector("#google-create-button");
const authStatus = document.querySelector("#auth-status");

const teacherIdentity = document.querySelector("#teacher-identity");
const signOutButton = document.querySelector("#sign-out-button");
const studentCount = document.querySelector("#student-count");
const highPriorityCount = document.querySelector("#high-priority-count");
const prepHoursSaved = document.querySelector("#prep-hours-saved");
const draftEmailsCount = document.querySelector("#draft-emails-count");
const interventionCount = document.querySelector("#intervention-count");
const resultsBar = document.querySelector("#results-bar");
const studentSearch = document.querySelector("#student-search");
const studentSort = document.querySelector("#student-sort");
const priorityFilters = document.querySelector("#priority-filters");
const moduleTabs = document.querySelector("#module-tabs");
const moduleJumpButtons = document.querySelectorAll(".module-jump");

const teachingPackForm = document.querySelector("#teaching-pack-form");
const teachingPackOutput = document.querySelector("#teaching-pack-output");
const subPlanForm = document.querySelector("#sub-plan-form");
const subPlanOutput = document.querySelector("#sub-plan-output");
const subPlanFile = document.querySelector("#sub-plan-file");
const repurposeForm = document.querySelector("#repurpose-form");
const repurposeOutput = document.querySelector("#repurpose-output");
const repurposeFile = document.querySelector("#repurpose-file");
const clearRepurposeFileButton = document.querySelector("#clear-repurpose-file");
const repurposeFileStatus = document.querySelector("#repurpose-file-status");
const supportSummary = document.querySelector("#support-summary");
const highSupportList = document.querySelector("#high-support-list");
const moderateSupportList = document.querySelector("#moderate-support-list");
const lowSupportList = document.querySelector("#low-support-list");
const highListCount = document.querySelector("#high-list-count");
const moderateListCount = document.querySelector("#moderate-list-count");
const lowListCount = document.querySelector("#low-list-count");
const studentDetail = document.querySelector("#student-detail");
const classIntelSelect = document.querySelector("#class-intel-select");
const classIntelOutput = document.querySelector("#class-intel-output");
const adminReadyForm = document.querySelector("#admin-ready-form");
const adminReadyOutput = document.querySelector("#admin-ready-output");
const downloadSample = document.querySelector("#download-sample");
const pasteImport = document.querySelector("#paste-import");
const pasteImportButton = document.querySelector("#paste-import-button");
const importMode = document.querySelector("#import-mode");
const csvUpload = document.querySelector("#csv-upload");
const importStatus = document.querySelector("#import-status");
const classSettings = document.querySelector("#class-settings");
const rosterClassSelect = document.querySelector("#roster-class-select");
const rosterTable = document.querySelector("#roster-table");
const workloadQueue = document.querySelector("#workload-queue");
const settingsTabs = document.querySelector("#settings-tabs");
const settingsPanels = document.querySelectorAll(".settings-panel");
const profileForm = document.querySelector("#profile-form");
const profileName = document.querySelector("#profile-name");
const profileEmail = document.querySelector("#profile-email");
const profileSchool = document.querySelector("#profile-school");
const profileTitle = document.querySelector("#profile-title");
const profileDepartment = document.querySelector("#profile-department");
const profilePhone = document.querySelector("#profile-phone");
const profilePreferredView = document.querySelector("#profile-preferred-view");
const profileStatus = document.querySelector("#profile-status");
const emailSettingsForm = document.querySelector("#email-settings-form");
const emailHost = document.querySelector("#email-host");
const emailPort = document.querySelector("#email-port");
const emailSecure = document.querySelector("#email-secure");
const emailUsername = document.querySelector("#email-username");
const emailFromAddress = document.querySelector("#email-from-address");
const emailPassword = document.querySelector("#email-password");
const emailSettingsStatus = document.querySelector("#email-settings-status");
const emailTestRecipient = document.querySelector("#email-test-recipient");
const sendTestEmailButton = document.querySelector("#send-test-email-button");
const historyList = document.querySelector("#history-list");
const communicationsList = document.querySelector("#communications-list");
const alertsList = document.querySelector("#alerts-list");
const alertForm = document.querySelector("#alert-form");
const alertStatus = document.querySelector("#alert-status");
const clearHistoryButton = document.querySelector("#clear-history-button");
const clearCommunicationsButton = document.querySelector("#clear-communications-button");
const clearAlertsButton = document.querySelector("#clear-alerts-button");
const navToggle = document.querySelector("#nav-toggle");
const navMenu = document.querySelector("#nav-menu");
const refineForm = document.querySelector("#refine-form");
const refineChatLog = document.querySelector("#refine-chat-log");

let teacherProfile = null;
let students = [...sampleStudents];
let selectedStudentId = sampleStudents[0].student_id;
let activeModule = "teaching-pack";
let activeSettingsTab = "profile";
let workspaceActivities = [];
let lastPlanningContext = null;
let sessionReady = false;
let selectedInsightsClass = "";
let selectedRosterClass = "";
let currentEmailSettings = null;
const state = {
  search: "",
  filter: "all",
  sort: "priority",
};

const plannerTemplates = {
  reteach: {
    topic: "Reteach checkpoint lesson",
    className: "Algebra II",
    gradeLevel: "10",
    duration: "45 minutes",
    goal: "Students will repair one misconception and complete one fresh mastery task independently.",
  },
  "small-group": {
    topic: "Small-group debug and feedback workshop",
    className: "AP Computer Science",
    gradeLevel: "11",
    duration: "50 minutes",
    goal: "Students will identify one code issue, apply a fix, and explain why the bug happened.",
  },
  "exit-ticket": {
    topic: "Exit ticket mastery check",
    className: "Biology",
    gradeLevel: "9",
    duration: "40 minutes",
    goal: "Students will summarize the day concept and answer one transfer question before dismissal.",
  },
};

const priorityRank = {
  high: 0,
  moderate: 1,
  low: 2,
};

const DEFAULT_EMAIL_PROVIDER = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  username: "",
  fromAddress: "",
  hasPassword: false,
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function setStatus(target, message, type = "neutral") {
  if (!target) {
    return;
  }
  target.textContent = message;
  target.dataset.state = type;
}

function setAuthStatus(message, type = "neutral") {
  setStatus(authStatus, message, type);
}

function setImportStatus(message, type = "neutral") {
  setStatus(importStatus, message, type);
}

function setProfileStatus(message, type = "neutral") {
  setStatus(profileStatus, message, type);
}

function setEmailSettingsStatus(message, type = "neutral") {
  setStatus(emailSettingsStatus, message, type);
}

function setAlertStatus(message, type = "neutral") {
  setStatus(alertStatus, message, type);
}

async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    const parts = [payload?.error, payload?.detail].filter(Boolean);
    throw new Error(parts.join(" ") || `Request failed (${response.status})`);
  }

  return payload;
}

function showAuthMode(mode) {
  if (!signInTab || !createAccountTab || !resetTab || !signInForm || !createAccountForm || !resetRequestForm || !resetConfirmForm) {
    return;
  }
  const modes = {
    signin: signInForm,
    create: createAccountForm,
    reset: resetRequestForm,
    confirm: resetConfirmForm,
  };

  signInTab.classList.toggle("active", mode === "signin");
  createAccountTab.classList.toggle("active", mode === "create");
  resetTab.classList.toggle("active", mode === "reset" || mode === "confirm");

  for (const [key, form] of Object.entries(modes)) {
    form.classList.toggle("is-hidden", key !== mode);
  }
}

function applyAuthState() {
  const signedIn = Boolean(teacherProfile?.email);
  document.body.classList.toggle("signed-in", signedIn);
  authShell?.classList.toggle("is-hidden", signedIn);
  if (!signedIn && sessionReady && (!authShell || !authShell.children.length) && !window.location.pathname.endsWith("/index.html") && window.location.pathname !== "/") {
    window.location.replace("./index.html");
  }
}

function renderTeacherIdentity() {
  if (!teacherIdentity) {
    return;
  }
  if (!teacherProfile?.email) {
    teacherIdentity.textContent = "No teacher signed in";
    teacherIdentity.dataset.state = "empty";
    return;
  }

  const summary = [teacherProfile.name, teacherProfile.title, teacherProfile.email].filter(Boolean).join(" · ");
  teacherIdentity.textContent = summary;
  teacherIdentity.dataset.state = "connected";
}

function applyTeacherProfile(profile) {
  teacherProfile = profile;
  if (profileName) profileName.value = profile?.name || "";
  if (profileEmail) profileEmail.value = profile?.email || "";
  if (profileSchool) profileSchool.value = profile?.school || "";
  if (profileTitle) profileTitle.value = profile?.title || "";
  if (profileDepartment) profileDepartment.value = profile?.department || "";
  if (profilePhone) profilePhone.value = profile?.phone || "";
  if (profilePreferredView) profilePreferredView.value = profile?.preferredView || "desktop";
  document.body.dataset.preferredView = profile?.preferredView || "desktop";
  renderTeacherIdentity();
  applyAuthState();
  if (!profile) {
    currentEmailSettings = null;
    applyEmailSettings(null);
    if (emailTestRecipient) {
      emailTestRecipient.value = "";
    }
  }
}

function getDefaultStudents() {
  return teacherProfile ? [] : [...sampleStudents];
}

function consumeAuthFlash() {
  const url = new URL(window.location.href);
  const success = url.searchParams.get("authSuccess");
  const error = url.searchParams.get("authError");
  const resetEmail = url.searchParams.get("resetEmail");
  const resetToken = url.searchParams.get("resetToken");

  if (success === "google_connected") {
    setAuthStatus("Google Workspace sign-in completed.", "success");
  } else if (error === "google_not_configured") {
    setAuthStatus("Google OAuth is not configured yet. Add your Google credentials to .env.", "error");
  } else if (error) {
    setAuthStatus(`Google sign-in failed: ${error.replaceAll("_", " ")}.`, "error");
  }

  if (resetEmail && resetToken) {
    showAuthMode("confirm");
    resetConfirmForm?.elements?.namedItem("email")?.setAttribute("value", resetEmail);
    resetConfirmForm?.elements?.namedItem("token")?.setAttribute("value", resetToken);
    if (resetConfirmForm?.elements?.namedItem("email")) {
      resetConfirmForm.elements.namedItem("email").value = resetEmail;
    }
    if (resetConfirmForm?.elements?.namedItem("token")) {
      resetConfirmForm.elements.namedItem("token").value = resetToken;
    }
    setAuthStatus("Reset link verified. Choose a new password.", "success");
  }

  if (success || error || resetEmail || resetToken) {
    url.searchParams.delete("authSuccess");
    url.searchParams.delete("authError");
    url.searchParams.delete("resetEmail");
    url.searchParams.delete("resetToken");
    window.history.replaceState({}, "", url);
  }
}

function createSampleDownload() {
  if (downloadSample) {
    downloadSample.href = `data:text/csv;charset=utf-8,${encodeURIComponent(SAMPLE_IMPORT_TEXT)}`;
  }
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function clampNumber(value, min, max, fallback = min) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, numeric));
}

function normalizeBehaviorConcern(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return ["low", "medium", "high"].includes(normalized) ? normalized : "medium";
}

function normalizeTrend(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return ["up", "flat", "down"].includes(normalized) ? normalized : "flat";
}

function normalizeStudent(record) {
  return {
    student_id: String(record.student_id || "").trim(),
    student_name: String(record.student_name || "").trim(),
    grade_level: String(record.grade_level || "").trim(),
    class_name: String(record.class_name || "").trim(),
    attendance_percent: clampNumber(record.attendance_percent, 0, 100, 100),
    missing_assignments: clampNumber(record.missing_assignments, 0, 100, 0),
    late_submissions: clampNumber(record.late_submissions, 0, 100, 0),
    participation_score: clampNumber(record.participation_score, 1, 5, 3),
    behavior_concern: normalizeBehaviorConcern(record.behavior_concern),
    recent_quiz_avg: clampNumber(record.recent_quiz_avg, 0, 100, 100),
    recent_test_avg: clampNumber(record.recent_test_avg, 0, 100, 100),
    score_trend: normalizeTrend(record.score_trend),
    last_intervention_days_ago: clampNumber(record.last_intervention_days_ago, 0, 365, 0),
    teacher_notes: String(record.teacher_notes || "").trim(),
    advisor_email: normalizeEmail(record.advisor_email),
    parent_email: normalizeEmail(record.parent_email),
  };
}

function parseDelimitedText(text, delimiter) {
  const rows = [];
  let current = "";
  let row = [];
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === delimiter && !inQuotes) {
      row.push(current);
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }
      row.push(current);
      if (row.some((cell) => cell.trim() !== "")) {
        rows.push(row);
      }
      row = [];
      current = "";
      continue;
    }

    current += char;
  }

  row.push(current);
  if (row.some((cell) => cell.trim() !== "")) {
    rows.push(row);
  }

  return rows;
}

function parseStudentImport(text) {
  const trimmed = text.trim();
  if (!trimmed) {
    return { headers: [], rows: [] };
  }

  const delimiter = trimmed.includes("\t") ? "\t" : ",";
  const parsedRows = parseDelimitedText(trimmed, delimiter);
  if (parsedRows.length < 2) {
    return { headers: [], rows: [] };
  }

  const headers = parsedRows[0].map((cell) => cell.trim());
  const rows = parsedRows.slice(1).map((row) =>
    headers.reduce((record, header, index) => {
      record[header] = row[index]?.trim() ?? "";
      return record;
    }, {}),
  );

  return { headers, rows };
}

function hasRequiredHeaders(headers) {
  return REQUIRED_HEADERS.every((header) => headers.includes(header));
}

function calculateRiskBreakdown(student) {
  const attendance_risk = Math.max(0, 100 - student.attendance_percent);
  const missing_risk = Math.min(100, student.missing_assignments * 15);
  const late_risk = Math.min(100, student.late_submissions * 12);
  const participationMap = { 5: 0, 4: 20, 3: 45, 2: 75, 1: 100 };
  const behaviorMap = { low: 10, medium: 50, high: 90 };
  const trendMap = { up: 10, flat: 40, down: 80 };

  const participation_risk = participationMap[student.participation_score] ?? 45;
  const behavior_risk = behaviorMap[student.behavior_concern] ?? 50;
  const quiz_risk = Math.max(0, 100 - student.recent_quiz_avg);
  const test_risk = Math.max(0, 100 - student.recent_test_avg);
  const trend_risk = trendMap[student.score_trend] ?? 40;

  const contributions = [
    { key: "attendance", weighted: attendance_risk * 0.2, reason: `Attendance is ${student.attendance_percent}% and may be limiting consistent instruction.` },
    { key: "missing", weighted: missing_risk * 0.2, reason: `${student.missing_assignments} missing assignments are reducing completion and confidence.` },
    { key: "late", weighted: late_risk * 0.1, reason: `${student.late_submissions} late submissions suggest pacing or organization issues.` },
    { key: "participation", weighted: participation_risk * 0.15, reason: `Participation score is ${student.participation_score}/5, so in-class understanding is less visible.` },
    { key: "behavior", weighted: behavior_risk * 0.1, reason: `Behavior concern is marked ${student.behavior_concern}.` },
    { key: "quiz", weighted: quiz_risk * 0.1, reason: `Recent quiz average is ${student.recent_quiz_avg}%.` },
    { key: "test", weighted: test_risk * 0.1, reason: `Recent test average is ${student.recent_test_avg}%.` },
    { key: "trend", weighted: trend_risk * 0.05, reason: `Score trend is ${student.score_trend}, which affects confidence in current momentum.` },
  ];

  let support_risk_score = contributions.reduce((sum, item) => sum + item.weighted, 0);
  if (student.last_intervention_days_ago >= 30 && support_risk_score >= 50) {
    support_risk_score = Math.min(100, support_risk_score + 5);
    contributions.push({
      key: "intervention_gap",
      weighted: 5,
      reason: `${student.last_intervention_days_ago} days since the last intervention adds urgency.`,
    });
  }

  return {
    support_risk_score: Math.min(100, Math.round(support_risk_score * 10) / 10),
    contributions,
  };
}

function getSupportLevel(score) {
  if (score >= 65) {
    return "high";
  }
  if (score >= 35) {
    return "moderate";
  }
  return "low";
}

function buildIntervention(student, topReasons) {
  const keys = topReasons.map((item) => item.key);
  if (keys.includes("missing") || keys.includes("late")) {
    return "Create a short recovery calendar for the two highest-value missing tasks, add a checkpoint date, and notify the advisor if needed.";
  }
  if (keys.includes("quiz") || keys.includes("test") || keys.includes("trend")) {
    return "Schedule a targeted reteach or small-group check this week, then reassess with a short mastery check before the next class.";
  }
  if (keys.includes("attendance") || keys.includes("intervention_gap")) {
    return "Run an attendance/access check-in and create a Google Calendar follow-up reminder before the next major assessment.";
  }
  if (keys.includes("participation") || keys.includes("behavior")) {
    return "Use a low-stakes participation structure and document one engagement goal for the next five class meetings.";
  }
  return "Continue weekly monitoring with one documented teacher follow-up and a short progress note.";
}

function summarizeBehavior(student) {
  const notes = String(student.teacher_notes || "").trim();
  const normalized = notes.toLowerCase();
  const tags = [];
  if (student.late_submissions > 0) {
    tags.push(`${student.late_submissions} late submission${student.late_submissions === 1 ? "" : "s"}`);
  }
  if (student.missing_assignments > 0) {
    tags.push(`${student.missing_assignments} missing assignment${student.missing_assignments === 1 ? "" : "s"}`);
  }
  if (/distract|off task|talk/i.test(normalized)) {
    tags.push("distracted in class");
  }
  if (/late to class|tardy/i.test(normalized)) {
    tags.push("late to class");
  }
  if (/quiet|not participat|low particip/i.test(normalized)) {
    tags.push("low participation");
  }
  if (/behavior|concern/i.test(normalized) && student.behavior_concern !== "low") {
    tags.push(`${student.behavior_concern} behavior concern`);
  }
  if (!tags.length && notes) {
    tags.push(notes);
  }
  return tags.length ? tags.join("; ") : "No behavior or work-habit note recorded.";
}

function buildProgressSummary(student, topReasons) {
  return `Support level: ${student.supportLevel} (${student.support_risk_score})
Class: ${student.class_name} · Grade ${student.grade_level}
Quiz average: ${student.recent_quiz_avg}%
Test average: ${student.recent_test_avg}%
Attendance: ${student.attendance_percent}%
Missing assignments: ${student.missing_assignments}
Late submissions: ${student.late_submissions}
Participation: ${student.participation_score}/5
Behavior/work habits: ${summarizeBehavior(student)}
Main concerns: ${topReasons.map((item) => item.reason).join(" ")}
Teacher notes: ${student.teacher_notes || "No additional teacher notes."}`;
}

function buildEmail(student, topReasons) {
  return `Subject: ${student.student_name} support update

Hello,

I wanted to share a quick update on ${student.student_name} in ${student.class_name}. Current indicators place this student in the ${student.supportLevel} support band with a TeacherFlowAI score of ${student.support_risk_score}.

Key reasons:
- ${topReasons.map((item) => item.reason).join("\n- ")}

Suggested next step:
${student.intervention}

Teacher notes:
${student.teacher_notes || "No additional teacher notes were provided."}

Best,
${teacherProfile?.name || "TeacherFlowAI Draft"}`;
}

function scoreStudent(student) {
  const normalized = normalizeStudent(student);
  const breakdown = calculateRiskBreakdown(normalized);
  const supportLevel = getSupportLevel(breakdown.support_risk_score);
  const whyFlagged = breakdown.contributions
    .filter((item) => item.weighted > 0)
    .sort((left, right) => right.weighted - left.weighted)
    .slice(0, 3);
  const intervention = buildIntervention(normalized, whyFlagged);
  const base = { ...normalized, support_risk_score: breakdown.support_risk_score, supportLevel, intervention };
  return {
    ...base,
    whyFlagged,
    progressSummary: buildProgressSummary(base, whyFlagged),
    email: buildEmail(base, whyFlagged),
  };
}

function getScoredStudents() {
  return students.map(scoreStudent);
}

function getFilteredStudents(scoredStudents) {
  const searchValue = state.search.trim().toLowerCase();
  return scoredStudents
    .filter((student) => {
      const filterMatch = state.filter === "all" || student.supportLevel === state.filter;
      const searchMatch =
        !searchValue ||
        [
          student.student_name,
          student.student_id,
          student.class_name,
          student.grade_level,
          student.teacher_notes,
          student.advisor_email,
          student.parent_email,
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchValue);
      return filterMatch && searchMatch;
    })
    .sort((left, right) => {
      switch (state.sort) {
        case "name":
          return left.student_name.localeCompare(right.student_name);
        case "score-high":
          return right.support_risk_score - left.support_risk_score;
        case "missing":
          return right.missing_assignments - left.missing_assignments;
        case "priority":
        default:
          return (
            priorityRank[left.supportLevel] - priorityRank[right.supportLevel] ||
            right.support_risk_score - left.support_risk_score ||
            left.student_name.localeCompare(right.student_name)
          );
      }
    });
}

function slugify(value) {
  return String(value || "teacherflowai-resource")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "teacherflowai-resource";
}

function createHtmlDocument(title, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 32px; color: #1a1f2c; line-height: 1.55; background: linear-gradient(180deg, #f8faf7, #eef3ef); }
      h1, h2, h3 { margin: 0 0 12px; }
      .sheet { max-width: 860px; margin: 0 auto; }
      .card { border: 1px solid #d8dfeb; border-radius: 16px; padding: 18px; margin: 14px 0; background: #fff; box-shadow: 0 16px 36px rgba(20, 32, 51, 0.06); }
      .label { font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #51607a; margin-bottom: 10px; }
      table { width: 100%; border-collapse: collapse; margin-top: 12px; }
      td, th { border: 1px solid #d8dfeb; padding: 10px; text-align: left; vertical-align: top; }
      ul, ol { margin: 0; padding-left: 20px; }
      .prompt { background: #f4f7fd; border-radius: 12px; padding: 14px; }
      .timing-grid { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); margin: 14px 0; }
      .timing-block { border: 1px solid #d8dfeb; border-radius: 14px; padding: 14px; background: #fbfcff; }
      .timing-block strong { display: block; margin-bottom: 6px; }
      .slide-page { min-height: 420px; padding: 30px; margin: 18px 0; border-radius: 24px; color: #112116; background: linear-gradient(135deg, #fffdf7, #eef6ef); border: 1px solid #d7dfd5; box-shadow: 0 20px 48px rgba(17, 33, 22, 0.08); }
      .slide-kicker { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #44614f; margin-bottom: 12px; }
      .slide-page h2 { font-size: 32px; margin-bottom: 14px; }
      .slide-page p { font-size: 18px; line-height: 1.6; max-width: 32em; }
      .slide-notes { margin-top: 18px; padding-top: 14px; border-top: 1px solid #d7dfd5; color: #51607a; }
      .parallel-assessment-sheet { background: #fff; border: 1px solid #d9dfeb; border-radius: 18px; padding: 28px; box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08); }
      .parallel-sheet-head { border-bottom: 1px solid #d8dfeb; padding-bottom: 18px; margin-bottom: 22px; }
      .parallel-section { margin-bottom: 26px; }
      .parallel-section-head { display: flex; justify-content: space-between; gap: 16px; align-items: baseline; margin-bottom: 12px; }
      .parallel-question { border: 1px solid #e3e8f2; border-radius: 14px; padding: 16px; margin-bottom: 14px; background: #fbfcff; }
      .parallel-question-head { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; margin-bottom: 10px; }
      .parallel-question h4 { margin-bottom: 10px; }
      .question-body p { margin: 0 0 8px; white-space: pre-wrap; }
      .answer-options { margin: 10px 0 0; }
      .student-answer-lines { display: grid; gap: 10px; margin-top: 14px; }
      .student-answer-lines span { display: block; min-height: 22px; border-bottom: 1px solid #bbc6db; }
      .teacher-answer { margin-top: 14px; background: #eef4ff; border-radius: 12px; padding: 12px; }
      .teacher-answer pre { white-space: pre-wrap; font-family: inherit; margin: 0 0 12px; }
      .point-badge { font-size: 12px; font-weight: 700; color: #33517f; background: #eaf1ff; border-radius: 999px; padding: 6px 10px; white-space: nowrap; }
      .section-code_writing .parallel-question { background: #fff8ef; border-color: #ecd6b2; }
      .section-code_writing .parallel-section-head span { color: #8a5a12; }
      .section-short_answer .parallel-question { background: #f8fbff; }
      .two-column-key { column-count: 2; column-gap: 22px; }
      .two-column-key .parallel-sheet-head { column-span: all; break-after: avoid; }
      .two-column-key .parallel-section { break-inside: avoid; }
      .outline-list { margin-top: 10px; }
    </style>
  </head>
  <body>
    <div class="sheet">
      ${bodyHtml}
    </div>
  </body>
</html>`;
}

function makeHtmlDownloadLink(label, filename, title, bodyHtml) {
  const html = createHtmlDocument(title, bodyHtml);
  return `<a class="secondary-button" download="${escapeHtml(filename)}" href="data:text/html;charset=utf-8,${encodeURIComponent(html)}">${escapeHtml(label)}</a>`;
}

function makeTextDownloadLink(label, filename, payload) {
  return `<a class="secondary-button" download="${escapeHtml(filename)}" href="data:text/plain;charset=utf-8,${encodeURIComponent(payload)}">${escapeHtml(label)}</a>`;
}

function makeCopyButton(label, payload) {
  return `<button class="secondary-button copy-resource-button" type="button" data-copy="${escapeHtml(payload)}" data-label="${escapeHtml(label)}">${escapeHtml(label)}</button>`;
}

function setRepurposeFileStatus(message) {
  if (!repurposeFileStatus) {
    return;
  }
  repurposeFileStatus.textContent = message;
}

function parseDurationMinutes(value) {
  const text = String(value || "").trim().toLowerCase();
  if (!text) {
    return 50;
  }

  const rangeMatch = text.match(/(\d+)\s*[-–]\s*(\d+)/);
  if (rangeMatch) {
    const low = Number.parseInt(rangeMatch[1], 10);
    const high = Number.parseInt(rangeMatch[2], 10);
    return Math.round((low + high) / 2);
  }

  const singleMatch = text.match(/(\d+)/);
  if (singleMatch) {
    return Number.parseInt(singleMatch[1], 10);
  }

  if (text.includes("block")) {
    return 80;
  }

  return 50;
}

function buildTimeline(totalMinutes) {
  const base = totalMinutes >= 70
    ? [
        { label: "Warm-Up", minutes: 10 },
        { label: "Mini-Lesson", minutes: 14 },
        { label: "Guided Practice", minutes: 16 },
        { label: "Independent Work", minutes: 28 },
        { label: "Closure", minutes: 12 },
      ]
    : totalMinutes >= 55
      ? [
          { label: "Warm-Up", minutes: 8 },
          { label: "Mini-Lesson", minutes: 10 },
          { label: "Guided Practice", minutes: 12 },
          { label: "Independent Work", minutes: 18 },
          { label: "Closure", minutes: 7 },
        ]
      : [
          { label: "Warm-Up", minutes: 6 },
          { label: "Mini-Lesson", minutes: 8 },
          { label: "Guided Practice", minutes: 10 },
          { label: "Independent Work", minutes: 15 },
          { label: "Closure", minutes: 6 },
        ];

  const baseTotal = base.reduce((sum, block) => sum + block.minutes, 0);
  const diff = totalMinutes - baseTotal;
  base[3].minutes += diff;
  return base;
}

function buildVideoSearchLink(query) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

function getVideoSuggestions(topicText, keywordText = "") {
  const source = [topicText, keywordText].filter(Boolean).join(" ");
  const text = source.toLowerCase();
  const suggestions = [];

  if (keywordText && !/^https?:\/\//i.test(keywordText)) {
    const cleanedKeyword = keywordText.replace(/[,\n]+/g, " ").replace(/\s+/g, " ").trim();
    if (cleanedKeyword) {
      suggestions.push({
        title: `Search YouTube: ${cleanedKeyword}`,
        url: buildVideoSearchLink(cleanedKeyword),
        note: "Search results built from the teacher's exact keywords.",
      });
    }
  }

  if (/python|for loop|for loops|iteration|iterat/i.test(text)) {
    return [
      ...suggestions,
      {
        title: "Real Python: Introduction & For Loop Paradigms",
        url: "https://realpython.com/videos/for-loops-intro/",
        note: "Short intro to iteration and Python for-loops.",
      },
      {
        title: "Real Python: Iterators and Iterables Overview",
        url: "https://realpython.com/videos/iterators-iterables-overview/",
        note: "Useful if the lesson needs the meaning of iteration in Python.",
      },
      {
        title: "Dave Gray: Python While Loops & For Loops",
        url: "https://www.classcentral.com/course/youtube-python-while-loops-for-loops-python-tutorial-for-beginners-155290",
        note: "Longer beginner-friendly loop lesson with examples.",
      },
    ];
  }

  if (suggestions.length) {
    return suggestions;
  }

  const fallbackQuery = String(source || "").trim();
  return fallbackQuery
    ? [
        {
          title: `Search YouTube: ${fallbackQuery}`,
          url: buildVideoSearchLink(fallbackQuery),
          note: "Search results built from the lesson topic and teacher keywords.",
        },
      ]
    : [];
}

function renderSuggestionLinks(items) {
  if (!items.length) {
    return `<section class="resource-section"><h5>Lesson Video / Link</h5><p>No suggested video was found for this topic yet.</p></section>`;
  }

  return items
    .map(
      (item) => `
        <section class="resource-section">
          <h5><a href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">${escapeHtml(item.title)}</a></h5>
          <p>${escapeHtml(item.note)}</p>
        </section>
      `,
    )
    .join("");
}

function renderTimelineHtml(timeline, detailsByLabel = {}) {
  return `
    <div class="timeline-preview">
      ${timeline
        .map(
          (block) => `
            <section class="resource-section timeline-section">
              <div class="timeline-topline">
                <h5>${escapeHtml(block.label)}</h5>
                <span class="timeline-minutes">${escapeHtml(`${block.minutes} min`)}</span>
              </div>
              <p>${escapeHtml(detailsByLabel[block.label] || "")}</p>
            </section>
          `,
        )
        .join("")}
    </div>
  `;
}

function inferTeachingPackValuesFromResource(values) {
  const sourceText = values.resourceText.trim();
  const durationMatch = sourceText.match(/(\d+)\s*minutes?/i);
  const duration = durationMatch ? `${durationMatch[1]} minutes` : "45 minutes";
  const gradeMatch = sourceText.match(/grade\s*(\d+)/i);
  const gradeLevel = gradeMatch ? gradeMatch[1] : "9";
  const classMatch = sourceText.match(/class[:\s]+([^\n]+)/i) || sourceText.match(/for\s+([A-Za-z0-9 /&-]{3,40})/i);
  const className = classMatch ? classMatch[1].trim() : "Class";
  const objectiveMatch =
    sourceText.match(/objective[:\s]+([^\n]+)/i) ||
    sourceText.match(/students? will\s+([^\n.]+)/i) ||
    sourceText.match(/student will\s+([^\n.]+)/i);
  const goal = objectiveMatch
    ? `Students will ${objectiveMatch[1]
        .trim()
        .replace(/^be able to\s+/i, "")
        .replace(/^students? will\s+/i, "")
        .replace(/\bin\s+\d+\s*minutes?\b/i, "")
        .trim()}.`
    : `Students will explain and apply ${sourceText.slice(0, 80).trim()}.`;
  const topicMatch =
    sourceText.match(/topic[:\s]+([^\n]+)/i) ||
    sourceText.match(/lesson on\s+([^\n.]+)/i) ||
    sourceText.match(/quiz on\s+([^\n.]+)/i) ||
    sourceText.match(/about\s+([^\n.]+)/i);
  const topic = topicMatch
    ? topicMatch[1].trim()
    : goal.replace(/^Students will\s+/i, "").replace(/\bin\s+\d+\s*minutes?\b/i, "").replace(/\.$/, "").trim();

  return {
    topic,
    className,
    gradeLevel,
    duration,
    goal,
    challengeLevel: /rigor|challenge|justify|transfer/i.test(sourceText) ? "rigorous" : "grade-level",
    activityStyle: /partner|interactive|discussion|talk/i.test(sourceText) ? "interactive" : "balanced",
  };
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the uploaded file."));
    reader.onload = () => {
      const result = String(reader.result || "");
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };
    reader.readAsDataURL(file);
  });
}

function shouldUseAssessmentTransform(values, fileMeta) {
  const combined = `${values.sourceType} ${values.targetType} ${values.resourceText}`.toLowerCase();
  const assessmentLikeTarget = ["parallel-assessment", "quiz"].includes(String(values.targetType || "").toLowerCase());
  const assessmentLikeSource = /worksheet|quiz|assessment|test|parallel/.test(combined);
  return assessmentLikeTarget || (assessmentLikeSource && Boolean(fileMeta));
}

async function requestAssessmentTransform(values, fileMeta, refinementPrompt = "") {
  const mergedText = [values.resourceText, refinementPrompt ? `Refinement request:\n${refinementPrompt}` : ""]
    .filter(Boolean)
    .join("\n\n");
  return apiRequest("/api/resources/transform", {
    method: "POST",
    body: JSON.stringify({
      sourceType: values.sourceType,
      targetType: values.targetType,
      resourceText: mergedText,
      fileName: fileMeta?.name || "",
      mimeType: fileMeta?.type || "",
      fileData: fileMeta?.data || "",
    }),
  });
}

function buildAssessmentTransformCards(payload) {
  const extraction = payload?.extraction || {};
  const result = payload?.result || {};
  const blueprint = result.blueprint || { sections: [], questionCount: 0 };
  const versions = Array.isArray(result.versions) ? result.versions : [];
  const summaryCard = {
    title: "Imported Assessment Map",
    content: `
      <div class="resource-preview">
        <section class="resource-section">
          <h5>${escapeHtml(result.title || "Parallel Assessment Builder")}</h5>
          <p>${escapeHtml(result.summary || "Imported resource transformed into parallel classroom-ready versions.")}</p>
          <ul>
            <li>Parser used: ${escapeHtml(extraction.parser || "manual text")}</li>
            <li>Detected sections: ${escapeHtml(blueprint.sections?.length || 0)}</li>
            <li>Detected questions: ${escapeHtml(blueprint.questionCount || 0)}</li>
            <li>Imported file: ${escapeHtml(extraction.fileName || "Pasted resource")}</li>
          </ul>
        </section>
      </div>
      <div class="resource-actions">
        ${makeHtmlDownloadLink("Download Imported Structure", `${slugify(result.title || "imported-structure")}-outline.html`, `${result.title || "Imported Assessment"} Structure`, result.originalOutlineHtml || "<p>No outline available.</p>")}
      </div>
    `,
  };

  const versionCards = versions.map((version) => ({
    title: `${version.name} Preview`,
    content: `
      <div class="resource-preview">
        ${(version.preview || [])
          .map(
            (section) => `
              <section class="resource-section">
                <h5>${escapeHtml(section.title)}</h5>
                <ul>
                  ${(section.questions || []).map((question) => `<li>${escapeHtml(`${question.number}. ${question.stem}`)}</li>`).join("")}
                </ul>
              </section>
            `,
          )
          .join("")}
      </div>
      <div class="resource-actions">
        ${makeHtmlDownloadLink(`Download ${version.name} Student Page`, `${slugify(result.title || version.name)}-${slugify(version.name)}.html`, `${result.title || "Parallel Assessment"} ${version.name}`, version.studentHtml || "<p>No version generated.</p>")}
        ${makeHtmlDownloadLink(`Download ${version.name} Teacher Key`, `${slugify(result.title || version.name)}-${slugify(version.name)}-key.html`, `${result.title || "Parallel Assessment"} ${version.name} Teacher Key`, version.keyHtml || "<p>No key generated.</p>")}
      </div>
    `,
  }));

  return [summaryCard, ...versionCards];
}

function renderSlidePreview(slides) {
  return `
    <div class="slide-deck-preview">
      ${slides
        .map(
          (slide, index) => `
            <section class="slide-card">
              <span class="slide-index">Slide ${index + 1}</span>
              <h5>${escapeHtml(slide.title)}</h5>
              <p>${escapeHtml(slide.body).replaceAll("\n", "<br />")}</p>
            </section>
          `,
        )
        .join("")}
    </div>
  `;
}

function buildWorksheetPackFromPrompt(prompt) {
  const isWhileLoops = /while loop|while loops/i.test(prompt);
  const isApcsp = /ap csp|apcsp|ap computer science principles/i.test(prompt);
  const topicTitle = isWhileLoops ? "Iteration Using While Loops" : "Targeted Practice Worksheet";
  const title = isApcsp ? `AP CSP Worksheet: ${topicTitle}` : `Worksheet: ${topicTitle}`;
  const requestedCountMatch = prompt.match(/(\d+)\s+question/i);
  const requestedCount = requestedCountMatch ? Number.parseInt(requestedCountMatch[1], 10) : 16;
  const questionTarget = Math.max(10, Math.min(40, requestedCount || 16));
  const buildQuestionBlock = (question, answerType = "short") => {
    const line =
      answerType === "mc"
        ? "Answer: ________________________________"
        : answerType === "code"
          ? "Response:\n________________________________________\n________________________________________"
          : "Response: ________________________________";
    return `${question}\n${line}`;
  };

  let worksheetText = `${title}\n\n`;
  let answerKey = `Teacher Key\n\n`;

  if (isWhileLoops) {
    const pool = [
      { section: "Warm-Up", q: buildQuestionBlock("1. In your own words, what does a while loop do?") , a: "A while loop repeats code while a condition stays true." },
      { section: "Warm-Up", q: `2. Which statement is true?\nA. A while loop runs forever no matter what\nB. A while loop repeats while a condition stays true\nC. A while loop only works with lists\nAnswer: ________________________________`, a: "B" },
      { section: "Warm-Up", q: buildQuestionBlock("3. Give one real-life example of repetition that could be described with a while loop."), a: "Any valid repetition example." },
      { section: "Trace the Code", q: `4. Predict the output:\ncount = 1\nwhile count < 4:\n    print(count)\n    count = count + 1\nOutput:\n________________________________________`, a: "1, 2, 3" },
      { section: "Trace the Code", q: `5. Predict the output:\ntotal = 0\nnumber = 1\nwhile number <= 3:\n    total = total + number\n    print(total)\n    number = number + 1\nOutput:\n________________________________________`, a: "1, 3, 6" },
      { section: "Trace the Code", q: buildQuestionBlock("6. Why does this loop stop?\nvalue = 10\nwhile value > 7:\n    value = value - 1"), a: "It stops when value becomes 7, so the condition is false." },
      { section: "Trace the Code", q: `7. Predict the output:\nx = 2\nwhile x < 5:\n    print(x)\n    x = x + 2\nOutput:\n________________________________________`, a: "2, 4" },
      { section: "Fix the Code", q: `8. Find and fix the bug:\ncount = 1\nwhile count < 5\n    print(count)\n    count = count + 1\nFixed code:\n________________________________________`, a: "Add the missing colon." },
      { section: "Fix the Code", q: `9. Find and fix the bug:\ncount = 1\nwhile count < 5:\n    print(count)\nFixed code:\n________________________________________`, a: "Add count = count + 1 inside the loop." },
      { section: "Fix the Code", q: `10. Find and fix the bug:\nscore = 0\nwhile score > 3:\n    print(score)\n    score = score + 1\nFixed code:\n________________________________________`, a: "Condition should allow the loop to start, such as score < 3." },
      { section: "Fix the Code", q: `11. Why can this code create an infinite loop?\nnum = 1\nwhile num < 10:\n    print(num)\nAnswer:\n________________________________________`, a: "Because num never changes." },
      { section: "Build the Code", q: `12. Write a while loop that prints the numbers 1 through 5.\nResponse:\n________________________________________\n________________________________________`, a: "Any correct loop 1 to 5." },
      { section: "Build the Code", q: `13. Write a while loop that adds the numbers 1 through 4 and prints the final total.\nResponse:\n________________________________________\n________________________________________`, a: "Any correct accumulation loop with total 10." },
      { section: "Build the Code", q: `14. Write a while loop that prints each even number from 2 through 10.\nResponse:\n________________________________________\n________________________________________`, a: "Any correct even-number loop." },
      { section: "Build the Code", q: `15. Write a while loop that counts down from 5 to 1.\nResponse:\n________________________________________\n________________________________________`, a: "Any correct countdown loop." },
      { section: "Challenge Problems", q: `16. A student starts with 3 points and gains 2 points each round. Write a while loop that keeps going until the student has at least 11 points.\nResponse:\n________________________________________\n________________________________________`, a: "Any correct loop that stops at 11 or higher." },
      { section: "Challenge Problems", q: `17. Write a loop that keeps asking for input until the user types "stop". You may use pseudocode or Python.\nResponse:\n________________________________________\n________________________________________`, a: "Any correct input loop or valid pseudocode." },
      { section: "Challenge Problems", q: `18. A robot moves forward 1 step each turn until it reaches 6 steps. Write a while loop for that process.\nResponse:\n________________________________________\n________________________________________`, a: "Any correct loop with a stopping condition at 6." },
      { section: "Challenge Problems", q: buildQuestionBlock("19. Reflection: What is the most common mistake students make with while loops, and how can you avoid it?"), a: "Strong answer mentions infinite loops, wrong condition, or forgetting to update the variable." },
      { section: "Challenge Problems", q: buildQuestionBlock("20. Why is a stopping condition important in a while loop?"), a: "It prevents the loop from running forever and defines when repetition should end." },
      { section: "Trace the Code", q: `21. Predict the output:\nnum = 0\nwhile num < 3:\n    print("Hi")\n    num = num + 1\nOutput:\n________________________________________`, a: "Hi, Hi, Hi" },
      { section: "Fix the Code", q: `22. Fix the condition so the loop prints 1, 2, 3:\nnum = 1\nwhile num < 3:\n    print(num)\n    num = num + 1\nFixed line:\n________________________________________`, a: "Use while num <= 3:" },
      { section: "Build the Code", q: `23. Write a loop that prints 10, 8, 6, 4, 2.\nResponse:\n________________________________________\n________________________________________`, a: "Any correct countdown-by-two loop." },
      { section: "Warm-Up", q: buildQuestionBlock("24. Multiple choice: Which part of a while loop should change so the loop can stop?\nA. The condition only\nB. A variable used in the condition\nC. The print statement"), a: "B" },
      { section: "Challenge Problems", q: `25. A player starts at level 1 and gains 1 level after each win. Write a loop that continues until the player reaches level 5.\nResponse:\n________________________________________\n________________________________________`, a: "Any correct loop to level 5." },
      { section: "Trace the Code", q: `26. Predict the output:\ntotal = 2\nwhile total < 9:\n    print(total)\n    total = total + 3\nOutput:\n________________________________________`, a: "2, 5, 8" },
      { section: "Fix the Code", q: `27. Explain the bug:\ncount = 5\nwhile count < 3:\n    print(count)\nAnswer:\n________________________________________`, a: "The condition is false from the start, so the loop never runs." },
      { section: "Build the Code", q: `28. Write a loop that prints each item in this list using an index:\n["pen", "book", "bag"]\nResponse:\n________________________________________\n________________________________________`, a: "Any valid while loop with index logic." },
      { section: "Challenge Problems", q: `29. Write a loop that keeps adding 5 to a total until the total is at least 30.\nResponse:\n________________________________________\n________________________________________`, a: "Any valid accumulation loop to 30 or higher." },
      { section: "Challenge Problems", q: buildQuestionBlock("30. AP CSP reflection: How is a while loop different from writing the same statement many times by hand?"), a: "It makes repetition more efficient and easier to change." },
    ];

    const chosen = pool.slice(0, questionTarget);
    const grouped = new Map();
    chosen.forEach((item) => {
      if (!grouped.has(item.section)) {
        grouped.set(item.section, []);
      }
      grouped.get(item.section).push(item);
    });

    worksheetText += [...grouped.entries()]
      .map(([section, items]) => `Section: ${section}\n${items.map((item) => item.q).join("\n\n")}`)
      .join("\n\n");
    answerKey = `Teacher Key: ${title}\n\n${chosen.map((item) => `${item.q.split("\n")[0]}\nAnswer: ${item.a}`).join("\n\n")}`;
  } else {
    worksheetText += `1. Warm-up question\n2. Guided practice\n3. Independent practice\n4. Reflection`;
    answerKey = `Teacher Key\n\nProvide acceptable responses and common misconceptions.`;
  }

  const worksheetHtml = `
    <h1>${escapeHtml(title)}</h1>
    <p class="label">${escapeHtml(isApcsp ? "Aligned to AP CSP Algorithms and Programming practice" : "Classroom worksheet")}</p>
    <div class="card"><p>${escapeHtml(worksheetText).replaceAll("\n", "<br />")}</p></div>
  `;
  const keyHtml = `
    <h1>${escapeHtml(title)} Teacher Key</h1>
    <div class="card"><p>${escapeHtml(answerKey).replaceAll("\n", "<br />")}</p></div>
  `;

  return { title, worksheetText, answerKey, worksheetHtml, keyHtml };
}

function buildTeachingPack(values) {
  const topic = values.topic.trim();
  const className = values.className.trim();
  const goal = values.goal.trim();
  const gradeLevel = values.gradeLevel.trim();
  const durationText = values.duration.trim();
  const challengeLevel = values.challengeLevel || "grade-level";
  const activityStyle = values.activityStyle || "balanced";
  const durationMinutes = parseDurationMinutes(durationText);
  const timeline = buildTimeline(durationMinutes);
  const numericGrade = Number.parseInt(gradeLevel, 10);
  const ageBand = Number.isFinite(numericGrade) && numericGrade <= 6 ? "upper-elementary" : Number.isFinite(numericGrade) && numericGrade <= 8 ? "middle" : "high";
  const isCoding = /python|coding|programming|iteration|loop/i.test(`${topic} ${goal} ${className}`);
  const challengeLabel =
    challengeLevel === "rigorous" ? "more rigorous" : challengeLevel === "support" ? "more scaffolded" : "grade-level balanced";
  const styleLabel =
    activityStyle === "interactive" ? "interactive" : activityStyle === "independent" ? "independent-practice heavy" : "balanced";
  const interactiveMove = activityStyle === "interactive"
    ? "Students complete a turn-and-talk, one quick whiteboard check, and one short partner task before independent work."
    : activityStyle === "independent"
      ? "Teacher launches briefly, then students spend most of the block in guided-to-independent practice with short checkpoints."
      : "Teacher models, pauses for one live check, then shifts into guided and independent work.";
  const rigorMove = challengeLevel === "rigorous"
    ? "Add one justify-your-thinking prompt and one transfer problem that cannot be solved by copying the example."
    : challengeLevel === "support"
      ? "Use sentence stems, chunked directions, and one partially completed example before students work alone."
      : "Keep one on-level model, one guided practice round, and one independent transfer question.";
  const genericExample = ageBand === "high"
    ? `Use one academically appropriate example in ${className} that requires students to justify the answer and explain why a common mistake fails.`
    : ageBand === "middle"
      ? `Use one accessible example in ${className} with visible steps, a partner check, and one short reasoning sentence after the answer.`
      : `Use one simple, concrete example with visual or everyday context, a fast talk move, and clear numbered steps.`;
  const warmUpPrompt = isCoding
    ? `Quick Start

Do Now:
1. Look at this everyday pattern: brush teeth, put on shoes, grab backpack. What is repeating?
2. Read this Python code:
for item in ["pencil", "notebook", "charger"]:
    print(item)
3. Write what repeats, what changes, and what you think prints.

Partner check:
Compare answers with one partner and agree on one sentence that explains iteration.`
    : `Quick Start

Do Now:
1. In 2-3 sentences, explain what you already know about ${topic}.
2. Give one real-life, class, or cross-subject connection.
3. Predict one mistake a student might make the first time they try this skill.

Partner check:
Turn to one partner and share which clue would help you start correctly.`;
  const workedExample = isCoding
    ? `Worked Example: Python Iteration

Goal:
Students will see that a for-loop repeats the same instruction for each item in a sequence.

Example Code:
scores = [72, 84, 91]
for score in scores:
    print(score)

Think-Aloud:
- The list has 3 values.
- The loop variable is score.
- The loop runs once for 72, once for 84, and once for 91.
- The print statement happens every time the loop repeats.

Expected Output:
72
84
91

Common Error To Visualize:
for score in scores
print(score)

Why it fails:
- Missing colon after the loop header
- Missing indentation on the print line

Interactive check:
Pause and ask students to hold up fingers for how many times the loop will run before revealing the output.`
    : `Worked Example

Learning Goal:
${goal}

Teacher Model:
1. Introduce one clear example connected to ${className}.
2. Walk through the first step and explain why it matters.
3. Show one common misconception.
4. Model how to check the answer or reasoning.
5. ${genericExample}

Student Thinking Prompt:
"What clue tells you which strategy to use first?"

Common Error:
Students may rush to the answer without naming the reasoning step that proves it works.

Interactive check:
Ask students to explain the first move before they solve the example independently.`;
  const classworkTaskCount = durationMinutes >= 70 ? 8 : durationMinutes >= 55 ? 6 : 5;
  const classworkText = isCoding
    ? `Classwork

Part A. Whiteboard Trace
1. Read the loop below and write the output on mini whiteboards or paper:
for n in [1, 3, 5]:
    print(n)

2. Read the loop below and write the output:
for word in ["go", "team"]:
    print(word)

3. Circle what changes on each iteration: loop variable / print statement / colon

Part B. Partner Match
4. Match each term with its job:
   - sequence
   - loop variable
   - repeated line

Part C. Fix It
5. Rewrite this code so it runs correctly:
for color in ["red", "blue", "green"]
print(color)

6. Rewrite this code so it runs correctly:
for pet in ["cat", "dog", "bird"]:
print(pet)

Part D. Build It
7. Write your own loop that prints each animal in this list:
["fox", "owl", "bear"]

8. Write your own loop that prints each even number in:
[2, 4, 6, 8]

Part E. Explain It
9. In one sentence, explain what iteration means in Python.
10. In one sentence, explain why indentation matters in a loop.
11. Turn to a partner and compare which line repeats and which line changes.
12. Extension: Rewrite one of the loops with a new list and predict the output before running it.`
    : `Classwork

Part A. Guided Practice
1. Complete one model-based problem on ${topic}.
2. Underline the clue that told you what to do first.
3. Write one sentence explaining why that clue matters.

Part B. Compare Strategies
4. Solve a second problem on ${topic}.
5. Compare your method with a partner and list one similarity.
6. List one difference between the two approaches.

Part C. Independent Practice
7. Complete ${classworkTaskCount} fresh practice item${classworkTaskCount === 1 ? "" : "s"} on your own.
8. Show or describe each step clearly.
9. Add one sentence explaining why your final answer or idea is reasonable.

Part D. Reflection
10. Name one mistake a student could make on this topic.
11. Explain how to catch that mistake before turning in the work.
12. Challenge: Complete one transfer task that uses ${topic} in a new context.`;
  const homeworkText = isCoding
    ? `Homework

1. Write one Python loop that prints three numbers.
2. Write one Python loop that prints three words.
3. Write one Python loop that prints each school subject in:
["math", "science", "history"]
4. For each loop, label:
   - the sequence
   - the loop variable
   - the line that repeats
5. Correct this broken loop and explain the fix:
for item in ["a", "b", "c"]
    print(item)
6. Correct this broken loop and explain the fix:
for score in [70, 80, 90]
print(score)
7. Write one sentence: How is a loop different from writing three print statements by hand?`
    : `Homework

1. Complete ${durationMinutes >= 70 ? 6 : 4} focused practice problems on ${topic}.
2. Choose one response and annotate your reasoning step by step.
3. Solve one additional challenge problem that uses the same concept in a new context.
4. Write one reflection:
   - What part felt strongest?
   - What still needs review?
5. Bring one question to the next ${className} class.`;
  const exitTicketText = isCoding
    ? `Exit Ticket

1. In your own words, what does iteration mean in Python?
2. Predict the output:
for number in [2, 4, 6]:
    print(number)
3. Name one syntax detail that must be correct for the loop to run.
4. Confidence check: 1 2 3 4`
    : `Exit Ticket

1. In one sentence, explain the main idea from today on ${topic}.
2. Complete one short mastery check aligned to: ${goal}
3. What step would you still want a teacher example for?
4. Confidence check: 1 2 3 4`;
  const answerKeyText = isCoding
    ? `Answer Key

Worked Example:
The loop runs once for each item in the list. Output:
72
84
91

Classwork:
1. Output = 1, 3, 5
2. Output = go, team
3. What changes = loop variable
4. Sequence = the list, loop variable = the name after for, repeated line = indented line
5. Correct code:
for color in ["red", "blue", "green"]:
    print(color)
6. Correct code:
for pet in ["cat", "dog", "bird"]:
    print(pet)
7. Sample acceptable answer:
for animal in ["fox", "owl", "bear"]:
    print(animal)
8. Sample acceptable answer:
for number in [2, 4, 6, 8]:
    print(number)
9. Strong explanation:
Iteration means repeating the same code step for each item in a sequence.
10. Indentation matters because it tells Python which line belongs inside the loop.

Exit Ticket:
Output = 2, 4, 6
Syntax details = colon after header, indentation on repeated line`
    : `Answer Key

Use this key to look for:
1. Correct use of the targeted strategy or concept.
2. Clear reasoning, not only a final answer.
3. One identified misconception or error correction.
4. Exit ticket responses that restate the core idea and show partial or full mastery.

Teacher scoring guide:
- Strong response: accurate, complete, and clearly explained
- Partial response: mostly correct but missing a reasoning step
- Reteach response: shows confusion about the first move or core idea`;
  const parentSummary = `Today in ${values.className}, students worked on ${values.topic}. We focused on: ${values.goal}. Students completed classwork, homework, and an exit ticket aligned to the same lesson target.`;
  const videoSuggestions = getVideoSuggestions(`${topic} ${goal} ${className}`, values.lessonVideo || "");
  const timelineDetails = {
    "Warm-Up": `Students enter and complete a short written start. ${activityStyle === "interactive" ? "Close with a partner check before the mini-lesson." : "Teacher reviews one strong response quickly."}`,
    "Mini-Lesson": `Model the key skill with one worked example and name the success criteria out loud.`,
    "Guided Practice": activityStyle === "interactive"
      ? "Run one live check-for-understanding and one partner or whiteboard task before students work alone."
      : "Work one example together and stop to check the first move before releasing students.",
    "Independent Work": `Students complete the main classwork. ${challengeLevel === "rigorous" ? "Include one transfer task and one written justification." : challengeLevel === "support" ? "Provide chunked prompts and one teacher checkpoint halfway through." : "Include one core task and one brief extension."}`,
    "Closure": "Use the exit ticket, collect work, and sort students into confident / partial / reteach groups for the next day.",
  };
  const renderPreviewSection = (title, text) => `
    <section class="resource-section">
      <h5>${escapeHtml(title)}</h5>
      <p>${escapeHtml(text).replaceAll("\n", "<br />")}</p>
    </section>
  `;
  const studentSheet = (title, intro, body) => `
    <h1>${escapeHtml(title)}</h1>
    <p class="label">${escapeHtml(className)} · Grade ${escapeHtml(gradeLevel || ageBand)} · ${escapeHtml(durationText)}</p>
    <div class="card"><strong>Today Goal</strong><p>${escapeHtml(goal)}</p></div>
    <div class="card"><strong>Directions</strong><p>${escapeHtml(intro)}</p></div>
    <div class="card"><p>${escapeHtml(body).replaceAll("\n", "<br />")}</p></div>
  `;
  const lessonPlanHtml = `
    <h1>${escapeHtml(topic)} Lesson Plan</h1>
    <p class="label">${escapeHtml(className)} · Grade ${escapeHtml(gradeLevel)} · ${escapeHtml(durationText)}</p>
    <div class="card"><strong>Objective:</strong> ${escapeHtml(goal)}</div>
    <div class="card"><strong>Lesson Build:</strong> ${escapeHtml(`This version is ${styleLabel} and ${challengeLabel}. ${interactiveMove} ${rigorMove}`)}</div>
    <div class="card">
      <strong>Period Pacing</strong>
      <div class="timing-grid">
        ${timeline
          .map(
            (block) => `
              <div class="timing-block">
                <strong>${escapeHtml(block.label)}</strong>
                <div>${escapeHtml(`${block.minutes} min`)}</div>
                <div>${escapeHtml(timelineDetails[block.label])}</div>
              </div>
            `,
          )
          .join("")}
      </div>
    </div>
    <div class="card"><strong>Warm-Up</strong><div class="prompt">${escapeHtml(warmUpPrompt)}</div></div>
    <div class="card"><strong>Worked Example</strong><p>${escapeHtml(workedExample).replaceAll("\n", "<br />")}</p></div>
    <div class="card"><strong>Classwork</strong><p>${escapeHtml(classworkText).replaceAll("\n", "<br />")}</p></div>
    <div class="card"><strong>Homework</strong><p>${escapeHtml(homeworkText).replaceAll("\n", "<br />")}</p></div>
    <div class="card"><strong>Exit Ticket</strong><p>${escapeHtml(exitTicketText).replaceAll("\n", "<br />")}</p></div>
  `;
  const slideCards = isCoding
    ? [
        { title: "Warm-Up And Goal", body: `Goal: ${goal}\n\n${warmUpPrompt}`, move: "Project this immediately. Students write first, then pair-share." },
        { title: "Mini-Lesson", body: workedExample, move: "Read the example, trace it live, and pause before revealing the output." },
        { title: "Guided Practice", body: `Do these together:\n1. Predict the output of:\nfor n in [1, 3, 5]:\n    print(n)\n2. What changes each iteration?\n3. Why does indentation matter?`, move: "Cold-call or use whiteboards before moving on." },
        { title: "Independent Work", body: classworkText, move: "Students complete the full classwork from this slide or the handout." },
        { title: "Homework", body: homeworkText, move: "Assign at the end or use as extension if students finish early." },
        { title: "Exit Ticket", body: exitTicketText, move: "Students complete independently and turn it in before leaving." },
      ]
    : [
        { title: "Warm-Up And Goal", body: `Goal: ${goal}\n\n${warmUpPrompt}`, move: "Students complete the warm-up right away, then share one idea." },
        { title: "Mini-Lesson", body: workedExample, move: "Use this slide as the teacher model." },
        { title: "Guided Practice", body: `Guided questions:\n1. What clue tells you how to start?\n2. What is the first step?\n3. What mistake should we avoid?\n4. Explain your reasoning to a partner.`, move: "Work one item together before release." },
        { title: "Independent Practice", body: classworkText, move: "Students complete the classwork from this slide or the printed handout." },
        { title: "Homework", body: homeworkText, move: "Assign for after class or use as extension work." },
        { title: "Exit Ticket", body: exitTicketText, move: "Students complete independently and submit before dismissal." },
      ];
  const pptOutlineText = `PowerPoint Outline: ${topic}

Class: ${className}
Grade: ${gradeLevel}
Length: ${durationText}
Lesson style: ${styleLabel}
Challenge level: ${challengeLabel}

${slideCards
  .map(
    (slide, index) => `Slide ${index + 1}: ${slide.title}
Main content: ${slide.body}
Teacher move: ${slide.move}`,
  )
  .join("\n\n")}`;
  const slidesHtml = `
    <h1>${escapeHtml(topic)} Slide Deck</h1>
    ${slideCards
      .map(
        (slide, index) => `
          <section class="slide-page">
            <p class="slide-kicker">Slide ${index + 1}</p>
            <h2>${escapeHtml(slide.title)}</h2>
            <p>${escapeHtml(slide.body).replaceAll("\n", "<br />")}</p>
            <div class="slide-notes"><strong>Teacher move:</strong> ${escapeHtml(slide.move)}</div>
          </section>
        `,
      )
      .join("")}
  `;
  const speakerNotesHtml = `
    <h1>${escapeHtml(topic)} Speaker Notes</h1>
    <p class="label">${escapeHtml(className)} · ${escapeHtml(durationText)}</p>
    ${slideCards
      .map(
        (slide, index) => `
          <div class="card">
            <p class="label">Slide ${index + 1}</p>
            <h2>${escapeHtml(slide.title)}</h2>
            <p>${escapeHtml(slide.body).replaceAll("\n", "<br />")}</p>
            <p><strong>Teacher move:</strong> ${escapeHtml(slide.move)}</p>
          </div>
        `,
      )
      .join("")}
  `;
  const warmUpHtml = studentSheet(`${topic} Warm-Up`, "Read each prompt carefully and respond in complete sentences.", warmUpPrompt);
  const workedExampleHtml = `
    <h1>${escapeHtml(topic)} Worked Example</h1>
    <p class="label">${escapeHtml(className)} · Grade ${escapeHtml(gradeLevel || ageBand)}</p>
    <div class="card"><p>${escapeHtml(workedExample).replaceAll("\n", "<br />")}</p></div>
  `;
  const classworkHtml = studentSheet(`${topic} Classwork`, "Show your thinking. If you finish early, check one answer and explain why it is correct.", classworkText);
  const homeworkHtml = studentSheet(`${topic} Homework`, "Complete each part carefully. Bring your work and one question to the next class.", homeworkText);
  const exitTicketHtml = studentSheet(`${topic} Exit Ticket`, "Complete this independently before leaving class.", exitTicketText);
  const answerKeyHtml = `
    <h1>${escapeHtml(topic)} Answer Key</h1>
    <p class="label">${escapeHtml(className)} · Teacher Use</p>
    <div class="card"><p>${escapeHtml(answerKeyText).replaceAll("\n", "<br />")}</p></div>
  `;

  return [
    {
      title: "Period Roadmap",
      content: `
        <div class="resource-preview">
          <section class="resource-section">
            <h5>Lesson Build</h5>
            <p>${escapeHtml(`This pack is ${styleLabel}, ${challengeLabel}, and sized for ${durationMinutes} minutes. ${interactiveMove} ${rigorMove}`)}</p>
          </section>
          <section class="resource-section">
            <h5>Objective</h5>
            <p>${escapeHtml(goal)}</p>
          </section>
        </div>
        ${renderTimelineHtml(timeline, timelineDetails)}
        <div class="resource-actions">
          ${makeHtmlDownloadLink("Download Full Lesson Plan", `${slugify(topic)}-lesson-plan.html`, `${topic} Lesson Plan`, lessonPlanHtml)}
          ${makeCopyButton("Copy Lesson Summary", `Lesson topic: ${topic}\nObjective: ${goal}\nLesson style: ${styleLabel}\nChallenge level: ${challengeLabel}\nPacing: ${timeline.map((block) => `${block.label} ${block.minutes} min`).join(", ")}`)}
        </div>
      `,
    },
    {
      title: "Slides And PPT",
      content: `
        ${renderSlidePreview(slideCards)}
        <div class="resource-actions">
          ${makeHtmlDownloadLink("Download Slide Deck", `${slugify(topic)}-slides.html`, `${topic} Slide Deck`, slidesHtml)}
          ${makeHtmlDownloadLink("Download Speaker Notes", `${slugify(topic)}-speaker-notes.html`, `${topic} Speaker Notes`, speakerNotesHtml)}
          ${makeTextDownloadLink("Download PPT Outline", `${slugify(topic)}-ppt-outline.txt`, pptOutlineText)}
          ${makeCopyButton("Copy PPT Outline", pptOutlineText)}
        </div>
      `,
    },
    {
      title: "Lesson Video / Link",
      content: `
        <div class="resource-preview">
          ${renderSuggestionLinks(videoSuggestions)}
        </div>
      `,
    },
    {
      title: "Student Materials",
      content: `
        <div class="resource-preview">
          ${renderPreviewSection("Core Learning", `${workedExample}\n\nStudents use this to learn the key idea first.`)}
          ${renderPreviewSection("Practice", classworkText)}
          ${renderPreviewSection("Challenge", isCoding ? `Extension: Rewrite one loop with a different list, predict the output, and explain why it still works.` : `Extension: Complete one transfer problem and justify why your strategy still works in a new context.`)}
        </div>
        <div class="resource-actions">
          ${makeHtmlDownloadLink("Download Warm-Up Page", `${slugify(topic)}-warmup.html`, `${topic} Warm-Up`, warmUpHtml)}
          ${makeHtmlDownloadLink("Download Worked Example Page", `${slugify(topic)}-worked-example.html`, `${topic} Worked Example`, workedExampleHtml)}
          ${makeHtmlDownloadLink("Download Classwork Page", `${slugify(topic)}-classwork.html`, `${topic} Classwork`, classworkHtml)}
          ${makeHtmlDownloadLink("Download Homework Page", `${slugify(topic)}-homework.html`, `${topic} Homework`, homeworkHtml)}
          ${makeCopyButton("Copy Classwork", classworkText)}
        </div>
      `,
    },
    {
      title: "Exit Ticket",
      content: `
        <div class="resource-preview">
          ${renderPreviewSection("Exit Ticket Preview", exitTicketText)}
          ${renderPreviewSection(
            "What To Look For",
            `Successful responses should restate the core idea, complete the short mastery check correctly, and identify the exact step that still needs reteaching.`,
          )}
          ${renderPreviewSection("Exit Ticket Solutions", isCoding ? `Expected output question answer: 2, 4, 6\nSyntax detail: colon after the loop header and correct indentation on the repeated line.` : `Use the answer key to confirm the main idea, check the mastery response, and identify whether the student can explain the first step clearly.`)}
        </div>
        <div class="resource-actions">
          ${makeHtmlDownloadLink("Download Exit Ticket Page", `${slugify(topic)}-exit-ticket.html`, `${topic} Exit Ticket`, exitTicketHtml)}
          ${makeHtmlDownloadLink("Download Answer Key Page", `${slugify(topic)}-answer-key.html`, `${topic} Answer Key`, answerKeyHtml)}
          ${makeCopyButton("Copy Exit Ticket", exitTicketText)}
          ${makeCopyButton("Copy Exit Ticket Solutions", isCoding ? `Expected output: 2, 4, 6\nSyntax detail: colon and indentation.` : `Check that the student restates the main idea and completes the mastery task accurately.`)}
        </div>
      `,
    },
    {
      title: "Differentiated Version",
      content: `
        <div class="resource-preview">
          ${renderPreviewSection("Scaffold", isCoding ? `Give students starter code, one partially completed loop, and sentence stems such as "The loop repeats because..."` : `Give students sentence starters, guided steps, and vocabulary support.`)}
          ${renderPreviewSection("Core", `Grade-level practice aligned to ${goal}.`)}
          ${renderPreviewSection("Extension", isCoding ? `Ask early finishers to rewrite the loop with a different list and predict the output before running it.` : `Provide one higher-complexity transfer task for early finishers.`)}
        </div>
      `,
    },
    {
      title: "Answer Key",
      content: `
        <div class="resource-preview">
          ${renderPreviewSection("Teacher Answer Key Preview", isCoding ? `Model answer: A for-loop repeats a block of code for each item in a sequence. Common error: missing indentation after the loop header.` : `Provide model responses, annotated solution steps, and one common-error explanation tied to ${topic}.`)}
          ${renderPreviewSection("Full Key Notes", answerKeyText)}
          ${renderPreviewSection("Homework Preview", homeworkText)}
        </div>
        <div class="resource-actions">
          ${makeHtmlDownloadLink("Download Homework Page", `${slugify(topic)}-homework.html`, `${topic} Homework`, homeworkHtml)}
          ${makeHtmlDownloadLink("Download Answer Key Page", `${slugify(topic)}-answer-key.html`, `${topic} Answer Key`, answerKeyHtml)}
          ${makeCopyButton("Copy Homework", homeworkText)}
        </div>
      `,
    },
    {
      title: "Optional Parent Summary",
      content: `<p>${escapeHtml(parentSummary)}</p>`,
    },
  ];
}

function renderOutputCards(target, cards) {
  if (!target) {
    return;
  }
  target.innerHTML = cards
    .map(
      (card) => `
        <article class="output-card">
          <h4>${escapeHtml(card.title)}</h4>
          ${card.content}
        </article>
      `,
    )
    .join("");
}

function buildRepurposeOutput(values) {
  const titleMap = {
    "parallel-assessment": "Parallel Assessment",
    "lesson-plan": "Lesson Plan",
    quiz: "Quiz Draft",
    reteach: "Reteach Activity",
    observation: "Observation/Admin Version",
    "parent-email": "Parent Email",
    feedback: "Student Feedback Comments",
  };
  const sourceText = values.resourceText.trim();
  const shortSource = sourceText.slice(0, 180);
  const durationMatch = sourceText.match(/(\d+)\s*minutes?/i);
  const duration = durationMatch ? `${durationMatch[1]} minutes` : "15 minutes";
  const audienceMatch = sourceText.match(/for\s+(.+)/i);
  const audience = audienceMatch ? audienceMatch[1].trim() : "the target class";
  const topicMatch =
    sourceText.match(/teach\s+(.+?)\s+for/i) ||
    sourceText.match(/about\s+(.+?)\s+for/i) ||
    sourceText.match(/on\s+(.+?)\s+for/i);
  const inferredTopic = topicMatch ? topicMatch[1].trim() : shortSource;
  const promptRequestsWorksheet = /worksheet/i.test(sourceText);
  const effectiveTarget = promptRequestsWorksheet ? "worksheet" : values.targetType;
  const effectiveTitle = effectiveTarget === "worksheet" ? "Worksheet" : titleMap[effectiveTarget];

  if (effectiveTarget === "worksheet") {
    const worksheetPack = buildWorksheetPackFromPrompt(sourceText);
    return [
      {
        title: `${escapeHtml(values.sourceType)} to Worksheet`,
        content: `
          <p>This output followed the prompt request for a worksheet, including section structure, pacing, and teacher-key separation.</p>
          <ul>
            <li>Detected duration: ${escapeHtml(duration)}</li>
            <li>Detected audience/context: ${escapeHtml(audience)}</li>
            <li>Worksheet built as a student-facing handout with a separate teacher key.</li>
          </ul>
        `,
      },
      {
        title: "Worksheet Preview",
        content: `
          <div class="resource-preview">
            <section class="resource-section">
              <h5>${escapeHtml(worksheetPack.title)}</h5>
              <p>${escapeHtml(worksheetPack.worksheetText).replaceAll("\n", "<br />")}</p>
            </section>
          </div>
          <div class="resource-actions">
            ${makeHtmlDownloadLink("Download Worksheet Page", `${slugify(worksheetPack.title)}.html`, worksheetPack.title, worksheetPack.worksheetHtml)}
            ${makeHtmlDownloadLink("Download Teacher Key", `${slugify(worksheetPack.title)}-key.html`, `${worksheetPack.title} Teacher Key`, worksheetPack.keyHtml)}
            ${makeCopyButton("Copy Worksheet", worksheetPack.worksheetText)}
          </div>
        `,
      },
    ];
  }

  if (effectiveTarget === "lesson-plan") {
    const packValues = inferTeachingPackValuesFromResource(values);
    const packCards = buildTeachingPack(packValues);
    return [
      {
        title: "Repurpose Summary",
        content: `
          <div class="resource-preview">
            <section class="resource-section">
              <h5>Source Converted</h5>
              <p>${escapeHtml(`TeacherFlowAI turned the uploaded/pasted ${values.sourceType} into a full teaching pack for ${packValues.topic}.`)}</p>
            </section>
            <section class="resource-section">
              <h5>Detected Lesson Frame</h5>
              <p>${escapeHtml(`${packValues.className} · Grade ${packValues.gradeLevel} · ${packValues.duration}`)}</p>
            </section>
            <section class="resource-section">
              <h5>Objective</h5>
              <p>${escapeHtml(packValues.goal)}</p>
            </section>
          </div>
        `,
      },
      ...packCards,
    ];
  }

  let concreteOutput = `Use the source text to create a ${effectiveTitle} for ${audience}.`;

  if (effectiveTarget === "lesson-plan") {
    concreteOutput = `Lesson Plan

Objective:
Students will build understanding of ${inferredTopic} in ${duration}.

Opening (3 minutes):
- Quick do-now: "What do you already know about ${inferredTopic}?"

Mini-Lesson (${duration} total block):
- Define ${inferredTopic} in plain language.
- Model one example step by step.
- Pause once to ask students what pattern they notice.

Guided Practice:
- Students complete one short prompt with teacher support.
- Teacher checks for one misconception before release.

Independent Practice:
- Students complete one fresh item aligned to the modeled example.

Closure:
- Exit question: "How would you explain ${inferredTopic} to another student?"
`;
  } else if (effectiveTarget === "observation") {
    concreteOutput = `Observation/Admin Version

Formal Objective:
Students will demonstrate understanding of ${inferredTopic} through structured modeling, guided practice, and independent application.

Instructional Sequence:
1. Launch and activate prior knowledge.
2. Explicit teacher model.
3. Guided practice with checks for understanding.
4. Independent application.
5. Closure with evidence of mastery.

Rationale:
This sequence supports gradual release and visible formative assessment within a ${duration} block.`;
  } else if (effectiveTarget === "parent-email") {
    concreteOutput = `Subject: Class update on ${inferredTopic}

Hello,

Today students worked on ${inferredTopic}. During class they received direct instruction, guided practice, and a short mastery check. The goal was to help students explain and apply the concept independently.

Please ask your student what they learned and what step felt most challenging.

Best,
${teacherProfile?.name || "Teacher"}`;
  } else if (effectiveTarget === "quiz") {
    concreteOutput = `Quiz Draft

1. Define ${inferredTopic} in your own words.
2. Complete one short application problem.
3. Explain one likely mistake and how to fix it.
4. Write one reflection: what part still feels unclear?`;
  } else if (effectiveTarget === "reteach") {
    concreteOutput = `Reteach Activity

Station 1: Review the teacher model for ${inferredTopic}.
Station 2: Fix an incorrect example and explain the correction.
Station 3: Complete one scaffolded problem independently.
Exit: Write the rule or process in one sentence.`;
  } else if (effectiveTarget === "feedback") {
    concreteOutput = `Student Feedback Comments

- You are beginning to understand ${inferredTopic}, but your explanation still needs more precision.
- Your strongest step was identifying the correct starting point.
- Next, focus on explaining why each step works, not only what you did.`;
  }

  const repurposeHtml = `
    <h1>${escapeHtml(effectiveTitle)}</h1>
    <p class="label">${escapeHtml(values.sourceType)} repurposed for ${escapeHtml(audience)}</p>
    <div class="card"><p>${escapeHtml(concreteOutput).replaceAll("\n", "<br />")}</p></div>
  `;

  return [
    {
      title: `${escapeHtml(values.sourceType)} to ${effectiveTitle}`,
      content: `
        <p>This repurpose output uses the teacher prompt directly and rebuilds it into a usable ${escapeHtml(effectiveTarget)} instead of just repeating the source text.</p>
        <ul>
          <li>Core idea extracted from source: ${escapeHtml(shortSource)}${sourceText.length > 180 ? "..." : ""}</li>
          <li>Detected duration: ${escapeHtml(duration)}</li>
          <li>Detected audience/context: ${escapeHtml(audience)}</li>
        </ul>
      `,
    },
    {
      title: "Repurposed Output",
      content: `
        <p><strong>Use case:</strong> Convert ${escapeHtml(values.sourceType)} into ${escapeHtml(effectiveTitle)} with clearer structure and lower prep overhead.</p>
        <div class="resource-preview">
          <section class="resource-section">
            <h5>Usable Preview</h5>
            <p>${escapeHtml(concreteOutput).replaceAll("\n", "<br />")}</p>
          </section>
        </div>
        <div class="resource-actions">
          ${makeHtmlDownloadLink("Download Classroom Page", `${slugify(inferredTopic)}-${effectiveTarget}.html`, `${effectiveTitle}: ${inferredTopic}`, repurposeHtml)}
          ${makeCopyButton("Copy Output", concreteOutput)}
        </div>
      `,
    },
  ];
}

function buildAdminReadyOutput(values) {
  return [
    {
      title: "Observation-Ready Format",
      content: `
        <ul>
          <li><strong>Objective:</strong> Students will demonstrate mastery through aligned practice and exit evidence.</li>
          <li><strong>Agenda:</strong> Launch, mini-lesson, guided practice, independent work, closure.</li>
          <li><strong>Checks for Understanding:</strong> strategic questioning, visible responses, exit ticket.</li>
        </ul>
      `,
    },
    {
      title: "Standards-Aligned Version",
      content: `<p>Aligned to ${escapeHtml(values.standards || "teacher-selected standards")} with explicit task-to-objective alignment and assessment evidence.</p>`,
    },
    {
      title: "Instructional Strategy Rationale",
      content: `<p>This lesson uses direct instruction, guided practice, and independent application to gradually release responsibility while maintaining observation-ready structure around ${escapeHtml(values.focus || "visible learning moves")}.</p>`,
    },
    {
      title: "Differentiation Notes",
      content: `<p>Scaffolds include guided supports, structured checks, flexible grouping, and extension pathways for early mastery.</p>`,
    },
  ];
}

function summarizeSubNeed(values, createMode, subRole) {
  const roleLine = subRole === "teach"
    ? "Teach the short lesson, then move students into the prepared practice."
    : "Keep students on task, clarify directions, and monitor completion.";
  const materialLine = createMode
    ? "Use the prepared lesson materials below. The sub should not need to invent anything."
    : "Use the teacher-provided assessment or worksheet and keep pacing simple.";
  const collectionLine = values.submissionNotes
    ? `Collect/report: ${values.submissionNotes}`
    : "Collect all work and leave a short note on completion, struggles, and behavior.";
  return [roleLine, materialLine, collectionLine].join(" ");
}

function buildIndependentWorkLabel(values, createMode) {
  const combined = `${values.coverageGoal} ${values.materials}`.toLowerCase();
  if (/homework/.test(combined)) {
    return "Homework / Classwork Time";
  }
  return createMode ? "Independent Practice" : "Assessment / Work Time";
}

function buildSubCreatedLessonMaterials(values) {
  const topic = values.topic.trim();
  const className = values.className.trim();
  const durationText = values.duration.trim();
  const durationMinutes = parseDurationMinutes(durationText);
  const timeline = buildTimeline(durationMinutes);
  const isCoding = Boolean(values.isCoding);
  const subRole = values.subRole || "teach";
  const lessonVideo = values.lessonVideo || "";
  const suggestedVideos = getVideoSuggestions(`${topic} ${values.coverageGoal} ${values.priorKnowledge}`, lessonVideo);
  const selectedVideo = lessonVideo || suggestedVideos[0]?.url || "";
  const independentWorkLabel = buildIndependentWorkLabel(values, true);
  const warmupText = isCoding
    ? `Warm-Up

1. In plain English, what does it mean when a computer repeats a step?
2. Look at this rule: "Keep counting until you reach 5." Which word tells you the action keeps repeating?
3. Predict: if a loop starts at 1 and adds 1 each time until it reaches 5, what numbers will appear?`
    : `Warm-Up

1. In 2-3 sentences, explain what you already know about ${topic}.
2. What is one example from class or real life that connects to ${topic}?
3. What part of this topic might confuse someone the first time they see it?`;

  const modelText = isCoding
    ? `Worked Example: While Loop

Teacher says:
"A while loop repeats code while a condition stays true. The loop must also change something, or it may run forever."

Model this code:
count = 1
while count <= 5:
    print(count)
    count = count + 1

Talk through it:
- The loop starts with count = 1.
- The condition asks: is count less than or equal to 5?
- If yes, print the number.
- Then increase count by 1.
- The loop stops once count becomes 6.

Expected output:
1
2
3
4
5

Common mistake to warn about:
If students forget count = count + 1, the loop never stops.`
    : `Worked Example

Teacher says:
"Today we are focusing on ${topic}. I am going to model one clear example first, then you will try the same structure on your own."

Model:
1. Read the task aloud.
2. Name the first step clearly.
3. Show one worked example.
4. Point out one common mistake.
5. Restate what a successful response should include.`;

  const worksheetText = isCoding
    ? `Student Practice: While Loops

Section 1. Understand the idea
1. Circle the best definition of a while loop.
   A. It stores text
   B. It repeats code while a condition is true
   C. It draws a picture
2. In one sentence, explain what must happen inside a while loop so it eventually stops.

Section 2. Trace the code
3. Predict the output:
count = 1
while count <= 3:
    print(count)
    count = count + 1

4. Predict the output:
num = 2
while num < 6:
    print(num)
    num = num + 2

5. Predict the final value of x:
x = 4
while x < 7:
    x = x + 1

Section 3. Debug the code
6. What is wrong with this loop?
total = 1
while total <= 4:
    print(total)

7. Fix this loop so it counts from 3 to 5:
number = 3
while number < 5
    print(number)
    number = number + 1

8. Explain why this loop would never stop:
value = 10
while value > 0:
    print(value)

Section 4. Build the code
9. Write a while loop that prints the numbers 1 through 4.

10. Write a while loop that starts at 0 and prints 0, 2, 4, 6.

11. Write a while loop that counts down from 5 to 1.

Section 5. Reflection and challenge
12. In one sentence, explain the difference between the condition and the update.
13. Challenge: Write a loop that starts at 2 and keeps adding 3 until the number is greater than 14.
14. Reflection: What is one mistake you will check for before turning in your code?`
    : `Student Practice

1. Complete one short concept check on ${topic}.
2. Read the worked example and explain the first move in your own words.
3. Solve three guided practice items that follow the same structure.
4. Complete two independent items on your own.
5. Write one reflection naming a mistake to avoid on ${topic}.`;

  const exitTicketText = isCoding
    ? `Exit Ticket

1. In your own words, what does a while loop do?
2. Predict the output:
value = 1
while value < 4:
    print(value)
    value = value + 1
3. What one line keeps the loop from running forever?`
    : `Exit Ticket

1. In one sentence, explain today’s main idea about ${topic}.
2. Complete one short mastery check.
3. Name the step you would want reviewed one more time.`;

  const answerKeyText = isCoding
    ? `Answer Key

Warm-Up:
1. Repeating a step until a condition changes
2. "Until" signals repetition
3. 1, 2, 3, 4, 5

Worksheet:
1. B
2. The loop variable must change so the condition eventually becomes false.
3. 1, 2, 3
4. 2, 4
5. 7
6. It never updates total, so the condition never changes.
7. Correct version:
number = 3
while number <= 5:
    print(number)
    number = number + 1
8. The value never changes, so value stays 10 forever.
9. Sample answer:
number = 1
while number <= 4:
    print(number)
    number = number + 1
10. Sample answer:
number = 0
while number <= 6:
    print(number)
    number = number + 2
11. Sample answer:
number = 5
while number >= 1:
    print(number)
    number = number - 1
12. The condition decides whether the loop continues. The update changes the variable.
13. Sample answer:
number = 2
while number <= 14:
    print(number)
    number = number + 3
14. Accept answers mentioning condition, colon, indentation, or update.

Exit Ticket:
1. It repeats code while a condition is true.
2. 1, 2, 3
3. The update line: value = value + 1`
    : `Answer Key

Use this key to check whether students:
1. Named the main idea correctly.
2. Followed the same structure as the modeled example.
3. Showed their reasoning clearly.
4. Identified one likely mistake or confusion point.`;

  const slideBlocks = isCoding
    ? [
        { title: "Warm-Up", body: warmupText, move: "Project or read the warm-up. Give students 5-6 quiet minutes to begin." },
        { title: "Mini-Lesson", body: `A while loop repeats code while a condition stays true.\n\n${modelText}`, move: "Teach one clear example only, then move on." },
        { title: "Video / Link", body: selectedVideo || "No lesson video was listed. Use the mini-lesson slide and move directly into guided practice.", move: "Play the suggested video if it fits the class. If not, skip this slide." },
        { title: "Guided Practice", body: `Solve these together:\n1. Predict the output:\ncount = 1\nwhile count <= 3:\n    print(count)\n    count = count + 1\n2. What line makes the loop stop?\n3. What mistake causes an infinite loop?`, move: "Do one together before students work on their own." },
        { title: independentWorkLabel, body: worksheetText, move: "Students complete the prepared work. Circulate and keep the room focused." },
        { title: "Exit Ticket", body: exitTicketText, move: "Collect the exit ticket and all student work before dismissal." },
      ]
    : [
        { title: "Warm-Up", body: warmupText, move: "Project or read the warm-up and let students begin right away." },
        { title: "Mini-Lesson", body: modelText, move: "Model one example only and keep the explanation short." },
        { title: "Video / Link", body: selectedVideo || "No lesson video was listed. Skip this slide if not needed.", move: "Play the suggested video here if it fits the lesson." },
        { title: "Guided Practice", body: `Do these questions together:\n1. What clue tells you how to start?\n2. What is the first step?\n3. What is one mistake to avoid?\n4. Explain your answer to a partner before moving on.`, move: "Make sure students know how to start before release." },
        { title: independentWorkLabel, body: worksheetText, move: "Students complete the prepared work independently or with a partner if directed." },
        { title: "Exit Ticket", body: exitTicketText, move: "Collect all student work together." },
      ];
  const pptOutlineText = `Substitute Slide Outline: ${className}

Topic: ${topic}
Class block: ${durationText}
Sub role: ${subRole === "teach" ? "Teach the lesson" : "Monitor the work period"}
${selectedVideo ? `Lesson video / link: ${selectedVideo}` : "Lesson video / link: none listed"}

${slideBlocks
  .map(
    (slide, index) => `Slide ${index + 1}: ${slide.title}
Main content: ${slide.body}
Sub move: ${slide.move}`,
  )
  .join("\n\n")}`;

  const slidesHtml = `
    <h1>${escapeHtml(className)} Sub Lesson Slides</h1>
    <p class="label">${escapeHtml(topic)} · ${escapeHtml(durationText)}</p>
    <div class="card">
      <strong>Sub Pacing</strong>
      <div class="timing-grid">
        ${timeline
          .map(
            (block) => `
              <div class="timing-block">
                <strong>${escapeHtml(block.label)}</strong>
                <div>${escapeHtml(`${block.minutes} min`)}</div>
              </div>
            `,
          )
          .join("")}
      </div>
    </div>
    ${slideBlocks
      .map(
        (slide, index) => `
          <section class="slide-page">
            <p class="slide-kicker">Slide ${index + 1}</p>
            <h2>${escapeHtml(slide.title)}</h2>
            <p>${escapeHtml(slide.body).replaceAll("\n", "<br />")}</p>
            <div class="slide-notes"><strong>Sub move:</strong> ${escapeHtml(slide.move)}</div>
          </section>
        `,
      )
      .join("")}
  `;

  const worksheetHtml = `
    <h1>${escapeHtml(className)} ${escapeHtml(independentWorkLabel)}</h1>
    <p class="label">${escapeHtml(topic)} · ${escapeHtml(durationText)}</p>
    <div class="card"><strong>Directions</strong><p>Complete the warm-up, follow the modeled example, and work through the practice in order. Show your thinking and turn everything in before class ends.</p></div>
    <div class="card"><p>${escapeHtml(worksheetText).replaceAll("\n", "<br />")}</p></div>
  `;

  const exitTicketHtml = `
    <h1>${escapeHtml(className)} Exit Ticket</h1>
    <p class="label">${escapeHtml(topic)}</p>
    <div class="card"><p>${escapeHtml(exitTicketText).replaceAll("\n", "<br />")}</p></div>
  `;

  const answerKeyHtml = `
    <h1>${escapeHtml(className)} Answer Key</h1>
    <p class="label">${escapeHtml(topic)} · Teacher / Sub Use</p>
    <div class="card"><p>${escapeHtml(answerKeyText).replaceAll("\n", "<br />")}</p></div>
  `;

  return {
    launchPreview: isCoding
      ? "Students begin with a short while-loop warm-up, then the substitute models one count-to-5 example before students move into structured practice."
      : `Students begin with a short warm-up on ${topic}, then the substitute models one example before guided and independent practice.`,
    modelPreview: modelText.split("\n").slice(0, 8).join("\n"),
    practicePreview: worksheetText.split("\n").slice(0, 16).join("\n"),
    worksheetPreview: worksheetText.split("\n").slice(0, 18).join("\n"),
    exitTicketPreview: exitTicketText,
    answerKeyPreview: answerKeyText.split("\n").slice(0, 12).join("\n"),
    worksheetText,
    pptOutlineText,
    slidesHtml,
    worksheetHtml,
    exitTicketHtml,
    answerKeyHtml,
    independentWorkLabel,
    suggestedVideos,
    selectedVideo,
  };
}

function buildSubPlan(values) {
  const createMode = values.coverageMode !== "assessment" || !values.assessmentSummary;
  const isCoding = /python|coding|programming|while loop|while loops|iteration|loop/i.test(
    `${values.topic} ${values.coverageGoal} ${values.className} ${values.priorKnowledge}`,
  );
  const topic = values.topic.trim();
  const durationText = values.duration.trim() || "50 minutes";
  const durationMinutes = parseDurationMinutes(durationText);
  const timeline = buildTimeline(durationMinutes);
  const subRole = values.subRole || "teach";
  const subNeedSummary = summarizeSubNeed(values, createMode, subRole);
  const independentWorkLabel = buildIndependentWorkLabel(values, createMode);
  const suggestedVideos = getVideoSuggestions(`${topic} ${values.coverageGoal} ${values.priorKnowledge}`, values.lessonVideo || "");
  const selectedVideo = values.lessonVideo || suggestedVideos[0]?.url || "";
  const lessonSlug = `${slugify(values.className || "class")}-${slugify(topic || "sub-lesson")}`;
  const warmup = `Warm-up (${timeline[0].minutes} min): Students complete a quick start prompt on ${values.topic}. The substitute reads the prompt aloud, gives one simple example, and starts the timer.`;
  const guidedTask = createMode
    ? `Main task (${timeline[1].minutes + timeline[2].minutes + timeline[3].minutes} min): Students work through a teacher-created practice set on ${values.topic}. ${subRole === "teach" ? "Use the included lesson slides, video/link, and prepared materials." : "Use the included directions and keep students on pace."}`
    : `Main task (${timeline[1].minutes + timeline[2].minutes + timeline[3].minutes} min): Students complete the teacher-provided assessment / worksheet. The substitute should not reteach the full lesson, only clarify directions and monitor pacing.`;
  const closing = `Closing (${timeline[4].minutes} min): Collect all student work, write down who finished, who struggled, and any behavior or attendance issues.`;
  const subLessonSteps = [
    `Take attendance and read the teacher note before students begin work.`,
    `Tell students the class goal in one sentence: ${values.coverageGoal.toLowerCase()}.`,
    `Review the directions for ${values.topic} in simple language. Do not assume students or the substitute remember prior teacher language.`,
    warmup,
    guidedTask,
    `Collect the required work and leave a note for the classroom teacher before the end of the period.`,
    closing,
  ];

  const createdLessonMaterials = createMode
    ? buildSubCreatedLessonMaterials({
        className: values.className,
        classHour: values.classHour,
        topic,
        duration: durationText,
        priorKnowledge: values.priorKnowledge,
        coverageGoal: values.coverageGoal,
        materials: values.materials,
        submissionNotes: values.submissionNotes,
        isCoding,
        subRole,
        lessonVideo: selectedVideo,
      })
    : null;

  const createdMaterials = createMode
    ? `
      <div class="card">
        <h2>TeacherFlowAI-Created Lesson Materials</h2>
        <p>A substitute-ready lesson packet is included below with a warm-up, modeled example, student worksheet, exit ticket, and answer key. The substitute does not need to invent the lesson.</p>
      </div>
      <div class="card">
        <h2>Lesson Flow Included</h2>
        <p><strong>Topic:</strong> ${escapeHtml(values.topic)}</p>
        <ol>
          <li>Warm-up prompt with substitute script</li>
          <li>Mini-lesson example the substitute can read and model</li>
          <li>Student worksheet sized to fill the requested class block</li>
          <li>Exit ticket and answer key</li>
          <li>Collection directions tied to the class goal</li>
        </ol>
      </div>
      <div class="card">
        <h2>Answer / Collection Notes</h2>
        <p>The substitute should collect all student work, use the included key for quick checking if needed, and note any major confusion areas for the classroom teacher.</p>
      </div>
    `
    : `
      <div class="card">
        <h2>Teacher-Provided Assessment</h2>
        <p>${escapeHtml(values.assessmentSummary || "Assessment uploaded by teacher.")}</p>
      </div>
    `;

  const subCoverSheetHtml = `
    <h1>${escapeHtml(values.className)} Sub Cover Sheet</h1>
    <p class="label">${escapeHtml(values.classHour)} · ${escapeHtml(values.duration)}</p>
    <div class="card">
      <h2>Today’s Goal</h2>
      <p>${escapeHtml(values.coverageGoal)}</p>
    </div>
    <div class="card">
      <h2>What Students Already Know</h2>
      <p>${escapeHtml(values.priorKnowledge)}</p>
    </div>
    <div class="card">
      <h2>Sub Role</h2>
      <p>${escapeHtml(subRole === "teach" ? "Teach the short lesson with the included packet." : "Monitor work time, clarify directions, and keep students on pace.")}</p>
    </div>
    <div class="card">
      <h2>Short Sub Summary</h2>
      <p>${escapeHtml(subNeedSummary)}</p>
    </div>
    <div class="card">
      <h2>What The Substitute Should Do</h2>
      <ol>${subLessonSteps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
    </div>
    <div class="card">
      <h2>Lesson Video / Link</h2>
      <p>${escapeHtml(selectedVideo || "No lesson video or link was listed.")}</p>
    </div>
    <div class="card">
      <h2>Behavior / Seating Notes</h2>
      <p>${escapeHtml(values.behaviorNotes || "No special behavior or seating notes were listed.")}</p>
    </div>
  `;

  const studentInstructionHtml = `
    <h1>${escapeHtml(values.className)} Student Directions</h1>
    <p class="label">${escapeHtml(values.topic)}</p>
    <div class="card">
      <h2>What To Do Today</h2>
      <ol>
        <li>Start the warm-up as soon as class begins.</li>
        <li>${escapeHtml(createMode ? `Complete the class practice tasks on ${values.topic}.` : "Complete the teacher-provided quiz / test / worksheet.")}</li>
        <li>Work quietly and use your own thinking first.</li>
        <li>Turn in all work before the end of class.</li>
      </ol>
    </div>
    <div class="card">
      <h2>Helpful Reminder</h2>
      <p>${escapeHtml(values.priorKnowledge)}</p>
    </div>
  `;

  const collectionChecklistHtml = `
    <h1>${escapeHtml(values.className)} Collection Checklist</h1>
    <div class="card">
      <h2>Before Students Leave</h2>
      <ul>
        <li>Attendance taken</li>
        <li>Work collected from each student</li>
        <li>Students who were absent listed</li>
        <li>Students who finished early listed</li>
        <li>Students who struggled listed</li>
        <li>Behavior concerns noted</li>
      </ul>
    </div>
    <div class="card">
      <h2>Teacher Requested Collection / Report</h2>
      <p>${escapeHtml(values.submissionNotes || "Leave a short note about who finished, who struggled, and any behavior issues.")}</p>
    </div>
  `;

  const returnNoteHtml = `
    <h1>${escapeHtml(values.className)} Teacher Return Note</h1>
    <div class="card">
      <h2>Quick Substitute Report</h2>
      <p>Students absent:</p>
      <p>________________________________________</p>
      <p>Students who completed the work:</p>
      <p>________________________________________</p>
      <p>Students who struggled or needed support:</p>
      <p>________________________________________</p>
      <p>Behavior / classroom issues:</p>
      <p>________________________________________</p>
      <p>Anything the classroom teacher should know before the next class:</p>
      <p>________________________________________</p>
    </div>
  `;

  const subPlanHtml = `
    <h1>${escapeHtml(values.className)} Sub Plan</h1>
    <p class="label">${escapeHtml(values.classHour)} · ${escapeHtml(values.duration)}</p>
    <div class="card">
      <h2>Teacher Absence Note</h2>
      <p>The substitute should assume they do not know the class routine or the lesson background. This plan keeps directions simple, uses the listed materials only, and focuses on coverage, collection, and classroom stability.</p>
    </div>
    <div class="card">
      <h2>What Students Already Know</h2>
      <p>${escapeHtml(values.priorKnowledge)}</p>
    </div>
    <div class="card">
      <h2>Sub Lesson Steps</h2>
      <ol>${subLessonSteps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
    </div>
    <div class="card">
      <h2>Short Sub Summary</h2>
      <p>${escapeHtml(subNeedSummary)}</p>
    </div>
    <div class="card">
      <h2>Lesson Video / Link</h2>
      <p>${escapeHtml(selectedVideo || "No lesson video or link was listed.")}</p>
    </div>
    ${createdMaterials}
    <div class="card">
      <h2>Materials / Links</h2>
      <p>${escapeHtml(values.materials || "No extra materials were listed.")}</p>
    </div>
    <div class="card">
      <h2>Behavior / Seating Notes</h2>
      <p>${escapeHtml(values.behaviorNotes || "No special behavior or seating notes were listed.")}</p>
    </div>
    <div class="card">
      <h2>What To Collect / Report</h2>
      <p>${escapeHtml(values.submissionNotes || "Leave a short note about who completed the work, who struggled, and any behavior issues.")}</p>
    </div>
  `;

  return [
    {
      title: "Sub At A Glance",
      content: `
        <div class="resource-preview">
          <section class="resource-section">
            <h5>Class + Time</h5>
            <p>${escapeHtml(values.className)} · ${escapeHtml(values.classHour)} · ${escapeHtml(values.duration)}</p>
          </section>
          <section class="resource-section">
            <h5>What The Sub Needs To Know</h5>
            <p>${escapeHtml(subNeedSummary)}</p>
          </section>
          <section class="resource-section">
            <h5>What Students Already Know</h5>
            <p>${escapeHtml(values.priorKnowledge)}</p>
          </section>
          <section class="resource-section">
            <h5>Sub Role</h5>
            <p>${escapeHtml(subRole === "teach" ? "Teach the short lesson with the included materials." : "Monitor work completion and clarify directions only.")}</p>
          </section>
          <section class="resource-section">
            <h5>Coverage Mode</h5>
            <p>${escapeHtml(
              createMode
                ? "TeacherFlowAI created sub-ready lesson materials because no teacher assessment was supplied."
                : "TeacherFlowAI built the plan around the uploaded teacher assessment / worksheet.",
            )}</p>
          </section>
          <section class="resource-section">
            <h5>Lesson Video / Link</h5>
            <p>${escapeHtml(selectedVideo || "None listed.")}</p>
          </section>
        </div>
        ${renderTimelineHtml(timeline, {
          "Warm-Up": "Start immediately and settle the room.",
          "Mini-Lesson": subRole === "teach" ? "Use the lesson slides and model one clear example." : "Review directions and expectations only.",
          "Guided Practice": "Make sure students know how to begin the first task.",
          "Independent Work": "Students complete the packet while the sub circulates and redirects.",
          "Closure": "Collect work and leave a short teacher note.",
        })}
        <div class="resource-actions">
          ${makeHtmlDownloadLink("Download Sub Plan Page", `${slugify(values.className)}-sub-plan.html`, `${values.className} Sub Plan`, subPlanHtml)}
          ${makeHtmlDownloadLink("Download Sub Cover Sheet", `${slugify(values.className)}-sub-cover-sheet.html`, `${values.className} Sub Cover Sheet`, subCoverSheetHtml)}
          ${makeCopyButton("Copy Sub Plan Summary", `Class: ${values.className}\nHour: ${values.classHour}\nTopic: ${values.topic}\nCoverage goal: ${values.coverageGoal}\nMaterials: ${values.materials || "None listed"}\nCollect/report: ${values.submissionNotes || "Leave a short teacher note."}`)}
        </div>
      `,
    },
    {
      title: "Suggested Videos",
      content: `
        <div class="resource-preview">
          ${renderSuggestionLinks(suggestedVideos)}
        </div>
      `,
    },
    {
      title: "Note For The Substitute",
      content: `
        <div class="resource-preview">
          <section class="resource-section">
            <h5>Simple Directions For The Sub</h5>
            <p>${escapeHtml(
              `Today students are working on ${values.topic}. They already know: ${values.priorKnowledge}. ${
                createMode
                  ? "Use the included sub-ready directions and practice materials."
                  : "Use the uploaded teacher assessment and keep students on pace."
              } ${subNeedSummary}`,
            )}</p>
          </section>
          <section class="resource-section">
            <h5>Behavior / Seating Notes</h5>
            <p>${escapeHtml(values.behaviorNotes || "No special notes listed.")}</p>
          </section>
        </div>
      `,
    },
    ...(createMode && createdLessonMaterials
      ? [
          {
            title: "Lesson Slides",
            content: `
              <div class="resource-preview">
                <section class="resource-section">
                  <h5>Lesson Launch</h5>
                  <p>${escapeHtml(createdLessonMaterials.launchPreview)}</p>
                </section>
                <section class="resource-section">
                  <h5>Mini-Lesson</h5>
                  <p>${escapeHtml(createdLessonMaterials.modelPreview).replaceAll("\n", "<br />")}</p>
                </section>
                <section class="resource-section">
                  <h5>${escapeHtml(independentWorkLabel)}</h5>
                  <p>${escapeHtml(createdLessonMaterials.practicePreview).replaceAll("\n", "<br />")}</p>
                </section>
              </div>
              <div class="resource-actions">
                ${makeHtmlDownloadLink("Download Lesson Slides", `${lessonSlug}-sub-slides.html`, `${values.className} Lesson Slides`, createdLessonMaterials.slidesHtml)}
                ${makeTextDownloadLink("Download PPT Outline", `${lessonSlug}-sub-ppt-outline.txt`, createdLessonMaterials.pptOutlineText)}
              </div>
            `,
          },
          {
            title: "Student Packet",
            content: `
              <div class="resource-preview">
                <section class="resource-section">
                  <h5>Worksheet Preview</h5>
                  <p>${escapeHtml(createdLessonMaterials.worksheetPreview).replaceAll("\n", "<br />")}</p>
                </section>
              </div>
              <div class="resource-actions">
                ${makeHtmlDownloadLink(`Download ${createdLessonMaterials.independentWorkLabel}`, `${lessonSlug}-student-work.html`, `${values.className} ${createdLessonMaterials.independentWorkLabel}`, createdLessonMaterials.worksheetHtml)}
                ${makeHtmlDownloadLink("Download Exit Ticket", `${lessonSlug}-exit-ticket.html`, `${values.className} Exit Ticket`, createdLessonMaterials.exitTicketHtml)}
                ${makeCopyButton("Copy Worksheet Text", createdLessonMaterials.worksheetText)}
              </div>
            `,
          },
          {
            title: "Answer Key",
            content: `
              <div class="resource-preview">
                <section class="resource-section">
                  <h5>Exit Ticket Preview</h5>
                  <p>${escapeHtml(createdLessonMaterials.exitTicketPreview).replaceAll("\n", "<br />")}</p>
                </section>
                <section class="resource-section">
                  <h5>Answer Key Preview</h5>
                  <p>${escapeHtml(createdLessonMaterials.answerKeyPreview).replaceAll("\n", "<br />")}</p>
                </section>
              </div>
              <div class="resource-actions">
                ${makeHtmlDownloadLink("Download Answer Key", `${lessonSlug}-answer-key.html`, `${values.className} Answer Key`, createdLessonMaterials.answerKeyHtml)}
              </div>
            `,
          },
        ]
      : []),
    {
      title: "Student Instruction Sheet",
      content: `
        <div class="resource-preview">
          <section class="resource-section">
            <h5>What students see</h5>
            <p>${escapeHtml(
              createMode
                ? `Students will receive sub-ready directions and practice materials for ${values.topic}.`
                : "Students will receive directions for completing the teacher-provided assessment or worksheet.",
            )}</p>
          </section>
        </div>
        <div class="resource-actions">
          ${makeHtmlDownloadLink("Download Student Instruction Sheet", `${slugify(values.className)}-student-directions.html`, `${values.className} Student Directions`, studentInstructionHtml)}
        </div>
      `,
    },
    {
      title: "Collection And Return",
      content: `
        <div class="resource-preview">
          <section class="resource-section">
            <h5>What the sub must collect</h5>
            <p>${escapeHtml(values.submissionNotes || "Collect all work and leave a note on completion, struggles, and behavior.")}</p>
          </section>
        </div>
        <div class="resource-actions">
          ${makeHtmlDownloadLink("Download Collection Checklist", `${slugify(values.className)}-collection-checklist.html`, `${values.className} Collection Checklist`, collectionChecklistHtml)}
          ${makeHtmlDownloadLink("Download Teacher Return Note Form", `${slugify(values.className)}-return-note.html`, `${values.className} Teacher Return Note`, returnNoteHtml)}
        </div>
      `,
    },
  ];
}

function renderSupportSummary(scoredStudents) {
  const high = scoredStudents.filter((student) => student.supportLevel === "high").length;
  const moderate = scoredStudents.filter((student) => student.supportLevel === "moderate").length;
  const low = scoredStudents.filter((student) => student.supportLevel === "low").length;

  if (studentCount) studentCount.textContent = String(scoredStudents.length);
  if (highPriorityCount) highPriorityCount.textContent = String(high);
  if (!supportSummary) {
    return;
  }

  supportSummary.innerHTML = `
    <article class="summary-card">
      <span class="metric-label">High Support</span>
      <strong>${high}</strong>
      <p>Immediate intervention and likely outreach this week.</p>
    </article>
    <article class="summary-card">
      <span class="metric-label">Moderate Support</span>
      <strong>${moderate}</strong>
      <p>Targeted monitoring and reteach planning should start soon.</p>
    </article>
    <article class="summary-card">
      <span class="metric-label">Low Support</span>
      <strong>${low}</strong>
      <p>Lighter monitoring with periodic teacher review.</p>
    </article>
    <article class="summary-card">
      <span class="metric-label">Why Progress Summary Works</span>
      <strong>Top 2-3 Factors</strong>
      <p>The summary is generated by selecting the strongest weighted risk factors, then adding class context and teacher notes.</p>
    </article>
  `;
}

function renderResultsBar(filteredStudents, totalStudents) {
  if (!resultsBar) {
    return;
  }
  resultsBar.innerHTML = `
    <div class="results-copy">
      Showing <strong>${filteredStudents.length}</strong> of <strong>${totalStudents}</strong> students.
    </div>
    <button id="clear-filters-button" class="secondary-button" type="button" ${
      state.search || state.filter !== "all" ? "" : "disabled"
    }>Clear Filters</button>
  `;
  const clearButton = document.querySelector("#clear-filters-button");
  clearButton?.addEventListener("click", () => {
    state.search = "";
    state.filter = "all";
    studentSearch.value = "";
    setActiveFilterChip("all");
    renderAll();
  });
}

function renderListColumn(target, studentsForLevel) {
  if (!target) {
    return;
  }
  if (!studentsForLevel.length) {
    target.innerHTML = `<div class="list-empty">No students in this band.</div>`;
    return;
  }

  target.innerHTML = studentsForLevel
    .map(
      (student) => `
        <button class="student-list-item ${student.student_id === selectedStudentId ? "selected" : ""}" type="button" data-student-select="${escapeHtml(
          student.student_id,
        )}">
          <strong>${escapeHtml(student.student_name)}</strong>
          <span>${escapeHtml(student.class_name)} · Score ${student.support_risk_score}</span>
        </button>
      `,
    )
    .join("");
}

function getEmailPayload(emailText) {
  const normalized = String(emailText || "").replace(/\r\n/g, "\n");
  const [firstLine = "", ...rest] = normalized.split("\n");
  return {
    subject: firstLine.startsWith("Subject:") ? firstLine.replace(/^Subject:\s*/, "").trim() : "",
    body: rest.join("\n").trim(),
  };
}

function getEmailRecipient(student) {
  return student.advisor_email || student.parent_email || "";
}

function openGmailDraft(student) {
  const { subject, body } = getEmailPayload(student.email);
  const authUser = teacherProfile?.email ? `&authuser=${encodeURIComponent(teacherProfile.email)}` : "";
  const to = getEmailRecipient(student);
  const toQuery = to ? `&to=${encodeURIComponent(to)}` : "";
  window.open(
    `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}${toQuery}${authUser}`,
    "_blank",
    "noopener,noreferrer",
  );
}

function formatCalendarDate(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(
    date.getUTCHours(),
  )}${pad(date.getUTCMinutes())}00Z`;
}

function buildCalendarRange(dateInput, timeInput, durationMinutes = 30) {
  const start = new Date();
  if (dateInput) {
    const [year, month, day] = dateInput.split("-").map(Number);
    start.setFullYear(year, (month || 1) - 1, day || 1);
  }
  if (timeInput) {
    const [hours, minutes] = timeInput.split(":").map(Number);
    start.setHours(hours || 8, minutes || 0, 0, 0);
  } else {
    start.setHours(8, 0, 0, 0);
  }
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  return { start, end };
}

function openCalendarReminder(student) {
  const { start, end } = buildCalendarRange("", "", 30);
  start.setDate(start.getDate() + 1);
  start.setHours(7, 30, 0, 0);
  const authUser = teacherProfile?.email ? `&authuser=${encodeURIComponent(teacherProfile.email)}` : "";
  const details = `TeacherFlowAI follow-up for ${student.student_name}

Support score: ${student.support_risk_score}
Suggested intervention: ${student.intervention}
Advisor: ${student.advisor_email || "Not provided"}
Teacher notes: ${student.teacher_notes || "No additional notes."}`;
  window.open(
    `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `TeacherFlowAI follow-up: ${student.student_name}`,
    )}&details=${encodeURIComponent(details)}&dates=${formatCalendarDate(start)}/${formatCalendarDate(end)}${authUser}`,
    "_blank",
    "noopener,noreferrer",
  );
}

function openAlertCalendarEvent(alert) {
  const { start, end } = buildCalendarRange(alert.dueDate, alert.dueTime, 30);
  const authUser = teacherProfile?.email ? `&authuser=${encodeURIComponent(teacherProfile.email)}` : "";
  window.open(
    `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(alert.title)}&details=${encodeURIComponent(
      alert.description || "TeacherFlowAI follow-up alert",
    )}&dates=${formatCalendarDate(start)}/${formatCalendarDate(end)}${authUser}`,
    "_blank",
    "noopener,noreferrer",
  );
}

function renderStudentDetail(student) {
  if (!studentDetail) {
    return;
  }
  if (!student) {
    studentDetail.innerHTML = `
      <div class="empty-state">
        <h4>Select a student</h4>
        <p>Choose a student name from High, Moderate, or Low support to open the full detail panel.</p>
      </div>
    `;
    return;
  }

  studentDetail.innerHTML = `
    <article class="detail-card">
      <div class="student-card-header">
        <div>
          <span class="tag ${student.supportLevel}">${student.supportLevel} support</span>
          <h4>${escapeHtml(student.student_name)}</h4>
          <div class="student-subhead">${escapeHtml(student.class_name)} · Grade ${escapeHtml(
            student.grade_level,
          )} · ID ${escapeHtml(student.student_id)}</div>
        </div>
        <div class="student-meta compact-meta">
          <span>Score: ${student.support_risk_score}</span>
          <span>Quiz: ${student.recent_quiz_avg}%</span>
          <span>Test: ${student.recent_test_avg}%</span>
          <span>Trend: ${escapeHtml(student.score_trend)}</span>
        </div>
      </div>
      <section class="support-block">
        <div class="support-block-head">
          <h4>1. Risk Summary</h4>
          <span class="queue-badge">${escapeHtml(student.supportLevel)} support</span>
        </div>
        <div class="detail-grid simple-detail-grid">
          <div class="detail-item"><strong>Attendance</strong><span>${student.attendance_percent}%</span></div>
          <div class="detail-item"><strong>Missing Work</strong><span>${student.missing_assignments}</span></div>
          <div class="detail-item"><strong>Late Work</strong><span>${student.late_submissions}</span></div>
          <div class="detail-item"><strong>Participation</strong><span>${student.participation_score}/5</span></div>
          <div class="detail-item"><strong>Behavior / Work Habits</strong><span>${escapeHtml(summarizeBehavior(student))}</span></div>
          <div class="detail-item"><strong>Last Intervention</strong><span>${student.last_intervention_days_ago} days ago</span></div>
        </div>
        <div class="progress-block compact-block">
          <h4>Why flagged</h4>
          <ul class="reason-list">
            ${student.whyFlagged.map((reason) => `<li>${escapeHtml(reason.reason)}</li>`).join("")}
          </ul>
        </div>
      </section>
      <section class="support-block">
        <div class="support-block-head">
          <h4>2. Contact + Intervention</h4>
        </div>
        <div class="detail-grid simple-detail-grid">
          <div class="detail-item contact-item"><strong>Advisor Email</strong><span>${escapeHtml(student.advisor_email || "Not provided")}</span></div>
          <div class="detail-item contact-item"><strong>Parent Email</strong><span>${escapeHtml(student.parent_email || "Not provided")}</span></div>
        </div>
        <div class="progress-block compact-block">
          <h4>Suggested next step</h4>
          ${escapeHtml(student.intervention)}
        </div>
      </section>
      <section class="support-block">
        <div class="support-block-head">
          <h4>3. Actions + Generated Outputs</h4>
        </div>
        <div class="student-actions">
          <button class="secondary-button student-action-button" type="button" data-action="email" data-student-id="${escapeHtml(
            student.student_id,
          )}">Draft Advisor/Parent Email</button>
          <button class="secondary-button student-action-button" type="button" data-action="summary" data-student-id="${escapeHtml(
            student.student_id,
          )}">Generate Progress Summary</button>
          <button class="secondary-button student-action-button" type="button" data-action="calendar" data-student-id="${escapeHtml(
            student.student_id,
          )}">Add Google Calendar Reminder</button>
        </div>
        <div class="student-sections action-panels">
          <div class="email-block is-hidden" data-panel="email" data-student-id="${escapeHtml(student.student_id)}">
            <h4>Draft Advisor/Parent Email</h4>
            ${escapeHtml(student.email)}
          </div>
          <div class="progress-block is-hidden" data-panel="summary" data-student-id="${escapeHtml(student.student_id)}">
            <h4>Progress Summary</h4>
            ${escapeHtml(student.progressSummary)}
          </div>
        </div>
      </section>
    </article>
  `;
}

function renderClassSettings() {
  if (!classSettings) {
    return;
  }
  const classes = [...new Set(students.map((student) => student.class_name))].sort();
  classSettings.innerHTML = `
    <div class="class-settings-list">
      ${classes.map((className) => `<div class="class-pill">${escapeHtml(className)}</div>`).join("")}
    </div>
    <p class="microcopy">Use the sample CSV template so advisor and parent email columns always load into the same fixed schema.</p>
  `;
}

function renderRosterManager() {
  if (!rosterClassSelect || !rosterTable) {
    return;
  }
  const classes = [...new Set(students.map((student) => student.class_name))].sort();
  rosterClassSelect.innerHTML = classes.length
    ? classes.map((className) => `<option value="${escapeHtml(className)}">${escapeHtml(className)}</option>`).join("")
    : `<option value="">No classes imported yet</option>`;

  if (!classes.includes(selectedRosterClass)) {
    selectedRosterClass = classes[0] || "";
  }
  const selectedClass = selectedRosterClass || classes[0] || "";
  if (selectedClass && rosterClassSelect.value !== selectedClass) {
    rosterClassSelect.value = selectedClass;
  }

  const rosterStudents = students.filter((student) => student.class_name === selectedClass);
  if (!rosterStudents.length) {
    rosterTable.innerHTML = `<div class="empty-state"><h4>No roster yet</h4><p>Import the sample CSV to load class-by-class roster management.</p></div>`;
    return;
  }

  rosterTable.innerHTML = `
    <div class="roster-table-head">
      <span>Student</span>
      <span>Grade</span>
      <span>Advisor Email</span>
      <span>Parent Email</span>
      <span>Teacher Notes</span>
      <span>Save</span>
    </div>
    ${rosterStudents
      .map(
        (student) => `
          <form class="roster-row" data-roster-form="${escapeHtml(student.student_id)}">
            <div>
              <strong>${escapeHtml(student.student_name)}</strong><br />
              <span class="microcopy">${escapeHtml(student.student_id)}</span>
            </div>
            <div>${escapeHtml(student.grade_level)}</div>
            <input name="advisor_email" type="email" value="${escapeHtml(student.advisor_email || "")}" />
            <input name="parent_email" type="email" value="${escapeHtml(student.parent_email || "")}" />
            <input name="teacher_notes" type="text" value="${escapeHtml(student.teacher_notes || "")}" />
            <button class="secondary-button" type="submit">Save</button>
          </form>
        `,
      )
      .join("")}
  `;
}

function renderClassSummary() {
  if (!classIntelSelect || !classIntelOutput) {
    return;
  }
  const classes = [...new Set(students.map((student) => student.class_name))].sort();
  classIntelSelect.innerHTML = classes.length
    ? classes.map((className) => `<option value="${escapeHtml(className)}">${escapeHtml(className)}</option>`).join("")
    : `<option value="">No classes imported yet</option>`;

  if (!classes.includes(selectedInsightsClass)) {
    selectedInsightsClass = classes[0] || "";
  }
  const selectedClass = selectedInsightsClass || classes[0] || "";
  if (selectedClass && classIntelSelect.value !== selectedClass) {
    classIntelSelect.value = selectedClass;
  }

  const classStudents = getScoredStudents().filter((student) => student.class_name === selectedClass);
  if (!classStudents.length) {
    classIntelOutput.innerHTML = `<div class="empty-state"><h4>No class data</h4><p>Import student data to unlock class summary intelligence.</p></div>`;
    return;
  }

  const trendingDown = classStudents.filter((student) => student.score_trend === "down");
  const improved = classStudents.filter((student) => student.score_trend === "up");
  const outreach = classStudents.filter((student) => student.supportLevel !== "low" && (student.advisor_email || student.parent_email));
  const avgQuiz = Math.round(classStudents.reduce((sum, student) => sum + student.recent_quiz_avg, 0) / classStudents.length);
  const avgTest = Math.round(classStudents.reduce((sum, student) => sum + student.recent_test_avg, 0) / classStudents.length);
  const likelyReteach =
    avgQuiz < 80 || avgTest < 80
      ? `Current assessment concepts in ${selectedClass} likely need reteaching because class averages are ${avgQuiz}% on quizzes and ${avgTest}% on tests.`
      : `Current assessment data in ${selectedClass} does not signal an immediate whole-class reteach need.`;

  renderOutputCards(classIntelOutput, [
    {
      title: "Trending Down",
      content: `<ul>${trendingDown.map((student) => `<li>${escapeHtml(student.student_name)} (${student.support_risk_score})</li>`).join("") || "<li>No students are currently trending down.</li>"}</ul>`,
    },
    {
      title: "Improved",
      content: `<ul>${improved.map((student) => `<li>${escapeHtml(student.student_name)}</li>`).join("") || "<li>No students are currently marked as improving.</li>"}</ul>`,
    },
    {
      title: "Likely Reteach Concepts",
      content: `<p>${escapeHtml(likelyReteach)}</p>`,
    },
    {
      title: "Who Needs Outreach",
      content: `<ul>${outreach.map((student) => `<li>${escapeHtml(student.student_name)} · ${escapeHtml(student.advisor_email || student.parent_email || "No email on file")}</li>`).join("") || "<li>No immediate outreach list for this class.</li>"}</ul>`,
    },
    {
      title: "Before Next Class",
      content: `
        <ul>
          <li>Review ${trendingDown.length || "no"} students who are trending down.</li>
          <li>${escapeHtml(likelyReteach)}</li>
          <li>Prepare outreach for ${outreach.length} students with email contacts.</li>
          <li>Use the support dashboard to prioritize high and moderate students before tomorrow plan.</li>
        </ul>
      `,
    },
  ]);
}

function renderWorkloadQueue(scoredStudents) {
  if (!workloadQueue) {
    return;
  }
  const high = scoredStudents.filter((student) => student.supportLevel === "high");
  const moderate = scoredStudents.filter((student) => student.supportLevel === "moderate");
  renderOutputCards(workloadQueue, [
    {
      title: "Immediate Intervention Queue",
      content: `<p>${high.length ? `Start with ${escapeHtml(high.slice(0, 3).map((student) => student.student_name).join(", "))}. These are the students TeacherFlowAI thinks should be handled first based on score, missing work, late work, and assessment data.` : "No students are currently in the urgent intervention queue."}</p>`,
    },
    {
      title: "Outreach Ready",
      content: `<p>${scoredStudents.filter((student) => student.advisor_email || student.parent_email).length} students already have advisor or parent email data on file, so the teacher can open a draft immediately.</p>`,
    },
    {
      title: "Small Group Candidates",
      content: `<p>${moderate.length} moderate-support students are candidates for the next small-group reteach block.</p>`,
    },
    {
      title: "How This Queue Works",
      content: `<p>This queue is not a hidden AI model. It is a simple teacher action list built from the current student support scores, contact availability, and intervention needs shown on this page.</p>`,
    },
  ]);
}

function updateProductivityStrip(scoredStudents) {
  const estimatedHours = 2 + scoredStudents.length * 0.4 + scoredStudents.filter((student) => student.supportLevel !== "low").length * 0.55;
  if (prepHoursSaved) prepHoursSaved.textContent = `${estimatedHours.toFixed(1)} hrs`;
  if (draftEmailsCount) draftEmailsCount.textContent = String(scoredStudents.filter((student) => student.advisor_email || student.parent_email).length);
  if (interventionCount) interventionCount.textContent = String(scoredStudents.filter((student) => student.supportLevel !== "low").length);
}

function renderSupportWorkspace() {
  if (
    !highSupportList &&
    !moderateSupportList &&
    !lowSupportList &&
    !supportSummary &&
    !studentCount &&
    !highPriorityCount &&
    !prepHoursSaved &&
    !draftEmailsCount &&
    !interventionCount &&
    !workloadQueue
  ) {
    return;
  }
  const scoredStudents = getFilteredStudents(getScoredStudents());
  const allScoredStudents = getScoredStudents();
  renderSupportSummary(allScoredStudents);
  renderResultsBar(scoredStudents, allScoredStudents.length);
  renderWorkloadQueue(allScoredStudents);
  updateProductivityStrip(allScoredStudents);

  const high = scoredStudents.filter((student) => student.supportLevel === "high");
  const moderate = scoredStudents.filter((student) => student.supportLevel === "moderate");
  const low = scoredStudents.filter((student) => student.supportLevel === "low");

  if (highListCount) highListCount.textContent = String(high.length);
  if (moderateListCount) moderateListCount.textContent = String(moderate.length);
  if (lowListCount) lowListCount.textContent = String(low.length);

  if (!scoredStudents.some((student) => student.student_id === selectedStudentId)) {
    selectedStudentId = scoredStudents[0]?.student_id || "";
  }

  renderListColumn(highSupportList, high);
  renderListColumn(moderateSupportList, moderate);
  renderListColumn(lowSupportList, low);
  renderStudentDetail(scoredStudents.find((student) => student.student_id === selectedStudentId));
}

function setActiveModule(moduleId) {
  activeModule = moduleId;
  document.querySelectorAll(".module-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `module-${moduleId}`);
  });
  moduleTabs?.querySelectorAll("[data-module]").forEach((button) => {
    button.classList.toggle("active", button.dataset.module === moduleId);
  });
}

function setActiveFilterChip(value) {
  priorityFilters?.querySelectorAll(".filter-chip").forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === value);
  });
}

function buildLessonPackFromTemplate(key) {
  const template = plannerTemplates[key];
  if (!template) {
    return;
  }
  for (const [field, value] of Object.entries(template)) {
    const input = teachingPackForm.elements.namedItem(field);
    if (input) {
      input.value = value;
    }
  }
  renderOutputCards(teachingPackOutput, buildTeachingPack(template));
}

function setupScrollReveal() {
  const revealTargets = document.querySelectorAll(".module-card, .panel, .metric-card");
  if (!("IntersectionObserver" in window)) {
    revealTargets.forEach((target) => target.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 },
  );

  revealTargets.forEach((target) => {
    target.classList.add("reveal");
    observer.observe(target);
  });
}

async function loadStudents() {
  const payload = await apiRequest("/api/students", { method: "GET", headers: {} });
  students = (payload.students || []).map(normalizeStudent);
  selectedStudentId = students[0]?.student_id || "";
}

async function saveRosterStudent(studentId, updates) {
  const payload = await apiRequest(`/api/students/${encodeURIComponent(studentId)}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
  const updated = normalizeStudent(payload.student);
  students = students.map((student) => (student.student_id === studentId ? updated : student));
  renderAll();
}

async function importStudents(text, sourceLabel) {
  const { headers, rows } = parseStudentImport(text);
  if (!rows.length) {
    setImportStatus(`No ${sourceLabel} rows were found. Include the fixed header row and at least one student row.`, "error");
    return;
  }

  if (!hasRequiredHeaders(headers)) {
    setImportStatus("The file does not match the fixed TeacherFlowAI schema. Download the sample CSV and fill in those exact columns.", "error");
    return;
  }

  const normalized = rows.map(normalizeStudent);
  const payload = await apiRequest("/api/students/import", {
    method: "POST",
    body: JSON.stringify({
      mode: importMode.value,
      students: normalized,
    }),
  });
  students = payload.students.map(normalizeStudent);
  selectedStudentId = students[0]?.student_id || "";
  renderAll();
  setImportStatus(`Imported ${payload.count} student${payload.count === 1 ? "" : "s"} from ${sourceLabel}.`, "success");
  logWorkspaceActivity({
    type: "roster_import",
    title: `Imported ${payload.count} students`,
    description: `${sourceLabel} import completed in ${payload.mode} mode. Total roster: ${payload.total}.`,
    status: "completed",
  });
}

async function loadProfile() {
  if (!teacherProfile) {
    return;
  }
  const payload = await apiRequest("/api/profile", { method: "GET", headers: {} });
  applyTeacherProfile(payload.profile);
}

function applyEmailSettings(settings) {
  const nextSettings = {
    ...DEFAULT_EMAIL_PROVIDER,
    ...(settings || {}),
  };
  currentEmailSettings = nextSettings;
  if (!emailSettingsForm) {
    return;
  }
  if (emailHost) emailHost.value = nextSettings.host || DEFAULT_EMAIL_PROVIDER.host;
  if (emailPort) emailPort.value = nextSettings.port || DEFAULT_EMAIL_PROVIDER.port;
  if (emailSecure) emailSecure.value = String(Boolean(nextSettings.secure));
  if (emailUsername) emailUsername.value = nextSettings.username || "";
  if (emailFromAddress) emailFromAddress.value = nextSettings.fromAddress || "";
  if (emailPassword) emailPassword.value = "";
  if (emailPassword) {
    emailPassword.placeholder = nextSettings.hasPassword ? "Password saved. Enter a new one only if you want to replace it." : "App password or SMTP password";
  }
  if (emailTestRecipient && !emailTestRecipient.value) {
    emailTestRecipient.value = teacherProfile?.email || "";
  }
}

async function loadEmailSettings() {
  if (!teacherProfile || !emailSettingsForm) {
    return;
  }
  const payload = await apiRequest("/api/settings/email", { method: "GET", headers: {} });
  applyEmailSettings(payload.emailSettings);
}

async function loadWorkspace() {
  if (!teacherProfile) {
    workspaceActivities = [];
    return;
  }
  const payload = await apiRequest("/api/workspace", { method: "GET", headers: {} });
  workspaceActivities = Array.isArray(payload.activities) ? payload.activities : [];
}

async function logWorkspaceActivity(activity) {
  if (!teacherProfile?.email) {
    return;
  }
  try {
    const payload = await apiRequest("/api/workspace/activity", {
      method: "POST",
      body: JSON.stringify(activity),
    });
    workspaceActivities = Array.isArray(payload.activities) ? payload.activities : workspaceActivities;
    renderWorkspacePanels();
  } catch {
    // non-blocking activity logging
  }
}

async function deleteWorkspaceActivity(activityId) {
  if (!activityId) {
    return;
  }
  const payload = await apiRequest("/api/workspace/activity/delete", {
    method: "POST",
    body: JSON.stringify({ activityId }),
  });
  workspaceActivities = Array.isArray(payload.activities) ? payload.activities : [];
  renderWorkspacePanels();
  setAlertStatus("Item deleted.", "success");
}

async function clearWorkspaceScope(scope) {
  const payload = await apiRequest("/api/workspace/clear", {
    method: "POST",
    body: JSON.stringify({ scope }),
  });
  workspaceActivities = Array.isArray(payload.activities) ? payload.activities : [];
  renderWorkspacePanels();
  setAlertStatus("Selected items deleted.", "success");
}

function setActiveSettingsTab(tabId) {
  activeSettingsTab = tabId;
  settingsTabs?.querySelectorAll("[data-settings-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.settingsTab === tabId);
  });
  settingsPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === `settings-panel-${tabId}`);
  });
}

function formatActivityTime(value) {
  if (!value) {
    return "No date";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function renderActivityCards(target, items, emptyTitle, emptyCopy) {
  if (!target) {
    return;
  }
  if (!items.length) {
    target.innerHTML = `<div class="empty-state"><h4>${escapeHtml(emptyTitle)}</h4><p>${escapeHtml(emptyCopy)}</p></div>`;
    return;
  }

  target.innerHTML = items
    .map(
      (item) => `
        <article class="activity-card">
          <div class="activity-head">
            <div>
              <h4>${escapeHtml(item.title || "Untitled activity")}</h4>
              <p class="microcopy">${escapeHtml(
                [item.studentName, item.className, item.status].filter(Boolean).join(" · ") || item.type || "workspace",
              )}</p>
            </div>
            <div class="activity-actions">
              <span class="queue-badge">${escapeHtml(formatActivityTime(item.createdAt || item.dueDate || `${item.dueDate || ""}${item.dueTime ? `T${item.dueTime}` : ""}`))}</span>
              <button class="ghost-button activity-delete-button" type="button" data-delete-activity="${escapeHtml(item.id || "")}">Delete</button>
            </div>
          </div>
          <p>${escapeHtml(item.description || "No additional notes recorded.")}</p>
          ${
            item.dueDate
              ? `<p class="microcopy">Due: ${escapeHtml(formatActivityTime(`${item.dueDate}${item.dueTime ? `T${item.dueTime}` : ""}`))}</p>`
              : ""
          }
        </article>
      `,
    )
    .join("");
}

function renderWorkspacePanels() {
renderActivityCards(
    historyList,
    workspaceActivities.filter((item) =>
      ["teaching_pack", "repurpose", "admin_ready", "progress_summary", "roster_import", "profile_update"].includes(item.type),
    ),
    "No saved work yet",
    "Generated teaching packs, repurpose outputs, summaries, and admin-ready versions will appear here.",
  );

  renderActivityCards(
    communicationsList,
    workspaceActivities.filter((item) => ["email_draft", "calendar_reminder", "communication_note"].includes(item.type)),
    "No communication activity yet",
    "Email drafts, reminders, and follow-up notes will appear here by student.",
  );

  renderActivityCards(
    alertsList,
    workspaceActivities.filter((item) => item.type === "alert"),
    "No alerts saved",
    "Create teacher alerts here so follow-up actions are not lost between classes.",
  );
}

[historyList, communicationsList, alertsList].forEach((target) => {
  target?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete-activity]");
    if (!button) {
      return;
    }
    deleteWorkspaceActivity(button.dataset.deleteActivity).catch((error) => {
      setAlertStatus(error.message, "error");
    });
  });
});

function appendChatBubble(role, message) {
  if (!refineChatLog) {
    return;
  }
  const bubble = document.createElement("article");
  bubble.className = `chat-bubble ${role}`;
  bubble.textContent = message;
  refineChatLog.appendChild(bubble);
  refineChatLog.scrollTop = refineChatLog.scrollHeight;
}

async function refinePlanningContext(prompt) {
  if (!lastPlanningContext) {
    return { message: "Generate a teaching pack or repurpose output first so TeacherFlowAI has something to refine." };
  }

  const lower = prompt.toLowerCase();
  const refinementNotes = [];
  if (lower.includes("interactive")) {
    refinementNotes.push("Add a turn-and-talk, one live check-for-understanding poll, and one student whiteboard response before independent work.");
  }
  if (lower.includes("rigor") || lower.includes("higher")) {
    refinementNotes.push("Increase rigor by adding one justify-your-thinking question and one transfer task that requires students to explain why the strategy works.");
  }
  if (lower.includes("python") || lower.includes("iteration") || lower.includes("coding")) {
    refinementNotes.push("Tighten the coding examples, trace output line by line, and add stronger debugging tasks.");
  }
  if (lower.includes("slide") || lower.includes("ppt")) {
    refinementNotes.push("Rebuild the slide flow so each slide has a clearer teaching move and stronger visual organization.");
  }
  if (lower.includes("differentiat")) {
    refinementNotes.push("Differentiate with one scaffolded prompt, one on-level task, and one extension challenge for early finishers.");
  }
  if (!refinementNotes.length) {
    refinementNotes.push(`Refine the current ${lastPlanningContext.type.replaceAll("_", " ")} by tightening directions, clarifying teacher moves, and making the student task more immediately usable.`);
  }

  if (lastPlanningContext.type === "teaching_pack") {
    const nextValues = {
      ...lastPlanningContext.values,
      goal: `${lastPlanningContext.values.goal} Refinement notes: ${refinementNotes.join(" ")}`,
      topic: lower.includes("python") || lower.includes("iteration") ? `${lastPlanningContext.values.topic} with Python iteration focus` : lastPlanningContext.values.topic,
    };
    const cards = buildTeachingPack(nextValues);
    renderOutputCards(teachingPackOutput, cards);
    lastPlanningContext = { ...lastPlanningContext, values: nextValues };
    return { message: refinementNotes.join(" ") };
  }

  if (lastPlanningContext.type === "repurpose_backend") {
    const nextValues = {
      ...lastPlanningContext.values,
      resourceText: lastPlanningContext.values.resourceText,
    };
    const payload = await requestAssessmentTransform(nextValues, lastPlanningContext.fileMeta, prompt);
    renderOutputCards(repurposeOutput, buildAssessmentTransformCards(payload));
    lastPlanningContext = { ...lastPlanningContext, values: nextValues };
    return {
      message: `Rebuilt the assessment with this refinement: ${prompt}`,
    };
  }

  if (lastPlanningContext.type === "repurpose") {
    const nextValues = {
      ...lastPlanningContext.values,
      resourceText: `${lastPlanningContext.values.resourceText}\n\nRefinement request:\n${prompt}`,
    };
    const cards = buildRepurposeOutput(nextValues);
    renderOutputCards(repurposeOutput, cards);
    lastPlanningContext = { ...lastPlanningContext, values: nextValues };
    return { message: refinementNotes.join(" ") };
  }

  return { message: refinementNotes.join(" ") };
}

function renderAll() {
  renderSupportWorkspace();
  renderClassSummary();
  renderClassSettings();
  renderRosterManager();
  renderWorkspacePanels();
}

repurposeFile?.addEventListener("change", () => {
  setRepurposeFileStatus(repurposeFile.files?.[0] ? `${repurposeFile.files[0].name} selected.` : "No file selected.");
});

clearRepurposeFileButton?.addEventListener("click", () => {
  if (repurposeFile) {
    repurposeFile.value = "";
  }
  setRepurposeFileStatus("No file selected.");
});

function closeMobileNav() {
  navMenu?.classList.remove("open");
  navToggle?.setAttribute("aria-expanded", "false");
}

async function restoreSession() {
  try {
    const payload = await apiRequest("/api/auth/session", { method: "GET", headers: {} });
    if (payload.authenticated) {
      applyTeacherProfile(payload.user);
    } else {
      applyTeacherProfile(null);
    }
  } catch {
    applyTeacherProfile(null);
  }
}

teachingPackForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(teachingPackForm);
  const values = {
    topic: formData.get("topic").toString().trim(),
    className: formData.get("className").toString().trim(),
    gradeLevel: formData.get("gradeLevel").toString().trim(),
    duration: formData.get("duration").toString().trim(),
    goal: formData.get("goal").toString().trim(),
    challengeLevel: formData.get("challengeLevel").toString().trim(),
    activityStyle: formData.get("activityStyle").toString().trim(),
  };
  renderOutputCards(teachingPackOutput, buildTeachingPack(values));
  lastPlanningContext = {
    type: "teaching_pack",
    values,
  };
  logWorkspaceActivity({
    type: "teaching_pack",
    title: `Generated teaching pack for ${values.topic}`,
    description: `Created a lesson pack for ${values.className} with goal: ${values.goal}`,
    className: values.className,
    status: "generated",
  });
});

subPlanForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(subPlanForm);
  const uploadedFile = subPlanFile?.files?.[0] || null;
  const coverageMode = formData.get("coverageMode").toString().trim();
  if (coverageMode === "assessment" && !uploadedFile) {
    renderOutputCards(subPlanOutput, [
      {
        title: "Assessment needed",
        content: "<p>Upload the quiz, test, or worksheet the substitute should use. If you want TeacherFlowAI to create the materials, switch the coverage mode to let TeacherFlowAI create the lesson materials.</p>",
      },
    ]);
    return;
  }
  let assessmentSummary = "";
  if (uploadedFile) {
    assessmentSummary = `${uploadedFile.name} uploaded by teacher for substitute use.`;
  }
  const values = {
    className: formData.get("className").toString().trim(),
    classHour: formData.get("classHour").toString().trim(),
    topic: formData.get("topic").toString().trim(),
    duration: formData.get("duration").toString().trim(),
    priorKnowledge: formData.get("priorKnowledge").toString().trim(),
    coverageGoal: formData.get("coverageGoal").toString().trim(),
    subRole: formData.get("subRole").toString().trim(),
    coverageMode,
    behaviorNotes: formData.get("behaviorNotes").toString().trim(),
    materials: formData.get("materials").toString().trim(),
    lessonVideo: formData.get("lessonVideo").toString().trim(),
    submissionNotes: formData.get("submissionNotes").toString().trim(),
    assessmentSummary,
  };
  renderOutputCards(subPlanOutput, buildSubPlan(values));
  logWorkspaceActivity({
    type: "teaching_pack",
    title: `Generated sub plan for ${values.className}`,
    description: `Created a substitute coverage plan for ${values.classHour} on ${values.topic}.`,
    className: values.className,
    status: "generated",
  });
});

repurposeForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(repurposeForm);
  const uploadedFile = repurposeFile?.files?.[0] || null;
  const values = {
    sourceType: formData.get("sourceType").toString(),
    targetType: formData.get("targetType").toString(),
    resourceText: formData.get("resourceText").toString().trim(),
  };

  if (!values.resourceText && !uploadedFile) {
    renderOutputCards(repurposeOutput, [
      {
        title: "Nothing to transform yet",
        content: "<p>Paste an existing resource or upload a file before generating a transformed version.</p>",
      },
    ]);
    return;
  }

  try {
    let fileMeta = null;
    if (uploadedFile) {
      fileMeta = {
        name: uploadedFile.name,
        type: uploadedFile.type,
        data: await readFileAsBase64(uploadedFile),
      };
    }

    if (shouldUseAssessmentTransform(values, fileMeta)) {
      const payload = await requestAssessmentTransform(values, fileMeta);
      renderOutputCards(repurposeOutput, buildAssessmentTransformCards(payload));
      lastPlanningContext = {
        type: "repurpose_backend",
        values,
        fileMeta,
      };
      return;
    }

    renderOutputCards(
      repurposeOutput,
      buildRepurposeOutput(values),
    );
    lastPlanningContext = {
      type: "repurpose",
      values,
    };
    logWorkspaceActivity({
      type: "repurpose",
      title: `Repurposed ${values.sourceType} into ${values.targetType}`,
      description: values.resourceText.slice(0, 240),
      status: "generated",
    });
  } catch (error) {
    renderOutputCards(repurposeOutput, [
      {
        title: "Transformation error",
        content: `<p>${escapeHtml(error.message || "TeacherFlowAI could not transform that resource.")}</p>`,
      },
    ]);
  }
});

adminReadyForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(adminReadyForm);
  const values = {
    lessonText: formData.get("lessonText").toString().trim(),
    standards: formData.get("standards").toString().trim(),
    focus: formData.get("focus").toString().trim(),
  };
  renderOutputCards(
    adminReadyOutput,
    buildAdminReadyOutput(values),
  );
  logWorkspaceActivity({
    type: "admin_ready",
    title: "Generated observation/admin-ready version",
    description: `Observation focus: ${values.focus || "Not specified"}${values.standards ? ` · Standards: ${values.standards}` : ""}`,
    status: "generated",
  });
});

signInTab?.addEventListener("click", () => showAuthMode("signin"));
createAccountTab?.addEventListener("click", () => showAuthMode("create"));
resetTab?.addEventListener("click", () => showAuthMode("reset"));

signInForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(signInForm);
  try {
    const payload = await apiRequest("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({
        email: formData.get("email").toString().trim(),
        password: formData.get("password").toString(),
      }),
    });
    applyTeacherProfile(payload.user);
    await loadProfile();
    await loadEmailSettings();
    await loadStudents();
    await loadWorkspace();
    renderAll();
    setAuthStatus("", "neutral");
  } catch (error) {
    setAuthStatus(error.message, "error");
  }
});

createAccountForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(createAccountForm);
  try {
    const payload = await apiRequest("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        email: formData.get("email").toString().trim(),
        name: formData.get("name").toString().trim(),
        school: formData.get("school").toString().trim(),
        password: formData.get("password").toString(),
      }),
    });
    applyTeacherProfile(payload.user);
    await loadProfile();
    await loadEmailSettings();
    await loadWorkspace();
    students = [];
    renderAll();
    setAuthStatus("", "neutral");
  } catch (error) {
    setAuthStatus(error.message, "error");
  }
});

resetRequestForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(resetRequestForm);
  try {
    const payload = await apiRequest("/api/auth/password-reset/request", {
      method: "POST",
      body: JSON.stringify({ email: formData.get("email").toString().trim() }),
    });
    setAuthStatus(payload.message || "If that account exists, a password reset email has been sent.", "success");
  } catch (error) {
    setAuthStatus(error.message, "error");
  }
});

resetConfirmForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(resetConfirmForm);
  try {
    await apiRequest("/api/auth/password-reset/confirm", {
      method: "POST",
      body: JSON.stringify({
        email: formData.get("email").toString().trim(),
        token: formData.get("token").toString().trim(),
        password: formData.get("password").toString(),
      }),
    });
    await restoreSession();
    await loadProfile();
    await loadEmailSettings();
    await loadWorkspace();
    await loadStudents();
    renderAll();
    setAuthStatus("Password updated and you are signed in.", "success");
  } catch (error) {
    setAuthStatus(error.message, "error");
  }
});

googleSignInButton?.addEventListener("click", () => {
  window.location.href = "/api/auth/google/start";
});

googleCreateButton?.addEventListener("click", () => {
  window.location.href = "/api/auth/google/start";
});

signOutButton?.addEventListener("click", async () => {
  try {
    await apiRequest("/api/auth/signout", { method: "POST", body: JSON.stringify({}) });
  } catch {
    // ignore signout request failure
  }
  applyTeacherProfile(null);
  workspaceActivities = [];
  students = getDefaultStudents();
  selectedStudentId = students[0]?.student_id || "";
  renderAll();
  showAuthMode("signin");
  setAuthStatus("Signed out. Sign in again with your work email to reopen the workspace.", "success");
  window.setTimeout(() => {
    window.location.assign("/");
  }, 80);
});

studentSearch?.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderAll();
});

studentSort?.addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderAll();
});

priorityFilters?.addEventListener("click", (event) => {
  const button = event.target.closest(".filter-chip");
  if (!button) {
    return;
  }
  state.filter = button.dataset.filter;
  setActiveFilterChip(state.filter);
  renderAll();
});

moduleTabs?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-module]");
  if (!button) {
    return;
  }
  setActiveModule(button.dataset.module);
});

settingsTabs?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-settings-tab]");
  if (!button) {
    return;
  }
  setActiveSettingsTab(button.dataset.settingsTab);
});

profileForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const payload = await apiRequest("/api/profile", {
      method: "PATCH",
      body: JSON.stringify({
        name: profileName.value.trim(),
        school: profileSchool.value.trim(),
        title: profileTitle.value.trim(),
        department: profileDepartment.value.trim(),
        phone: profilePhone.value.trim(),
        preferredView: profilePreferredView.value,
      }),
    });
    applyTeacherProfile(payload.profile);
    await loadWorkspace();
    renderAll();
    setProfileStatus("Profile saved.", "success");
  } catch (error) {
    setProfileStatus(error.message, "error");
  }
});

emailSettingsForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const payload = await apiRequest("/api/settings/email", {
      method: "PATCH",
      body: JSON.stringify({
        host: emailHost?.value.trim(),
        port: Number(emailPort?.value || 587),
        secure: emailSecure?.value === "true",
        username: emailUsername?.value.trim(),
        fromAddress: emailFromAddress?.value.trim(),
        password: emailPassword?.value || "",
      }),
    });
    applyEmailSettings(payload.emailSettings);
    setEmailSettingsStatus("Email provider saved.", "success");
    await loadWorkspace();
    renderWorkspacePanels();
  } catch (error) {
    setEmailSettingsStatus(error.message, "error");
  }
});

sendTestEmailButton?.addEventListener("click", async () => {
  try {
    const payload = await apiRequest("/api/settings/email/test", {
      method: "POST",
      body: JSON.stringify({
        to: emailTestRecipient?.value.trim() || teacherProfile?.email || "",
      }),
    });
    setEmailSettingsStatus(payload.message || "Test email sent.", "success");
  } catch (error) {
    setEmailSettingsStatus(error.message, "error");
  }
});

alertForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(alertForm);
  const alertRecord = {
    type: "alert",
    title: formData.get("title").toString().trim(),
    description: formData.get("description").toString().trim(),
    dueDate: formData.get("dueDate").toString().trim(),
    dueTime: formData.get("dueTime").toString().trim(),
    status: "open",
  };
  await logWorkspaceActivity({
    ...alertRecord,
  });
  if (formData.get("calendarSync").toString() === "google" && alertRecord.dueDate) {
    openAlertCalendarEvent(alertRecord);
  }
  alertForm.reset();
  setAlertStatus(
    formData.get("calendarSync").toString() === "google" && alertRecord.dueDate
      ? "Alert saved and opened in Google Calendar for your signed-in work account."
      : "Alert saved to TeacherFlowAI. Use Google Calendar sync when you want it to appear in Calendar.",
    "success",
  );
});

refineForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(refineForm);
  const prompt = formData.get("prompt").toString().trim();
  if (!prompt) {
    return;
  }
  appendChatBubble("user", prompt);
  const response = await refinePlanningContext(prompt);
  appendChatBubble("system", response.message);
  await logWorkspaceActivity({
    type: "planning_refine",
    title: "Refined planning output",
    description: `Prompt: ${prompt}\nResponse: ${response.message}`,
    status: "refined",
  });
  refineForm.reset();
});

navToggle?.addEventListener("click", () => {
  const isOpen = navMenu?.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

navMenu?.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    closeMobileNav();
  }
});

document.addEventListener("click", (event) => {
  if (!navMenu || !navToggle || !navMenu.classList.contains("open")) {
    return;
  }
  if (event.target.closest("#nav-menu") || event.target.closest("#nav-toggle")) {
    return;
  }
  closeMobileNav();
});

moduleJumpButtons.forEach((button) => {
  button.addEventListener("click", () => setActiveModule(button.dataset.module));
});

document.addEventListener("click", (event) => {
  const deleteActivityButton = event.target.closest("[data-delete-activity]");
  if (deleteActivityButton) {
    deleteWorkspaceActivity(deleteActivityButton.dataset.deleteActivity).catch(() => {});
    return;
  }

  const copyButton = event.target.closest(".copy-resource-button");
  if (copyButton) {
    const payload = copyButton.dataset.copy || "";
    navigator.clipboard
      ?.writeText(payload)
      .then(() => {
        copyButton.textContent = "Copied";
        window.setTimeout(() => {
          copyButton.textContent = copyButton.dataset.label || "Copy";
        }, 1200);
      })
      .catch(() => {});
    return;
  }

  const plannerButton = event.target.closest("[data-plan-template]");
  if (plannerButton) {
    buildLessonPackFromTemplate(plannerButton.dataset.planTemplate);
    setActiveModule("teaching-pack");
    return;
  }

  const selectButton = event.target.closest("[data-student-select]");
  if (selectButton) {
    selectedStudentId = selectButton.dataset.studentSelect;
    renderSupportWorkspace();
    return;
  }

  const actionButton = event.target.closest(".student-action-button");
  if (!actionButton) {
    return;
  }

  const student = getScoredStudents().find((item) => item.student_id === actionButton.dataset.studentId);
  if (!student) {
    return;
  }

  if (actionButton.dataset.action === "email") {
    openGmailDraft(student);
    logWorkspaceActivity({
      type: "email_draft",
      title: `Drafted outreach for ${student.student_name}`,
      description: `Prepared Gmail draft for ${student.class_name}.`,
      studentId: student.student_id,
      studentName: student.student_name,
      className: student.class_name,
      status: "drafted",
    });
    const panel = document.querySelector(`[data-panel="email"][data-student-id="${student.student_id}"]`);
    if (panel) {
      panel.classList.remove("is-hidden");
    }
    return;
  }

  if (actionButton.dataset.action === "calendar") {
    openCalendarReminder(student);
    logWorkspaceActivity({
      type: "calendar_reminder",
      title: `Created reminder for ${student.student_name}`,
      description: student.intervention,
      studentId: student.student_id,
      studentName: student.student_name,
      className: student.class_name,
      status: "scheduled",
    });
    return;
  }

  const panel = document.querySelector(`[data-panel="${actionButton.dataset.action}"][data-student-id="${student.student_id}"]`);
  if (panel) {
    panel.classList.toggle("is-hidden");
  }
  if (actionButton.dataset.action === "summary") {
    logWorkspaceActivity({
      type: "progress_summary",
      title: `Generated progress summary for ${student.student_name}`,
      description: student.progressSummary,
      studentId: student.student_id,
      studentName: student.student_name,
      className: student.class_name,
      status: "saved",
    });
  }
});

clearHistoryButton?.addEventListener("click", () => {
  clearWorkspaceScope("history").catch(() => {});
});

clearCommunicationsButton?.addEventListener("click", () => {
  clearWorkspaceScope("communications").catch(() => {});
});

clearAlertsButton?.addEventListener("click", () => {
  clearWorkspaceScope("alerts").catch(() => {});
});

classIntelSelect?.addEventListener("change", () => {
  selectedInsightsClass = classIntelSelect.value;
  renderClassSummary();
});

rosterClassSelect?.addEventListener("change", () => {
  selectedRosterClass = rosterClassSelect.value;
  renderRosterManager();
});

rosterTable?.addEventListener("submit", async (event) => {
  const form = event.target.closest("[data-roster-form]");
  if (!form) {
    return;
  }
  event.preventDefault();
  const formData = new FormData(form);
  const studentId = form.dataset.rosterForm;

  try {
    await saveRosterStudent(studentId, {
      advisor_email: formData.get("advisor_email").toString().trim(),
      parent_email: formData.get("parent_email").toString().trim(),
      teacher_notes: formData.get("teacher_notes").toString().trim(),
    });
    setImportStatus(`Saved contact updates for ${studentId}.`, "success");
    const student = students.find((item) => item.student_id === studentId);
    if (student) {
      logWorkspaceActivity({
        type: "communication_note",
        title: `Updated contact details for ${student.student_name}`,
        description: "Advisor email, parent email, or teacher notes were updated in the roster manager.",
        studentId: student.student_id,
        studentName: student.student_name,
        className: student.class_name,
        status: "updated",
      });
    }
  } catch (error) {
    setImportStatus(error.message, "error");
  }
});

pasteImportButton?.addEventListener("click", async () => {
  const text = pasteImport.value.trim();
  if (!text) {
    setImportStatus("Paste CSV or TSV rows before importing.", "error");
    return;
  }
  try {
    await importStudents(text, text.includes("\t") ? "TSV paste" : "CSV paste");
  } catch (error) {
    setImportStatus(error.message, "error");
  }
});

csvUpload?.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }
  try {
    setImportStatus(`Uploading ${file.name}...`, "neutral");
    await importStudents(await file.text(), file.name.endsWith(".tsv") ? "TSV" : "CSV");
  } catch (error) {
    setImportStatus(error.message, "error");
  }
  csvUpload.value = "";
});

async function initializeApp() {
  createSampleDownload();
  consumeAuthFlash();
  showAuthMode("signin");
  setActiveFilterChip(state.filter);
  setActiveModule(activeModule);
  setActiveSettingsTab(activeSettingsTab);
  setupScrollReveal();
  try {
    await restoreSession();
    if (teacherProfile) {
      await loadProfile();
      await loadEmailSettings();
      await loadStudents();
      await loadWorkspace();
    } else {
      students = getDefaultStudents();
      selectedStudentId = students[0]?.student_id || "";
    }
  } catch {
    students = getDefaultStudents();
    selectedStudentId = students[0]?.student_id || "";
  }
  sessionReady = true;
  applyAuthState();
  renderAll();
}

initializeApp();
