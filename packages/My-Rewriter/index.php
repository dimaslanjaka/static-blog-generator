<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
        <title>MyRewriter | Change The Words</title>
        <link rel="icon" href="style/img/favicon.png" />
        <link rel="stylesheet" type="text/css" href="style/style.css" />
</head>
<body>
        <!--FB script-->
        <div id="fb-root"></div>

        <!--header-->
        <div id="header">
          <div id="navbar"> 
                <ul>
                    <li><a href="http://localhost/MyRewriter.com">Home</a></li>
                    <li><a title="About MyRewriter" id="popuplink" href="#about">About</a></li>
                    <li><a title="Use MyRewriter" id="popuplink2" href="#use">How to Use</a></li>
                </ul>
            </div>
            <?php include "style/header.html"; ?>           
        </div>
    
        <!--pop up display-->
         <div style="display:none">        
                <div id="about" style="width:300px;height:200px;overflow:auto">
                    <br/>
                    <p align="center">
                    MyRewriter, simple rewriter web app <br/>
                    Develop by Yussan | Time2Apps <br/>
                    Copyright 2013-2014 <br/>
                    <h5 align="center"><a href="http://twitter.com/yussan_id" target="_blank">twitter : @yussan_id</h5>
                    </p>
                </div>

                <div id="use" style="width:600px;height:500px;overflow:auto">
                    <h3>Just Simple</h3>
                    <center><img width="550px" src="images/use1.png" /></center>
                    <p>First, choose language what do you want</p>
                    <center><img width="550px" src="images/use2.png" /></center>
                    <p>second, type your words, then submit to rewrite</p>
                </div>           
            </div>        
       

        <!--language bar-->
        <div style="width:100%; height: 50px;background-color: #5484fd;">
            <!--kiri1-->
            <div style="float: left;width:50%;height:100%;">
                <p style="color: #FFFFFF" class="header-text">Choose language : </p>
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
                <form id="optionsLanguage" name="form" class="selectChangeLanguage" >
                    <input type="submit" value="GO" onClick="language()" />
                    <select name="menuLanguage">
                        <option value="#">Language</option>
                        <option value="id" >Indonesia</option>
                        <option value="jp">Japanese</option>
                        <option value="en">English</option>
                    </select>
                        
                </form>
            </div>

        </div>

        <br/>
        <!--content-->
        <div id ="content">
            <script type="text/javascript" src="js/changeLanguage.js"></script>
            <?php include "language/home_flag.html" ?>
        </div>
        <!--footer-->
        <div id="footer">
            <div class="footernavbar">
                <table align="center" width="24%" style="margin-bottom: 10px">
                    <tr>
                        <td width="6%">
                            <a href="https://docs.google.com/forms/d/1SQe7miMKLojfdMvRX4rt66ceeGt0hCRd72ldwbIVB5o/viewform">Contact Us</a>
                        </td>
                        <td width="8%">
                            <a href="https://docs.google.com/forms/d/1THrOE5r7IjrTtcZZQ3dHZwbS3nHzhQyWYB8Ja3ooln0/viewform">Report Problem</a>
                        </td>
                        <td width="8%">
                            <a href="https://docs.google.com/forms/d/1Tuj2JanEe-GbnNRy_EXCp5E5iSxIdZAfYrXKmYb4M7o/viewform">Become Developer</a>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="copyright">
                <p><a class="blue-link" href="http://myrewriter.com">www.MyRewriter.com</a></p>
                <p>My Rewriter, Change the Words, help publisher make others article</p>
                <p>Copyright &copy; 2013 MyRewriter,<a href="http://time2apps.com">Yussan Time2Apps</a></p>
            </div>
        </div>

    </body>

<!--javascript-->
 <script type="text/javascript" src="js/changeLanguage.js"></script>

<script type="text/javascript">
    function language() {
        var language = (document.form.menuLanguage.value);

        if(language == "id") {
            changeIdLanguage();
        } else if (language == "en") {
           changeEnLanguage();
        } else if(language == "jp") {
            changeJpLanguage();
        } else (none);
    };
</script>

<!--FB api-->
<script>
/*
    (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/id_ID/all.js#xfbml=1";
    fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));*/
</script>
<script type="text/javascript" src="jquery-1.4.3.min.js"></script> 
<script type="text/javascript" src="fancybox/jquery.fancybox-1.3.4.pack.js"></script>
<link rel="stylesheet" type="text/css" href="fancybox/jquery.fancybox-1.3.4.css" media="screen" />
<script type="text/javascript">
        $(document).ready(function() {
            $("#popuplink").fancybox({
                'titlePosition'     : 'inside',
                'transitionIn'      : 'elastic',
                'transitionOut'     : 'elastic'
            });
            $("#popuplink2").fancybox({
                'titlePosition'     : 'inside',
                'transitionIn'      : 'elastic',
                'transitionOut'     : 'elastic'
            });
        });
</script>
</html>
