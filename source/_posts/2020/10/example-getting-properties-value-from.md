---
title: Example getting properties value from settings.gradle.kts
webtitle: WMI Gitlab
subtitle: pre><br />pluginManagement {<br /> resolutionStrategy {<br />
  eachPlugin {<br /> // Work around
lang: en
date: 2020-10-24T09:19:00.000+07:00
type: post
tags: []
author:
  nick: Kuswati
  link: https://www.blogger.com/profile/09256263851708439294
  email: noreply@blogger.com
modified: 2020-10-24T09:19:53.448+07:00
category:
  - Kotlin
comments: true
cover: https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png
location: ""

---

<pre><br>pluginManagement {<br>    resolutionStrategy {<br>        eachPlugin {<br>            // Work around https://github.com/gradle/gradle/issues/1697.<br>            if (requested.version == null) {<br>                def pluginName = requested.id.name.split('-').collect { it.capitalize() }.join().uncapitalize()<br>                def versionPropertyName = (requested.id.id == 'org.jetbrains.kotlin.jvm') ?<br>                        "kotlinPluginVersion" : "${pluginName}PluginVersion"<br>                logger.info("Checking for plugin version property '$versionPropertyName'.")<br>                if (gradle.rootProject.hasProperty(versionPropertyName)) {<br>                    def version = gradle.rootProject.properties[versionPropertyName]<br>                    logger.info("Setting '${requested.id.id}' plugin version to $version.")<br>                    useVersion version<br>                } else {<br>                    logger.warn("No version specified for plugin '${requested.id.id}' and property " +<br>                            "'$versionPropertyName' does not exist.")<br>                }<br>            }<br>        }<br>    }<br>}<br></pre>