const personas = [
  {
    id: "ceo",
    name: "总控本人",
    nickname: "人生游戏总 CEO",
    purpose: "负责方向、原则、节奏、反思、情绪管理和最终拍板。",
    mode: "统筹",
  },
  {
    id: "work-yuanqi",
    name: "元气工作人格",
    nickname: "元气森林的牛马",
    purpose: "处理工作相关的短期交付、压力管理和边界感。",
    mode: "执行",
  },
  {
    id: "baiheverse",
    name: "baiheverse 副业投资人",
    nickname: "副业投资人",
    purpose: "负责副业、产品、商业化、内容资产和长期复利。",
    mode: "创业",
  },
  {
    id: "personal-investor",
    name: "个人投资者",
    nickname: "投资人格",
    purpose: "负责仓位、标的、交易判断、风险控制和投资复盘。",
    mode: "判断",
  },
  {
    id: "renovation-manager",
    name: "装修经理",
    nickname: "装修项目经理",
    purpose: "负责装修推进、供应商沟通、预算、清单和待确认事项。",
    mode: "项目推进",
  },
  {
    id: "life-planner",
    name: "生活安排者",
    nickname: "日常关卡规划师",
    purpose: "负责旅行、家庭、健康、日常安排和生活体验。",
    mode: "安排",
  },
];

const seedProjects = [
  {
    id: "lifegame",
    name: "lifegame",
    chineseName: "玩中取乐系统",
    personaId: "ceo",
    why: "做一个愉快的人生提效工具，让 Vault-Life 成为人生游戏总控。",
    status: "seed",
    horizon: "mid",
    progress: "已确定代号、中文名、产品方向和首批人格。",
    blocker: "需要确认首批项目、人格式样和 MVP 技术路线。",
    next: "用配置文件跑通纸面系统，再 scaffold 本地 Web MVP。",
  },
  {
    id: "baiheverse",
    name: "baiheverse",
    personaId: "baiheverse",
    why: "作为副业和长期资产线，探索产品、内容和商业化机会。",
    status: "active",
    horizon: "long",
    progress: "已作为独立人格进入 lifegame 初始配置。",
    blocker: "需要补充当前具体项目和下一步。",
    next: "梳理 baiheverse 当前在做的 1-3 个具体项目。",
  },
  {
    id: "personal-investing",
    name: "个人投资",
    personaId: "personal-investor",
    why: "管理个人投资判断、仓位、研究问题和复盘。",
    status: "active",
    horizon: "long",
    progress: "已作为独立人格进入 lifegame 初始配置。",
    blocker: "需要定义投资记录进入 lifegame 的边界。",
    next: "确认投资模块首版只记录决策和复盘，还是也记录持仓状态。",
  },
  {
    id: "renovation",
    name: "装修",
    personaId: "renovation-manager",
    why: "推进装修事项，沉淀装修经验，减少反复纠结。",
    status: "active",
    horizon: "mid",
    progress: "已作为独立人格进入 lifegame 初始配置。",
    blocker: "需要从现有装修 wiki 中选择进入 lifegame 的项目边界。",
    next: "确认装修相关项目是合并为一个项目，还是拆成 hxt、待选清单、复盘。",
  },
  {
    id: "life-arrangement",
    name: "生活安排",
    personaId: "life-planner",
    why: "管理旅行、健康、家庭、日常安排，让生活更顺。",
    status: "seed",
    horizon: "mid",
    progress: "已作为生活人格进入初始配置。",
    blocker: "需要补充当前真实事项。",
    next: "列出最近 2 周生活安排里最值得跟踪的事情。",
  },
  {
    id: "work-rhythm",
    name: "工作节奏",
    personaId: "work-yuanqi",
    why: "只在 Life 空间记录个人节奏、压力和边界，不记录公司业务材料。",
    status: "seed",
    horizon: "short",
    progress: "已作为工作人格的 Life 侧投影进入初始配置。",
    blocker: "需要保持与 Vault-Work 的边界。",
    next: "定义哪些工作反思可以进入 Life，哪些必须留在 Work。",
  },
];

const storageKeys = {
  projects: "lifegame.projects.v1",
  journal: "lifegame.journal.v1",
  ui: "lifegame.ui.v1",
};

let projects = sanitizeProjects(loadFromStorage(storageKeys.projects, seedProjects));
let journalEntries = loadFromStorage(storageKeys.journal, []);
let editingProjectId = null;

