<!DOCTYPE html>
<html lang="{{ config.language|default(theme.language) }}">
<head>
    <meta charset="utf-8" />
    {% block title %}
        <title>{% if page.title %}{{ page.title }}{% endif %} - {% if page.webtitle %}{{ page.webtitle }}{% else %}{{ config.subtitle|default(theme.subtitle) }}{% endif %}</title>
    {% endblock %}

    {% include './_partial/common/head.swig' %}

    {% block pageCss %}
    {% endblock %}

    {% if is_post() %}
    {% block jsonld %}{% endblock %}
    {% endif %}

    {% if config.adsense && config.adsense.enable %}
    <script data-ad-client="{{ config.adsense.pub }}" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
    {% endif %}

    {% if config.tagmanager && config.tagmanager.enable %}
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','{{ config.tagmanager.id }}');</script>
    <!-- End Google Tag Manager -->
    {% endif %}
</head>
<body ontouchstart>
    {% block loader %}
        {% include './_partial/common/loader.swig' %}
    {% endblock %}

    {% if config.tagmanager && config.tagmanager.enable %}
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ config.tagmanager.id }}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    {% endif %}

    <div id="page" class="page js-hidden">
        {% block header %}
            {% include './_partial/common/header.swig' %}
        {% endblock %}

        {% block main %}
        {% endblock %}

        {% block footer %}
            {% include './_partial/common/footer.swig' %}
        {% endblock %}

        {% block backTop %}
            {% include './_partial/common/back-top.swig' %}
        {% endblock %}
    </div>

    <!-- build:js /js/common.js -->
        <script type="text/javascript" src="js/common/utils.js"></script>
        <script type="text/javascript" src="js/common/pack.js"></script>
        <script type="text/javascript" src="js/common/animation.js"></script>
        <script type="text/javascript" src="js/layout/loading.js"></script>
        <script type="text/javascript" src="js/layout/header.js"></script>
        <script type="text/javascript" src="js/layout/back-top.js"></script>
        <script type="text/javascript" src="js/layout/post.js"></script>
    <!-- endbuild -->

    {% block pagejs %}
    {% endblock %}

    {% block other %}
    {% endblock %}

    {% include './_partial/common/math.swig' %}

    {% if config.https && config.https.enable %}
    <!-- force https -->
    <script type="text/javascript" src="/js/https.js"></script>
    {% endif %}

    {% if config.adblock %}
    <link rel="stylesheet" href="/js/adblock.css" media="all" />
    <script type="text/javascript" src="/js/adblock.js"></script>
    {% endif %}
</body>
</html>
