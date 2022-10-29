<?php

/*
 * Document create by MyRewriter 
 * Twenty-Web-Developer
 */

if ($_POST['artikel']) {
    include "conection.php";
    $artikel = nl2br($_POST['artikel']); //manipulasi HTML dengan nl2br /n menjadi spasi baris

//explode memisahkan tiap kata kemudian diubah menjadi array, artikel[0], artikel[1], ...
//dipisah berdasarkan spasi / " "
    $ar = explode(" ", $artikel); 

    $hasil = "";
    //array dari ar ke value
    foreach ($ar as $value) { 
        if (!preg_match("/\.|'/", $value)) { //menggambil kata-kata
            // cari kata-kata tersebut di database MySQL-apache
            $cari = mysql_query("select * from en_sinonim where word1='$value'");
            $j = mysql_num_rows($cari);
            if ($j > 0) {
                $ka = mysql_fetch_array($cari);
                $hasil = $hasil . "<span class='re'>" . stripslashes($ka['word2']) . "</span> ";
            } else {
                $cari2 = mysql_query("select * from en_sinonim where word2='$value'");
                $j2 = mysql_num_rows($cari2);
                if ($j2 > 0) {
                    $ka2 = mysql_fetch_array($cari2);
                    $hasil = $hasil . "<span class='re'>" . stripslashes($ka2['word1']) . "</span> ";
                } else {
                    $hasil = $hasil . stripslashes($value) . " ";
                }
            }
        } else {
            $ka = preg_replace("/\./", "", $value);
            $cari = mysql_query("select * from en_sinonim where word1='$ka'");
            $j = mysql_num_rows($cari);
            if ($j > 0) {
                $kax = mysql_fetch_array($cari);
                $hasil = $hasil . "<span class='re'>" . stripslashes($kax['word2']) . "</span>. ";
            } else {
                $hasil = $hasil . stripslashes($ka) . ". ";
            }
        }
    }
    echo $hasil;
}
?>
