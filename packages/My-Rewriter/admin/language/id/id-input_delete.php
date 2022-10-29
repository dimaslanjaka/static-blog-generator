<?php
	$number=$_GET['nomor'];

	if(isset($number)) {
		if($number>0) {
			include("../../../conection.php");
			$sql = "DELETE FROM id_sinonim WHERE (number='$number')";
			$delete=mysql_query($sql, $dbcon);
			if($delete) {
				echo "Data behasil di hapus, id = $number";
			} else {
				echo "Data id = $number , gagal dihapus";
			} 

		}
	}
	echo "<meta http-equiv='refresh' content='2;URL=id-sinonim_list.php' />";
?>