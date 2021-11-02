<!-- Analytics -->

<!-- Global site tag (gtag.js) - Google Analytics -->
{% if config.analytics|default(theme.analytics.GA3) %}
  <script async src="https://www.googletagmanager.com/gtag/js?id={{ config.analytics.GA3|default(theme.analytics.GA3) }}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', '{{ config.analytics.GA3|default(theme.analytics.GA3) }}');
  </script>
{% endif %}

{% if config.analytics && config.analytics.GA4 %}
  <!-- Global site tag (gtag.js) - Google Analytics GA4 -->
  <script async src="https://www.googletagmanager.com/gtag/js?id={{ config.analytics.GA4 }}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', '{{ config.analytics.GA4 }}');
  </script>
{% endif %}

{% if config.analytics && config.analytics.cloudflare %}
  <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "{{ config.analytics.cloudflare }}"}'></script><!-- End Cloudflare Web Analytics -->
{% endif %}