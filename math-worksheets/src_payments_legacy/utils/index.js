export const createPageUrl = (pageName) => {
  if (!pageName) {
    return '/';
  }

  if (pageName === 'Home') {
    return '/';
  }

  return `/${pageName.toLowerCase()}`;
};

export const delay = (ms = 300) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
