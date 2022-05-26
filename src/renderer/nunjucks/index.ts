import nunjucks from 'nunjucks';
const str = `
{% remote "/stuff" %}
  This content will be replaced with the content from /stuff
{% error %}
  There was an error fetching /stuff
{% endremote %}
`;
const compile = nunjucks.compile(str);
compile.render();
