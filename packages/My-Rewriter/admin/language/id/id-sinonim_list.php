<?php
	session_start();
	if(empty($_SESSION['username'])) {
		echo "<center><h1>Please login first</h1></center>";
	} else { ?>

	<?php include("../../../conection.php");
		$sql = "SELECT * FROM id_sinonim";
		$dataresult = mysql_query($sql, $dbcon);
	?>

	<?php
		$totaldata=mysql_num_rows($dataresult);
		if($totaldata) {
			echo "Ada <b>$totaldata</b> sinonim dengan isi : <br/>";
		}
	?>

	<?php
		while($data=mysql_fetch_array($dataresult)) {
	?>	
		<?php
			echo $data['word1'];
			echo " | ";
		?>
		<?php 
			echo $data['word2'];
			echo " | ";
		?>
		<a href="id-input_edit.php?nomor=<?php echo "$data[number]"?>" > Edit </a> 
		<?php echo " | "?>
		<a href="id-input_delete.php?nomor=<?php echo "$data[number]"?>" > Delete </a>
		<br />
	<?php
		}
	}
	?>