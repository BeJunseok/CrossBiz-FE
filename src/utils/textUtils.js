export const getTextWidth = (text, fontSize = 12) => {
  let width = 0;
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);

    if (charCode >= 0xac00 && charCode <= 0xd7a3) {
      // 한글 범위
      width += 1;
    } else if (charCode === 8361) {
      // '₩' (원화 기호)
      width += 1;
    } else if (charCode === 32) {
      // ' ' (띄어쓰기)
      width += 0.3;
    } else {
      // 그 외 (영문, 숫자, 일반 특수문자)
      width += 0.6;
    }
  }
  return width * fontSize;
};
