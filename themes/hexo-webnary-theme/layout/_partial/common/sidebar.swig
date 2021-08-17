<aside class="page__sidebar">
    <!-- {% if get_setting('qrcode', 'avatar') %}
        <div class="sidebar__img">
            <img src="{{ get_setting('qrcode', 'avatar') }}" alt="{{ get_setting('title') }}" title="{{ get_setting('title') }}">
        </div>
    {% endif %} -->

    <form id="page-search-from" class="page__search-from" action="/search/">
        <label class="search-form__item">
            <input class="input" type="text" name="search" placeholder="Search...">
            <i class="iconfont icon-search"></i>
        </label>
    </form>

    {% if get_setting('description') %}
        <div class="sidebar__block">
            <h3 class="block__title">{{ __('aside.introduction') }}</h3>
            <p class="block__text">{{ get_setting('description') }}</p>
        </div>
    {% endif %}

    <div class="sidebar__block">
        <h3 class="block__title">{{ __('aside.categorie') }}</h3>
        {{ list_categories({ order: -1, class: 'block' }) }}
    </div>

    <div class="sidebar__block">
        <h3 class="block__title">{{ __('aside.latest_post') }}</h3>
        {{ latest_post(4) }}
    </div>

    <div class="sidebar__block">
        <h3 class="block__title">{{ __('aside.tag') }}</h3>
        {{ tags({ order: -1 }) }}
    </div>


    <div class="sidebar__block">
        <h3 class="block__title">{{ __('ads') }}</h3>
        <style>
        /*.adsense_responsive_sidebar { width: 320px; height: 100px; }
        @media(min-width: 500px) { .adsense_responsive_sidebar { width: 468px; height: 60px; } }
        @media(min-width: 800px) { .adsense_responsive_sidebar { width: 728px; height: 90px; } }*/
        </style>
        <!-- adsense single banner auto square {{ config.adsense.ads1 }} -->
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1165447249910969" crossorigin="anonymous"></script>
        <ins class="adsbygoogle adsense_responsive_sidebar"
                style="display:inline-block"
                data-ad-client="{{ config.adsense.pub }}"
                data-ad-slot="{{ config.adsense.ads-sidebar }}"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    </div>

    <!-- <div class="sidebar__block">
        <h3 class="block__title">{{ __('aside.friend_links') }}</h3>
        <ul class="block-list">
            {% for item in site.data.link %}
                <li class="block-list-item">
                    <a class="block-list-link" href="{{ item.link }}" title="{{ item.desc }}" target="_blank">{{ item.name }}</a>
                </li>
            {% endfor %}
        </ul>
    </div> -->
</aside>