saveToStorage(storageKeys.projects, projects);

const fallbackQuestions = [
  { label: "行动问题", text: "我最近 14 天真正要推进哪三件事？" },
  { label: "判断问题", text: "这个项目存在的理由是否还成立？" },
  { label: "过滤问题", text: "这次思考是任务、判断、问题、外部影响，还是噪音？" },
  { label: "边界问题", text: "哪个人格正在接管太多注意力？" },
];

const state = normalizeUiState(
  loadFromStorage(storageKeys.ui, {
  view: "hall",
  personaId: "all",
  horizon: "mid",
  }),
);

const personaList = document.querySelector("#personaList");
const railTitle = document.querySelector("#railTitle");
const affairsPersonaList = document.querySelector("#affairsPersonaList");
const projectGrid = document.querySelector("#projectGrid");
const todayView = document.querySelector("#todayView");
const hallRoomGrid = document.querySelector("#hallRoomGrid");
const affairsRoom = document.querySelector("#affairsRoom");
const questionList = document.querySelector("#questionList");
const councilList = document.querySelector("#councilList");
const npcEchoList = document.querySelector("#npcEchoList");
const recentEntryList = document.querySelector("#recentEntryList");
const stageTitle = document.querySelector("#stageTitle");
const journalStack = document.querySelector("#journalStack");
const captureForm = document.querySelector("#captureForm");
const capturePersona = document.querySelector("#capturePersona");
const captureText = document.querySelector("#captureText");

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : structuredClone(fallback);
  } catch {
    return structuredClone(fallback);
  }
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function sanitizeProjects(projectList) {
  const validPersonaIds = new Set(personas.map((persona) => persona.id));
  return projectList.filter((project) => validPersonaIds.has(project.personaId));
}

function personaName(id) {
  return personas.find((persona) => persona.id === id)?.name ?? "未分配";
}

function horizonLabel(horizon) {
  return {
    short: "短期",
    mid: "中期",
    long: "长期",
  }[horizon] ?? "全部";
}

function renderStats() {
  const personaCount = document.querySelector("#personaCount");
  if (!personaCount) return;

  personaCount.textContent = personas.length;
  document.querySelector("#projectCount").textContent = projects.length;
  document.querySelector("#shortCount").textContent = projects.filter(
    (project) => project.horizon === "short",
  ).length;
  document.querySelector("#futureCount").textContent = projects.filter((project) =>
    ["mid", "long"].includes(project.horizon),
  ).length;
}

function renderPersonas() {
  const inAffairs = state.view === "affairs";
  railTitle.textContent = inAffairs ? "今日事务" : "大厅";
  personaList.hidden = !inAffairs;

  personaList.innerHTML = personas
    .map(
      (persona) => `
        <button class="persona-card ${state.personaId === persona.id ? "active" : ""}" data-persona="${persona.id}">
          <span>${persona.mode}</span>
          <strong>${persona.name}</strong>
          <span>${persona.nickname}</span>
        </button>
      `,
    )
    .join("");

  affairsPersonaList.innerHTML = personas
    .map(
      (persona) => `
        <button class="${state.personaId === persona.id ? "active" : ""}" data-quick-persona="${persona.id}">
          ${persona.name}
        </button>
      `,
    )
    .join("");
}

function renderCapturePersonaOptions() {
  capturePersona.innerHTML = personas
    .map((persona) => `<option value="${persona.id}">${persona.name}</option>`)
    .join("");
  syncCapturePersona();
}

function filteredProjects() {
  return projects.filter((project) => {
    const personaMatch = state.personaId === "all" || project.personaId === state.personaId;
    const horizonMatch = ["mid", "long"].includes(project.horizon) && project.horizon === state.horizon;
    return personaMatch && horizonMatch;
  });
}

