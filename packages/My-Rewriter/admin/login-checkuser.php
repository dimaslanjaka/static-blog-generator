<?php
	session_start();
	$user=$_POST['loginuser'];
	$pass=$_POST['loginpass'];

	if(isset($user)) {
		include("../conection.php");
		$login=mysql_query("SELECT * from user where user='$user' and password='$pass'");
		$ketemu = mysql_num_rows($login);
		$data = mysql_fetch_array($login);
		if($ketemu > 0) {
			$_SESSION['username'] = $user;
			echo "<center>Login Success</center>";
			echo "<meta http-equiv='refresh' content='2;URL=dashboard.php'>";
		} else {
			echo "<center>Your user/password is wrong, try again</center>";
			echo "<meta http-equiv='refresh' content='2;URL=index.php'>";
		}
	}
?>