var ModelUser = require("../model/user");
var Msg = require("../model/msg");

// login 对象
module.exports.login = {
	get:function(req,res,next){
		 res.render('login', { title: '登陆页' });
	},
	post:function(req,res,next){
		
		var	postData = {
			name:req.body.name
		}
		
		var postMsg = {
			status:false,
			msg:''
		}

		ModelUser.findOne(postData,function(err,data){
			if(err){
				console.log(err);
			}

			if(!data){
				postMsg.msg = Msg.login.error_a;
				res.send(postMsg);
			}else{
				if(data.password === req.body.password){
					
					req.session.user = data;
					postMsg.msg = Msg.login.success;
					postMsg.status = true;
					postMsg._id = data._id;
					res.send(postMsg);

				}else{
					postMsg.msg = Msg.login.error;
					res.send(postMsg);
				}
			}
		});
		// res.send('登陆成功！');
	}
};

// reg 对象
module.exports.reg = {
	get:function(req,res,next){
		 res.render('reg', { title: '注册页' });
		 // res.send("测试文件");
	},
	post:function(req,res,next){
		
		// req.body 保存密 form 提交项
		var postData = {
			name : req.body.name,
			password : req.body.password
		}

		var resJson = {
			status:false,
			msg:''
		}
		// 判断注册用户用户名是否相同
		ModelUser.findOne({name:req.body.name},function(err,data){
			if(err){
				console.log(err);
			}

			if(data){
				resJson.msg = '此用户已经被注册！';
				res.send(resJson);
			}else{

				ModelUser.create(postData,function(err,data){
					if(err){
						resJson.msg = '注册异常！';
						// console.log(resJson);
					}
					
					resJson.msg = '注册成功！';
					resJson.status = true;
					resJson._id = data._id;
					req.session.user = data._id;;
					// res.redirect('/user/'+ data._id);
					res.send(resJson)
				});

			}
		});	
		
	}
}

// logout 对象
module.exports.logout = {
	get:function(req,res,next){
		delete req.session.user;
		res.redirect('/');
	},
}

// user 对象
module.exports.user = {
	get:function(req,res,next){
		
		var getData = {
			_id : req.param('_id')
		}

		if(getData._id){

			ModelUser.findById(getData,function(err,data){
				if(err){
					console.log(err);
				}

				if(data){
					res.render('user',{
						title:data.name + ',个人资料',
						my:data
					});
				}else{
					res.send('查询不到');
				}
			})
		}else{
			res.send('用户不存在');
		}
		
		// res.send('个人中心'+_id);
	}
}

// 登陆前访问权限设置
module.exports.loginSet = {
	yes:function(req,res,next){
		var user = req.session.user;
		// console.log(user);
		if(!user){
			res.redirect('/login'); // 重定向 并结束
		}else{
			next(); // 继续执行
		}
	}
}

// 登陆后访问权限
module.exports.loginNo = {
	yes:function(req,res,next){
		var user = req.session.user;

		if(user){
			res.redirect('/user/'+ user._id);
		}else{
			next();
		}
	}
}
