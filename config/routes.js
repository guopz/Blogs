var PluginUser = require("../plugin/user");
var PluginBlog = require("../plugin/blog");

function app(app){
	// 同一调用中间件 无论调用下面哪一个路由都需要
	app.use(function(req,res,next){
		var user = req.session.user;

		if(user){
			app.locals.user = user;
		}else{
			app.locals.user = user;
		}

		// app.locals.ceshi = "测试用！"; 
		// 在前台通过 <%= ceshi%> 调用
		next();
	});

	// index
	app.get('/',function(req,res,next){
		 res.render('index', { title: '首页' });
	});

	// login
	app.get('/login',PluginUser.loginNo.yes,PluginUser.login.get);
	app.post('/login',PluginUser.login.post);

	// reg
	app.get("/reg",PluginUser.loginNo.yes,PluginUser.reg.get);
	app.post('/reg',PluginUser.reg.post);

	// logout
	app.get('/logout',PluginUser.loginSet.yes,PluginUser.logout.get);

	// user
	app.get('/user/:_id',PluginUser.user.get)

	// add
	app.get('/blog/add',PluginUser.loginSet.yes,PluginBlog.add.get);
	app.post('/blog/add',PluginBlog.add.post);

	// list
	app.get('/blog/list',PluginUser.loginSet.yes,PluginBlog.list.get);
	// view
	app.get('/blog/view/:_id',PluginBlog.view.get);

	// edtior
	app.get('/list/:_id/editor',PluginBlog.editor.get);
	app.post('/list/:_id/editor/',PluginBlog.editor.post);
}

module.exports = app;