function renderProjects() {
  const selectedPersona = personas.find((persona) => persona.id === state.personaId);
  renderLayoutMode();
  if (state.view === "hall") {
    stageTitle.textContent = "大厅";
    projectGrid.innerHTML = "";
    projectGrid.hidden = true;
    return;
  }

  stageTitle.textContent = "今日事务";

  if (!selectedPersona) {
    projectGrid.innerHTML = "";
    projectGrid.hidden = true;
    return;
  }

  projectGrid.hidden = false;

  const cards = filteredProjects();
  if (cards.length === 0) {
    projectGrid.innerHTML = `
      <section class="project-board">
        <div class="project-board-head">
          <span>人格项目</span>
          <div class="segmented" aria-label="项目时间视角">
            <button class="${state.horizon === "mid" ? "active" : ""}" data-horizon="mid">中期</button>
            <button class="${state.horizon === "long" ? "active" : ""}" data-horizon="long">长期</button>
          </div>
        </div>
        <div class="empty-state">
          这个人格暂时没有${horizonLabel(state.horizon)}项目。
        </div>
      </section>
    `;
    return;
  }

  projectGrid.innerHTML = `
    <section class="project-board">
      <div class="project-board-head">
        <span>人格项目</span>
        <div class="segmented" aria-label="项目时间视角">
          <button class="${state.horizon === "mid" ? "active" : ""}" data-horizon="mid">中期</button>
          <button class="${state.horizon === "long" ? "active" : ""}" data-horizon="long">长期</button>
        </div>
      </div>
      <div class="project-card-grid">
        ${cards
    .map(
      (project) => {
        const isEditing = editingProjectId === project.id;
        return `
        <article class="project-card">
          <div class="project-head">
            <div>
              <span>${personaName(project.personaId)} / ${project.status}</span>
              <strong>${project.chineseName ?? project.name}</strong>
            </div>
            <span class="badge">${horizonLabel(project.horizon)}</span>
          </div>
          <p>${project.why}</p>
          ${
            isEditing
              ? `
                <div class="edit-fields">
                  <label>进展<textarea data-edit-field="progress">${project.progress}</textarea></label>
                  <label>卡点<textarea data-edit-field="blocker">${project.blocker}</textarea></label>
                  <label>下一步<textarea data-edit-field="next">${project.next}</textarea></label>
                </div>
              `
              : `
                <p><strong>进展：</strong>${project.progress}</p>
                <p><strong>卡点：</strong>${project.blocker}</p>
                <div class="next-action">
                  <span>下一步</span>
                  <p>${project.next}</p>
                </div>
              `
          }
          <div class="project-actions">
            ${
              isEditing
                ? `
                  <button class="primary" data-save-project="${project.id}">保存</button>
                  <button data-cancel-edit="${project.id}">取消</button>
                `
                : `<button data-edit-project="${project.id}">编辑</button>`
            }
          </div>
        </article>
      `;
      },
    )
    .join("")}
      </div>
    </section>
  `;
}

function renderTodayView() {
  if (state.view === "hall") {
    todayView.innerHTML = "";
    todayView.hidden = true;
    return;
  }

  todayView.hidden = false;
  const projectScope = projects.filter((project) => state.personaId === "all" || project.personaId === state.personaId);
  const shortProjects = projectScope.filter(
    (project) => project.horizon === "short" && project.status !== "seed",
  );
  const activeProjects = projectScope.filter((project) => project.status !== "seed");
  const openEntries = visibleEntries().filter((entry) => !entry.processed);
  const pendingJudgments = openEntries.filter((entry) => entry.type === "judgment");
  const openQuestions = openEntries.filter((entry) => entry.type === "question");
  const npcInfluences = openEntries.filter((entry) => entry.type === "influence");
  const latestThoughts = openEntries.slice(-3).reverse();
  const todayItems = openEntries.filter((entry) => entry.type === "task" && entry.bucket === "today");
  const firstFocus = shortProjects[0] ?? activeProjects[0];
  const firstTodayItem = todayItems[0];

  todayView.innerHTML = `
    <section class="affairs-board">
      <div class="room-title">
        <span>${personaName(state.personaId)} 今日事务</span>
        <strong>${todayItems.length}</strong>
      </div>
      <div class="affairs-card-grid">
        <article class="today-card">
          <span>今日事项</span>
          <strong>${firstTodayItem?.text ?? `${todayItems.length} 个事项`}</strong>
          <p>${firstTodayItem ? "已进入今天要处理的事项。" : (firstFocus?.next ?? "先往思考之地丢一条真实输入，让系统从你的原话里分流。")}</p>
          ${
            !firstTodayItem && firstFocus
              ? `<div class="flow-actions"><button data-create-todo-from-project="${firstFocus.id}">加入今日事项</button></div>`
              : ""
          }
        </article>
        <article class="today-card">
          <span>等待拍板</span>
          <strong>${pendingJudgments.length} 条判断</strong>
          <p>${pendingJudgments[0]?.text ?? "暂时没有待拍板判断。"}</p>
        </article>
        <article class="today-card">
          <span>最近思考</span>
          <strong>${openQuestions.length} 个问题</strong>
          <p>${openQuestions[0]?.text ?? latestThoughts[0]?.text ?? "思考之地目前很干净。"}</p>
        </article>
        <article class="today-card">
          <span>短期池</span>
          <strong>${shortProjects.length} 个项目</strong>
          <p>${shortProjects.map((project) => project.name).join(" / ") || "没有真实短期项目。"}</p>
        </article>
      </div>
    </section>
  `;
}

