const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const os = require("os");
const net = require("net");
const tls = require("tls");
const { execFileSync } = require("child_process");
const { URL } = require("url");

const ROOT = __dirname;
loadEnvFile(path.join(ROOT, ".env"));

const DATA_DIR = path.join(ROOT, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const STUDENTS_FILE = path.join(DATA_DIR, "students.json");
const ACTIVITIES_FILE = path.join(DATA_DIR, "activities.json");
const PORT = Number(process.env.PORT || 3000);
const SESSION_SECRET = process.env.SESSION_SECRET || "teacherflowai-dev-secret";
const APP_BASE_URL = process.env.APP_BASE_URL || "";
const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = Number(process.env.SMTP_PORT || 0);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const SMTP_SECURE = parseBooleanEnv(process.env.SMTP_SECURE);
const MAIL_FROM = process.env.MAIL_FROM || "";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "";
const SESSION_COOKIE = "teacherflowai_session";
const OAUTH_COOKIE = "teacherflowai_oauth_state";
const sessions = new Map();
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
const KNOWN_SECTION_NAMES = [
  "warm-up",
  "warm up",
  "concept check",
  "trace the code",
  "fix the code",
  "build the code",
  "independent practice",
  "guided practice",
  "challenge",
  "challenge problems",
  "reflection",
  "multiple choice",
  "short answer",
  "coding",
];

ensureDataStore();

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, getOrigin(req));

    if (req.method === "GET" && url.pathname === "/healthz") {
      json(res, 200, { ok: true, service: "teacherflowai" });
      return;
    }

    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
      return;
    }

    await serveStatic(req, res, url);
  } catch (error) {
    json(res, 500, {
      error: "Internal server error",
      detail: error.message,
    });
  }
});

server.listen(PORT, () => {
  console.log(`TeacherFlowAI running on http://localhost:${PORT}`);
});

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    if (!key || process.env[key] != null) {
      continue;
    }

    let value = line.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

function ensureDataStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, "[]\n", "utf8");
  }
  if (!fs.existsSync(STUDENTS_FILE)) {
    fs.writeFileSync(STUDENTS_FILE, "{}\n", "utf8");
  }
  if (!fs.existsSync(ACTIVITIES_FILE)) {
    fs.writeFileSync(ACTIVITIES_FILE, "{}\n", "utf8");
  }
}

function parseBooleanEnv(value) {
  if (value == null || value === "") {
    return null;
  }
  return ["1", "true", "yes", "on"].includes(String(value).trim().toLowerCase());
}

function getOrigin(req) {
  const proto = req.headers["x-forwarded-proto"] || "http";
  return `${proto}://${req.headers.host}`;
}

function json(res, statusCode, payload, extraHeaders = {}) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...extraHeaders,
  });
  res.end(JSON.stringify(payload));
}

function parseCookies(req) {
  const raw = req.headers.cookie || "";
  return raw.split(";").reduce((cookies, chunk) => {
    const [name, ...rest] = chunk.trim().split("=");
    if (!name) {
      return cookies;
    }
    cookies[name] = decodeURIComponent(rest.join("="));
    return cookies;
  }, {});
}

function createCookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (options.httpOnly) {
    parts.push("HttpOnly");
  }
  if (options.path) {
    parts.push(`Path=${options.path}`);
  }
  if (options.sameSite) {
    parts.push(`SameSite=${options.sameSite}`);
  }
  if (options.maxAge != null) {
    parts.push(`Max-Age=${options.maxAge}`);
  }
  return parts.join("; ");
}

function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    return fallback;
  }
}

function writeJson(filePath, payload) {
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function readUsers() {
  return readJson(USERS_FILE, []);
}

function writeUsers(users) {
  writeJson(USERS_FILE, users);
}

function readStudentsStore() {
  return readJson(STUDENTS_FILE, {});
}

function writeStudentsStore(store) {
  writeJson(STUDENTS_FILE, store);
}

function readActivitiesStore() {
  return readJson(ACTIVITIES_FILE, {});
}

function writeActivitiesStore(store) {
  writeJson(ACTIVITIES_FILE, store);
}

function sanitizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    school: user.school || "",
    title: user.title || "",
    department: user.department || "",
    phone: user.phone || "",
    preferredView: user.preferredView || "desktop",
    authProvider: user.authProvider || "local",
  };
}

function sanitizeEmailSettings(settings = {}) {
  const normalized = getDecryptedEmailSettings(settings);
  const host = String(normalized.host || "").trim();
  const port = Number(normalized.port || 0);
  const secure = normalized.secure == null ? false : Boolean(normalized.secure);
  const username = String(normalized.username || "").trim();
  const fromAddress = String(normalized.fromAddress || "").trim();
  const password = String(normalized.password || "");

  return {
    configured: Boolean(host && username && password),
    host,
    port: port > 0 ? port : 587,
    secure,
    username,
    fromAddress,
    hasPassword: Boolean(password),
  };
}

function getDefaultEmailSettings() {
  return {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    username: "",
    fromAddress: "",
    password: "",
  };
}

function deriveSecretKey() {
  return crypto.createHash("sha256").update(String(SESSION_SECRET || "teacherflowai-dev-secret")).digest();
}

function encryptSecret(value) {
  if (!value) {
    return "";
  }
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", deriveSecretKey(), iv);
  const encrypted = Buffer.concat([cipher.update(String(value), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return ["enc1", iv.toString("base64"), tag.toString("base64"), encrypted.toString("base64")].join(":");
}

function decryptSecret(value) {
  const raw = String(value || "");
  if (!raw) {
    return "";
  }
  if (!raw.startsWith("enc1:")) {
    return raw;
  }
  const [, ivBase64, tagBase64, encryptedBase64] = raw.split(":");
  if (!ivBase64 || !tagBase64 || !encryptedBase64) {
    return "";
  }
  try {
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      deriveSecretKey(),
      Buffer.from(ivBase64, "base64"),
    );
    decipher.setAuthTag(Buffer.from(tagBase64, "base64"));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedBase64, "base64")),
      decipher.final(),
    ]);
    return decrypted.toString("utf8");
  } catch {
    return "";
  }
}

function getDecryptedEmailSettings(settings = {}) {
  return {
    ...settings,
    password: decryptSecret(settings.password || ""),
  };
}

function getEncryptedEmailSettings(settings = {}) {
  return {
    ...settings,
    password: encryptSecret(settings.password || ""),
  };
}

function normalizeEmailSettingsInput(input = {}, existing = {}) {
  const current = {
    ...getDefaultEmailSettings(),
    ...getDecryptedEmailSettings(existing),
  };
  const next = {
    host: String(input.host ?? current.host ?? "").trim(),
    port: Number(input.port ?? current.port ?? 587) || 587,
    secure:
      input.secure == null
        ? current.secure == null
          ? false
          : Boolean(current.secure)
        : Boolean(input.secure),
    username: normalizeEmail(input.username ?? current.username ?? ""),
    fromAddress: normalizeEmail(input.fromAddress ?? current.fromAddress ?? ""),
    password:
      input.password == null || input.password === ""
        ? String(current.password || "")
        : String(input.password),
  };

  return next;
}

function resolveEmailSettings(config = null) {
  const candidate = config && typeof config === "object" ? getDecryptedEmailSettings(config) : {};
  const host = String(candidate.host || SMTP_HOST || "").trim();
  const port = Number(candidate.port || SMTP_PORT || 0) || 587;
  const secure = candidate.secure == null ? (SMTP_SECURE == null ? port === 465 : SMTP_SECURE) : Boolean(candidate.secure);
  const username = String(candidate.username || SMTP_USER || "").trim();
  const password = String(candidate.password || SMTP_PASS || "");
  const fromAddress = String(candidate.fromAddress || MAIL_FROM || username || "no-reply@teacherflowai.local").trim();

  return {
    host,
    port,
    secure,
    username,
    password,
    fromAddress,
    configured: Boolean(host && username && password),
  };
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

function validateStudentRecord(record) {
  for (const header of REQUIRED_HEADERS) {
    if (!(header in record)) {
      return `Missing required field: ${header}`;
    }
  }
  if (!String(record.student_id || "").trim()) {
    return "student_id is required";
  }
  if (!String(record.student_name || "").trim()) {
    return "student_name is required";
  }
  if (!String(record.class_name || "").trim()) {
    return "class_name is required";
  }
  return null;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "resource";
}

function normalizeImportedText(text) {
  return String(text || "")
    .replace(/\r/g, "")
    .replace(/\t/g, "    ")
    .replace(/\u0000/g, " ")
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function looksLikeRawPdfPayload(text) {
  const sample = String(text || "").slice(0, 600);
  return /%PDF-\d\.\d/.test(sample) || /endobj/.test(sample) || /\/Type\s*\/Page/.test(sample);
}

function stripHtml(html) {
  return normalizeImportedText(
    String(html || "")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|section|article|li|tr|h\d)>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">"),
  );
}

function writeTempUpload(fileName, buffer) {
  const extension = path.extname(fileName || "").toLowerCase() || ".bin";
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "teacherflowai-"));
  const tempPath = path.join(tempDir, `upload${extension}`);
  fs.writeFileSync(tempPath, buffer);
  return {
    tempDir,
    tempPath,
  };
}

