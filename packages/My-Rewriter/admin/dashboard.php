<html>
    <head>
        <title>MyRewriter - change the words</title>
        <link rel="icon" href="../style/img/favicon.png">
        <link rel="stylesheet" type="/text/css" href="../style/style.css">
        <script type="text/javascript" src="../js/changeLanguage.js"></script>

        <style type="text/css">
            input[type="text"] {
                height : 30px;
                weight : 800px;
            }
        </style>

    </head>


    <body>

        <!--FB script-->
        <div id="fb-root"></div>
        <script>(function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/id_ID/all.js#xfbml=1";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));</script>

        <!--header-->
        <div id="header">
            <?php include "header.html"; ?>
        </div>
        <!--language bar-->
        <div style="width:100%; height: 50px;background-color: #5484fd;">
            <!--kiri1-->
            <div style="float: left;width:50%;height:100%;">
                <p style="color: #FFFFFF" class="header-text">Input your word and sinonim with MyRewriter dashboard</p>
            </div>
            <!--kanan1--->
            <div style="float: right;width:50%;height:100%;" class="mini_flag">
                <!--
                <ul>
                <li>
                <a onclick = "changeIdLanguage()" href = "#BahasaIndonesia"><img src = "style/img/flag/masterindo.png" alt = ""/></a>
                </li>
                <li>
                <a onclick = "changeJpLanguage()" href = "#JapanLanguage"><img src = "style/img/flag/masterjapan.png" alt = ""/></a>
                </li>
                <li>
                <a onclick = "changeEnLanguage()" href = "#EnglishLanguage"><img src = "style/img/flag/masterenglish.png" alt = ""/></a>
                </li>
                </ul>
                -->
                <form class="selectChangeLanguage" >
                    <input type="submit" value="GO" onClick="language()">
                    <select onchange="changeLanguage('changeLanguage',this,value);" >
                        <option value="#">Language</option>
                        <option value="#Indonesia-language" name="id" >
                            Indonesia</option>
                        <option value="#Japanese-language" name="jp">
                            Japanese</option>
                        <option value="#English-language" name="en">
                            English</option>
                    </select>
                        
                </form>
            </div>

        </div>

        <br/>
        <!--content-->
        <div id ="content">
            <script type="text/javascript" src="../js/changeLanguage.js"></script>
            <?php include "dashboard_flag.html" ?>
        </div>
        <!--footer-->
        <div id="footer">
            <div class="footernavbar">
                <table align="center" width="24%" style="margin-bottom: 10px">
                    <tr>
                        <td width="6%">
                            <a href="#">Contact Us</a>
                        </td>
                        <td width="8%">
                            <a href="#">Report Problem</a>
                        </td>
                        <td width="8%">
                            <a href="#">Become Developer</a>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="copyright">
                <p><a href="http://myrewriter,com">www.MyRewriter.com</a></p>
                <p>My Rewriter, Change the Words, help publisher make others article</p>
                <p>Copyright c 2013 MyRewriter, Mr.Yussan</p>
            </div>
        </div>

    </body>


</html>
