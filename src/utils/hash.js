import {createId} from './func';

const basePath = `${window.location.origin}${window.location.pathname}`;
const baseTitle = document.title;

const getCurrentHash = () => decodeURI(window.location.hash.slice(1));

export const getHash = ({manager}) => {
  const {basePath} = manager;
  const name = window.location.pathname.replace(basePath.replace(window.location.origin, ''), '').slice(1);
  const hash = getCurrentHash();
  return createId({name, hash});
}

export const updateHash = ({anchor, affectHistory, manager}) => {
  const {hash, name, title, exact} = anchor;
  const {basePath} = manager;
  const method = affectHistory ? 'pushState' : 'replaceState';
  const newPath = `${name ? `${exact ? window.location.origin : basePath}/${name}` : basePath}${hash ? `#${hash}` : ''}`;

  window.history[method](undefined, undefined, newPath);

  if (title) {
    document.title = title;
  }
}

// remove hash in url without affecting history or forcing reload
export const removeHash = ({manager}) => {
  window.history.replaceState(
    undefined,
    baseTitle,
    manager ? manager.basePath : basePath
  );

  document.title = baseTitle;
}
