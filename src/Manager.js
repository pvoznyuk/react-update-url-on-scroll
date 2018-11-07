import { debounce } from './utils/func';
import { getBestAnchorGivenScrollLocation, getScrollTop } from './utils/scroll';
import { getHash, updateHash, removeHash } from './utils/hash';

const defaultConfig = {
  affectHistory: false,
  debounce: 100,
  keepLastAnchorHash: false,
  offset: 0,
  scrollBehaviour: 'smooth',
  scrollDelay: 0,
  scrollOnImagesLoad: false,
  onSectionEnter: null
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
    this.baseTitle = document.title;
    this.imagesAreLoaded = false;

    setTimeout(() => {
      if (this.config.scrollOnImagesLoad) {
        const imgs = document.images;
        const len = imgs.length;
        let counter = 0;

        const incrementCounter = () => {
          counter++;
          if (counter === len) {
            this.imagesAreLoaded = true;
            const event = new Event(EVENT_IMAGES_LOADED);
            window.dispatchEvent(event);
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
  }

  removeListeners = () => {
    window.removeEventListener('scroll', this.scrollHandler, true);
    window.removeEventListener('hashchange', this.handleHashChange);
  }

  configure = (config) => {
    this.config = {
      ...defaultConfig,
      ...config
    }
  }

  goToTop = () => {
    if (getScrollTop() === 0) return;
    this.forcedHash = true;
    window.scrollTo({
      top: 0,
      behavior: this.config.scrollBehaviour
    });
  }

  addAnchor = ({element, name, hash, id, title, exact}) => {
    // if this is the first anchor, set up listeners
    if (Object.keys(this.anchors).length === 0) {
      this.addListeners();
    }
    this.forceHashUpdate();
    this.anchors[id] = {
      id,
      component: element,
      name,
      hash,
      title,
      exact
    };

    // check if this anchor is the current one
    if (window.location.href.endsWith(`${name}${hash ? `#${hash}` : ''}`)) {
      this.basePath = this.basePath.replace(`/${name}`, '');
    }
  }

  removeAnchor = (id) => {
    delete this.anchors[id]
    // if this is the last anchor, remove listeners
    if (Object.keys(this.anchors).length === 0) {
      this.removeListeners()
    }
  }

  onSectionChange = (newAnchor, oldAnchor) => {
    const {onSectionEnter} = this.config;

    if (typeof onSectionEnter === 'function') {
      onSectionEnter(
        /* new state */
        newAnchor ? { ...this.anchors[newAnchor], id: newAnchor } : null,
        /* old state */
        oldAnchor ? { ...this.anchors[oldAnchor], id: oldAnchor } : null
      );
    }
  }

  handleScroll = () => {
    const {offset, keepLastAnchorHash, affectHistory} = this.config;
    const bestAnchorId = getBestAnchorGivenScrollLocation(this.anchors, -offset);
    const currentHash = getHash({manager: this});

    if (bestAnchorId && currentHash !== bestAnchorId) {
      this.forcedHash = true;

      updateHash({
        anchor: this.anchors[bestAnchorId],
        affectHistory,
        manager: this
      });

      this.onSectionChange(bestAnchorId, currentHash);

    } else if (!bestAnchorId && !keepLastAnchorHash) {
      removeHash({manager: this});
      this.onSectionEnter(null, currentHash);
    }
  }

  handleHashChange = (e) => {
    this.basePath = this.getBasePath(this.anchors);

    if (this.forcedHash) {
      this.forcedHash = false;
    } else {
      const runScrollingToSection = (delay) => this.goToSection(getHash({manager: this}), delay);

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
        const marginTop = ~~(element.currentStyle || window.getComputedStyle(element)).marginTop.replace(/\D+/g, '');
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: this.config.scrollBehaviour
        });
      }, delay);
    }
  }

}

export default new Manager()
