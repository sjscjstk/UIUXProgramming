const flowNicknameInput = document.querySelector("#flow-nickname");
const flowNicknameCount = document.querySelector("#flow-nickname-count");
const serviceName = "Re:hear";
let isSubcribed = false;
let submitCount = 0;

function makeSubscribeMessage(email, subscribed) {
    if (subscribed == true) {
        return email + "로 신청이 완료되었습니다.";
    }

    return "이메일을 입력한 뒤 신청해주세요.";
}

const subscribeForm = document.querySelector("#subscribe-form");
const emailInput = document.querySelector("#email");
const subscribeButton = document.querySelector("#subscribeButton");
const subscribeMessage = document.querySelector("#subscribeMessage");

function handleSubscribe(event) {
    event.preventDefault();

    const subscriberEmail = emailInput.value.trim();

    if (subscriberEmail === "") {
        subscribeMessage.textContent = 
            "이메일을 입력한 뒤 신청해주세요.";
        emailInput.focus();
        return;
    }

    isSubcribed = true;
    submitCount += 1;

    subscribeMessage.textContent =
        makeSubscribeMessage(subscriberEmail, isSubcribed);

    subscribeMessage.classList.add("is-success");

    subscribeButton.textContent = "신청 완료";
    subscribeButton.disabled = true;
}

subscribeForm.addEventListener("submit", handleSubscribe);

const themeButton = document.querySelector("#themeButton");
const nicknameInput = document.querySelector("#nickname");
const nicknameCount = document.querySelector("#nicknameCount");
const agreeCheck = document.querySelector("#agreeCheck");
const agreeMessage = document.querySelector("#agreeMessage");
const startButton = document.querySelector("#startButton");

function handleThemeClick() {
  const isDark = document.body.classList.toggle("dark");

  themeButton.textContent = isDark ? "라이트 모드" : "다크 모드";
  themeButton.setAttribute("aria-pressed", String(isDark));
}

themeButton.addEventListener("click", handleThemeClick);

function handleNicknameInput() {
  const maxLength = nicknameInput.maxLength;
  const currentLength = Math.min(nicknameInput.value.length, maxLength);

  nicknameCount.textContent = currentLength + " / " + maxLength;
}

nicknameInput.addEventListener("input", handleNicknameInput);

function handleAgreeChange() {
  const agreed = agreeCheck.checked;

  startButton.disabled = !agreed;
  agreeMessage.textContent = agreed
    ? "확인이 완료되었습니다. 서비스를 시작할 수 있습니다."
    : "동의 후 서비스를 시작할 수 있습니다.";
  
  if (agreed) {
    agreeMessage.classList.add("is-ready");
  }else {
    agreeMessage.classList.remove("is-ready");
  }
}

agreeCheck.addEventListener("change", handleAgreeChange);

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

function resetTabsAndPanels() {
  tabs.forEach(function (tab) {
    tab.classList.remove("is-active");
    tab.setAttribute("aria-selected", "false");
  });
  panels.forEach(function (panel) {
    panel.classList.remove("is-active");
    panel.hidden = true;
  });
}

function activateTab(clickedTab) {
  const targetSelector = clickedTab.dataset.target;
  const targetPanel = document.querySelector(targetSelector);

  clickedTab.classList.add("is-active");
  clickedTab.setAttribute("aria-selected", "true");

  targetPanel.classList.add("is-active");
  targetPanel.hidden = false;
}

function handleTabClick(event) {
  resetTabsAndPanels();
  activateTab(event.currentTarget);
}

tabs.forEach(function (tab) {
  tab.addEventListener("click", handleTabClick);
});

const trainingFlow = document.querySelector("#training-flow");
const heroTitleInput = document.querySelector("#hero-title-input");
const heroTitleError = document.querySelector("#hero-title-error");
const heroStartButton = document.querySelector("#hero-start-button");
const plannerSection = document.querySelector("#planner");
const planForm = document.querySelector("#plan-form");

const flowSteps = trainingFlow.querySelectorAll(".flow-step");
const progressItems = trainingFlow.querySelectorAll(".progress-item");
const titleInput = document.querySelector("#presentation-title");
const titleError = document.querySelector("#title-error");
const titleNext = document.querySelector("#title-next");
const qnaOption = document.querySelector("#qna-option");
const qnaOptions = document.querySelector("#qna-options");
const optionPrev = document.querySelector("#option-prev");
const optionNext = document.querySelector("#option-next");
const editInfoButton = document.querySelector("#edit-info");
const editOptionsButton = document.querySelector("#edit-options");
const finishButton = document.querySelector("#finish-button");
const restartButton = document.querySelector("#restart-button");

