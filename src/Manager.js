import { debounce, getAnchoreByName } from './utils/func';
import { getBestAnchorGivenScrollLocation, getScrollTop, scrollTo } from './utils/scroll';
import { getHash, updateHash, removeHash } from './utils/hash';
import { setMetaTags, getDefaultMetaTags } from './utils/meta';

const defaultConfig = {
  affectHistory: false,
  debounce: 100,
  keepLastAnchorHash: false,
  offset: 0,
  scrollBehaviour: 'smooth',
  scrollDelay: 0,
  scrollOnImagesLoad: false,
  onSectionEnter: null,
  meta: null,
  reloadOnGoingBack: false
}

const EVENT_IMAGES_LOADED = 'images:loaded';

class Manager {
  constructor() {
    this.anchors = {};
    this.forcedHash = false;
    this.config = defaultConfig;

    this.scrollHandler = debounce(this.handleScroll, ~~this.config.debounce);
    this.forceHashUpdate = debounce(this.handleHashChange, 1);

    this.basePath = this.getBasePath();
    this.basePathName = window.location.pathname;
    this.imagesAreLoaded = false;

    this.resetDefaultMetaTags();

    setTimeout(() => {
      let eventDispatched = false;
      const fireEvent = () => {
        if (!eventDispatched) {
          const event = new Event(EVENT_IMAGES_LOADED);
          window.dispatchEvent(event);
        }
        eventDispatched = true;
      }

      if (this.config.scrollOnImagesLoad) {

        if (this.config.scrollOnImagesLoad > 1) {
          setTimeout(fireEvent, parseInt(this.config.scrollOnImagesLoad, 10));
        }

        const imgs = document.images;
        const len = imgs.length;
        let counter = 0;

        const incrementCounter = () => {
          counter++;

          if (counter === len) {
            this.imagesAreLoaded = true;
            fireEvent();
          }
        }

        [].forEach.call(imgs, img => {
          if (img.complete) {
            incrementCounter();
          } else {
            img.addEventListener('load', incrementCounter, false);
          }
        });

      }
    });

    if (window.history && window.history.pushState) {
      window.addEventListener('popstate', () => {
        if (this.config.reloadOnGoingBack) {
          window.location.reload();
        }
      });
    }

  }

  getBasePath = (anchors) => {
    let newBasePath = `${window.location.origin}${window.location.pathname}`.replace(/\/$/, '');

    if (anchors) {
      Object.keys(anchors).forEach(id => {
        if (!anchors[id].exact && newBasePath.endsWith(anchors[id].name)) {
          newBasePath = newBasePath.replace(`/${anchors[id].name}`, '');
        }
      });
    }

    return newBasePath;
  }

  addListeners = () => {
    window.addEventListener('scroll', this.scrollHandler, true);
    window.addEventListener('hashchange', this.handleHashChange);
    /* window.addEventListener('onpopstate', this.getBasePath); */
  }

  removeListeners = () => {
    window.removeEventListener('scroll', this.scrollHandler, true);
    window.removeEventListener('hashchange', this.handleHashChange);
    /* window.addEventListener('onpopstate', this.getBasePath); */
  }

  configure = (config) => {
    this.config = {
      ...defaultConfig,
      ...config
    }
    this.resetDefaultMetaTags();
  }

  resetDefaultMetaTags = () => {
    if (this.config.meta) {
      this.defaultMetaTags = getDefaultMetaTags(this.config.meta);
      setMetaTags(this.defaultMetaTags);
    } else {
      this.defaultMetaTags = getDefaultMetaTags();
    }
  }

  setDefaultMetaTags = () => {
    setMetaTags(this.defaultMetaTags);
  }

  goToTop = () => {
    if (getScrollTop() === 0) return;
    this.forcedHash = true;

    scrollTo({
      top: 0,
      behavior: this.config.scrollBehaviour
    });
  }