function renderJournal() {
  if (journalEntries.length === 0) {
    journalStack.innerHTML = `
      <article class="journal-empty">
        <span>等待输入</span>
        <strong>这里会显示刚刚整理好的思绪。</strong>
      </article>
    `;
    return;
  }

  journalStack.innerHTML = journalEntries
    .slice()
    .reverse()
    .slice(0, 4)
    .map(
      (entry) => `
        <article class="${entry.type === "noise" ? "noise" : ""} ${entry.processed ? "processed" : ""}">
          <div class="journal-head">
            <span>${captureTypeLabel(entry.type)} / ${personaName(entry.personaId)}${entry.npcName ? ` / NPC: ${entry.npcName}` : ""}${entry.processed ? " / 已处理" : ""} / ${entry.createdAt}</span>
            <div class="entry-tools">
              <button data-delete-entry="${entry.id}" title="删除记录">×</button>
            </div>
          </div>
          <strong>${entry.text}</strong>
          <div class="auto-label">
            <span>系统判定：${captureTypeLabel(entry.type)}</span>
            <label>
              判错了再改
              <select data-entry-type="${entry.id}" title="修正类型">
                ${captureTypes
                  .map(
                    (type) =>
                      `<option value="${type.value}" ${entry.type === type.value ? "selected" : ""}>${type.label}</option>`,
                  )
                  .join("")}
              </select>
            </label>
          </div>
          <div class="entry-footer">
            <button class="done" data-mark-processed="${entry.id}">${entry.processed ? "取消处理" : "已收纳"}</button>
          </div>
        </article>
      `,
    )
    .join("");
}

function captureTypeLabel(type) {
  return captureTypes.find((item) => item.value === type)?.label ?? "记录";
}

function routeEntryType(entry, type) {
  const routedEntry = { ...entry, type };
  if (type === "task") {
    return { ...routedEntry, bucket: routedEntry.bucket ?? "today" };
  }
  if (routedEntry.bucket === "today") {
    delete routedEntry.bucket;
    delete routedEntry.sourceProjectId;
  }
  return routedEntry;
}

const captureTypes = [
  { value: "diary", label: "思考" },
  { value: "task", label: "任务" },
  { value: "judgment", label: "判断" },
  { value: "question", label: "问题" },
  { value: "influence", label: "外部影响" },
  { value: "noise", label: "噪音 / 测试" },
];

function classifyCapture(text, npcName) {
  const content = text.toLowerCase();
  if (npcName || detectNpcName(text)) return "influence";
  if (/(测试一下|试一下|test|随便问问|hello|hi)/i.test(text)) return "noise";
  if (/[?？]$/.test(text.trim()) || /(怎么|为什么|要不要|是否|能不能|该不该|如何)/.test(text)) {
    return "question";
  }
  if (/(决定|判断|选择|原则|采纳|不采纳|权重|影响|边界|复盘)/.test(text)) return "judgment";
  if (/(要做|下一步|todo|待办|记得|安排|推进|确认|完成)/i.test(content)) return "task";
  return "diary";
}

function detectNpcName(text) {
  const patterns = [
    /(?:^|[，。；\s])([\u4e00-\u9fa5A-Za-z0-9_·]{1,12})(?:跟|和|对|给)我(?:说|讲|建议|提醒|吐槽|表示|认为|提到|强调)/,
    /(?:^|[，。；\s])([\u4e00-\u9fa5A-Za-z0-9_·]{1,12})(?:说|讲|建议|提醒|吐槽|认为|觉得|提到|强调)/,
    /我(?:妈|爸|老婆|朋友|同事|老板|客户|中介|设计师|工长|医生|老师)(?:跟|和|对|给)?我?(?:说|讲|建议|提醒|吐槽|认为|觉得|提到|强调)/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match) continue;
    return match[1] ?? match[0].match(/我(?:妈|爸|老婆|朋友|同事|老板|客户|中介|设计师|工长|医生|老师)/)?.[0] ?? "";
  }

  return "";
}

