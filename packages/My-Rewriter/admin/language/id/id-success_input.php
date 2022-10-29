<style type="text/css">
	#info {
		width : 100%;
		height : 60;
		margin-top: 10px;

	}

	.info_inside {
		width : 70%;
		height : 50px;
		padding-top: 10px;
		margin : 5 auto ;
		background-color: #ffffff;
		border : 1px solid #cbcbcb;
	}

	.info_inside p {
		color : black;
		font-family: arial;
		font-size: 20px ;
		margin-top : 20px; 
		margin-bottom: 0;
	}


	.info_inside h5 {
		color : black;
		font-family: arial;
		margin-top: 2px; 
	}
</style>



<?php
	$word1 = $_POST['word1'];
	$word2 = $_POST['word2'];
	include ("../../../conection.php");
	$sql = "select * from id_sinonim";
	$hasildata = mysql_query($sql);
	$data = mysql_fetch_array($hasildata);


	if($word1==$data['word1']) {
		echo '
		<div id="info">
				<div class="info_inside">
					<center>
						<img src="../../../style/img/logo.png" width="150px" />
					</center>
					<div>
					<br/>	
					<div style="border-radius : 10px; width:19px; height:19px; background-color:red;color:red" /> 
					<div style="width : 500px;margin-left : 22px; font-family : arial">GAGAL, data sudah ada, coba lagi</div>
					</div>
				</div>
			</div>';
		echo "<meta http-equiv='refresh' content='2;URL=../../dashboard.php#Indonesia-language'>";
	} else /*if(isset($word1))*/ {
			echo '
			<div id="info">
				<div class="info_inside">
					<center>
						<img src="../../../style/img/logo.png" width="150px" />
					</center>
					<div>
					<br/>	
					<div style="border-radius : 10px; width:19px; height:19px; background-color:green;color:green" /> 
					<div style="width : 500px;margin-left : 22px; font-family : arial">SUKSES, data berhasil disimpan</div>
					</div>
				</div>
			</div>';
			
			mysql_query("INSERT INTO id_sinonim VALUES ('','$word1', '$word2')");
			echo "<meta http-equiv='refresh' content='2;URL=../../dashboard.php#Indonesia-language'>";
	} 

	
?>