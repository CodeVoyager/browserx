// ==UserScript==
// @name         Action mag stuff
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        file:///G:/Biblioteka/am/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  var activeKeys = [];
  var NOT_FOUND = -1;
  var MAX_LENGTH = 50;
  function Maybe(value) {
    return {
      apply: function(func) {
        if (value) {
          return new Maybe(func(value));
        }

        return new Maybe(value);
      },
      value: function() {
        return value;
      },
    };
  }
  var storage = Object.create({
    template: {
      colors: {
        link: '#F49D37',
        linkHover: '#E24E1B',
        linkVisited: '#23CE6B',
        // link: '#BA2C73',
        background: '#363537',
        border: '#53DD6C',
        text: '#FEFADE',
        // text: '#B7D5D4',
        greenText: '#789922',
        highlight: '#2176FF',
        // highlight: '#ACF39D',
      },
    },
  });
  var body =
    document.body.tagName === 'FRAMESET'
      ? document.querySelector('html')
      : document.body;

  /**
   * @param {string} element
   * @param {string} content
   * @param {string} _class
   * @returns Element
   */
  function getElementWithContent(element, content, _class) {
    var n = document.createElement(element);

    n.innerHTML = content;

    if (_class) {
      n.setAttribute('class', _class);
    }

    return n;
  }

  function setup() {
    var pathParts = document.location.pathname.split('/');
    var pivot = pathParts.indexOf('data');

    storage.path = pathParts
      .slice(pivot - 1)
      .map(decodeURIComponent)
      .join('/');
    storage.index = pathParts
      .slice(0, pivot)
      .map(decodeURIComponent)
      .join('/');
  }

  function buildInfoContainer() {
    var infoContainer = getElementWithContent('div', '', 'dynamic-info');
    var actionMagNr = /\d+/.exec(storage.path)[0];
    var title = Maybe(document.title)
      .apply(function(title) {
        if (title.length > MAX_LENGTH) {
          return title
            .split('')
            .slice(0, MAX_LENGTH)
            .concat(['...'])
            .join('');
        }

        return title;
      })
      .value();

    infoContainer.appendChild(
      getElementWithContent('div', '&times;', 'close-info')
    );
    infoContainer.appendChild(getElementWithContent('h3', 'Info'));
    infoContainer.appendChild(getElementWithContent('p', `Tytuł: ${title}`));
    infoContainer.appendChild(
      getElementWithContent(
        'p',
        `<a href="file://${
          storage.index
        }/data/texty.htm">Action mag #${actionMagNr} (arty)</a>`
      )
    );
    infoContainer.appendChild(
      getElementWithContent(
        'p',
        `<a href="file://${
          storage.index
        }/data/kaciki.htm">Action mag #${actionMagNr} (kąciki)</a>`
      )
    );
    if (window.random_art) {
      infoContainer.appendChild(
        getElementWithContent(
          'p',
          `<a onclick="window.random_art('nie')" href="file://${
            storage.index
          }/data/texty.htm">Randomowy art</a>`
        )
      );
    }
    if (NOT_FOUND !== storage.path.indexOf('data/film')) {
      infoContainer.appendChild(getElementWithContent('hr', ``));
      infoContainer.appendChild(
        getElementWithContent(
          'p',
          `<a data-style="film" href="javascript:">Dodaj style (film)</a>`
        )
      );
      if (
        NOT_FOUND === storage.path.indexOf('data/film/texty.htm') &&
        NOT_FOUND === storage.path.indexOf('data/film/index.htm')
      ) {
        var backLink = Maybe(
          [...body.querySelectorAll('a')].find(
            x =>
              NOT_FOUND !==
              x.innerText.toLowerCase().indexOf('powrót do amfilm')
          )
        )
          .apply(function(n) {
            return n.getAttribute('href');
          })
          .value();

        if (backLink) {
          infoContainer.appendChild(
            getElementWithContent(
              'p',
              `<a href="${backLink}" data-action="back">Teksty (film)</a>`
            )
          );
        }
      }
      infoContainer.appendChild(getElementWithContent('hr', ``));
    }
    if (NOT_FOUND !== storage.path.indexOf('data/sw')) {
      infoContainer.appendChild(getElementWithContent('hr', ``));
      infoContainer.appendChild(
        getElementWithContent(
          'p',
          `<a data-style="sw" href="javascript:">Dodaj style (sw)</a>`
        )
      );
      infoContainer.appendChild(getElementWithContent('hr', ``));
    }
    if (NOT_FOUND !== storage.path.indexOf('data/strefa')) {
      infoContainer.appendChild(getElementWithContent('hr', ``));
      infoContainer.appendChild(
        getElementWithContent(
          'p',
          `<a data-style="strefa" href="javascript:">Dodaj style (strefa 51)</a>`
        )
      );
      infoContainer.appendChild(getElementWithContent('hr', ``));
    }
    infoContainer.appendChild(
      getElementWithContent(
        'p',
        `<a data-style="basic" href="javascript:">Dodaj style (basic)</a>`
      )
    );
    infoContainer.appendChild(
      getElementWithContent(
        'p',
        `<a data-action="top" href="javascript:">do góry</a>`
      )
    );
    infoContainer.appendChild(getElementWithContent('hr', ``));
    infoContainer.appendChild(
      getElementWithContent('p', `Path: ${storage.path}`)
    );
    infoContainer.appendChild(
      getElementWithContent('p', `Wróć (ctrl+shift+u)`)
    );
    infoContainer.appendChild(
      getElementWithContent('p', `Wróć do poprzedniej strony (ctrl+shift+b)`)
    );
    infoContainer.appendChild(
      getElementWithContent('p', `Dodaj style (ctrl+shift+i)`)
    );
    infoContainer.appendChild(
      getElementWithContent('p', `Do góry (ctrl+shift+o)`)
    );

    body.appendChild(infoContainer);
  }

  function addStyleFilm() {
    document.head.appendChild(
      getElementWithContent(
        'style',
        `
            body td, body font {
                background-color: ${storage.template.colors.background};
                color: ${storage.template.colors.text};
            }
            body a, .linx a {
                color: ${storage.template.colors.link};
            }
            body .new a, .linx .new a {
                color: ${storage.template.colors.highlight};
            }
            body a:visited, .linx a:visited {
                color: ${storage.template.colors.linkVisited};
            }
            body a:hover, .linx a:hover {
                color: ${storage.template.colors.linkHover};
            }
        `
      )
    );
  }
  function addStyleStrefa51() {
    addStyleBasic();
    document.head.appendChild(
      getElementWithContent(
        'style',
        `
            a.menu {
                color: ${storage.template.colors.link};
            }
            a.menu:visited {
                color: ${storage.template.colors.linkVisited};
            }
        `
      )
    );
  }
  function addStyleBasic() {
    document.head.appendChild(
      getElementWithContent(
        'style',
        `
            body {
                font-family: Helvetica, Trajan;
                font-size: 20px;
                padding: 0 30%;
            }
            body font {
                font-size: 20px;
                color: inherit;
            }
            body a {
                color: ${storage.template.colors.link};
            }
        `
      )
    );
  }
  function goBack() {
    Maybe(document.querySelector('[data-action="back"]')).apply(function(
      n /* @type {Element} */
    ) {
      n.click();
    });
  }
  function goBackNative() {
    Maybe(window.history).apply(function(h) {
      return h.back();
    });
  }
  function goToTop() {
    Maybe(document.querySelector('[data-action="top"]')).apply(function(
      n /* @type {Element} */
    ) {
      n.click();
    });
  }
  function addStyle() {
    Maybe(document.querySelector('[data-style]')).apply(function(
      n /* @type {Element} */
    ) {
      n.click();
    });
  }

  function setEventListeners() {
    var dynamicInfo = Maybe(document.querySelector('.dynamic-info'));
    var isMouseDownDynamicInfo = false;
    var dynamicInfoPositionOffset = { left: 0, top: 0 };

    window.addEventListener('keydown', function(e) {
      activeKeys.push(e.key);
      resolveActiveKeys(e);
    });
    window.addEventListener('keyup', function(e) {
      activeKeys = activeKeys.filter(function(key) {
        return key !== e.key;
      });
      resolveActiveKeys(e);
    });
    window.addEventListener('mousemove', function(e) {
      // console.log(e.pageX, e.pageY);
      // console.log(isMouseDownDynamicInfo);
      if (isMouseDownDynamicInfo) {
        dynamicInfo.apply(function(n) {
          n.style.top = Math.max(0, e.pageY - dynamicInfoPositionOffset.top);
          n.style.left = Math.max(0, e.pageX - dynamicInfoPositionOffset.left);
        });
      }
    });
    dynamicInfo.apply(function(n) {
      n.addEventListener('mousedown', function(e) {
        isMouseDownDynamicInfo = true;
        dynamicInfoPositionOffset = { left: e.layerX, top: e.layerY };
      });
    });
    dynamicInfo.apply(function(n) {
      n.addEventListener('mouseup', function(e) {
        isMouseDownDynamicInfo = false;
      });
    });

    Maybe(document.querySelector('.dynamic-info .close-info')).apply(function(
      n /* @type {Element} */
    ) {
      n.addEventListener('click', function() {
        dynamicInfo.apply(function(n /* @type {Element} */) {
          n.parentNode.removeChild(n);
        });
      });
    });
    [...document.querySelectorAll('[data-style]')].forEach(function(n) {
      n.addEventListener('click', function() {
        var style = n.getAttribute('data-style');

        switch (style) {
          case 'film':
            addStyleFilm();
            return;
          case 'strefa':
            addStyleStrefa51();
            return;

          default:
            addStyleBasic();
            return;
        }
      });
    });
    Maybe(document.querySelector('[data-action="top"]')).apply(function(
      n /* @type {Element} */
    ) {
      n.addEventListener('click', function() {
        body.scrollTop = 0;
      });
    });
  }

  function normalize() {
    document.head.appendChild(
      getElementWithContent(
        'style',
        `
            body, frameset {
                background-color: ${storage.template.colors.background};
                color: ${storage.template.colors.text};
            }
            body pre {
                font-family: Fira Code, Helvetica;
            }
            body hr {
                color: ${storage.template.colors.border};
            }
            #page_Layer {
                background-color: ${storage.template.colors.background};
            }
            #page_Layer .title2 {
                background-color: ${storage.template.colors.background};
            }
            #page_Layer td {
                color: ${storage.template.colors.text};
            }
            #page_Layer .qnik {
                color: ${storage.template.colors.highlight};
            }
            #page_Layer a {
                color: ${storage.template.colors.link};
            }
            #page_Layer a:visited {
                color: ${storage.template.colors.linkVisited};
            }
            .dynamic-info {
                background: ${storage.template.colors.background};
                border: 1px solid ${storage.template.colors.border};
                box-shadow: 0 0 5px ${storage.template.colors.border};
                color: ${storage.template.colors.text};
                cursor: move;
                display: block;
                font-family: Fira Code, Helvetica;
                font-size: 12px;
                left: 10px;
                min-height: 50px;
                opacity: 0.5;
                padding: 10px;
                position: fixed;
                top: 10px;
                transition: 0.3s opacity ease-in;
                width: 300px;
            }
            .dynamic-info p {
                font-size: 12px;
            }
            .dynamic-info h3 {
                color: ${storage.template.colors.text};
                margin: 0;
            }
            .dynamic-info a {
                color: ${storage.template.colors.link};
                font-size: 12px;
                margin: 0;
            }
            .dynamic-info hr {
                color: #53DD6C;
            }
            .dynamic-info .close-info {
                color: ${storage.template.colors.highlight};
                cursor: pointer;
                font-size: 45px;
                line-height: 45px;
                position: absolute;
                right: 5px;
                top: -5px;
            }
            .dynamic-info:hover {
                opacity: 1;
            }
        `
      )
    );

    Maybe(document.getElementById('page_Layer')).apply(function(n) {
      n.removeAttribute('style');
    });
  }

  /**
   * @param {KeyboardEvent} e
   */
  function haltEvent(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  /**
   * @param {KeyboardEvent} e
   */
  function resolveActiveKeys(e) {
    var activeKeysMapped = activeKeys
      .filter(function(x) {
        return x;
      })
      .map(function(k) {
        return k.toLocaleLowerCase();
      });

    if (NOT_FOUND !== activeKeysMapped.indexOf('control')) {
      if (NOT_FOUND !== activeKeysMapped.indexOf('shift')) {
        if (NOT_FOUND !== activeKeysMapped.indexOf('u')) {
          haltEvent(e);
          goBack();
        }
        if (NOT_FOUND !== activeKeysMapped.indexOf('i')) {
          haltEvent(e);
          addStyle();
        }
        if (NOT_FOUND !== activeKeysMapped.indexOf('o')) {
          haltEvent(e);
          goToTop();
        }
        if (NOT_FOUND !== activeKeysMapped.indexOf('b')) {
          haltEvent(e);
          goBackNative();
        }
      }
    }
  }

  if (window.parent !== window) {
    return;
  }

  setup();
  buildInfoContainer();
  normalize();
  setEventListeners();
})();
