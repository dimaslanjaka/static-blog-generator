/* eslint-disable @typescript-eslint/no-unused-vars */

import '../libs/flowbite';
import 'core-js/actual';

const mobile_icon = document.getElementById('mobile-icon');
const mobile_menu = document.getElementById('mobile-menu');
const hamburger_icon = document.querySelector('#mobile-icon i');

function openCloseMenu() {
  mobile_menu.classList.toggle('block');
  mobile_menu.classList.toggle('active');
}

function changeIcon(icon) {
  icon.classList.toggle('fa-xmark');
}

mobile_icon.addEventListener('click', openCloseMenu);

// disable submit form.ajax-handling

document.querySelectorAll('form.ajax-handling').forEach((form) => {
  form.addEventListener('submit', (e) => e.preventDefault());
});