function cleanupTempUpload(tempDir) {
  if (!tempDir || !fs.existsSync(tempDir)) {
    return;
  }
  fs.rmSync(tempDir, { recursive: true, force: true });
}

function extractDocTextWithTextutil(filePath) {
  try {
    return execFileSync("/usr/bin/textutil", ["-convert", "txt", "-stdout", filePath], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      maxBuffer: 1024 * 1024 * 8,
    });
  } catch (error) {
    return "";
  }
}

function extractPdfText(filePath) {
  const swiftCacheDir = path.join(ROOT, "data", "swift-cache");
  if (!fs.existsSync(swiftCacheDir)) {
    fs.mkdirSync(swiftCacheDir, { recursive: true });
  }

  try {
    const swiftSource = `
      import Foundation
      import PDFKit

      let path = CommandLine.arguments[1]
      guard let document = PDFDocument(url: URL(fileURLWithPath: path)) else {
        exit(1)
      }

      var output = ""
      for index in 0..<document.pageCount {
        if let pageText = document.page(at: index)?.string {
          output += pageText + "\\n\\n"
        }
      }
      print(output)
    `;
    const pdfText = execFileSync("/usr/bin/swift", ["-e", swiftSource, filePath], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      maxBuffer: 1024 * 1024 * 12,
      env: {
        ...process.env,
        CLANG_MODULE_CACHE_PATH: swiftCacheDir,
      },
    });
    if (normalizeImportedText(pdfText)) {
      return pdfText;
    }
  } catch (error) {
    // fall through to metadata extraction
  }

  try {
    const metadata = execFileSync("/usr/bin/mdls", ["-raw", "-name", "kMDItemTextContent", filePath], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      maxBuffer: 1024 * 1024 * 8,
    }).trim();
    if (metadata && metadata !== "(null)") {
      return metadata;
    }
  } catch (error) {
    return "";
  }
  return "";
}

function extractTextFromUpload(fileName, mimeType, fileData) {
  const extension = path.extname(fileName || "").toLowerCase();
  const buffer = Buffer.from(String(fileData || ""), "base64");
  const fallbackText = normalizeImportedText(buffer.toString("utf8"));

  if (!buffer.length) {
    return {
      parser: "empty",
      text: "",
    };
  }

  if ([".txt", ".md", ".csv", ".tsv", ".json"].includes(extension)) {
    return { parser: "plain_text", text: fallbackText };
  }

  if ([".html", ".htm"].includes(extension) || String(mimeType || "").includes("html")) {
    return { parser: "html", text: stripHtml(buffer.toString("utf8")) };
  }

  const { tempDir, tempPath } = writeTempUpload(fileName, buffer);
  try {
    if ([".docx", ".doc", ".rtf"].includes(extension)) {
      const docText = normalizeImportedText(extractDocTextWithTextutil(tempPath));
      return { parser: "textutil", text: docText || fallbackText };
    }

    if (extension === ".pdf" || String(mimeType || "").includes("pdf")) {
      const pdfText = normalizeImportedText(extractPdfText(tempPath));
      return {
        parser: "pdf_extract",
        text: looksLikeRawPdfPayload(pdfText) ? "" : pdfText,
      };
    }
  } finally {
    cleanupTempUpload(tempDir);
  }

  return {
    parser: "fallback_binary_decode",
    text: looksLikeRawPdfPayload(fallbackText) ? "" : fallbackText,
  };
}

function inferAssessmentContext(text) {
  const lower = text.toLowerCase();
  const gradeMatch = text.match(/(?:grade|for)\s+(\d{1,2})(?:th|st|nd|rd)?/i);
  const durationMatch = text.match(/(\d+)\s*minutes?/i);
  const course =
    /ap csp|ap computer science principles/i.test(text)
      ? "AP CSP"
      : /algebra\s*2|algebra ii/i.test(text)
        ? "Algebra II"
        : /biology/i.test(text)
          ? "Biology"
          : /python/i.test(text)
            ? "Computer Science"
            : "Classroom";
  const topic =
    /while loop|while loops/i.test(text)
      ? "Iteration Using While Loops"
      : /for loop|for loops/i.test(text)
        ? "Iteration Using For Loops"
        : /quadratic/i.test(text)
          ? "Quadratic Functions"
          : /cellular respiration/i.test(text)
            ? "Cellular Respiration"
            : "Core Lesson Assessment";

  return {
    course,
    topic,
    gradeLevel: gradeMatch ? gradeMatch[1] : "",
    duration: durationMatch ? `${durationMatch[1]} minutes` : "",
  };
}

function isSectionHeading(line) {
  const normalized = line.trim().toLowerCase().replace(/[:\-]+$/, "");
  if (!normalized) {
    return false;
  }
  if (KNOWN_SECTION_NAMES.includes(normalized) || /^section\s+\d+/i.test(normalized)) {
    return true;
  }
  return /:$/.test(line.trim()) && normalized.split(/\s+/).length <= 14;
}

function getSectionDisplayType(title) {
  const normalized = String(title || "").toLowerCase();
  if (/code writing|coding|programming/.test(normalized)) {
    return "code_writing";
  }
  if (/short answer|multiple choice|assessment/.test(normalized)) {
    return "short_answer";
  }
  return "default";
}

