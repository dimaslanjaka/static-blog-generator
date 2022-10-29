<?php
	$did=$_POST['hidden'];
	$word1=$_POST['word1'];
	$word2=$_POST['word2'];

	if(isset($did)) {
		if($did>0) {
			include("../conection.php");
			$sql = "UPDATE id_sinonim set 
				word1='$word1' , word2='$word2' WHERE (number='$did')";
			$testupdate = mysql_query($sql, $dbcon);
			if($testupdate) {
				echo "Berhasil update data no. $did";
			} else {
				echo "Gagal update no. $did";
			}	
		}
	}
	echo "<meta http-equiv='refresh' content='2;URL=language/id/id-sinonim_list.php' />";
?>