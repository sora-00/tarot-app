export function getTarotImageName(cardId: number): string {
  const imageMap: { [key: number]: string } = {
    0: "the-foool",
    1: "magician",
    2: "the-high-priestess",
    3: "the-empress",
    4: "the-emperor",
    5: "the-hierophant",
    6: "the-lovers",
    7: "the-chariot",
    8: "strength",
    9: "the-hermit",
    10: "whell-of-fortune",
    11: "justice",
    12: "the-hanged-man",
    13: "death",
    14: "temperance",
    15: "the-devil",
    16: "the-tower",
    17: "star",
    18: "the-moon",
    19: "the-sun",
    20: "judgement",
    21: "the-world",
  };
  return imageMap[cardId] || "back";
}