const summaryTitle = document.querySelector("#summary-title");
const summaryNickname = document.querySelector("#summary-nickname");
const summaryDuration = document.querySelector("#summary-duration");
const summaryQna = document.querySelector("#summary-qna");
const titleStatus = document.querySelector("#title-status");
const flowNicknameError = document.querySelector("#flow-nickname-error");
const submitStatus = document.querySelector("#submit-status");
const qnaRadios = planForm.querySelectorAll('input[name="qna-count"]');
const MIN_TITLE = 2;
const MIN_NICKNAME = 2;
let currentStep = 0;
let isSubmitting = false;

const formData = {
  title: "",
  duration: "100",
  qna: false,
  qnaCount: "교육/어린이시설"
};

function showStep(index) {
  currentStep = index;
  flowSteps.forEach((step, i) => {
    step.hidden = i !== index;
  });
  progressItems.forEach((item, i) => {
    const isCurrent = i === index;
    item.classList.toggle("is-current", isCurrent);
    item.classList.toggle("is-done", i < index);
    if (isCurrent && index < 3) {
      item.setAttribute("aria-current", "step");
    } else {
      item.removeAttribute("aria-current");
    }
  });
}

const recordingDialog = document.querySelector("#recording-dialog");
const recordingCancel = document.querySelector("#recording-cancel");
const recordingConfirm = document.querySelector("#recording-confirm");

function revokeRecordingAgreement() {
  agreeCheck.checked = false;
  trainingFlow.hidden = true;
  plannerSection.hidden = true;
  handleAgreeChange();
  agreeCheck.focus();
}

startButton.addEventListener("click", () => {
  if (!agreeCheck.checked) return;
  recordingDialog.showModal();
});

recordingCancel.addEventListener("click", () => {
  recordingDialog.close();
  revokeRecordingAgreement();
});

recordingDialog.addEventListener("cancel", revokeRecordingAgreement);

recordingConfirm.addEventListener("click", () => {
  if (!agreeCheck.checked) return;
  recordingDialog.close();
  trainingFlow.hidden = false;
  plannerSection.hidden = true;
  trainingFlow.scrollIntoView({ behavior: "smooth" });
  heroTitleInput.focus();
});

// 1. 첫 번째 배너(Hero)에서 시군구명 입력 후 [상세 검색하기] 클릭 시
heroStartButton.addEventListener("click", () => {
  const value = heroTitleInput.value.trim();
  const message = getTitleError(value);
  if (message) {
    heroTitleError.textContent = message;
    heroTitleInput.setAttribute("aria-invalid", "true");
    heroTitleInput.focus();
    return;
  }
  heroTitleError.textContent = "";
  heroTitleInput.removeAttribute("aria-invalid");
  titleInput.value = value;
  formData.title = value;
  setFieldError(titleInput, titleError, "");
  updateTitleFeedback();

  // 메인 화면의 사용자 이름을 1단계 입력창에도 반영
  if (nicknameInput && flowNicknameInput) {
    flowNicknameInput.value = nicknameInput.value;
    setFieldError(flowNicknameInput, flowNicknameError, "");
    updateNicknameFeedback();
  }

  plannerSection.hidden = false;
  showStep(0);
  plannerSection.scrollIntoView({ block: "start", behavior: "smooth" });
  titleInput.focus();
});

flowNicknameInput.addEventListener("input", updateNicknameFeedback);
titleInput.addEventListener("input", updateTitleFeedback);

// 입력하는 동안: 오류가 표시된 상태에서 올바르게 고치면 오류 해제
heroTitleInput.addEventListener("input", () => {
  if (!heroTitleError.textContent) return;
  const message = getTitleError(heroTitleInput.value.trim());
  heroTitleError.textContent = message;
  if (!message) heroTitleInput.removeAttribute("aria-invalid");
});

heroTitleInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    heroStartButton.click();
  }
});

// ---------- 입력 검증 ----------
function getTitleError(value) {
  if (!value) return "시군구명을 입력해 주세요. 예: 관악구";
  if (/[^가-힣0-9\s]/.test(value)) return "한글 시군구명만 입력할 수 있어요. 영문·특수문자를 지우고 다시 입력해 주세요.";
  if (value.length < MIN_TITLE) return `시군구명은 ${MIN_TITLE}글자 이상 입력해 주세요. 예: 관악구, 가평군`;
  return "";
}

