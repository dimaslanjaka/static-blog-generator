import { Dismiss } from '../flowbite';

/**
 * Tailwind Toast Helper
 */
export default class TToast {
  wrapper = document.querySelector('#toast-wrapper');
  defaultClass =
    'inline-flex items-center justify-center flex-shrink-0 w-8 h-8';
  /**
   * @type {number}
   */
  timeout;

  /**
   * Tailwind Toast Helper
   * @param {string} message
   * @param {'danger'|'success'|'warning'} type
   * @param {number} timeout
   */
  constructor(type, message, timeout) {
    if (typeof timeout === 'number') this.timeout = timeout;
    let c = 0;
    while (!this.wrapper) {
      this.wrapper = document.querySelector('#toast-wrapper');
      c++;
      if (c > 3000) throw 'cannot find toast-wrapper';
    }
    if (this.wrapper) {
      let el = this.wrapper.querySelector('#toast-' + type);
      c = 0;
      while (!el) {
        el = this.wrapper.querySelector('#toast-' + type);
        c++;
        if (c > 3000) throw 'cannot find toast-' + type;
      }
      if (el) {
        // redeclare el locally
        const toast = this.#changeID(el.cloneNode(true));
        toast.querySelector('.toast-message').innerHTML = message;
        this.wrapper.querySelector('#toast-show').appendChild(toast);
      }
    }
  }

  /**
   * change id
   * @param {HTMLElement} el
   */
  #changeID(el) {
    const unique = Math.random().toFixed(2);
    let $targetEl, $triggerEl;
    el.id = el.id + '-' + unique;
    $targetEl = el;
    el.querySelectorAll('[id]').forEach((sl) => {
      sl.id = sl.id + '-' + unique;
    });
    for (
      let i = 0;
      i < el.querySelectorAll('[_data-dismiss-target]').length;
      i++
    ) {
      const sl = el.querySelectorAll('[_data-dismiss-target]')[i];
      $triggerEl = sl;
      // dismiss options object
      const options = {
        transition: 'transition-opacity',
        duration: 1000,
        timing: 'ease-out',

        // callback functions
        onHide: (context, targetEl) => {
          console.log('element has been dismissed');
          console.log(targetEl);
        }
      };
      /*
       * $targetEl: required
       * $triggerEl: optional
       * options: optional
       */
      const dismiss = new Dismiss($targetEl, $triggerEl, options);
      /*sl.setAttribute(
        'data-dismiss-target',
        sl.getAttribute('_data-dismiss-target') + '-' + unique
      );*/
      // assign click event
      sl.addEventListener('click', () => {
        dismiss.hide();
      });
      if (typeof this.timeout === 'number') {
        setTimeout(() => {
          dismiss.hide();
        }, this.timeout);
      }
    }

    return el;
  }

  /**
   * show toast
   */
  show() {
    //
  }
  /**
   * hide toast
   */
  hide() {
    // /
  }
}
