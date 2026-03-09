export const stripHtml = (html: string) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

export const truncateText = (text: string, maxLength = 100) =>
  text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;