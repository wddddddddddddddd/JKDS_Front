// store/cardsStore.js
import { defineStore } from 'pinia';

export const useCardsStore = defineStore('cardsStore', {
  state: () => ({
    cards: [], // 所有卡片数据
    currentCard: null, // 当前选中的卡片
    selectedCards: [], // 存储选中卡片的索引
  }),
  actions: {
    setCards(cards) {
      this.cards = cards;
    },
    setCurrentCard(card) {
      this.currentCard = card;
    },
    clearCurrentCard() {
      this.currentCard = null;
    },
    // 切换卡片的选中状态
    toggleCardSelection(index) {
      if (this.selectedCards.includes(index)) {
        this.selectedCards = this.selectedCards.filter((i) => i !== index);
      } else {
        this.selectedCards.push(index);
      }
    },
    // 清空选中状态
    clearSelection() {
      this.selectedCards = [];
    },
  },
});