function getNicknameError(value) {
  if (value && value.length < MIN_NICKNAME) {
    return `사용자 이름은 ${MIN_NICKNAME}글자 이상 입력해 주세요. 사용하지 않으려면 비워 두세요.`;
  }
  return "";
}

function setFieldError(input, errorEl, message) {
  errorEl.textContent = message;
  input.classList.toggle("has-error", Boolean(message));
  if (message) {
    input.setAttribute("aria-invalid", "true");
  } else {
    input.removeAttribute("aria-invalid");
  }
}

// 입력하는 동안 글자 수와 조건 충족 여부를 문구로 표시
function updateTitleFeedback() {
  const value = titleInput.value.trim();
  const message = getTitleError(value);
  titleStatus.classList.toggle("is-valid", value !== "" && !message);
  titleStatus.classList.toggle("is-invalid", value !== "" && Boolean(message));
  if (!value) {
    titleStatus.textContent = `0자 입력 · ${MIN_TITLE}글자 이상 입력해 주세요.`;
  } else if (message) {
    titleStatus.textContent = `${value.length}자 입력 · 아직 조건을 충족하지 못했어요.`;
  } else {
    titleStatus.textContent = `✓ ${value.length}자 입력 · 입력 조건을 충족했어요.`;
  }
  // 이미 오류가 표시된 상태라면 고치는 즉시 오류 문구 갱신/해제
  if (titleError.textContent) setFieldError(titleInput, titleError, message);
}

function updateNicknameFeedback() {
  const raw = flowNicknameInput.value;
  const value = raw.trim();
  const message = getNicknameError(value);
  flowNicknameCount.classList.toggle("is-valid", value !== "" && !message);
  flowNicknameCount.classList.toggle("is-invalid", Boolean(message));
  let tail = " · 선택 입력";
  if (message) tail = ` · ${MIN_NICKNAME}글자 이상 필요`;
  else if (value) tail = " · ✓ 사용할 수 있어요";
  flowNicknameCount.textContent = `${raw.length} / 10자${tail}`;
  if (flowNicknameError.textContent) setFieldError(flowNicknameInput, flowNicknameError, message);
}

function validateTitle() {
  const value = titleInput.value.trim();
  const message = getTitleError(value);
  setFieldError(titleInput, titleError, message);
  if (message) {
    titleInput.focus();
    return false;
  }
  formData.title = value;
  heroTitleInput.value = value;
  return true;
}

function validateNickname() {
  const message = getNicknameError(flowNicknameInput.value.trim());
  setFieldError(flowNicknameInput, flowNicknameError, message);
  if (message) flowNicknameInput.focus();
  return !message;
}

function setSubmitMessage(text, state) {
  submitStatus.textContent = text;
  submitStatus.className = "submit-status" + (state ? ` is-${state}` : "");
}

titleNext.addEventListener("click", () => {
  if (!validateTitle()) return;
  if (!validateNickname()) return;
  showStep(1);
});

// ---------- 조건부 입력: 표시/숨김 + 입력 가능(disabled) 상태를 함께 변경 ----------
function setQnaOpen(open) {
  qnaOptions.hidden = !open;
  qnaOptions.disabled = !open;
  qnaRadios.forEach((radio) => { radio.disabled = !open; });
}

qnaOption.addEventListener("change", () => setQnaOpen(qnaOption.checked));
setQnaOpen(false);
updateTitleFeedback();
updateNicknameFeedback();

optionPrev.addEventListener("click", () => showStep(0));

optionNext.addEventListener("click", () => {
  const selectedDuration = planForm.querySelector('input[name="duration"]:checked');
  const selectedQnaCount = planForm.querySelector('input[name="qna-count"]:checked');

  formData.duration = selectedDuration ? selectedDuration.value : "100";
  formData.qna = qnaOption.checked;
  formData.qnaCount = selectedQnaCount ? selectedQnaCount.value : "교육/어린이시설";

  summaryTitle.textContent = formData.title;
  
  const currentNickname = flowNicknameInput ? flowNicknameInput.value.trim() : "";
  summaryNickname.textContent = currentNickname !== "" ? currentNickname : "입력 안 함";

  summaryDuration.textContent = formData.duration === "전체" ? "전체 (최대 1,000개)" : `${formData.duration}개`;
  summaryQna.textContent = formData.qna ? `${formData.qnaCount} 포함` : "포함 안 함";

  showStep(2); 
});

editInfoButton.addEventListener("click", () => showStep(0));
editOptionsButton.addEventListener("click", () => showStep(1));