function renderQuestions() {
  const questions = buildQuestionMap();
  document.querySelector("#questionCount").textContent = questions.length;

  if (questions.length === 0) {
    if (state.personaId !== "all") {
      questionList.innerHTML = `
        <article class="question-item seed">
          <span>${personaName(state.personaId)}</span>
          <strong>这个人格还没有自己的问题。</strong>
        </article>
      `;
      return;
    }

    questionList.innerHTML = fallbackQuestions
      .map(
        (question) => `
          <article class="question-item seed">
            <span>${question.label}</span>
            <strong>${question.text}</strong>
          </article>
        `,
      )
      .join("");
    return;
  }

  questionList.innerHTML = questions
    .map(
      (question) => `
        <article class="question-item">
          <span>${question.label} / ${question.count} 次 / ${question.personas}</span>
          <strong>${question.text}</strong>
          ${question.latest !== question.text ? `<p>${question.latest}</p>` : ""}
        </article>
      `,
    )
    .join("");
}

function renderRooms() {
  const inHall = state.view === "hall";
  hallRoomGrid.hidden = !inHall;
  affairsRoom.hidden = true;

  if (!inHall) {
    return;
  }

  renderQuestions();
  renderCouncilRoom();
  renderNpcEchoRoom();
  renderRecentRoom();
}

function renderCouncilRoom() {
  const judgments = visibleEntries()
    .filter((entry) => entry.type === "judgment")
    .slice()
    .reverse()
    .slice(0, 4);

  document.querySelector("#councilCount").textContent = judgments.length;
  councilList.innerHTML =
    judgments
      .map(
        (entry) => `
          <article class="room-item">
            <span>${personaName(entry.personaId)} / ${entry.createdAt}</span>
            <strong>${entry.text}</strong>
          </article>
        `,
      )
      .join("") || `<article class="room-item seed"><strong>暂时没有需要拍板的判断。</strong></article>`;
}

function renderNpcEchoRoom() {
  const echoes = visibleEntries()
    .filter((entry) => entry.type === "influence")
    .slice()
    .reverse()
    .slice(0, 4);

  document.querySelector("#npcEchoCount").textContent = echoes.length;
  npcEchoList.innerHTML =
    echoes
      .map(
        (entry) => `
          <article class="room-item">
            <span>${entry.npcName ? `NPC: ${entry.npcName}` : personaName(entry.personaId)} / ${entry.createdAt}</span>
            <strong>${entry.text}</strong>
          </article>
        `,
      )
      .join("") || `<article class="room-item seed"><strong>暂时没有外部输入影响你。</strong></article>`;
}

function renderRecentRoom() {
  const recentEntries = visibleEntries()
    .filter((entry) => entry.type !== "noise")
    .slice()
    .reverse()
    .slice(0, 5);

  document.querySelector("#recentEntryCount").textContent = recentEntries.length;
  recentEntryList.innerHTML =
    recentEntries
      .map(
        (entry) => `
          <article class="room-item">
            <span>${captureTypeLabel(entry.type)} / ${personaName(entry.personaId)} / ${entry.createdAt}</span>
            <strong>${entry.text}</strong>
          </article>
        `,
      )
      .join("") || `<article class="room-item seed"><strong>新的思考会先落在这里，再去各个房间沉淀。</strong></article>`;
}

function visibleEntries() {
  return journalEntries.filter((entry) => state.personaId === "all" || entry.personaId === state.personaId);
}

