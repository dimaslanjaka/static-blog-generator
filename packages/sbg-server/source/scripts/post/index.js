const searchbox = document.querySelector('#search-dropdown');

searchbox.addEventListener('input', changeHandler);
searchbox.addEventListener('change', changeHandler);

function changeHandler(e) {
  e.preventDefault();
  /**
   * @type {HTMLInputElement}
   */
  const target = e.target;
  const value = target.value;

  const posts = Array.from(document.querySelectorAll('[aria-find="post"]'));
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    // hide non-matches post title
    if (
      !post.querySelector('[aria-find="title"]').textContent.includes(value)
    ) {
      post.classList.add('hidden');
    }
    // remove hidden when value is empty
    if (value.length === 0 && post.classList.contains('hidden')) {
      post.classList.remove('hidden');
    }
  }
}