  addAnchor = ({element, name, hash, id, meta, exact}) => {
    // if this is the first anchor, set up listeners
    if (Object.keys(this.anchors).length === 0) {
      this.addListeners();
    }

    const urlName = name || '';
    const urlHash = hash ? `#${hash}` : '';

    // check if this anchor is the current one
    if (window.location.href.endsWith(`${urlName}${urlHash}`)) {
      this.forceHashUpdate();
    }
    if (window.location.pathname.endsWith(`/${urlName}`)) {
      this.basePathName = this.basePathName.replace(`/${urlName}`, '');
      if (this.basePathName === '') this.basePathName = '/';
    }

    this.anchors[id] = {
      id,
      component: element,
      name,
      hash,
      meta,
      exact
    };

    this.basePath = this.getBasePath(this.anchors);

    this.normalizeMetaTags();
  }

  normalizeMetaTags = () => {
    Object.keys(this.anchors).forEach(anchorId => {
      const anchor = this.anchors[anchorId];
      if (anchor.hash && !anchor.meta) {

        if (anchor.exact || !anchor.name) {
          anchor.meta = this.defaultMetaTags;
        } else if (anchor.name) {
          const parentAnchor = getAnchoreByName(this.anchors, anchor.name);

          if (parentAnchor) {
            anchor.meta = parentAnchor.meta;
          }
        }
      }
    });
  }

  removeAnchor = (id) => {
    delete this.anchors[id];
    // if this is the last anchor, remove listeners
    if (Object.keys(this.anchors).length === 0) {
      this.removeListeners();
    }
  }

  onSectionChange = (newAnchor, oldAnchor) => {
    const {onSectionEnter} = this.config;
    const getPath = (anchor) => anchor.name
      ? (anchor.exact ? `/${anchor.name}` : `${this.basePathName !== '/' ? this.basePathName : ''}/${anchor.name}`)
      : this.basePathName;

    if (typeof onSectionEnter === 'function') {
      const nextState = newAnchor ? { ...this.anchors[newAnchor], id: newAnchor } : {};
      nextState.path = getPath(nextState);

      const prevState = oldAnchor ? { ...this.anchors[oldAnchor], id: oldAnchor } : {};
      prevState.path = getPath(prevState);

      onSectionEnter(nextState, prevState);
    }
  }

  handleScroll = () => {
    const {offset, keepLastAnchorHash, affectHistory} = this.config;
    const nextAnchor = getBestAnchorGivenScrollLocation(this.anchors, -offset);
    const prevAnchor = getHash({manager: this});

    if (nextAnchor && prevAnchor !== nextAnchor) {
      this.forcedHash = true;

      updateHash({
        anchor: this.anchors[nextAnchor],
        affectHistory,
        manager: this
      });

      this.onSectionChange(nextAnchor, prevAnchor);

    } else if (!nextAnchor && !keepLastAnchorHash) {
      removeHash({manager: this});
      if (this.anchors[prevAnchor]) {
        this.onSectionChange(null, prevAnchor);
      }
    }
  }

  handleHashChange = (e) => {
    this.basePath = this.getBasePath(this.anchors);

    if (this.forcedHash) {
      this.forcedHash = false;
    } else {
      const hash = getHash({manager: this});
      const runScrollingToSection = (delay = 0) => this.goToSection(hash, delay);

      if (this.config.scrollOnImagesLoad && !this.imagesAreLoaded) {
        window.addEventListener(EVENT_IMAGES_LOADED, runScrollingToSection, false);
      } else {
        runScrollingToSection(this.config.scrollDelay);
      }
    }
  }

  goToSection = (id, delay = 0) => {
    const element = (this.anchors[id] ? this.anchors[id].component : null) || document.getElementById(id);
    const {offset} = this.config;

    if (element) {
      setTimeout(() => {
        const marginTop = ~~(element.currentStyle || window.getComputedStyle(element).marginTop.replace(/\D+/g, ''));
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition - offset;

        scrollTo({
          top: offsetPosition,
          behavior: this.config.scrollBehaviour
        });
      }, delay);
    }
  }

}

export default new Manager()
