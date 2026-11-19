// ==== カード詳細モーダル ====

const cardModal = document.getElementById("card-modal");
const cardModalPreview = document.getElementById("card-modal-preview");
const cardModalName = document.getElementById("card-modal-name");
const cardModalType = document.getElementById("card-modal-type");
const cardModalDescription = document.getElementById("card-modal-description");
const cardModalIcon = document.getElementById("card-modal-icon");

const cardModalClose = document.getElementById("card-modal-close");
const cardModalCancel = document.getElementById("card-modal-cancel");
const cardModalUse = document.getElementById("card-modal-use");

// 属性の表示名
const CARD_TYPE_NAMES = {
  attack: "ATTACK",
  defense: "DEFENSE",
  disruption: "DISRUPTION",
  special: "SPECIAL",
};

// モーダルを開く
function openCardModal(index) {
  const card = playerHands[currentPlayer][index];

  if (!card) return;

  selectedCard = index;
  updateCardSelection();

  // 属性に応じたデザイン
  cardModalPreview.className = `selected-card-preview ${card.type}`;

  // カード情報
  cardModalName.textContent = card.name;
  cardModalType.textContent = CARD_TYPE_NAMES[card.type] ?? card.type;
  cardModalDescription.textContent = card.description;

  // 属性アイコン
  cardModalIcon.src = CARD_TYPE_ICONS[card.type] ?? "";
  cardModalIcon.alt = "";

  // カード使用済みなら再使用を禁止
  cardModalUse.disabled = hasUsedCard;
  cardModalUse.textContent = hasUsedCard ? "カード使用済み" : "カードを使用";

  cardModal.hidden = false;
  cardModalClose.focus();
}

// モーダルを閉じる
function closeCardModal(cancelSelection = true) {
  cardModal.hidden = true;

  if (cancelSelection) {
    selectedCard = null;
    updateCardSelection();
  }
}

// カード使用を確定
function confirmCardUse() {
  const index = selectedCard;

  if (index === null || hasUsedCard) return;

  // 選択情報は残してモーダルだけ閉じる
  closeCardModal(false);

  // 既存のカード使用処理へ
  useCard(index);
}

// 閉じるボタン
cardModalClose.addEventListener("click", () => {
  closeCardModal();
});

// 戻るボタン
cardModalCancel.addEventListener("click", () => {
  closeCardModal();
});

// 使用ボタン
cardModalUse.addEventListener("click", confirmCardUse);

// モーダルの背景をクリックしたら閉じる
cardModal.addEventListener("click", (event) => {
  if (event.target === cardModal) {
    closeCardModal();
  }
});

// Escapeキーでも閉じられるようにする
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !cardModal.hidden) {
    closeCardModal();
  }
});
