<main class="page__container page__main">
    <div class="page__content">
        <div class="page__posts clearfix">
            {% for post in page.posts %}
                <div class="page__post">
                    {% include '../post/mini.swig' with { post: post } %}
                </div>
            {% endfor %}
        </div>

        {{ s_paginator(3) }}
    </div>

    {% if config.adsense && config.adsense.enable && config.adsense.ads1 %}
        <div id="ads-bottom" class="text-center">
            <style>
            .adsense_responsive_1 { width: 320px; height: 100px; }
            @media(min-width: 500px) { .adsense_responsive_1 { width: 468px; height: 60px; } }
            @media(min-width: 800px) { .adsense_responsive_1 { width: 728px; height: 90px; } }
            </style>
            <!-- adsense single banner auto square {{ config.adsense.ads1 }} -->
            <!--script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={{ config.adsense.pub }}" crossorigin="anonymous"></script-->
            <ins class="adsbygoogle adsense_responsive_1"
                 style="display:inline-block"
                 data-ad-client="{{ config.adsense.pub }}"
                 data-ad-slot="{{ config.adsense.ads1 }}"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>
    {% endif %}

    {% include '../common/sidebar.swig' %}
</main>