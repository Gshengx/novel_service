// 引入路由
const router=require('express').Router();
//引入封装好的数据库操作
let db=require('../db.js');

// 测试
router.get('/test',(req,res)=>{
    let sql = db.test('u')
    console.log('连接数据库测试')
    db.Query(sql).then(data=>{
        res.send({"code":"200","data":data});
    },err=>{
        res.send({"code":"400","err":"服务器开小差了"});
    })
})

//注册用户
router.post('/registerUser',(req,res)=>{
    let sql=db.registerUser(req.body.name,req.body.psw);
    console.log('注册用户');
    db.Query(sql).then(data=>{
        res.send({"code":"200","data":data});
    },err=>{
        res.send({"code":"400","err":"服务器开小差了"});
    })
});

//根据用户名和密码获取用户信息
router.post('/getUserInfoByName',(req,res)=>{
    let sql=db.getUserInfoByName(req.body.name,req.body.psw);
    console.log('根据用户名和密码获取用户信息',req.body);
    db.Query(sql).then(data=>{
        res.send({"code":"200","data":data});
    },err=>{
        console.log("错误",err)
        res.send({"code":"400","err":"服务器开小差了"});
    })
});

//根据用户id获取用户信息
router.get('/getUserInfoById',(req,res)=>{
    let id=req.query.id;
    let sql=db.getUserInfoById(id);
    console.log('根据用户id获取用户信息');
    db.Query(sql).then(data=>{
        if(data[0]){
            res.send({"code":"200","data":data[0]}); 
        }else{
            res.send({"code":"204"})
        }
    },err=>{
        res.send({"code":"400","err":"服务器开小差了"});
    })
});

//加入书架或从书架移除
router.post('/updateBookShell',(req,res)=>{
    let sql=db.updateBookShell(req.body.userid,req.body.booksid);
    console.log('加入书架或从书架移除');
    db.Query(sql).then(data=>{
        res.send({"code":"200","data":data}); 
    },err=>{
        res.send({"code":"400","err":"服务器开小差了"});
    })
});

// 根据用户id查询阅读记录
router.get('/getReadRecords',(req,res)=>{
    let id = req.query.userid;
    let sql = db.getReadRecords(id,req.query.current, req.query.size||10);
    console.log('根据用户id查询阅读记录')
    db.Query(sql).then(data=>{
        res.send({'code':'200','data':data})
    },err=>{
        res.send({'code':'400','err':"服务器开小差了"})
    })
})

// 插入阅读记录
router.post('/setReadRecord',(req,res)=>{
    let params=req.body
    let sql=db.setReadRecord(params)
    console.log('插入阅读记录')
    db.Query(sql).then(data=>{
        res.send({'code':'200','data':data})
    },err=>{
        res.send({'code':'400','err':"服务器开小差了"})
    })
})

module.exports=router;