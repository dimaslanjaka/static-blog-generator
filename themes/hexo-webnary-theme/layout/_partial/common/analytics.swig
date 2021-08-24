<!-- Analytics -->

<!-- Global site tag (gtag.js) - Google Analytics -->
{% if config.google_statistic|default(theme.google_statistic) %}
  <script async src="https://www.googletagmanager.com/gtag/js?id={{ config.google_statistic|default(theme.google_statistic) }}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', '{{ config.google_statistic|default(theme.google_statistic) }}');
  </script>
{% endif %}

{% if config.google_analytics && config.google_analytics.GA4 %}
  <!-- Global site tag (gtag.js) - Google Analytics GA4 -->
  <script async src="https://www.googletagmanager.com/gtag/js?id={{ config.google_analytics.GA4 }}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', '{{ config.google_analytics.GA4 }}');
  </script>
{% endif %}