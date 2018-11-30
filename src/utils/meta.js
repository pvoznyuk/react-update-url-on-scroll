const getMetaTagName = (item) => item.getAttribute('name') || item.getAttribute('property');

const getMeta = (metaName) => {
  const metas = document.getElementsByTagName('meta');
  return Array.from(metas).find(item => getMetaTagName(item) === metaName);
}

export const setMetaTags = (metaTagsList = {}) => {
  const {title, ...metaTags} = metaTagsList;

  if (title) {
    document.title = title;
  }

  Object.keys(metaTags).forEach(tagName => {
    const currentTag = getMeta(tagName);

    if (currentTag) {
      // update a meta tag
      currentTag.setAttribute('content', metaTags[tagName]);
    } else {
      // create a meta tag
      const meta = document.createElement('meta');
      meta.name = tagName;
      meta.setAttribute('content', metaTags[tagName]);
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
  });

}

export const getDefaultMetaTags = (metaTags) => {
  if(metaTags) {
    return metaTags;
  }

  const metas = document.getElementsByTagName('meta');

  return Array.from(metas).reduce((acc, item) => {
    return {...acc, [getMetaTagName(item)]: item.getAttribute('content')}
  }, { title: document.title });
}
