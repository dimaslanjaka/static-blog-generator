{% if page.comments && config.gitTalk %}
    <link rel="stylesheet" href="https://unpkg.com/gitalk/dist/gitalk.css">
    <script src="https://unpkg.com/gitalk/dist/gitalk.min.js"></script>
    <script src="/js/md5.min.js"></script>

    <script>
        var tags = [{% for tag in page.tags %}'{{ tag.name }}', {% endfor %}];

        var gitalk = new Gitalk({
            clientID: '{{ config.gitTalk.clientId }}',
            clientSecret: '{{ config.gitTalk.clientSecret }}',
            repo: '{{ config.gitTalk.repo }}',
            owner: '{{ config.gitTalk.owner }}',
            admin: [{% for item in config.gitTalk.admin %}'{{ item }}', {% endfor %}],
            labels: tags,
            id: (new Date({{ page.date }})).getTime() > (new Date('2018-02-15')).getTime() ? md5(location.href) : location.href
        });

        gitalk.render('comment-container');
    </script>
{% endif %}

<!--{ if page.comments && config.disqus_shortname }-->
{% if config.disqus_shortname %}
    <span>Page Comments : {{ page.comments }}</span>
    <script id="dsq-count-scr" src="//{{ config.disqus_shortname }}.disqus.com/count.js" async></script>
    <script>
        var disqus_config = function () {
            this.page.url = '{{ config.url }}/{{ page.path }}';
            this.page.identifier = '/{{ page.path }}';
            this.page.title = '{{ page.title }}';
        };

        (function() { // DON'T EDIT BELOW THIS LINE
        var d = document, s = d.createElement('script');
        s.src = 'https://{{ config.disqus_shortname }}.disqus.com/{% if page.comments %}embed.js{% else %}count.js{% endif %}';
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
        })();
    </script>
    <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
{% endif %}
