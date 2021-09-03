<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
<meta name="format-detection" content="telephone=no">
<meta name="author" content="{% if get_setting('author').name %}{{ get_setting('author').name }}{% else %}Dimas Lanjaka{% endif %}" />
<meta name="designer" content="minfive" />
<meta name="keywords" content="{% if page.keywords %}{% endif %}{{ get_setting('keywords') }}"/>
<meta name="description" content="{% if page.subtitle %}{{ page.subtitle }}{% elseif page.title %}{{ page.title }}{% else %}{{ get_setting('description') }}{% endif %}" />

<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<meta name="format-detection" content="telephone=yes" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="robots" content="all" />

<link rel="canonical" href="{{ url }}">

<link rel="icon" type="image/png" href="{{ get_setting('favicon_ico') }}" sizes="32x32">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="{{ url }}">
<meta property="og:title" content="{% if page.title %}{{ page.title }} | {% endif %}{{ config.subtitle|default(theme.subtitle) }}">
<meta property="og:description" content="{% if page.subtitle %}{{ page.subtitle }}{% elseif page.title %}{{ page.title }}{% else %}{{ get_setting('description') }}{% endif %}">
<meta property="og:image" content="{{ page.cover|default(get_setting('default_cover')) }}">

{% if config.google_site_verification %}
  <meta name="google-site-verification" content="{{ config.google_site_verification }}" />
{% endif %}

{% if config.bing_site_verification %}
  <meta name="msvalidate.01" content="{{ config.bing_site_verification }}" />
{% endif %}

{% if config.yandex_site_verification %}
  <meta name="yandex-verification" content="{{ config.yandex_site_verification }}" />
{% endif %}


{% if config.baidu_site_verification %}
  <meta name="baidu-site-verification" content="{{ config.baidu_site_verification }}" />
{% endif %}


{% if config.qihu_site_verification %}
  <meta name="360-site-verification" content="{{ config.qihu_site_verification }}" />
{% endif %}


<!-- Prefetch -->
{% include './prefetch.swig' %}

<!-- CSS -->
{{ css('scss/base/index') }}

<!-- RSS -->
{{ feed_tag('atom.xml') }}

<!-- 统计 -->
{% include './analytics.swig' %}

<!-- note: for support on older browsers, you will need to load es5-shim and es6-shim -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/es5-shim/4.0.5/es5-shim.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/es6-shim/0.23.0/es6-shim.min.js"></script>