function inferResponseLines(question, sectionTitle) {
  const text = [question.stem, ...question.body].join("\n");
  const sectionType = getSectionDisplayType(sectionTitle);
  if (question.options.length) {
    return 1;
  }
  if (sectionType === "code_writing" || /write code|draw|program|pseudocode|input|print\(|circle|set_position/i.test(text)) {
    return 7;
  }
  if (/what is printed|what is the output|what value is stored|where is the following point/i.test(text)) {
    return 3;
  }
  return 4;
}

function extractPoints(question, sectionTitle) {
  const text = [question.stem, ...question.body].join("\n");
  const explicit = text.match(/\((\d+)\s*points?\)/i);
  if (explicit) {
    return Number(explicit[1]);
  }
  if (/1 point per problem/i.test(sectionTitle)) {
    return 1;
  }
  if (getSectionDisplayType(sectionTitle) === "code_writing") {
    return 3;
  }
  return 1;
}

function extractAssessmentBlueprint(text) {
  const normalized = normalizeImportedText(text);
  const lines = normalized.split("\n");
  const sections = [];
  let currentSection = {
    title: "Assessment",
    displayTitle: "Assessment",
    questions: [],
  };
  let activeQuestion = null;

  const pushQuestion = () => {
    if (!activeQuestion) {
      return;
    }
    activeQuestion.body = activeQuestion.body.filter(Boolean);
    activeQuestion.options = activeQuestion.options.filter(Boolean);
    currentSection.questions.push(activeQuestion);
    activeQuestion = null;
  };

  const pushSection = () => {
    pushQuestion();
    if (currentSection.questions.length) {
      sections.push(currentSection);
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();
    if (!trimmed) {
      if (activeQuestion) {
        activeQuestion.body.push("");
      }
      continue;
    }

    if (isSectionHeading(trimmed)) {
      pushSection();
      currentSection = {
        title: trimmed.replace(/[:\-]+$/, ""),
        displayTitle: trimmed,
        questions: [],
      };
      continue;
    }

    if (/^#\s+question\b/i.test(trimmed)) {
      continue;
    }

    const questionMatch = trimmed.match(/^(?:question\s*)?(\d+)(?:[\.\)]\s+|\s+)(.+)/i);
    if (questionMatch) {
      pushQuestion();
      activeQuestion = {
        number: Number(questionMatch[1]),
        stem: questionMatch[2].trim(),
        body: [],
        options: [],
      };
      continue;
    }

    const optionMatch = trimmed.match(/^([A-D])[\.\)]\s+(.+)/);
    if (optionMatch && activeQuestion) {
      activeQuestion.options.push({
        label: optionMatch[1],
        text: optionMatch[2].trim(),
      });
      continue;
    }

    if (!activeQuestion) {
      continue;
    }

    activeQuestion.body.push(trimmed);
  }

  pushSection();

  if (!sections.length && normalized) {
    const paragraphs = normalized.split(/\n{2,}/).filter(Boolean);
    const questions = paragraphs.map((paragraph, index) => ({
      number: index + 1,
      stem: paragraph.split("\n")[0].trim(),
      body: paragraph.split("\n").slice(1),
      options: [],
    }));
    sections.push({
      title: "Assessment",
      displayTitle: "Assessment",
      questions,
    });
  }

  let questionCount = 0;
  let totalPoints = 0;
  sections.forEach((section) => {
    const sectionType = getSectionDisplayType(section.title);
    section.questions = section.questions.map((question) => {
      const content = [question.stem, ...question.body].join("\n");
      const type = question.options.length >= 2 ? "multiple_choice" : /print\(|while |for |def |input\(/i.test(content) ? "code" : "short_response";
      const difficulty =
        /challenge|extension/i.test(section.title)
          ? "challenge"
          : /warm-up|warm up/i.test(section.title)
            ? "easy"
            : "moderate";
      questionCount += 1;
      totalPoints += extractPoints(question, section.title);
      return {
        ...question,
        type,
        difficulty,
        prompts: content,
        points: extractPoints(question, section.title),
        responseLines: inferResponseLines(question, section.title),
        sectionType,
      };
    });
    section.totalPoints = section.questions.reduce((sum, question) => sum + (question.points || 0), 0);
  });

  return {
    title: lines.find((line) => line.trim() && !isSectionHeading(line.trim()))?.trim() || "Imported Assessment",
    sections,
    questionCount,
    totalPoints,
    resemblesTestSheet: /test\b|quiz\b|short answer|code writing|point per problem/i.test(normalized),
  };
}

function buildQuestionPrompt(question) {
  return [question.stem, ...question.body].filter(Boolean).join("\n");
}

function shiftNumericText(text, versionIndex, salt = 0) {
  const delta = versionIndex === 0 ? 2 + (salt % 3) : 5 + (salt % 4);
  return String(text).replace(/\b\d+\b/g, (value) => {
    const num = Number.parseInt(value, 10);
    if (!Number.isFinite(num)) {
      return value;
    }
    if (num >= 1900 && num <= 2100) {
      return value;
    }
    if (num === 0) {
      return versionIndex === 0 ? "1" : "2";
    }
    return String(num + delta);
  });
}

function swapSurfaceContext(text, versionIndex, questionNumber = 0) {
  const schoolContexts = ["robotics club", "school store", "library team", "art showcase", "science lab"];
  const techContexts = ["game studio", "music app", "sports analytics team", "video channel", "design lab"];
  const replacement = versionIndex === 0
    ? schoolContexts[questionNumber % schoolContexts.length]
    : techContexts[questionNumber % techContexts.length];

  return String(text)
    .replace(/\bstudent\b/gi, versionIndex === 0 ? "team member" : "designer")
    .replace(/\bclass\b/gi, versionIndex === 0 ? "club" : "project group")
    .replace(/\bschool\b/gi, versionIndex === 0 ? "campus" : "studio")
    .replace(/\bproject\b/gi, replacement);
}

function buildParallelStem(stem, versionIndex, questionNumber) {
  const versionTag = versionIndex === 0 ? "Version A" : "Version B";
  const contextLead = versionIndex === 0 ? "School scenario" : "Tech scenario";
  return `${contextLead}: ${swapSurfaceContext(shiftNumericText(stem, versionIndex, questionNumber), versionIndex, questionNumber)} (${versionTag})`;
}

function buildParallelBodyLines(lines, versionIndex, questionNumber) {
  return (lines || []).map((line) => swapSurfaceContext(shiftNumericText(line, versionIndex, questionNumber), versionIndex, questionNumber));
}

function buildDetailedKey(question) {
  return question.solvedAnswer || question.answer || "Accept any equivalent correct response.";
}

function rewriteWhileLoopQuestion(question, versionIndex) {
  const prompt = buildQuestionPrompt(question);
  const offset = versionIndex + 1;

  if (question.type === "multiple_choice") {
    return {
      ...question,
      stem: `Which statement best explains what this while loop does when the counter starts at ${offset}?`,
      body: [
        `counter = ${offset}`,
        `while counter < ${offset + 4}:`,
        `    print(counter)`,
        "    counter += 1",
      ],
      options: [
        { label: "A", text: `It prints ${offset} through ${offset + 3} and then stops.` },
        { label: "B", text: `It prints ${offset} through ${offset + 4} and then stops.` },
        { label: "C", text: "It creates an infinite loop because the condition never changes." },
        { label: "D", text: "It prints only the starting value one time." },
      ],
      answer: "A",
      solvedAnswer: `Correct choice: A. The loop starts at ${offset}, prints each value, increases by 1, and stops before ${offset + 4}.`,
      teacherNote: "Students should connect the condition to the update step.",
    };
  }

  if (question.type === "code" || /trace|predict output/i.test(prompt)) {
    return {
      ...question,
      stem: `Trace the program and record the output for Version ${versionIndex === 0 ? "A" : "B"}.`,
      body: [
        `total = ${offset}`,
        `step = ${offset + 1}`,
        `while step < ${offset + 5}:`,
        "    total = total + step",
        "    print(total)",
        "    step += 1",
      ],
      options: [],
      answer: `Expected outputs increase as the running total changes: ${offset + (offset + 1)}, ...`,
      solvedAnswer: `Trace the loop by updating total after each step. Students should list each printed running total in order until step reaches ${offset + 5}.`,
      teacherNote: "Watch for students who confuse the current step with the running total.",
    };
  }

  if (/fix|debug|bug|error|infinite loop/i.test(prompt)) {
    return {
      ...question,
      stem: "Fix the bug so the loop stops after printing four values.",
      body: [
        `count = ${offset}`,
        `while count <= ${offset + 3}:`,
        "    print(count)",
        "    # missing update",
      ],
      options: [],
      answer: "Add count += 1 inside the loop body.",
      solvedAnswer: `One correct fix is:\ncount = ${offset}\nwhile count <= ${offset + 3}:\n    print(count)\n    count += 1`,
      teacherNote: "The key skill is recognizing that the condition variable must change.",
    };
  }

  return {
    ...question,
    stem: "Write a while loop that keeps adding 2 to a running total until the total is at least 20.",
    body: [
      "Start with total = 0.",
      "Show your code and one sentence explaining the stopping condition.",
    ],
    options: [],
    answer: "Any correct while loop with a running total and explicit stopping condition.",
    solvedAnswer: "Example:\ntotal = 0\nwhile total < 20:\n    total += 2\nprint(total)\nThe condition controls repetition until the total reaches at least 20.",
    teacherNote: "Check for a valid update statement and a clear explanation of when the loop ends.",
  };
}

function rewriteGenericQuestion(question, versionIndex, context) {
  const prompt = buildQuestionPrompt(question);
  const label = versionIndex === 0 ? "A" : "B";
  const questionNumber = Number(question.number || 0);
  const namePair = versionIndex === 0 ? ["Ada", "Lovelace"] : ["Alan", "Turing"];
  const moduloPair = versionIndex === 0 ? [17, 5] : [19, 6];
  const arithmeticPair = versionIndex === 0 ? { a: 12, b: 4, c: 3 } : { a: 15, b: 6, c: 4 };
  const stringPrompt = versionIndex === 0 ? "What is the output of the code below?" : "What will this program print?";
  const moduloPrompt = versionIndex === 0 ? "What is printed to the screen when the following program is run?" : "Determine the value printed by this program.";
  const codeOutputPrompt = versionIndex === 0 ? "What will the following code segment output?" : "What is the final output of this code segment?";
  const coordinatePrompt = versionIndex === 0 ? "In a graphics canvas, where is the following point?" : "Identify the location of this point on the graphics canvas.";
  const tracePrompt = versionIndex === 0 ? "Consider the following pseudocode. What value is stored in variable c?" : "Trace the pseudocode below. What value ends in variable c?";

  if (/14 % 4|%\s*4|printed to the screen/i.test(prompt)) {
    return {
      ...question,
      stem: moduloPrompt,
      body: [
        versionIndex === 0 ? `num = ${moduloPair[0]} % ${moduloPair[1]}` : `remainder = ${moduloPair[0]} % ${moduloPair[1]}`,
        versionIndex === 0 ? "print(num)" : "print(remainder)",
      ],
      options: [],
      answer: String(moduloPair[0] % moduloPair[1]),
      solvedAnswer: `${moduloPair[0]} % ${moduloPair[1]} leaves remainder ${moduloPair[0] % moduloPair[1]}, so the screen prints ${moduloPair[0] % moduloPair[1]}.`,
      teacherNote: `Version ${label} keeps the same modulo skill with different numbers.`,
    };
  }

  if (/Grace|Hopper|first \+ last|string/i.test(prompt)) {
    return {
      ...question,
      stem: stringPrompt,
      body: [
        versionIndex === 0 ? `first = "${namePair[0]}"` : `given = "${namePair[0]}"`,
        versionIndex === 0 ? `last = "${namePair[1]}"` : `family = "${namePair[1]}"`,
        versionIndex === 0 ? "print(first + last)" : "print(given + family)",
      ],
      options: [],
      answer: `${namePair[0]}${namePair[1]}`,
      solvedAnswer: `String concatenation joins the names directly with no added space, so the output is ${namePair[0]}${namePair[1]}.`,
      teacherNote: `Version ${label} checks string concatenation with a different name pair.`,
    };
  }

  if (/graphics canvas|get_width|get_height|point/i.test(prompt)) {
    return {
      ...question,
      stem: coordinatePrompt,
      body: versionIndex === 0 ? ["(0, get_height())"] : ["(get_width()/2, 0)"],
      options: [],
      answer:
        versionIndex === 0
          ? "Bottom-left corner of the canvas."
          : "Top-center of the canvas.",
      solvedAnswer:
        versionIndex === 0
          ? "(0, get_height()) means x is all the way left and y is all the way down, so the point is the bottom-left corner."
          : "(get_width()/2, 0) means the point is halfway across the width and at the very top, so it is the top-center of the canvas.",
      teacherNote: `Version ${label} keeps the same coordinate-system concept with a different corner.`,
    };
  }

  if (/siblings|read input|store the number|input/i.test(prompt)) {
    return {
      ...question,
      stem: versionIndex === 0
        ? "Read input from the user to find how many pets they have and store the number."
        : "Read input from the user to find how many classes they take and store the number.",
      body: ["Write one line of Python code."],
      options: [],
      answer:
        versionIndex === 0
          ? 'pets = int(input("How many pets do you have? "))'
          : 'classes = int(input("How many classes do you take? "))',
      solvedAnswer:
        versionIndex === 0
          ? 'pets = int(input("How many pets do you have? "))'
          : 'classes = int(input("How many classes do you take? "))',
      teacherNote: `Version ${label} keeps the same input-and-store skill with a new context.`,
    };
  }

  if (/a = 10|expression = a - b \* c % 3|code segment output/i.test(prompt)) {
    const values = arithmeticPair;
    const result = versionIndex === 0 ? values.a - (values.b * values.c) % 3 : values.a + values.b % values.c;
    return {
      ...question,
      stem: codeOutputPrompt,
      body: [
        `a = ${values.a}`,
        `b = ${values.b}`,
        `c = ${values.c}`,
        versionIndex === 0 ? "expression = a - b * c % 3" : "expression = a + b % c",
        "print(expression)",
      ],
      options: [],
      answer: String(result),
      solvedAnswer:
        versionIndex === 0
          ? `${values.b} * ${values.c} = ${values.b * values.c}. Then ${(values.b * values.c)} % 3 = ${(values.b * values.c) % 3}. Finally ${values.a} - ${(values.b * values.c) % 3} = ${result}.`
          : `${values.b} % ${values.c} = ${values.b % values.c}. Then ${values.a} + ${values.b % values.c} = ${result}.`,
      teacherNote: `Version ${label} preserves order-of-operations reasoning with new values.`,
    };
  }

  if (/a ← 4|What value is stored in variable c|←/i.test(prompt)) {
    return {
      ...question,
      stem: tracePrompt,
      body:
        versionIndex === 0
          ? [
              "a ← 3",
              "b ← 6",
              "c ← b + 2 - a",
              "a ← c",
              "b ← a - 1",
              "c ← b",
            ]
          : [
              "a ← 5",
              "b ← 8",
              "c ← b - 3 + a",
              "a ← b",
              "b ← c - 2",
              "c ← a",
            ],
      options: [],
      answer: versionIndex === 0 ? "4" : "8",
      solvedAnswer:
        versionIndex === 0
          ? "Trace it in order: c becomes 5, then a becomes 5, then b becomes 4, so c ends as 4."
          : "Trace it in order: c becomes 10, then a becomes 8, then b becomes 8, so c ends as 8.",
      teacherNote: `Version ${label} keeps the same tracing skill with a different pseudocode sequence.`,
    };
  }

  if (/5 \+ 3|\"5\" \+ \"3\"|result =/i.test(prompt)) {
    return {
      ...question,
      stem: codeOutputPrompt,
      body:
        versionIndex === 0
          ? ['result = 6 + 2', 'print(result)', 'result = "6" + "2"', 'print(result)']
          : ['value = 9 - 2', 'print(value)', 'value = "9" + "2"', 'print(value)'],
      options: [],
      answer: versionIndex === 0 ? "8 then 62" : "7 then 92",
      solvedAnswer:
        versionIndex === 0
          ? 'The first print outputs 8 because 6 + 2 is numeric addition. The second outputs 62 because the values are strings and get concatenated.'
          : 'The first print outputs 7 because 9 - 2 is numeric subtraction. The second outputs 92 because the values are strings and get concatenated.',
      teacherNote: `Version ${label} contrasts numeric addition and string concatenation with new values.`,
    };
  }

  if (/circle|draw a blue circle|radius/i.test(prompt)) {
    return {
      ...question,
      stem: versionIndex === 0 ? "Write code to draw a circle in the center of the screen." : "Write code to place a colored circle at the center of the canvas.",
      body:
        versionIndex === 0
          ? ["The circle should be green and have a radius of 40."]
          : ["The circle should be orange and have a radius of 55."],
      options: [],
      answer:
        versionIndex === 0
          ? 'circle = Circle(40)\ncircle.set_position(get_width()/2, get_height()/2)\ncircle.set_color(Color.green)\nadd(circle)'
          : 'circle = Circle(55)\ncircle.set_position(get_width()/2, get_height()/2)\ncircle.set_color(Color.orange)\nadd(circle)',
      solvedAnswer:
        versionIndex === 0
          ? 'circle = Circle(40)\ncircle.set_position(get_width()/2, get_height()/2)\ncircle.set_color(Color.green)\nadd(circle)'
          : 'circle = Circle(55)\ncircle.set_position(get_width()/2, get_height()/2)\ncircle.set_color(Color.orange)\nadd(circle)',
      teacherNote: `Version ${label} preserves the same graphics skill with different attributes.`,
    };
  }

  if (/donuts|advisory|decimal/i.test(prompt)) {
    return {
      ...question,
      stem:
        versionIndex === 0
          ? "Prompt the user for how many students are in their club. Then output how many stickers each student gets if 30 stickers are purchased."
          : "Prompt the user for how many players are on their team. Then output how many water bottles each player gets if 18 bottles are purchased.",
      body: ["It is okay to print the answer as a decimal."],
      options: [],
      answer:
        versionIndex === 0
          ? 'students = int(input("How many students are in the club? "))\nprint(30 / students)'
          : 'players = int(input("How many players are on the team? "))\nprint(18 / players)',
      solvedAnswer:
        versionIndex === 0
          ? 'students = int(input("How many students are in the club? "))\nprint(30 / students)'
          : 'players = int(input("How many players are on the team? "))\nprint(18 / players)',
      teacherNote: `Version ${label} keeps the same input/division structure with a new context.`,
    };
  }

  if (question.type === "multiple_choice") {
    const preservedAnswer = question.answer || question.options[0]?.label || "A";
    return {
      ...question,
      stem: buildParallelStem(question.stem, versionIndex, questionNumber),
      body: buildParallelBodyLines(question.body, versionIndex, questionNumber),
      options: question.options.map((option, index) => ({
        ...option,
        text: `${swapSurfaceContext(shiftNumericText(option.text, versionIndex, questionNumber + index), versionIndex, questionNumber)}${index === versionIndex ? versionIndex === 0 ? " in a robotics-club context" : " in a game-design context" : ""}`,
      })),
      answer: preservedAnswer,
      solvedAnswer: `Correct answer: ${preservedAnswer}. Version ${label} keeps the same skill but changes the scenario, wording, and numeric details.`,
      teacherNote: `Keep the same standard and difficulty, but vary the example used in Version ${label}.`,
    };
  }

  if (question.type === "code") {
    return {
      ...question,
      stem: buildParallelStem(question.stem, versionIndex, questionNumber),
      body: buildParallelBodyLines(
        question.body.map((line) =>
          line
            .replace(/\b14\b/g, String(moduloPair[0]))
            .replace(/\b4\b/g, String(moduloPair[1]))
            .replace(/Grace/g, namePair[0])
            .replace(/Hopper/g, namePair[1]),
        ),
        versionIndex,
        questionNumber,
      ),
      answer: `Teacher key for Version ${label}: accept a correct response that preserves the original skill with changed values.`,
      solvedAnswer: `Teacher key for Version ${label}: accept a correct response that preserves the original skill with changed values.`,
      teacherNote: `Version ${label} should look familiar to students but not duplicate the original item.`,
    };
  }

  return {
    ...question,
    stem: buildParallelStem(question.stem, versionIndex, questionNumber),
    body: buildParallelBodyLines(question.body, versionIndex, questionNumber),
    answer: `Version ${label}: accept any correct response that matches the same skill with the updated context/details.`,
    solvedAnswer: `Teacher key for Version ${label}: grade for the same skill target, correct reasoning, and correct final result using the updated scenario.`,
    teacherNote: `Version ${label} changes context and numeric details so students do not receive duplicate items.`,
  };
}

function createParallelAssessment(blueprint, context, versionIndex) {
  return {
    name: `Version ${versionIndex === 0 ? "A" : "B"}`,
    resemblesTestSheet: blueprint.resemblesTestSheet,
    sections: blueprint.sections.map((section) => ({
      title: section.title,
      displayTitle: section.displayTitle || section.title,
      sectionType: section.questions[0]?.sectionType || getSectionDisplayType(section.title),
      totalPoints: section.totalPoints || section.questions.reduce((sum, question) => sum + (question.points || 0), 0),
      questions: section.questions.map((question) =>
        /while loop|while loops/i.test(context.topic) || /while loop|while loops/i.test(buildQuestionPrompt(question))
          ? rewriteWhileLoopQuestion(question, versionIndex)
          : rewriteGenericQuestion(question, versionIndex, context),
      ),
    })),
  };
}

function renderQuestionHtml(question, showAnswers = false) {
  const optionHtml = question.options.length
    ? `<ul class="answer-options">${question.options.map((option) => `<li><strong>${escapeHtml(option.label)}.</strong> ${escapeHtml(option.text)}</li>`).join("")}</ul>`
    : "";
  const bodyHtml = question.body.length
    ? `<div class="question-body">${question.body.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}</div>`
    : "";
  const lineCount = Math.max(1, Number(question.responseLines || 3));
  const studentLines = Array.from({ length: lineCount }, () => "<span></span>").join("");
  const answerArea = showAnswers
    ? `<div class="teacher-answer"><p><strong>Answer / Key:</strong></p><pre>${escapeHtml(buildDetailedKey(question))}</pre><p><strong>Teacher Note:</strong> ${escapeHtml(question.teacherNote || "Use this question to confirm the target skill.")}</p></div>`
    : `<div class="student-answer-lines">${studentLines}</div>`;

  return `
    <article class="parallel-question question-type-${escapeHtml(question.type)} section-${escapeHtml(question.sectionType || "default")}">
      <div class="parallel-question-head">
        <h4>${escapeHtml(`${question.number}. ${question.stem}`)}</h4>
        <span class="point-badge">${escapeHtml(`${question.points || 1} pt${question.points === 1 ? "" : "s"}`)}</span>
      </div>
      ${bodyHtml}
      ${optionHtml}
      ${answerArea}
    </article>
  `;
}

function renderAssessmentVersionHtml(bundleTitle, context, version, showAnswers = false) {
  const totalPoints = version.sections.reduce((sum, section) => sum + (section.totalPoints || 0), 0);
  const sheetClass = showAnswers && version.resemblesTestSheet ? "parallel-assessment-sheet teacher-key two-column-key" : "parallel-assessment-sheet";
  const sectionHtml = version.sections
    .map(
      (section) => `
        <section class="parallel-section section-${escapeHtml(section.sectionType || "default")}">
          <div class="parallel-section-head">
            <h3>${escapeHtml(section.displayTitle || section.title)}</h3>
            <span>${escapeHtml(section.sectionType === "code_writing" ? "Code Writing" : "Short Answer")} · ${escapeHtml(`${section.totalPoints || 0} pts`)}${context.gradeLevel ? ` · Grade ${context.gradeLevel}` : ""}</span>
          </div>
          ${section.questions.map((question) => renderQuestionHtml(question, showAnswers)).join("")}
        </section>
      `,
    )
    .join("");

  return `
    <div class="${sheetClass}">
      <header class="parallel-sheet-head">
        <p class="label">${escapeHtml(context.course)}${context.duration ? ` · ${context.duration}` : ""}</p>
        <h1>${escapeHtml(bundleTitle)} - ${escapeHtml(version.name)}</h1>
        <p>${escapeHtml(context.topic)}</p>
        <p class="label">${escapeHtml(`Total Points: ${totalPoints}`)}</p>
      </header>
      ${sectionHtml}
    </div>
  `;
}

function buildAssessmentTransform(sourceText, sourceType, targetType) {
  const context = inferAssessmentContext(sourceText);
  const blueprint = extractAssessmentBlueprint(sourceText);
  const versions = [0, 1].map((index) => createParallelAssessment(blueprint, context, index));
  const originalOutline = blueprint.sections
    .map(
      (section) => `
        <section class="parallel-section">
          <div class="parallel-section-head">
            <h3>${escapeHtml(section.displayTitle || section.title)}</h3>
            <span>${escapeHtml(getSectionDisplayType(section.title) === "code_writing" ? "Code Writing" : "Short Answer")} · ${section.questions.length} questions · ${section.totalPoints || 0} pts</span>
          </div>
          <ul class="outline-list">
            ${section.questions
              .map((question) => `<li>${escapeHtml(`${question.number}. ${question.stem}`)}${question.points ? ` (${question.points} pt${question.points === 1 ? "" : "s"})` : ""}</li>`)
              .join("")}
          </ul>
        </section>
      `,
    )
    .join("");

  return {
    kind: "assessment_transform",
    title: `${context.course} ${context.topic} Parallel Assessment Builder`.trim(),
    summary: `Imported ${blueprint.questionCount} questions across ${blueprint.sections.length} section${blueprint.sections.length === 1 ? "" : "s"} and rebuilt them into parallel versions with the same pacing and skill targets.`,
    blueprint,
    context,
    versions: versions.map((version) => ({
      name: version.name,
      questionCount: version.sections.reduce((count, section) => count + section.questions.length, 0),
      totalPoints: version.sections.reduce((sum, section) => sum + (section.totalPoints || 0), 0),
      studentHtml: renderAssessmentVersionHtml(`${context.topic} Assessment`, context, version, false),
      keyHtml: renderAssessmentVersionHtml(`${context.topic} Teacher Key`, context, version, true),
      preview: version.sections.map((section) => ({
        title: section.displayTitle || section.title,
        questions: section.questions.slice(0, 3).map((question) => ({
          number: question.number,
          stem: question.stem,
        })),
      })),
    })),
    originalOutlineHtml: `
      <div class="parallel-assessment-sheet">
        <header class="parallel-sheet-head">
          <p class="label">Imported structure</p>
          <h1>${escapeHtml(blueprint.title)}</h1>
          <p>TeacherFlowAI preserved section order, exact headings, question count, and section point totals before generating new versions.</p>
          <p class="label">${escapeHtml(`Total Points: ${blueprint.totalPoints || 0}`)}</p>
        </header>
        ${originalOutline}
      </div>
    `,
  };
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const digest = crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
  return `${salt}:${digest}`;
}

function verifyPassword(password, storedHash) {
  const [salt, digest] = String(storedHash || "").split(":");
  if (!salt || !digest) {
    return false;
  }
  const candidate = crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
  return crypto.timingSafeEqual(Buffer.from(digest, "hex"), Buffer.from(candidate, "hex"));
}

function hashResetToken(token) {
  return crypto.createHash("sha256").update(`${token}:${SESSION_SECRET}`).digest("hex");
}

function buildAppUrl(req, pathname = "/") {
  const base = APP_BASE_URL || getOrigin(req);
  return new URL(pathname, base).toString();
}

function isSendmailAvailable() {
  return fs.existsSync("/usr/sbin/sendmail");
}

function createEmailError(message, code) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function buildEmailFailurePayload(error, notConfiguredMessage, fallbackMessage) {
  if (error?.code === "EMAIL_NOT_CONFIGURED") {
    return {
      status: 400,
      body: {
        error: notConfiguredMessage,
      },
    };
  }

  return {
    status: 500,
    body: {
      error: fallbackMessage,
      detail: String(error?.message || "").trim() || "Unknown email delivery error.",
    },
  };
}

function resolveEmailSettings(config = null) {
  const candidate = config && typeof config === "object" ? config : {};
  const host = String(candidate.host || SMTP_HOST || "").trim();
  const port = Number(candidate.port || SMTP_PORT || 0) || 587;
  const secure = candidate.secure == null ? (SMTP_SECURE == null ? port === 465 : SMTP_SECURE) : Boolean(candidate.secure);
  const username = String(candidate.username || SMTP_USER || "").trim();
  const password = String(candidate.password || SMTP_PASS || "");
  const fromAddress = String(candidate.fromAddress || MAIL_FROM || username || "no-reply@teacherflowai.local").trim();

  return {
    host,
    port,
    secure,
    username,
    password,
    fromAddress,
    configured: Boolean(host && username && password),
  };
}

function formatEmailMessage({ to, subject, text }) {
  const mailConfig = resolveEmailSettings();
  return [
    `From: TeacherFlowAI <${mailConfig.fromAddress}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    text,
    "",
  ].join("\r\n");
}

function dotStuffEmailMessage(message) {
  return message
    .replaceAll(/\r?\n/g, "\r\n")
    .split("\r\n")
    .map((line) => (line.startsWith(".") ? `.${line}` : line))
    .join("\r\n");
}

function readSmtpResponse(socket, state) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup();
      reject(createEmailError("SMTP server timed out.", "EMAIL_SEND_TIMEOUT"));
    }, 15000);

    const onData = (chunk) => {
      state.buffer += chunk.toString("utf8");

      while (state.buffer.includes("\n")) {
        const newlineIndex = state.buffer.indexOf("\n");
        const line = state.buffer.slice(0, newlineIndex).replace(/\r$/, "");
        state.buffer = state.buffer.slice(newlineIndex + 1);
        if (!line) {
          continue;
        }
        state.lines.push(line);
        if (/^\d{3} /.test(line)) {
          cleanup();
          resolve({
            code: Number(line.slice(0, 3)),
            lines: [...state.lines],
          });
          state.lines = [];
        }
      }
    };

    const onError = (error) => {
      cleanup();
      reject(error);
    };

    const onClose = () => {
      cleanup();
      reject(createEmailError("SMTP connection closed unexpectedly.", "EMAIL_SEND_FAILED"));
    };

    function cleanup() {
      clearTimeout(timeout);
      socket.off("data", onData);
      socket.off("error", onError);
      socket.off("close", onClose);
    }

    socket.on("data", onData);
    socket.on("error", onError);
    socket.on("close", onClose);
  });
}

async function sendSmtpCommand(socket, state, command, expectedCodes) {
  if (command != null) {
    socket.write(`${command}\r\n`);
  }
  const response = await readSmtpResponse(socket, state);
  if (!expectedCodes.includes(response.code)) {
    throw createEmailError(
      `SMTP command failed: ${response.lines.join(" | ")}`,
      "EMAIL_SEND_FAILED",
    );
  }
  return response;
}

async function upgradeSocketToTls(socket, host) {
  return new Promise((resolve, reject) => {
    const secureSocket = tls.connect(
      {
        socket,
        servername: host,
      },
      () => resolve(secureSocket),
    );

    secureSocket.once("error", reject);
  });
}

async function openSmtpSocket(host, port, secure) {
  return new Promise((resolve, reject) => {
    const onConnect = () => {
      cleanup();
      resolve(socket);
    };

    const onError = (error) => {
      cleanup();
      reject(error);
    };

    const socket = secure
      ? tls.connect({ host, port, servername: host }, onConnect)
      : net.createConnection({ host, port }, onConnect);

    socket.setEncoding("utf8");
    socket.setTimeout(15000, () => {
      socket.destroy(createEmailError("SMTP connection timed out.", "EMAIL_SEND_TIMEOUT"));
    });
    socket.once("error", onError);

    function cleanup() {
      socket.off("error", onError);
    }
  });
}

async function sendViaSmtp({ to, subject, text }, config) {
  const mailConfig = resolveEmailSettings(config);
  const host = mailConfig.host;
  const secure = mailConfig.secure;
  const port = mailConfig.port || (secure ? 465 : 587);
  let socket = await openSmtpSocket(host, port, secure);
  let state = { buffer: "", lines: [] };

  try {
    const greeting = await readSmtpResponse(socket, state);
    if (greeting.code !== 220) {
      throw createEmailError("SMTP server rejected the connection.", "EMAIL_SEND_FAILED");
    }

    let ehlo = await sendSmtpCommand(socket, state, `EHLO ${os.hostname() || "localhost"}`, [250]);

    const supportsStartTls = ehlo.lines.some((line) => /STARTTLS/i.test(line));
    if (!secure && supportsStartTls) {
      await sendSmtpCommand(socket, state, "STARTTLS", [220]);
      socket = await upgradeSocketToTls(socket, host);
      socket.setEncoding("utf8");
      socket.setTimeout(15000, () => {
        socket.destroy(createEmailError("SMTP connection timed out.", "EMAIL_SEND_TIMEOUT"));
      });
      state = { buffer: "", lines: [] };
      ehlo = await sendSmtpCommand(socket, state, `EHLO ${os.hostname() || "localhost"}`, [250]);
    }

    const advertisedAuth = ehlo.lines.join("\n");
    if (mailConfig.username && mailConfig.password) {
      if (/AUTH(?:=|\s).*PLAIN/i.test(advertisedAuth)) {
        const authValue = Buffer.from(`\u0000${mailConfig.username}\u0000${mailConfig.password}`, "utf8").toString("base64");
        await sendSmtpCommand(socket, state, `AUTH PLAIN ${authValue}`, [235]);
      } else {
        await sendSmtpCommand(socket, state, "AUTH LOGIN", [334]);
        await sendSmtpCommand(socket, state, Buffer.from(mailConfig.username, "utf8").toString("base64"), [334]);
        await sendSmtpCommand(socket, state, Buffer.from(mailConfig.password, "utf8").toString("base64"), [235]);
      }
    }

    await sendSmtpCommand(socket, state, `MAIL FROM:<${mailConfig.fromAddress}>`, [250]);
    await sendSmtpCommand(socket, state, `RCPT TO:<${to}>`, [250, 251]);
    await sendSmtpCommand(socket, state, "DATA", [354]);
    const message = [
      `From: TeacherFlowAI <${mailConfig.fromAddress}>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=utf-8",
      "Content-Transfer-Encoding: 8bit",
      "",
      text,
      "",
    ].join("\r\n");
    socket.write(`${dotStuffEmailMessage(message)}\r\n.\r\n`);
    const delivery = await readSmtpResponse(socket, state);
    if (delivery.code !== 250) {
      throw createEmailError(
        `SMTP server did not accept the message: ${delivery.lines.join(" | ")}`,
        "EMAIL_SEND_FAILED",
      );
    }
    await sendSmtpCommand(socket, state, "QUIT", [221]);
  } finally {
    socket.end();
  }
}

function sendViaSendmail({ to, subject, text }, config) {
  const mailConfig = resolveEmailSettings(config);
  const message = [
    `From: TeacherFlowAI <${mailConfig.fromAddress}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    text,
    "",
  ].join("\r\n");
  execFileSync("/usr/sbin/sendmail", ["-t"], {
    input: message,
    stdio: ["pipe", "ignore", "ignore"],
  });
}

async function sendEmail({ to, subject, text }, config = null) {
  const mailConfig = resolveEmailSettings(config);
  if (mailConfig.configured) {
    await sendViaSmtp({ to, subject, text }, mailConfig);
    return;
  }

  if (isSendmailAvailable()) {
    sendViaSendmail({ to, subject, text }, mailConfig);
    return;
  }

  throw createEmailError(
    "TeacherFlowAI email is not configured. Add SMTP settings to .env.",
    "EMAIL_NOT_CONFIGURED",
  );
}

async function sendPasswordResetEmail(req, email, resetToken, mailConfig = null) {
  const message = [
    "A password reset was requested for your TeacherFlowAI account.",
    "",
    "Open this link to choose a new password:",
  ];
  const resetUrl = new URL(buildAppUrl(req, "/"));
  resetUrl.searchParams.set("resetEmail", email);
  resetUrl.searchParams.set("resetToken", resetToken);

  message.push(resetUrl.toString(), "", "If you did not request this, you can ignore this email.");

  await sendEmail({
    to: email,
    subject: "TeacherFlowAI password reset",
    text: message.join("\n"),
  }, mailConfig);
}

function createSession(userId) {
  const token = crypto.randomBytes(24).toString("hex");
  const signature = crypto.createHmac("sha256", SESSION_SECRET).update(token).digest("hex");
  const sessionId = `${token}.${signature}`;
  sessions.set(sessionId, { userId, createdAt: Date.now() });
  return sessionId;
}

function getSessionUser(req) {
  const cookies = parseCookies(req);
  const sessionId = cookies[SESSION_COOKIE];
  if (!sessionId || !sessions.has(sessionId)) {
    return null;
  }
  const session = sessions.get(sessionId);
  return readUsers().find((user) => user.id === session.userId) || null;
}

function clearSession(res, req) {
  const cookies = parseCookies(req);
  if (cookies[SESSION_COOKIE]) {
    sessions.delete(cookies[SESSION_COOKIE]);
  }
  return createCookie(SESSION_COOKIE, "", {
    httpOnly: true,
    path: "/",
    sameSite: "Lax",
    maxAge: 0,
  });
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) {
    return {};
  }
  return JSON.parse(raw);
}

function requireUser(req, res) {
  const user = getSessionUser(req);
  if (!user) {
    json(res, 401, { error: "You need to sign in first." });
    return null;
  }
  return user;
}

function getUserStudents(userId) {
  const store = readStudentsStore();
  return Array.isArray(store[userId]) ? store[userId] : [];
}

function setUserStudents(userId, students) {
  const store = readStudentsStore();
  store[userId] = students;
  writeStudentsStore(store);
}

function getUserActivities(userId) {
  const store = readActivitiesStore();
  return Array.isArray(store[userId]) ? store[userId] : [];
}

function setUserActivities(userId, activities) {
  const store = readActivitiesStore();
  store[userId] = activities;
  writeActivitiesStore(store);
}

function findUserByEmail(email) {
  const normalized = normalizeEmail(email);
  return readUsers().find((user) => user.email === normalized) || null;
}

function appendUserActivity(userId, activity) {
  const activities = getUserActivities(userId);
  activities.unshift({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...activity,
  });
  setUserActivities(userId, activities.slice(0, 120));
}

function deleteUserActivity(userId, activityId) {
  const activities = getUserActivities(userId);
  const nextActivities = activities.filter((item) => item.id !== activityId);
  setUserActivities(userId, nextActivities);
  return nextActivities;
}

function clearUserActivitiesByScope(userId, scope) {
  const activities = getUserActivities(userId);
  const nextActivities = activities.filter((item) => {
    if (scope === "all") {
      return false;
    }
    if (scope === "history") {
      return !["teaching_pack", "repurpose", "admin_ready", "progress_summary", "roster_import", "profile_update"].includes(item.type);
    }
    if (scope === "communications") {
      return !["email_draft", "calendar_reminder", "communication_note"].includes(item.type);
    }
    if (scope === "alerts") {
      return item.type !== "alert";
    }
    return true;
  });
  setUserActivities(userId, nextActivities);
  return nextActivities;
}

function buildGoogleAuthUrl(state, origin) {
  const redirectUri = GOOGLE_REDIRECT_URI || `${origin}/api/auth/google/callback`;
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("prompt", "select_account");
  authUrl.searchParams.set("state", state);
  return authUrl.toString();
}

async function exchangeGoogleCodeForProfile(code, origin) {
  const redirectUri = GOOGLE_REDIRECT_URI || `${origin}/api/auth/google/callback`;
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error("Failed to exchange Google authorization code.");
  }

  const tokenPayload = await tokenResponse.json();
  const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: {
      Authorization: `Bearer ${tokenPayload.access_token}`,
    },
  });

  if (!profileResponse.ok) {
    throw new Error("Failed to load Google profile.");
  }

  return profileResponse.json();
}

async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/auth/session") {
    const user = getSessionUser(req);
    json(res, 200, { authenticated: Boolean(user), user: user ? sanitizeUser(user) : null });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/signup") {
    const body = await readBody(req);
    const email = normalizeEmail(body.email);
    const name = String(body.name || "").trim();
    const school = String(body.school || "").trim();
    const password = String(body.password || "");

    if (!email || !name || !school || password.length < 8) {
      json(res, 400, { error: "Name, work email, school, and an 8+ character password are required." });
      return;
    }

    const users = readUsers();
    if (users.some((user) => user.email === email)) {
      json(res, 409, { error: "That work email already has an account." });
      return;
    }

    const user = {
      id: crypto.randomUUID(),
      email,
      name,
      school,
      title: "",
      department: "",
      phone: "",
      preferredView: "desktop",
      emailSettings: getEncryptedEmailSettings(getDefaultEmailSettings()),
      passwordHash: hashPassword(password),
      passwordReset: null,
      authProvider: "local",
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    writeUsers(users);
    setUserStudents(user.id, []);
    setUserActivities(user.id, []);

    const sessionId = createSession(user.id);
    json(
      res,
      201,
      { user: sanitizeUser(user) },
      {
        "Set-Cookie": createCookie(SESSION_COOKIE, sessionId, {
          httpOnly: true,
          path: "/",
          sameSite: "Lax",
          maxAge: 60 * 60 * 24 * 7,
        }),
      },
    );
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/signin") {
    const body = await readBody(req);
    const email = normalizeEmail(body.email);
    const password = String(body.password || "");
    const user = findUserByEmail(email);

    if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
      json(res, 401, { error: "Invalid email or password." });
      return;
    }

    const sessionId = createSession(user.id);
    json(
      res,
      200,
      { user: sanitizeUser(user) },
      {
        "Set-Cookie": createCookie(SESSION_COOKIE, sessionId, {
          httpOnly: true,
          path: "/",
          sameSite: "Lax",
          maxAge: 60 * 60 * 24 * 7,
        }),
      },
    );
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/signout") {
    json(
      res,
      200,
      { ok: true },
      {
        "Set-Cookie": clearSession(res, req),
      },
    );
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/password-reset/request") {
    const body = await readBody(req);
    const email = normalizeEmail(body.email);
    const users = readUsers();
    const userIndex = users.findIndex((candidate) => candidate.email === email);
    if (userIndex === -1) {
      json(res, 200, { ok: true, message: "If that account exists, a password reset email has been sent." });
      return;
    }

    const resetToken = crypto.randomBytes(18).toString("hex");
    users[userIndex].passwordReset = {
      tokenHash: hashResetToken(resetToken),
      expiresAt: Date.now() + 1000 * 60 * 30,
      requestedAt: new Date().toISOString(),
    };
    writeUsers(users);

    try {
      await sendPasswordResetEmail(req, email, resetToken, users[userIndex].emailSettings || null);
      json(res, 200, {
        ok: true,
        message: "Password reset email sent.",
      });
    } catch (error) {
      const failure = buildEmailFailurePayload(
        error,
        "TeacherFlowAI email is not configured yet. Save SMTP settings in Settings → Email Provider or add SMTP values to .env.",
        "TeacherFlowAI could not send the reset email. Check your SMTP settings and try again.",
      );
      json(res, failure.status, failure.body);
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/password-reset/confirm") {
    const body = await readBody(req);
    const email = normalizeEmail(body.email);
    const token = String(body.token || "").trim();
    const password = String(body.password || "");
    const users = readUsers();
    const userIndex = users.findIndex((candidate) => candidate.email === email);

    if (userIndex === -1 || !users[userIndex].passwordReset) {
      json(res, 400, { error: "No active reset request was found for that account." });
      return;
    }

    const resetRecord = users[userIndex].passwordReset;
    if (password.length < 8) {
      json(res, 400, { error: "New password must be at least 8 characters." });
      return;
    }
    if (Date.now() > Number(resetRecord.expiresAt || 0)) {
      users[userIndex].passwordReset = null;
      writeUsers(users);
      json(res, 400, { error: "Reset token expired. Request a new one." });
      return;
    }
    if (hashResetToken(token) !== resetRecord.tokenHash) {
      json(res, 400, { error: "Reset token is invalid." });
      return;
    }

    users[userIndex].passwordHash = hashPassword(password);
    users[userIndex].passwordReset = null;
    users[userIndex].passwordUpdatedAt = new Date().toISOString();
    writeUsers(users);

    const sessionId = createSession(users[userIndex].id);
    json(
      res,
      200,
      { user: sanitizeUser(users[userIndex]) },
      {
        "Set-Cookie": createCookie(SESSION_COOKIE, sessionId, {
          httpOnly: true,
          path: "/",
          sameSite: "Lax",
          maxAge: 60 * 60 * 24 * 7,
        }),
      },
    );
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/auth/google/start") {
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      res.writeHead(302, {
        Location: "/?authError=google_not_configured",
      });
      res.end();
      return;
    }

    const state = crypto.randomBytes(16).toString("hex");
    res.writeHead(302, {
      Location: buildGoogleAuthUrl(state, getOrigin(req)),
      "Set-Cookie": createCookie(OAUTH_COOKIE, state, {
        httpOnly: true,
        path: "/",
        sameSite: "Lax",
        maxAge: 60 * 10,
      }),
    });
    res.end();
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/auth/google/callback") {
    const cookies = parseCookies(req);
    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");

    if (!state || !code || cookies[OAUTH_COOKIE] !== state) {
      res.writeHead(302, {
        Location: "/?authError=oauth_state_mismatch",
        "Set-Cookie": createCookie(OAUTH_COOKIE, "", {
          httpOnly: true,
          path: "/",
          sameSite: "Lax",
          maxAge: 0,
        }),
      });
      res.end();
      return;
    }

    try {
      const profile = await exchangeGoogleCodeForProfile(code, getOrigin(req));
      const email = normalizeEmail(profile.email);
      if (!email) {
        throw new Error("Google did not return an email address.");
      }

      const users = readUsers();
      let user = users.find((candidate) => candidate.email === email);
      if (!user) {
        user = {
          id: crypto.randomUUID(),
          email,
          name: String(profile.name || email).trim(),
          school: "",
          title: "",
          department: "",
          phone: "",
          preferredView: "desktop",
          emailSettings: getEncryptedEmailSettings(getDefaultEmailSettings()),
          passwordHash: "",
          passwordReset: null,
          authProvider: "google",
          createdAt: new Date().toISOString(),
        };
        users.push(user);
      } else {
        user.name = String(profile.name || user.name || email).trim();
        user.authProvider = "google";
      }
      writeUsers(users);
      const studentStore = readStudentsStore();
      if (!Array.isArray(studentStore[user.id])) {
        setUserStudents(user.id, []);
      }
      const activityStore = readActivitiesStore();
      if (!Array.isArray(activityStore[user.id])) {
        setUserActivities(user.id, []);
      }

      const sessionId = createSession(user.id);
      res.writeHead(302, {
        Location: "/?authSuccess=google_connected",
        "Set-Cookie": [
          createCookie(SESSION_COOKIE, sessionId, {
            httpOnly: true,
            path: "/",
            sameSite: "Lax",
            maxAge: 60 * 60 * 24 * 7,
          }),
          createCookie(OAUTH_COOKIE, "", {
            httpOnly: true,
            path: "/",
            sameSite: "Lax",
            maxAge: 0,
          }),
        ],
      });
      res.end();
    } catch (error) {
      res.writeHead(302, {
        Location: `/?authError=${encodeURIComponent(error.message.replaceAll(" ", "_").toLowerCase())}`,
        "Set-Cookie": createCookie(OAUTH_COOKIE, "", {
          httpOnly: true,
          path: "/",
          sameSite: "Lax",
          maxAge: 0,
        }),
      });
      res.end();
    }
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/students") {
    const user = requireUser(req, res);
    if (!user) {
      return;
    }
    json(res, 200, { students: getUserStudents(user.id) });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/resources/transform") {
    const user = requireUser(req, res);
    if (!user) {
      return;
    }

    const body = await readBody(req);
    const sourceType = String(body.sourceType || "worksheet").trim().toLowerCase();
    const targetType = String(body.targetType || "parallel-assessment").trim().toLowerCase();
    const resourceText = String(body.resourceText || "").trim();
    const fileName = String(body.fileName || "").trim();
    const mimeType = String(body.mimeType || "").trim();
    const fileData = String(body.fileData || "").trim();

    let extracted = {
      parser: "none",
      text: "",
    };
    if (fileData && fileName) {
      extracted = extractTextFromUpload(fileName, mimeType, fileData);
    }

    if ((fileName.toLowerCase().endsWith(".pdf") || mimeType.includes("pdf")) && !extracted.text) {
      json(res, 400, {
        error: "TeacherFlowAI could not extract readable text from that PDF. Try exporting it again as a text-based PDF or paste the assessment text directly.",
      });
      return;
    }

    const mergedText = normalizeImportedText([resourceText, extracted.text].filter(Boolean).join("\n\n"));
    if (!mergedText) {
      json(res, 400, { error: "Paste text or upload a file before generating a transformed resource." });
      return;
    }

    const result = buildAssessmentTransform(mergedText, sourceType, targetType);
    appendUserActivity(user.id, {
      type: "repurpose",
      title: fileName ? `Generated parallel assessment from ${fileName}` : "Generated parallel assessment from pasted resource",
      description: result.summary,
      status: "generated",
      className: result.context.course,
    });

    json(res, 200, {
      ok: true,
      extraction: {
        fileName,
        parser: extracted.parser,
        textPreview: mergedText.slice(0, 500),
      },
      result,
    });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/profile") {
    const user = requireUser(req, res);
    if (!user) {
      return;
    }
    json(res, 200, { profile: sanitizeUser(user) });
    return;
  }

  if (req.method === "PATCH" && url.pathname === "/api/profile") {
    const user = requireUser(req, res);
    if (!user) {
      return;
    }

    const body = await readBody(req);
    const users = readUsers();
    const index = users.findIndex((candidate) => candidate.id === user.id);
    if (index === -1) {
      json(res, 404, { error: "Teacher account not found." });
      return;
    }

    users[index] = {
      ...users[index],
      name: String(body.name ?? users[index].name).trim(),
      school: String(body.school ?? users[index].school).trim(),
      title: String(body.title ?? users[index].title).trim(),
      department: String(body.department ?? users[index].department).trim(),
      phone: String(body.phone ?? users[index].phone).trim(),
      preferredView: ["desktop", "mobile", "auto"].includes(String(body.preferredView || "").trim())
        ? String(body.preferredView).trim()
        : users[index].preferredView || "desktop",
    };

    writeUsers(users);
    appendUserActivity(user.id, {
      type: "profile_update",
      title: "Updated teacher profile",
      description: "Account information and display preferences were updated.",
    });
    json(res, 200, { profile: sanitizeUser(users[index]) });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/settings/email") {
    const user = requireUser(req, res);
    if (!user) {
      return;
    }
    json(res, 200, { emailSettings: sanitizeEmailSettings(user.emailSettings || {}) });
    return;
  }

  if (req.method === "PATCH" && url.pathname === "/api/settings/email") {
    const user = requireUser(req, res);
    if (!user) {
      return;
    }

    const body = await readBody(req);
    const users = readUsers();
    const index = users.findIndex((candidate) => candidate.id === user.id);
    if (index === -1) {
      json(res, 404, { error: "Teacher account not found." });
      return;
    }

    const nextSettings = normalizeEmailSettingsInput(body, users[index].emailSettings || {});
    if (!nextSettings.host || !nextSettings.username) {
      json(res, 400, { error: "SMTP host and username are required." });
      return;
    }
    if (!nextSettings.password) {
      json(res, 400, { error: "SMTP password is required the first time you save this provider." });
      return;
    }

    users[index].emailSettings = getEncryptedEmailSettings(nextSettings);
    writeUsers(users);
    appendUserActivity(user.id, {
      type: "profile_update",
      title: "Updated email provider settings",
      description: `SMTP delivery is configured for ${nextSettings.username}.`,
    });
    json(res, 200, { emailSettings: sanitizeEmailSettings(nextSettings) });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/settings/email/test") {
    const user = requireUser(req, res);
    if (!user) {
      return;
    }

    const body = await readBody(req);
    const users = readUsers();
    const current = users.find((candidate) => candidate.id === user.id);
    const savedConfig = current?.emailSettings || {};
    if (!sanitizeEmailSettings(savedConfig).configured) {
      json(res, 400, { error: "Email provider is not configured yet. Save SMTP settings first." });
      return;
    }
    const recipient = normalizeEmail(body.to || user.email);
    if (!recipient) {
      json(res, 400, { error: "A test email recipient is required." });
      return;
    }

    try {
      await sendEmail(
        {
          to: recipient,
          subject: "TeacherFlowAI SMTP test",
          text: `This is a TeacherFlowAI test email for ${user.email}.\n\nIf you received this, your email provider settings are working.`,
        },
        savedConfig,
      );
      json(res, 200, { ok: true, message: `Test email sent to ${recipient}.` });
    } catch (error) {
      const failure = buildEmailFailurePayload(
        error,
        "Email provider is not configured yet. Save SMTP settings first.",
        "TeacherFlowAI could not send the test email. Check the SMTP values and try again.",
      );
      json(res, failure.status, failure.body);
    }
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/workspace") {
    const user = requireUser(req, res);
    if (!user) {
      return;
    }
    json(res, 200, { activities: getUserActivities(user.id) });
    return;
  }

  if (req.method === "DELETE" && url.pathname === "/api/workspace") {
    const user = requireUser(req, res);
    if (!user) {
      return;
    }
    const scope = String(url.searchParams.get("scope") || "all").trim().toLowerCase();
    json(res, 200, { ok: true, activities: clearUserActivitiesByScope(user.id, scope) });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/workspace/clear") {
    const user = requireUser(req, res);
    if (!user) {
      return;
    }
    const body = await readBody(req);
    const scope = String(body.scope || "all").trim().toLowerCase();
    json(res, 200, { ok: true, activities: clearUserActivitiesByScope(user.id, scope) });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/workspace/activity") {
    const user = requireUser(req, res);
    if (!user) {
      return;
    }

    const body = await readBody(req);
    const type = String(body.type || "").trim();
    const title = String(body.title || "").trim();
    const description = String(body.description || "").trim();
    if (!type || !title) {
      json(res, 400, { error: "Activity type and title are required." });
      return;
    }

    appendUserActivity(user.id, {
      type,
      title,
      description,
      studentId: String(body.studentId || "").trim(),
      studentName: String(body.studentName || "").trim(),
      className: String(body.className || "").trim(),
      status: String(body.status || "").trim(),
      dueDate: String(body.dueDate || "").trim(),
      dueTime: String(body.dueTime || "").trim(),
    });
    json(res, 201, { ok: true, activities: getUserActivities(user.id) });
    return;
  }

  const activityDeleteMatch = req.method === "DELETE" && url.pathname.match(/^\/api\/workspace\/activity\/([^/]+)$/);
  if (activityDeleteMatch) {
    const user = requireUser(req, res);
    if (!user) {
      return;
    }
    const activityId = decodeURIComponent(activityDeleteMatch[1]);
    json(res, 200, { ok: true, activities: deleteUserActivity(user.id, activityId) });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/workspace/activity/delete") {
    const user = requireUser(req, res);
    if (!user) {
      return;
    }
    const body = await readBody(req);
    const activityId = String(body.activityId || "").trim();
    if (!activityId) {
      json(res, 400, { error: "Activity id is required." });
      return;
    }
    json(res, 200, { ok: true, activities: deleteUserActivity(user.id, activityId) });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/students/import") {
    const user = requireUser(req, res);
    if (!user) {
      return;
    }

    const body = await readBody(req);
    const incoming = Array.isArray(body.students) ? body.students : [];
    const mode = String(body.mode || "replace").trim().toLowerCase();
    if (!incoming.length) {
      json(res, 400, { error: "No student records were provided." });
      return;
    }

    const normalized = [];
    for (const record of incoming) {
      const error = validateStudentRecord(record);
      if (error) {
        json(res, 400, { error });
        return;
      }
      normalized.push(normalizeStudent(record));
    }

    let nextStudents = normalized;
    if (mode === "append") {
      const existing = getUserStudents(user.id);
      const byId = new Map(existing.map((student) => [student.student_id, student]));
      normalized.forEach((student) => {
        byId.set(student.student_id, student);
      });
      nextStudents = [...byId.values()];
    }

    setUserStudents(user.id, nextStudents);
    json(res, 200, {
      ok: true,
      count: normalized.length,
      total: nextStudents.length,
      mode,
      classes: [...new Set(nextStudents.map((student) => student.class_name))].sort(),
      students: nextStudents,
    });
    return;
  }

  const studentMatch = req.method === "PATCH" && url.pathname.match(/^\/api\/students\/([^/]+)$/);
  if (studentMatch) {
    const user = requireUser(req, res);
    if (!user) {
      return;
    }

    const studentId = decodeURIComponent(studentMatch[1]);
    const body = await readBody(req);
    const students = getUserStudents(user.id);
    const index = students.findIndex((student) => student.student_id === studentId);

    if (index === -1) {
      json(res, 404, { error: "Student not found." });
      return;
    }

    const nextStudent = normalizeStudent({
      ...students[index],
      advisor_email: body.advisor_email ?? students[index].advisor_email,
      parent_email: body.parent_email ?? students[index].parent_email,
      teacher_notes: body.teacher_notes ?? students[index].teacher_notes,
    });

    students[index] = nextStudent;
    setUserStudents(user.id, students);
    json(res, 200, { ok: true, student: nextStudent });
    return;
  }

  json(res, 404, { error: "Route not found." });
}

async function serveStatic(req, res, url) {
  const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = path.join(ROOT, pathname);
  const normalizedPath = path.normalize(filePath);

  if (!normalizedPath.startsWith(ROOT)) {
    json(res, 403, { error: "Forbidden" });
    return;
  }

  if (!fs.existsSync(normalizedPath) || fs.statSync(normalizedPath).isDirectory()) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  const ext = path.extname(normalizedPath).toLowerCase();
  const types = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
  };

  res.writeHead(200, {
    "Content-Type": types[ext] || "application/octet-stream",
    "Cache-Control": "no-store",
  });
  fs.createReadStream(normalizedPath).pipe(res);
}
