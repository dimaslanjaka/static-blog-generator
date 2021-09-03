{% if is_home() %}
    {% set arr = num_toArray(page.total) %}
    {% for p in arr %}
        {% if p > 1 %}
        <link rel="prefetch" href="{{ url_for(config.pagination_dir + '/' + p + '/') }}" />
        {% endif %}
    {% endfor %}
{% endif %}

{% if is_category() %}
    {% set arr = num_toArray(page.total) %}
    {% for p in arr %}
        {% if p > 1 %}
        <link rel="prefetch" href="{{ url_for(config.category_dir + '/' + page.category + '/' + p + '/') }}" />
        {% endif %}
    {% endfor %}
{% endif %}

{% if is_tag() %}
    {% set arr = num_toArray(page.total) %}
    {% for p in arr %}
        {% if p > 1 %}
        <link rel="prefetch" href="{{ url_for(config.tag_dir + '/' + page.tag + '/' + p + '/') }}" />
        {% endif %}
    {% endfor %}
{% endif %}

<link rel="dns-prefetch" href="//secure.gravatar.com" />
<link rel="dns-prefetch" href="//static.codepen.io" />
<link rel="dns-prefetch" href="//res.cloudinary.com" />
<link rel="dns-prefetch" href="//ad.doubleclick.com" />
<link rel="dns-prefetch" href="//s3.buysellads.com" />
<link rel="dns-prefetch" href="//srv.buysellads.com" />
<link rel="dns-prefetch" href="//fonts.googleapis.com" />
<link rel="dns-prefetch" href="//www.google-analytics.com" />
<link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
<link rel="dns-prefetch" href="//fonts.gstatic.com" />
<link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
<link rel="dns-prefetch" href="//tpc.googlesyndication.com" />
<link rel="dns-prefetch" href="//adservice.google.com" />
<link rel="dns-prefetch" href="//www.googletagservices.com" />
<link rel="dns-prefetch" href="//git.webmanajemen.com" />