const storageKey = "smoke-free-search-plans-v1";

function readPlans() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (!Array.isArray(stored)) return [];
    return stored.filter((plan) => plan && typeof plan.id === "string" && typeof plan.title === "string");
  } catch {
    return [];
  }
}

let savedSearchPlans = readPlans();

function savePlans() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(savedSearchPlans));
    return true;
  } catch {
    return false;
  }
}

const planList = document.querySelector("#plan-list");
const emptyState = document.querySelector("#empty-state");
const planCount = document.querySelector("#plan-count");
const archiveStatus = document.querySelector("#archive-status");
const planDialog = document.querySelector("#plan-dialog");

// ---------- 폼 제출 (submit 이벤트) ----------
planForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (isSubmitting) return; // 제출 중 중복 제출 방지

  // 1·2단계에서 Enter 키를 눌렀을 때는 해당 단계의 '다음' 동작으로 처리
  if (currentStep === 0) { titleNext.click(); return; }
  if (currentStep === 1) { optionNext.click(); return; }
  if (currentStep !== 2) return;

  // 조건 미충족 시 제출을 막고 수정이 필요한 1단계로 안내
  const titleMessage = getTitleError(titleInput.value.trim());
  const nicknameMessage = getNicknameError(flowNicknameInput.value.trim());
  if (titleMessage || nicknameMessage) {
    showStep(0);
    setFieldError(titleInput, titleError, titleMessage);
    setFieldError(flowNicknameInput, flowNicknameError, nicknameMessage);
    (titleMessage ? titleInput : flowNicknameInput).focus();
    return;
  }
  formData.title = titleInput.value.trim();

  // 제출 중: 진행 문구 표시 + 버튼 비활성화
  isSubmitting = true;
  finishButton.disabled = true;
  finishButton.setAttribute("aria-busy", "true");
  setSubmitMessage("검색 조건을 저장하는 중입니다...", "progress");

  setTimeout(() => {
    const currentPlan = {
      id: `${Date.now()}`,
      title: formData.title,
      nickname: flowNicknameInput.value.trim(),
      duration: formData.duration,
      qna: formData.qna,
      qnaCount: formData.qnaCount,
      cancelled: false,
      createdAt: new Date().toISOString()
    };

    savedSearchPlans.unshift(currentPlan);
    if (!savePlans()) {
      // 실패: 입력 내용은 그대로 두고 다시 시도할 수 있게 복구
      savedSearchPlans.shift();
      isSubmitting = false;
      finishButton.disabled = false;
      finishButton.removeAttribute("aria-busy");
      setSubmitMessage("저장하지 못했습니다. 입력한 내용은 그대로 남아 있으니 '검색 결과 저장 및 확인하기'를 다시 눌러 주세요.", "error");
      return;
    }

    // 성공: 완료 안내 + 검색 결과 조회
    isSubmitting = false;
    renderPlans();
    setSubmitMessage("", "");
    resultKeyword.textContent = formData.title;
    showStep(3);
    fetchSmokingZones();
  }, 600);
});

function createText(tag, className, content) {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = content;
  return element;
}

