/**
 * Tailwind Toast Helper
 */
export default class TToast {
  wrapper = document.getElementById('toast-wrapper');
  defaultClass =
    'inline-flex items-center justify-center flex-shrink-0 w-8 h-8';
  /**
   * create danger
   */
  danger() {
    this.#setIconColor(
      'text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200'
    );
    return this;
  }
  #setIconColor(classNames) {
    this.wrapper
      .querySelector('#toast-icon')
      .setAttribute(
        'class',
        'inline-flex items-center justify-center flex-shrink-0 w-8 h-8' +
          classNames
      );
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