function buildQuestionMap() {
  const groups = new Map();

  visibleEntries()
    .filter((entry) => entry.type !== "noise")
    .filter((entry) => entry.type === "question" || isQuestionLike(entry.text))
    .forEach((entry) => {
      const questionText = extractQuestionText(entry.text);
      const key = normalizeQuestion(questionText);
      if (!key) return;

      const current = groups.get(key) ?? {
        text: questionText,
        count: 0,
        latest: "",
        latestIndex: -1,
        personas: new Set(),
        openCount: 0,
      };
      current.count += 1;
      current.openCount += entry.processed ? 0 : 1;
      current.personas.add(personaName(entry.personaId));
      current.latest = entry.text;
      current.latestIndex = journalEntries.indexOf(entry);
      groups.set(key, current);
    });

  return [...groups.values()]
    .sort((a, b) => b.openCount - a.openCount || b.count - a.count || b.latestIndex - a.latestIndex)
    .slice(0, 6)
    .map((question) => ({
      label: question.openCount > 0 ? `${question.openCount} 个未处理` : "已沉淀",
      text: question.text,
      latest: question.latest,
      count: question.count,
      personas: [...question.personas].join(" / "),
    }));
}

function isQuestionLike(text) {
  return /[?？]/.test(text) || /(怎么|为什么|要不要|是否|能不能|该不该|如何|哪几个|哪些)/.test(text);
}

function extractQuestionText(text) {
  const parts = text
    .split(/[\n。；;]/)
    .map((part) => part.trim())
    .filter(Boolean);
  const questionPart = parts.find((part) => isQuestionLike(part));
  return (questionPart ?? text).trim();
}

