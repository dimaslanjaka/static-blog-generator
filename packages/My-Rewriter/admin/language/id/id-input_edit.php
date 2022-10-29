<script language="javascript">
	function words_input() {

		var iword1=document.sinonim.word1.value;
		var iword2=document.sinonim.word2.value;

		if(iword1=="") {
			alert("kata pertama kosong");
		} else if (iword2=="") {
			alert("kata kedua kosong");
		} else {
			document.sinonim.submit();
		}
	}
</script>

<?php
	$id=$_GET['nomor'];
	include("../../../conection.php");
	$sql = "SELECT * FROM id_sinonim WHERE number='$id'";
	$result = mysql_query($sql, $dbcon);
	$data = mysql_fetch_array($result);
?>

<?php
	session_start();
	if(empty($_SESSION['username'])) {
		echo "<center><h1>Please login first</h1></center>";
	} else { 
?>

<!--form edit sinonim-->
	<form name="sinonim" method="post" action="id-input_update.php">
		<h2>Edit Sinonim</h2>
		<input name="hidden" type="hidden" value="<?php echo "$data[number]"; ?>" >
		<h3>kata 1</h3>
		<input name="word1" type="text" id="word1" size="20" value="<?php echo"$data[word1]"; ?>" />
		<h3>kata 2</h3>
		<input name="word2" type="text" id="word2" size="20" value="<?php echo"$data[word2]"; ?>"/>
		<br />
		<input type="button" name="Submit" id="Submit" value="Simpan" onClick="words_input()" />
		<br />			
	</form>
<?php
}
?>