import Manager from './Manager';
export const goToTop = Manager.goToTop;
export const configureAnchors = Manager.configure;

export { setMetaTags } from './utils/meta';
export { updateHash as goToAnchor, removeHash } from './utils/hash';
export { default, ScrollableLink } from './ScrollableSection'