function normalizeQuestion(text) {
  return text
    .toLowerCase()
    .replace(/[，。！？?、；;：:\s"'“”‘’（）()]/g, "")
    .slice(0, 48);
}

function normalizeUiState(uiState) {
  const validPersonaIds = new Set(personas.map((persona) => persona.id));
  const view = uiState.view === "affairs" ? "affairs" : "hall";
  const personaId =
    view === "affairs" && validPersonaIds.has(uiState.personaId) ? uiState.personaId : "all";
  const horizon = ["mid", "long"].includes(uiState.horizon) ? uiState.horizon : "mid";
  return { view, personaId, horizon };
}

function saveUiState() {
  saveToStorage(storageKeys.ui, state);
}

function setPersona(personaId) {
  state.view = "affairs";
  state.personaId = personaId;
  saveUiState();
  syncCapturePersona();
  renderPersonas();
  renderProjects();
  renderTodayView();
  renderRooms();
}

function enterAffairs(personaId = state.personaId === "all" ? "ceo" : state.personaId) {
  setPersona(personaId);
}

function enterHall() {
  state.view = "hall";
  state.personaId = "all";
  saveUiState();
  syncCapturePersona();
  renderPersonas();
  renderProjects();
  renderTodayView();
  renderRooms();
}

function renderLayoutMode() {
  document.body.classList.toggle("home-mode", state.view === "hall");
  document.body.classList.toggle("affairs-mode", state.view === "affairs");
}

function syncCapturePersona() {
  if (!capturePersona) return;
  capturePersona.value = state.personaId === "all" ? "ceo" : state.personaId;
}

function setHorizon(horizon) {
  state.horizon = horizon;
  saveUiState();
  document.querySelectorAll("[data-horizon]").forEach((button) => {
    button.classList.toggle("active", button.dataset.horizon === horizon);
  });
  renderProjects();
}

document.addEventListener("click", (event) => {
  const personaButton = event.target.closest("[data-persona]");
  if (personaButton) setPersona(personaButton.dataset.persona);

  const quickPersonaButton = event.target.closest("[data-quick-persona]");
  if (quickPersonaButton) setPersona(quickPersonaButton.dataset.quickPersona);

  const horizonButton = event.target.closest("[data-horizon]");
  if (horizonButton) setHorizon(horizonButton.dataset.horizon);

  const editButton = event.target.closest("[data-edit-project]");
  if (editButton) {
    editingProjectId = editButton.dataset.editProject;
    renderProjects();
  }

  const cancelButton = event.target.closest("[data-cancel-edit]");
  if (cancelButton) {
    editingProjectId = null;
    renderProjects();
    renderTodayView();
  }

  const saveButton = event.target.closest("[data-save-project]");
  if (saveButton) {
    const card = saveButton.closest(".project-card");
    const updates = Object.fromEntries(
      [...card.querySelectorAll("[data-edit-field]")].map((field) => [
        field.dataset.editField,
        field.value.trim(),
      ]),
    );
    projects = projects.map((project) =>
      project.id === saveButton.dataset.saveProject ? { ...project, ...updates } : project,
    );
    saveToStorage(storageKeys.projects, projects);
    editingProjectId = null;
    renderProjects();
  }

  const deleteEntryButton = event.target.closest("[data-delete-entry]");
  if (deleteEntryButton) {
    journalEntries = journalEntries.filter((entry) => entry.id !== deleteEntryButton.dataset.deleteEntry);
    saveToStorage(storageKeys.journal, journalEntries);
    renderJournal();
    renderTodayView();
    renderRooms();
  }

  const flowButton = event.target.closest("[data-flow-entry]");
  if (flowButton) {
    journalEntries = journalEntries.map((entry) =>
      entry.id === flowButton.dataset.flowEntry ? routeEntryType(entry, flowButton.dataset.flowType) : entry,
    );
    saveToStorage(storageKeys.journal, journalEntries);
    renderJournal();
    renderTodayView();
    renderRooms();
  }

  const processedButton = event.target.closest("[data-mark-processed]");
  if (processedButton) {
    journalEntries = journalEntries.map((entry) =>
      entry.id === processedButton.dataset.markProcessed
        ? { ...entry, processed: !entry.processed }
        : entry,
    );
    saveToStorage(storageKeys.journal, journalEntries);
    renderJournal();
    renderTodayView();
    renderRooms();
  }

  const setNextButton = event.target.closest("[data-set-next]");
  if (setNextButton) {
    const entry = journalEntries.find((item) => item.id === setNextButton.dataset.setNext);
    if (!entry) return;
    const targetProject = projects.find((project) => project.personaId === entry.personaId) ?? projects[0];
    projects = projects.map((project) =>
      project.id === targetProject.id ? { ...project, next: entry.text } : project,
    );
    journalEntries = journalEntries.map((item) =>
      item.id === entry.id ? { ...item, type: "task", processed: true } : item,
    );
    saveToStorage(storageKeys.projects, projects);
    saveToStorage(storageKeys.journal, journalEntries);
    renderProjects();
    renderJournal();
    renderTodayView();
    renderRooms();
  }

  const createTodoButton = event.target.closest("[data-create-todo-from-project]");
  if (createTodoButton) {
    const project = projects.find((item) => item.id === createTodoButton.dataset.createTodoFromProject);
    if (!project) return;
    const existingTodayItem = journalEntries.find(
      (entry) => entry.bucket === "today" && entry.sourceProjectId === project.id && !entry.processed,
    );
    if (existingTodayItem) return;

    journalEntries.push({
      id: crypto.randomUUID(),
      type: "task",
      bucket: "today",
      personaId: project.personaId,
      npcName: "",
      text: project.next,
      sourceProjectId: project.id,
      createdAt: new Date().toLocaleString("zh-CN", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
    saveToStorage(storageKeys.journal, journalEntries);
    renderJournal();
    renderTodayView();
    renderRooms();
  }
});

document.addEventListener("change", (event) => {
  const typeSelect = event.target.closest("[data-entry-type]");
  if (!typeSelect) return;

  journalEntries = journalEntries.map((entry) =>
    entry.id === typeSelect.dataset.entryType ? routeEntryType(entry, typeSelect.value) : entry,
  );
  saveToStorage(storageKeys.journal, journalEntries);
  renderJournal();
  renderTodayView();
  renderRooms();
});

document.querySelector("#resetPersona").addEventListener("click", enterHall);
document.querySelector("#returnHomeTop").addEventListener("click", enterHall);
document.querySelector("[data-enter-affairs]").addEventListener("click", () => enterAffairs());
document.querySelector("#clearDraft").addEventListener("click", () => {
  captureText.value = "";
  captureText.focus();
});

captureForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = captureText.value.trim();
  if (!text) {
    captureText.focus();
    return;
  }
  const detectedNpcName = detectNpcName(text);
  const type = classifyCapture(text, detectedNpcName);

  journalEntries.push({
    id: crypto.randomUUID(),
    type,
    ...(type === "task" ? { bucket: "today" } : {}),
    personaId: capturePersona.value,
    npcName: detectedNpcName,
    text,
    createdAt: new Date().toLocaleString("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
  });
  saveToStorage(storageKeys.journal, journalEntries);
  captureText.value = "";
  renderJournal();
  renderTodayView();
  renderRooms();
});

renderStats();
renderCapturePersonaOptions();
renderPersonas();
renderProjects();
renderTodayView();
renderJournal();
renderRooms();
