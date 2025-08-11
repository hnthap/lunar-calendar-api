const PI = 3.1415926535898;
const TAU = 2 * PI;
const DEGREES_TO_RADIANS = PI / 180.0;
const CHINESE = {
  branches: [
    "申",
    "酉",
    "戌",
    "亥",
    "子",
    "丑",
    "寅",
    "卯",
    "辰",
    "巳",
    "午",
    "未",
  ],
  stems: ["庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁", "戊", "己"],
};
const ENGLISH = {
  branches: [
    "Monkey",
    "Rooster",
    "Dog",
    "Pig",
    "Rat",
    "Ox",
    "Tiger",
    "Rabbit",
    "Dragon",
    "Snake",
    "Horse",
    "Goat",
  ],
  stems: [
    "Metal",
    "Metal",
    "Water",
    "Water",
    "Wood",
    "Wood",
    "Fire",
    "Fire",
    "Earth",
    "Earth",
  ],
};
const VIETNAMESE = {
  branches: [
    "Thân",
    "Dậu",
    "Tuất",
    "Hợi",
    "Tý",
    "Sửu",
    "Dần",
    "Mão",
    "Thìn",
    "Tỵ",
    "Ngọ",
    "Mùi",
  ],
  stems: [
    "Canh",
    "Tân",
    "Nhâm",
    "Quý",
    "Giáp",
    "Ất",
    "Bính",
    "Đinh",
    "Mậu",
    "Kỷ",
  ],
};

export const Constants = {
  CHINESE,
  DEGREES_TO_RADIANS,
  ENGLISH,
  PI,
  TAU,
  VIETNAMESE,
} as const;
