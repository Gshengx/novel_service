
let mysql=require('mysql');

// 创建连接池，效率更高，不需要每次操作数据库都创建连接
let pool=mysql.createPool({
    host:'43.139.203.87',
    user:'root',
    password:'g577028',
    database:'novels',
    port:3306,
    connectionLimit:50,//允许连接数
    multipleStatements : true,  //是否允许执行多条sql语句
    timezone:"08:00" //大坑，必须加这一句，否则时间不对劲
})

//封装数据库sql请求操作，返回的是一个包含对象的数组
let Query=( sql , ...params )=>{
     return new Promise(function(resolve,reject){
         //从连接池中拿一条链接
         pool.getConnection(function(err,connection){
            if(err){
                return reject(err);
            }
            connection.query( sql , params , function(error,res){
                // console.log(res);
                connection.release();
                if(error){
                    return  reject(error);
                }
                resolve(res);
            });
        });
    });
};

// 查表配置
let tableName={
    h:'novels_h',
    n:'novels_n',
    u:'user'
}
// 测试
let test=function(t='n'){
    let sql=`
    select
        title
    from
        ${tableName[t]}
    limit
        1
    `;
    return sql
}
// 注册用户
let registerUser = function (name, psw) {
  let sql = `
    insert ignore into
        user (userName,psw)
    values
        ('${name}','${psw}')
    `
  return sql
}
// 根据用户名和密码获取用户信息
let getUserInfoByName = function (name, psw) {
  let sql = `
    select
        *
    from
        user
    where
        userName='${name}' and psw='${psw}'
    `
  return sql
}

// 根据用户id获取用户信息
let getUserInfoById = function (id) {
  let sql = `
    select
        *
    from
        user
    where
        userid='${id}'
    `
  return sql
}

// 加入书架或从书架移除
let updateBookShell = function (id, bookIds) {
  let sql = `
    update
        user
    set
        bookShell='${bookIds}'
    where
        userid='${id}'
    `
  return sql
}

// 获取更新的数据
let getLastNovels=function(t='n',current=1,size=10){
    let sql = `
    select 
        *
    from
        ${tableName[t]}
    order by
        DATE_FORMAT( updatetime,'%Y-%m-%d') desc,id
    limit
        ${(current - 1) * size}, ${size};`
    // where
    //     DATE_FORMAT( updatetime,'%Y-%m-%d') = DATE_FORMAT(CURDATE()-1,'%Y-%m-%d');`
    return sql
}

//根据搜索关键词获取列表
let getNovelsByKeyword=function(t='n',current=1,size=10,keyword){
    let sql = `
        select
            *
        from
            ${tableName[t]}
        where
            title like '%${keyword}%'  or abstract like '%${keyword}%' or author like '%${keyword}%'
        limit
            ${(current - 1) * size}, ${size}
            `
        return sql
}
// 根据用户id查询阅读记录
let getReadRecords = function (userid, current = 1, size = 5) {
  let sql = `
    select
        *
    from
        read_records
    where
        userid = '${userid}'
    order by
        DATE_FORMAT( updatetime,'%Y-%m-%d') desc
    limit
        ${(current - 1) * size}, ${size}
    `
  return sql
}

// 插入阅读记录
let setReadRecord = function (params) {
  const { id, userid, title, lastpage, updatetime, chart } = params
  let sql = `
    insert into
        read_records(recordid,id,userid,title,lastpage,updatetime,chart)
    values
        ('${userid}_${id}','${id}','${userid}','${title}','${lastpage}','${updatetime}','${chart}')
    on duplicate key update
        updatetime='${updatetime}',chart='${chart}',lastpage='${lastpage}';
    `
  return sql
}

// 根据id批量查询数据
let getNovelsById=function(t='n',books){
    let arr = JSON.stringify(books.split(','))
    arr = arr.slice(1,arr.length-1)
    console.log(arr)
    let sql=`
    select
        *
    from
        ${tableName[t]}
    where
        id in (${arr});
    `
    return sql
}

 module.exports = {
   Query,

   test,
   registerUser,
   getUserInfoByName,
   getUserInfoById,
   updateBookShell,
   getLastNovels,
   getReadRecords,
   getNovelsByKeyword,
   setReadRecord,
   getNovelsById
 }