function renderPlans() {
  if (!planList) return;
  planList.replaceChildren();
  if (emptyState) emptyState.hidden = savedSearchPlans.length !== 0;
  planList.hidden = savedSearchPlans.length === 0;
  
  const activeCount = savedSearchPlans.filter((plan) => !plan.cancelled).length;
  if (planCount) {
    planCount.textContent = String(activeCount);
    planCount.setAttribute("aria-label", `진행 중인 검색 기록 ${activeCount}개`);
  }

  savedSearchPlans.forEach((plan) => {
    const card = document.createElement("li");
    card.className = `plan-card${plan.cancelled ? " is-cancelled" : ""}`;
    card.style.cssText = "min-width: 0; padding: 23px; border: 1px solid var(--line); border-radius: 17px; background: var(--surface);";

    const top = document.createElement("div");
    top.className = "plan-card-top";
    top.style.cssText = "display: flex; justify-content: space-between; gap: 12px; align-items: center; margin-bottom: 15px;";
    
    const stateSpan = createText("span", "plan-state", plan.cancelled ? "취소됨" : "저장됨");
    stateSpan.style.cssText = "padding: 4px 9px; border-radius: 6px; color: #0647f9; background: #edf0ff; font-size: 11px; font-weight: 800;";
    top.append(stateSpan);

    const date = new Date(plan.createdAt);
    if (!Number.isNaN(date.getTime())) {
      const timeTag = createText("time", "plan-date", new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "long", day: "numeric" }).format(date));
      timeTag.style.cssText = "color: var(--muted); font-size: 12px;";
      top.append(timeTag);
    }
    card.append(top);

    const titleH3 = createText("h3", "plan-title", `[${plan.title}] 금연구역 조회`);
    titleH3.style.cssText = "margin-bottom: 6px; font-size: 20px; font-weight: 800; color: var(--ink);";
    card.append(titleH3);

    const qnaTextStr = plan.qna ? `상세 조건(${plan.qnaCount}) 포함` : "시설 유형 조건 미포함";
    const metaP = createText("p", "plan-meta", `사용자: ${plan.nickname || "입력 안 함"} · 조회 갯수: ${plan.duration === "전체" ? "전체" : plan.duration + "개"} · ${qnaTextStr}`);
    metaP.style.cssText = "margin-bottom: 20px; font-size: 13px; color: var(--muted);";
    card.append(metaP);

    const actions = document.createElement("div");
    actions.className = "plan-actions";
    actions.style.cssText = "display: flex; flex-wrap: wrap; gap: 8px;";

    const openButton = createText("button", "button button-secondary", "내용 보기");
    openButton.type = "button";
    openButton.dataset.action = "open";
    openButton.dataset.id = plan.id;
    openButton.style.cssText = "min-height: 41px; padding: 7px 13px; font-size: 13px; color: var(--ink); background: var(--surface); border: 1px solid var(--line); border-radius: 10px; cursor: pointer; font-weight: 700;";

    const toggleButton = createText("button", "button button-text", plan.cancelled ? "검색 기록 되돌리기" : "검색 기록 취소하기");
    toggleButton.type = "button";
    toggleButton.dataset.action = "toggle";
    toggleButton.dataset.id = plan.id;
    toggleButton.style.cssText = "min-height: 41px; padding: 7px 13px; font-size: 13px; color: #0647f9; background: transparent; border: 0; cursor: pointer; font-weight: 700;";
    
    actions.append(openButton, toggleButton);
    card.append(actions);
    planList.append(card);
  });
}

if (planList) {
  planList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const plan = savedSearchPlans.find((item) => item.id === button.dataset.id);
    if (!plan) return;

    if (button.dataset.action === "open") {
      document.querySelector("#dialog-title").textContent = `[${plan.title}] 금연구역 조회`;
      document.querySelector("#dialog-status").textContent = plan.cancelled ? "취소된 검색 기록입니다." : "저장된 검색 기록입니다.";
      document.querySelector("#dialog-nickname").textContent = plan.nickname || "입력 안 함";
      document.querySelector("#dialog-duration").textContent = plan.duration === "전체" ? "전체 (최대 1,000개)" : `${plan.duration}개`;
      document.querySelector("#dialog-qna").textContent = plan.qna ? `${plan.qnaCount} 포함` : "포함 안 함";
      if (planDialog && typeof planDialog.showModal === "function") {
        planDialog.showModal();
      }
      return;
    }

    const wasCancelled = plan.cancelled;
    plan.cancelled = !wasCancelled;
    savePlans();
    renderPlans();
    if (archiveStatus) {
      archiveStatus.textContent = `‘${plan.title}’ 검색 기록을 ${wasCancelled ? "다시 활성화했습니다" : "취소했습니다"}.`;
    }
  });
}

const dialogClose = document.querySelector("#dialog-close");
const dialogDone = document.querySelector("#dialog-done");
if (dialogClose) dialogClose.addEventListener("click", () => planDialog.close());
if (dialogDone) dialogDone.addEventListener("click", () => planDialog.close());

renderPlans();

restartButton.addEventListener("click", () => {
  planForm.reset();
  formData.title = "";
  formData.duration = "100";
  formData.qna = false;
  formData.qnaCount = "교육/어린이시설";
  heroTitleInput.value = "";
  heroTitleError.textContent = "";
  heroTitleInput.removeAttribute("aria-invalid");
  setFieldError(titleInput, titleError, "");
  setFieldError(flowNicknameInput, flowNicknameError, "");
  updateTitleFeedback();
  updateNicknameFeedback();
  setQnaOpen(false);
  setSubmitMessage("", "");
  isSubmitting = false;
  finishButton.disabled = false;
  finishButton.removeAttribute("aria-busy");
  searchResultsList.innerHTML = "";
  searchResultsList.hidden = true;
  searchEmpty.hidden = true;
  showStep(0);
  plannerSection.scrollIntoView({ block: "start", behavior: "smooth" });
  titleInput.focus();
});

