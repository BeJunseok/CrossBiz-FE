import i18n from '@/i18n/setting';

const parseUTCDate = (dateString) => {
  if (typeof dateString === 'string' && !dateString.endsWith('Z')) {
    return new Date(dateString + 'Z');
  }

  return new Date(dateString);
};

export const getTimeAgo = (createdAt) => {
  const { t, language } = i18n;

  const now = new Date();
  const created = parseUTCDate(createdAt);

  const diffInMs = now.getTime() - created.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return t('time.justNow');
  } else if (diffInMinutes < 60) {
    return t('time.minuteAgo', { count: diffInMinutes });
  } else if (diffInHours < 24) {
    return t('time.hourAgo', { count: diffInHours });
  } else if (diffInDays < 7) {
    return t('time.dayAgo', { count: diffInDays });
  } else {
    // 올해인지 체크
    const nowYear = now.getFullYear();
    const createdYear = created.getFullYear();

    if (nowYear === createdYear) {
      // 올해면 월, 일만 표시
      return created.toLocaleDateString(language, {
        month: 'long',
        day: 'numeric',
      });
    } else {
      // 이전 연도면 연도까지 표시
      return created.toLocaleDateString(language, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  }
};

export const formatDateTime = (dateString) => {
  const date = parseUTCDate(dateString);

  return date.toLocaleString(i18n.language, {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

export const formatDateOnly = (dateString) => {
  const date = parseUTCDate(dateString);

  return date.toLocaleString(i18n.language, {
    month: '2-digit',
    day: '2-digit',
  });
};
