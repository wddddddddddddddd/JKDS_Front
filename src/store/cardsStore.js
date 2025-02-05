// store/cardsStore.js
import { defineStore } from 'pinia';

export const useCardsStore = defineStore('cardsStore', {
  state: () => ({
    cards: [], // 所有卡片数据
    currentCard: null, // 当前选中的卡片
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
  },
});
