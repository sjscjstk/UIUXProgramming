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

  themeButton.textContent = isDark ? "라이트 테마로 바꾸기" : "다크 테마로 바꾸기";
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
const flowSteps = trainingFlow.querySelectorAll(".step");
const progressItems = trainingFlow.querySelectorAll(".progress_item");
const titleInput = document.querySelector("#presentation-title");
const titleError = document.querySelector("#title-error");
const titleNext = document.querySelector("#title-next");
const durationRange = document.querySelector("#duration-range");
const durationValue = document.querySelector("#duration-value");
const qnaOption = document.querySelector("#qna-option");
const qnaOptions = document.querySelector("#qna-options");
const optionPrev = document.querySelector("#option-prev");
const optionNext = document.querySelector("#option-next");
const summaryPrev = document.querySelector("#summary-prev");
const finishButton = document.querySelector("#finish-button");
const restartButton = document.querySelector("#restart-button");
const summaryTitle = document.querySelector("#summary-title");
const summaryDuration = document.querySelector("#summary-duration");
const summaryQna = document.querySelector("#summary-qna");
const durationValues = ["50", "100", "전체"];

const formData = {
  title:"", duration: "100", qna: false, qnaCount: "2"
};

function showStep(index) {
  flowSteps.forEach((step, i) => { step.hidden = i !== index; });
  progressItems.forEach((item, i) => {
    item.classList.toggle("is-active", i === index);
  })
}

const recordingDialog = document.querySelector("#recording-dialog");
const recordingCancel = document.querySelector("#recording-cancel");
const recordingConfirm = document.querySelector("#recording-confirm");

function revokeRecordingAgreement() {
  agreeCheck.checked = false;
  trainingFlow.hidden = true;
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
  showStep(0);
  trainingFlow.scrollIntoView({ behavior: "smooth" });
  titleInput.focus();
});

function validateTitle() {
  const value = titleInput.value.trim();
  if (!value) {
    titleError.textContent = "검색할 장소 및 지역명을 입력해 주세요.";
    titleInput.classList.add("has-error");
    titleInput.focus();
    return false;
  }
  titleError.textContent = "";
  titleInput.classList.remove("has-error");
  formData.title = value;
  return true;
}

titleNext.addEventListener("click", () => {
  if (!validateTitle()) return;
  showStep(1);
});

durationRange.addEventListener("input", () => {
  const selectedValue = durationValues[durationRange.value];
  durationValue.value = selectedValue === "전체" ? "전체" : selectedValue + "개";
});
qnaOption.addEventListener("change", () => {
  qnaOptions.hidden = !qnaOption.checked;
});

optionPrev.addEventListener("click", () => showStep(0));
optionNext.addEventListener("click", () => {
  formData.duration = durationValues[durationRange.value];
  formData.qna = qnaOption.checked;
  const count = document.querySelector('input[name="qna-count"]:checked');
  formData.qnaCount = count.value;
  summaryTitle.textContent = formData.title;
  summaryDuration.textContent = formData.duration === "전체" ? "전체" : formData.duration + "개";
  summaryQna.textContent = formData.qna ? formData.qnaCount + "조건 포함" : "미포함";
  showStep(2);
});

summaryPrev.addEventListener("click", () => showStep(1));
// 기존 finishButton 이벤트 리스너 수정
finishButton.addEventListener("click", () => {
  showStep(3); // 4번째 단계 화면 표시
  resultKeyword.textContent = formData.title;
  fetchSmokingZones(); // API 호출 함수 실행
});

restartButton.addEventListener("click", () => {
  formData.title = "";
  formData.duration = "100";
  formData.qna = false;
  formData.qnaCount = "2";
  titleInput.value = "";
  titleError.textContent = "";
  titleInput.classList.remove("has-error");
  durationRange.value = "1";
  durationValue.value = "100개";
  qnaOption.checked = false;
  qnaOptions.hidden = true;
  document.querySelector('input[name="qna-count"][value="2"]').checked = true;
  summaryTitle.textContent = "";
  summaryDuration.textContent = "";
  summaryQna.textContent = "";
  showStep(0);
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
  
  // 1. 사용자가 입력한 검색어(예: 관악구)를 URL에 넣을 수 있도록 인코딩
  const encodedKeyword = encodeURIComponent(formData.title);
  
  // 2. URL 끝에 '&signguNm=검색어'를 추가하여 API 서버에 직접 필터링 요청
  const url = `https://api.data.go.kr/openapi/tn_pubr_public_prhsmk_zn_api?serviceKey=${apiKey}&numOfRows=1000&type=json&signguNm=${encodedKeyword}`;

  try {
    const response = await fetch(url);
    const textData = await response.text();
    const data = JSON.parse(textData);

    // 3. 공공데이터포털의 유연한 데이터 구조에 맞게 items 배열 추출
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

    // 4. 정상적으로 가져온 결과 화면에 출력
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