const searchLoading = document.querySelector("#search-loading");
const searchResultsList = document.querySelector("#search-results-list");
const searchEmpty = document.querySelector("#search-empty");
const resultKeyword = document.querySelector("#result-keyword");

// 공공데이터 API 호출 및 결과 함수
async function fetchSmokingZones() {
  searchLoading.hidden = false;
  searchResultsList.hidden = true;
  searchEmpty.hidden = true;
  searchResultsList.innerHTML = "";

  const apiKey = "5%2BY1zwMSzW3g1bicboTzp1Hv3tECIrKQ6niTABRvowqGVv1xpaSxPQfllSCocK2Kv9z6bmJE3V8hDwhUeSS7wA%3D%3D";
  
  const encodedKeyword = encodeURIComponent(formData.title);
  const url = `https://api.data.go.kr/openapi/tn_pubr_public_prhsmk_zn_api?serviceKey=${apiKey}&numOfRows=1000&type=json&signguNm=${encodedKeyword}`;

  try {
    const response = await fetch(url);
    const textData = await response.text();
    const data = JSON.parse(textData);

    let items = [];
    if (data.response && data.response.body && data.response.body.items) {
      items = data.response.body.items;
    } else if (data.body && data.body.items) {
      items = data.body.items;
    } else if (data.items) {
      items = data.items;
    } else {
      const errorMsg = data.header?.resultMsg || data.response?.header?.resultMsg || data.resultMsg || data.response?.OpenAPI_ServiceResponse?.cmmMsgHeader || data.OpenAPI_ServiceResponse?.cmmMsgHeader?.returnAuthMsg;
      if (errorMsg && errorMsg !== "NORMAL SERVICE.") {
        throw new Error(`API 오류: ${errorMsg}`);
      }
    }

    if (!Array.isArray(items) && items.item) {
      items = items.item;
    }
    
    if (!Array.isArray(items)) {
      items = [];
    }

    if (items.length === 0) {
      searchLoading.hidden = true;
      searchEmpty.textContent = `‘${formData.title}’에 해당하는 금연구역 데이터가 없습니다. 시군구명을 확인해 주세요.`;
      searchEmpty.hidden = false;
      return;
    }

    searchLoading.hidden = true;
    items.forEach(item => {
      const li = document.createElement("li");
      li.className = "result-item";
      
      li.innerHTML = `
        <div class="result-title">${item.prhsmkNm || "금연구역명 없음"}</div>
        <dl class="result-details">
          <dt>금연구역명</dt><dd>${item.prhsmkNm || "-"}</dd>
          <dt>금연구역범위상세</dt><dd>${item.prhsmkScopeDesc || "-"}</dd>
          <dt>시도명</dt><dd>${item.ctprvnNm || "-"}</dd>
          <dt>시군구명</dt><dd>${item.signguNm || "-"}</dd>
          <dt>금연구역구분</dt><dd>${item.prhsmkSe || "-"}</dd>
          <dt>금연구역지정근거명</dt><dd>${item.prhsmkAppnBasis || "-"}</dd>
          <dt>금연구역면적</dt><dd>${item.prhsmkAr ? item.prhsmkAr + ' ㎡' : "-"}</dd>
          <dt>위반과태료</dt><dd>${item.ffnlg ? item.ffnlg + ' 원' : "-"}</dd>
          <dt>위반신고전화번호</dt><dd>${item.phoneNumber || "-"}</dd>
          <dt>소재지도로명주소</dt><dd>${item.rdnmadr || "-"}</dd>
          <dt>소재지지번주소</dt><dd>${item.lnmadr || "-"}</dd>
          <dt>관리기관명</dt><dd>${item.institutionNm || "-"}</dd>
          <dt>위도</dt><dd>${item.latitude || "-"}</dd>
          <dt>경도</dt><dd>${item.longitude || "-"}</dd>
          <dt>데이터기준일자</dt><dd>${item.referenceDate || "-"}</dd>
          <dt>제공기관코드</dt><dd>${item.instt_code || "-"}</dd>
          <dt>제공기관기관명</dt><dd>${item.instt_nm || "-"}</dd>
        </dl>
      `;
      searchResultsList.appendChild(li);
    });
    searchResultsList.hidden = false;

  } catch (error) {
    searchLoading.hidden = true;
    searchEmpty.innerHTML = `${error.message}`;
    searchEmpty.hidden = false;
  }
}