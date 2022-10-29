

<?php
	session_start();
	if(empty($_SESSION['username'])) {
		echo "<center>Anda belum login, silahkan login terlebih dahulu</center>";
			echo "<meta http-equiv='refresh' content='2;URL=../../index.php'>";
	} else { ?>
		<form name="sinonim" method="post" action="language/id/id-success_input.php">
			<h2>Masukan Sinonim</h2>
			<h3>kata / kalimat 1</h3>
			<p>untuk kata yang dihubungkan dengan tanda "-" tuliskan tanpa spasi seperti contoh. contoh : jalan-jalan, makan-makan</p>
			<input name="word1" type="text" id="word1" size="20" />

			<h3>kata / kalimat 2</h3>
			<p>Masukan kata / kalimat ke 2 yang merupakan sinonim dari kata / kalimat ke1</p>
			<input name="word2" type="text" id="word2" size="20" />
			<br /><br />
			<input type="button" name="Submit" id="Submit" value="Simpan" onClick="words_input()" />
			<br /><br />
			<a href="language/id/id-sinonim_list.php">Daftar Sinonim</a>
			
		</form>
	<?php }
	?>

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
