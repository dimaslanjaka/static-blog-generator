<article class="page__post">
    <div class="post__cover">
        <img src="{{ page.cover|default(get_setting('default_cover')) }}" alt="{{ page.title }}">
    </div>

    <header class="post__info">
        <h1 class="post__title">{{ page.title }}</h1>

        <div class="post__mark">
            <div class="mark__block">
                <i class="mark__icon iconfont icon-write"></i>
                <ul class="mark__list clearfix">
                    {% if Array.isArray(page.author) %}
                        {% for user in page.author %}
                            <li class="mark__item">
                                <a href="{{ url_for(user.link || '') }}">{{ (user.nick || user.name)|default(get_setting(author.name)) }}</a>
                            </li>
                        {% endfor %}
                    {% else %}
                        <li class="mark__item">
                            <a href="{{ url_for(page.author.link || '') }}">{{ (page.author.nick || page.author.name)|default(get_setting(author.name)) }}</a>
                        </li>
                    {% endif %}
                </ul>
            </div>

            <div class="mark__block">
                <i class="mark__icon iconfont icon-time"></i>
                <ul class="mark__list clearfix">
                    <li class="mark__item"><span>{{ date(page.date) }}</span></li>
                </ul>
            </div>

            <div class="mark__block">
                <i class="mark__icon iconfont icon-tab"></i>
                <ul class="mark__list clearfix">
                    {% for tag in page.tags %}
                        <li class="mark__item">
                            <a href="{{ url_for(tag.path) }}">{{ titlecase(tag.name) }}</a>
                        </li>
                    {% endfor %}
                </ul>
            </div>

            {% if config.busuanzi %}
            <div class="mark__block">
                <i class="mark__icon iconfont icon-eye"></i>
                <ul class="mark__list clearfix">
                    <li id="busuanzi_container_page_pv" class="mark__item"><span id="busuanzi_value_page_pv"></span>{{ __('other.bout') }}</li>
                </ul>
            </div>
            {% endif %}
        </div>
    </header>

    <div class="post__content">
        {{ render(page.content) }}

        {% if page.keywords %}
            <style>
            #incoming-terms * {
                font-size: 10px;
                margin: 5px;
            }
            #incoming-terms li:after {
                content: " | ";
            }
            #incoming-terms li:last-child:after {
                content: "";
            }
            #incoming-terms li {
                display: inline;
            }
            #incoming-terms ul {
                list-style-type: none;
            }
            </style>
            <div id="incoming-terms" itemscope itemtype="https://schema.org/ItemList">
            <h2 itemprop="name">Incoming Terms {{ capitalize(page.title) }}</h2>
            <link itemprop="itemListOrder" href="https://schema.org/ItemListOrderDescending" />
            <ul>
                {% for keyword in page.keywords %}
                <li itemprop="itemListElement">{{ trim_str(keyword) }}</li>
                {% endfor %}
            </ul>
            </div>
        {% endif %}

        {% if page.editor %}
        <div class="post-announce">
            {{ __('copyright_statement.one') }}
            <a href="{{ page.editor.link }}">{{ page.editor.name }}</a> {{ __('copyright_statement.two') }}：{{ page.editor.name }}（<a href="{{ page.editor.link }}">{{ page.editor.link }}</a>）
        </div>
        {% else %}
        <div class="post-announce">
            {{ __('copyright_statement.three') }}
            <a href="{{ config.url }}">{{ get_setting('title') }}</a>
            {{ __('copyright_statement.four') }}：{{ get_setting('title') }}（<a href="{{ config.url }}{{ url_for(page.path) }}">{{ config.url }}{{ url_for(page.path) }}</a>）
        </div>
        {% endif %}

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
                 style="display:inline-block" data-full-width-responsive="true"
                 data-ad-client="{{ config.adsense.pub }}"
                 data-ad-slot="{{ config.adsense.ads1 }}"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>
        {% endif %}

        <!-- https://github.com/sergeyzwezdin/hexo-related-posts -->
        {% if page.related_posts && page.related_posts.length %}
            <section style="padding: 5px">
                <h2 id="related-posts">Related posts</h2>
                <ul>
                {% for path in page.related_posts %}
                    {% if url_for(path).length %}
                        <li><a href="{{ url_for(path) }}">{{ url_for(path) }}</a></li>
                    {% endif %}
                {% endfor %}
                </ul>
            </section>
        {% endif %}

        <div class="post__prevs">
            <div class="post__prev">
                {% if page.next %}
                <a href="{{ url_for(page.next.path) }}" title="{{ page.next.title }}"><i class="iconfont icon-prev"></i>{{ page.next.title }}</a>
                {% endif %}
            </div>
            <div class="post__prev post__prev--right">
                {% if page.prev %}
                <a href="{{ url_for(page.prev.path) }}" title="{{ page.prev.title }}">{{ page.prev.title }}<i class="iconfont icon-next"></i></a>
                {% endif %}
            </div>
        </div>
    </div>
</article>
