import * as I from '../interfaces/';

import {
  eventScope,
} from '../utils/';

enum KEY_CODE {
  SPACE = 32,
  PAGE_UP,
  PAGE_DOWN,
  END,
  HOME,
  LEFT,
  UP,
  RIGHT,
  DOWN,
}

export function keyboardHandler(scrollbar: I.Scrollbar) {
  const addEvent = eventScope(scrollbar);
  const container = scrollbar.containerEl;

  addEvent(container, 'keydown', (evt: KeyboardEvent) => {
    const { activeElement } = document;

    if (activeElement !== container && !container.contains(activeElement)) {
      return;
    }

    if (isEditable(activeElement)) {
      return;
    }

    const delta = getKeyDelta(scrollbar, evt.keyCode || evt.which);

    if (!delta) {
      return;
    }

    const [x, y] = delta;

    scrollbar.addTransformableMomentum(x, y, evt, (willScroll) => {
      if (willScroll) {
        evt.preventDefault();
      } else {
        scrollbar.containerEl.blur();

        if (scrollbar.parent) {
          scrollbar.parent.containerEl.focus();
        }
      }
    });
  });
}

function getKeyDelta(scrollbar: I.Scrollbar, keyCode: number) {
  const {
    size,
    limit,
    offset,
  } = scrollbar;

  switch (keyCode) {
    case KEY_CODE.SPACE:
      return [0, 200];
    case KEY_CODE.PAGE_UP:
      return [0, -size.container.height + 40];
    case KEY_CODE.PAGE_DOWN:
      return [0, size.container.height - 40];
    case KEY_CODE.END:
      return [0, limit.y - offset.y];
    case KEY_CODE.HOME:
      return [0, -offset.y];
    case KEY_CODE.LEFT:
      return [-40, 0];
    case KEY_CODE.UP:
      return [0, -40];
    case KEY_CODE.RIGHT:
      return [40, 0];
    case KEY_CODE.DOWN:
      return [0, 40];
    default:
      return null;
  }
}

function isEditable(elem: any): boolean {
  if (elem.tagName === 'INPUT' || elem.tagName === 'TEXTAREA') {
    return true;
  }

  while (elem) {
    if (elem.contentEditable === 'true') {
      return true;
    }

    elem = elem.parentElement;
  }

  return false;
}
