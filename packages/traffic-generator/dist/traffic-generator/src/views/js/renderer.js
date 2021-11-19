
const handleError = (error, url) => {
  const msg = `
    There was an issue adding "${url}": ${error.message}
  `.trim();
  setTimeout(() => errorMessage.innerText = null, 5000);
}
