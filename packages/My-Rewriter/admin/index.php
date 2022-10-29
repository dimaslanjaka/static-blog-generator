<html>
	<head>
		<script language="javascript">
			function alert() {
				var inama=document.logininput.loginuser.value;
				var ipass=document.logininput.loginpass.value;

				if(inama=="") {
					alert("username is empty");
				} 
				else if (ipass=="") {
					alert("passsword is empty");
				} 
				else {
					document.logininput.submit();
				}
			}
		</script>

		<link rel="stylesheet" type="text/css" href="../style/style.css">

		<style type="text/css">
			body {
				background-color: #fefefe;
				font-family : arial;
			}

			p {
				margin-top: 1px;
				margin-bottom: 1px;
			}

			p.title {
				margin-top: 20px;
				font-family: arial;
				font-size: 25px;
			}

			p.note {
				font-family: arial;
				font-size: 11px;
			}

			.loginform {
				margin : 20 auto;
				width : 600px;
				height : 200px;
				border-radius: 10px;
				padding : 0px;
				border: 1px solid #848482;
			}

			.loginform-left {
				float : left;
				margin : 0;
				border-top-left-radius :10px;
				border-bottom-left-radius :10px;
				height : 180px;
				width : 380px;
				padding : 10px; 
				background-color: #f6f6f6;
			}

			.loginform-left-title {
				font-family: arial;
				width : 380px ;
				height : 20px;
				font-color : #848482;
				border-bottom: 1px solid #848482;
			}

			.loginform-right {
				float : right;
				margin : 0;
				border-top-right-radius:10px;
				border-bottom-right-radius:10px;
				height : 180px;
				width : 180px;
				padding : 10px;
				background-color : #848482;
			}

			.loginform-right-title {
				font-family: arial;
				width : 180px ;
				height : 20px;
				color : white;
				border-bottom: 1px solid white;
			}

			table {

				width : 350px;
				border-collapse: true;
				font-size: 12px;
			}

			table td {
				width :175px;
				margin : auto;
			}

			input[type="text"] {
				height : 30px;
			}

			input[type="password"] {
				height : 30px;
			}

			input[type="button"] {
				margin : auto;
				float : right;
				background-color: #2b65ec;
				color : white;
				height : 30px;
			}		

		</style>

		<title>
			MyRewriter - Dashboard Login
		</title>
	</head>
	<body>
		<br/>
		<center><img src="../style/img/logo.png" width="250px" /></center>
		<div class="loginform">
			<div class="loginform-left">
				<div class="loginform-left-title">
					Sign-in to Dashboard
				</div>
				<div>
					<form name="logininput" action="login-checkuser.php" method="post" >
					<table>
						<tr>
							<td>
								Username :
							</td>
							<td>
								<input name ="loginuser" type="text" id="user" size="31" /><br/>
							</td>
						</tr>
						<tr>
							<td>
								Password : 
							</td>
							<td>
								<input name="loginpass" type="password" id="pass" size="31" /><br/>
							</td>
						</tr>
						<tr>
							<td colspan="2">
								<a style="margin:auto; color : #3366FF" href="#forgotpassword" class="blue-link" > forgot your password </a>
								<input type="button" name="Submit" value="Sign In" onclick="alert()"  />
							</td>
						</tr>	
					</table>
					</form>			
	
						
					
				</div>
				<!--footer on left-->
				<div class="loginform-left-footer">
					back to home
				</div>
			</div>
			<div class="loginform-right">
				<div class="loginform-right-title">
					Want to be our partner
				</div>
				<div style="font-family:arial; font-size : 10px; color: white">
					MyRewriter is in the process of collecting synonyms of various languages ​​as much. For now just still support for Indonesian and English only. If you are willing as our parner, please register and add your collection of synonyms to our database, thanks 
				</div>
			</div>
		</div>
		  <div class="copyright">
                <p><a style="color : #3366FF" class="blue-link" href="http://myrewriter.com">www.MyRewriter.com</a></p>
                <p>My Rewriter, Change the Words, help publisher make others article</p>
                <p>Copyright c 2013 MyRewriter, Mr.Yussan</p>
            </div>
	</body>
</html>




