const model = require('../model/user');
const key =require('../key');
const jwt =require('jsonwebtoken');
const nodemailer = require("nodemailer");
var generator = require('generate-password');
const bcrypt = require('bcrypt');
SALT_WORK_FACTOR = 10;
const alert=require('alert-node');

//const sha1 = require('sha1');
var msg = "";


 module.exports = {
     login,registeruser,registersubadmin,checkauth,
     userview,subadminview,del,mod,modify,checkType,forgotsave,forgot,
     changepassword,passwordsave,resetpass,checkreset,checkauth2,changelinkpass,resetsapass,
     respass,decryppass
     //password
    //register
 }
 let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'munjal.chirag.test@gmail.com',
        pass: '7500598665'
    }
});
function eMail(email, password) {


    let mailOptions = {
        from: 'munjal.chirag.test@gmail.com',
        to: email,
        subject: "Registration",
        html: "Thanking You For Registering Your Email: " + email + "  Password: " + password
    };

    transporter.sendMail(mailOptions, function (error, info) {

        if (error) {
            console.log(error);

        } else {
            console.log('Email sent: ' + info.response);

        }

    });


}
function eMail2(email,link,cb) {
    
    
    var mailOptions = {
        from: 'munjal.chirag.test@gmail.com',
        to: email,
        subject: "Registration",
        html:'<p>Click <a href="https://sdirect-adarsh.herokuapp.com/recover/'+link+'">here</a> to reset your password</p>'
     };
    
        transporter.sendMail(mailOptions, function (err, info) {
    
            if (err) {
                return cb(err)
    
            } else {
                console.log(info.response);
                let result=info.response;
                return cb(null,result);
    
            }
    
        });
    
    
    }
    
    


// function register(req, res) {
//     let name=req.body.name;
//     let age=req.body.age;
//     let email = req.body.email;
//     let password = req.body.password;
//     console.log(name);
//     console.log(age);
//     console.log(email);
//     console.log(password);
    
//     let udata = new model({'name':name,'age':age, 'email': email, 'password': password })

//     udata.save(function (err,data) {
//         if (err) {
//              msg = err
//             // res.render('register.html');
//             console.log(err);
//             res.render('register.html',{msg});
//         }
//         else {
//              msg = "Registered Succesfully"
//               res.render('login.html');
//             // res.json("Registered");
//             console.log(data);
//         }
//     })

// }

function login(req,res)
{
    let email = req.body.email;
    var pass = req.body.pass;
   
    console.log(email);
    console.log(pass);
    model.findOne({ email: email }, function (err, data) {

        console.log("PPPPPPPPPPPPPPPPPPPPPP",data);
        if (err) {

            console.log(err);
        }

        else if (data == null) {
            res.json("User Not Found")

        }
        else {
            // test a matching password
            console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCC")
            data.comparePassword(pass, function (err, isMatch) {
                if (err) throw err;
                console.log("Password Verified", isMatch);
                //res.render('index.html'); // -&gt; Password123: true
                if (isMatch) {
                    console.log(data)
                    object_id=data.id;
                    role=data.role;
                    if(role=='admin'){
                        msg="admin"
                        console.log("IIIIIIIIIIIIIIII",object_id);
                        
                        generateToken(object_id,role,function(err,token){
                            if(err){
                                console.log(err)
                            }
                            else{
                                console.log("Received Token",token);
                                res.cookie('name',token).render('index.html',{msg});
                            }
                        });
                        
                    }
                    else if(role=='subadmin'){
                        msg="subadmin"
                        generateToken(object_id,role,(err,token)=>{
                            if(err){
                                   console.log(err);
                            }
                            else{
                                console.log("Received Token",token);
                                res.cookie('name',token).render('index.html',{msg});
                            }
                        });
                        
                    }
                    else{
                        res.json('user');
                    }
                }

                else {

                    res.send("Wrong Password")
                }
            });


        }
    });



}
  


function registersubadmin(req,res)
{
    let name=req.body.name;
    let age=req.body.age;
    let email = req.body.email;
    let password = generator.generate({length:10
    });
    console.log(name);
    console.log(age);
    console.log(email);
    console.log(password);
    
    let udata = new model({'name':name,'age':age, 'email': email, 'password': password,'role':'subadmin' })

    udata.save(function (err,data) {
        if (err) {
             msg = err
            // res.render('register.html');
            console.log(err);
            res.render('subadminregister.html',{msg});
        }
        else {
             msg = "Registered Succesfully"
           
            console.log(data)
           
            //
             eMail(email,password);
            // console.log(data);
            res.render('index.html');
        }
    })
}
function registeruser(req, res) {
    let name=req.body.name;
    let age=req.body.age;
    let email = req.body.email;
    let password = generator.generate({length:10
    });
    console.log(name);
    console.log(age);
    console.log(email);
    console.log(password);
    
    let udata = new model({'name':name,'age':age, 'email': email, 'password': password,'role':'user' })

    udata.save(function (err,data) {
        if (err) {
             msg = err
            // res.render('register.html');
            console.log(err);
            res.render('userregister.html',{msg});
        }
        else {
             msg = "Registered Succesfully"
             
              
            // res.json("Registered");
           // console.log(data);
           eMail(email,password);
            res.render('index.html');
        }
    })

}
function generateToken(value,role,cb)
{   console.log(role)
    console.log("Generate Id received" +value)
    jwt.sign({'id':value,'role':role},key.secret,{expiresIn: '30m'},(err,token)=>{
        if(err){
            return cb(err)
        }
        else{
            console.log(token);
            return cb(null,token)
        }
    });
    
}
function checkauth(req,res,next)
{
    let token=req.cookies.name;
    console.log("Cookie"+token);
    jwt.verify(token,key.secret,function(err,data)
{
    if(err)
    {
        console.log(err);
        res.render('login.html');
    }
    else{
        console.log(data.role);
        req.type=data.role
        req.id=data.id;
        next();
    }
})
}
function checkauth2(req,res,next){
    let id=req.params.id;
    console.log(id);
    jwt.verify(id,key.secret,function(err,decode){
        if(err){
             res.redirect('/');
             alert("Invalid Token")
        }
        else{
            let role=decode.role;
            if(role=="resetpass"){
                req.id=decode.id;
                next();

            }
            else{
                 res.redirect('/');
                 alert("Invalid Token")
            }
        }
    })
}
function userview(req, res) {
    
        model.find({ 'role': 'user'}, function (err, data) {
            juser = data
            res.render('userview.html', { juser });
        })
    
    }
function subadminview(req, res) {
    
        model.find({ 'role': 'subadmin'}, function (err, data) {
            juser = data
            res.render('subadminview.html', { juser });
        })
    
    }
    function mod(req,res){
        let id = req.params.id;
        console.log("*******"+id);
        model.findOne({'_id':id},(err,data)=>{
            if(err){
                console.log(err)
            }
            else{
                
                let name=data.name;
                let age=data.age;
                let email=data.email;
                let role=data.role;
                let id=data.id;
                let is_deleted=data.is_deleted;
                res.render('modify.html',{name,age,email,role,id,is_deleted});
            }
        })
    }
    function modify(req,res){
        let name=req.body.name;
        let age=req.body.age;
        let role=req.body.role;
        let id=req.body.id;
        let is_deleted=req.body.is_deleted;
        console.log(is_deleted)
       model.findByIdAndUpdate({'_id':id},{$set:{'name':name,'age':age,'role':role,'is_deleted':is_deleted}},(err,data)=>{
         if(err){
             console.log(err)
    
         }  
         else{
             if(role=='subadmin'){
              res.redirect('/subadminview');}
              else{
                   res.redirect('/userview');
              }
         }
       })
    
    
    }
    function del(req,res)
    {
        let id = req.params.id;
        console.log("#############"+id);
        model.findOneAndUpdate({ '_id': id }, { $set: { 'is_deleted': 'true' } }, (err, data) => {
            if (err) {
                res.json("err")
            }
            else {
                role = data.role;
                
                if (role == 'user') {
                    res.redirect('/userview');
                }
                else {
                    res.redirect('/subadminview');
                }
            }
        })
    
    }


    function checkType(req, res, next) {
        let type = req.type;
        console.log("========================"+type)
        if (type == 'admin') {
            next();
        }
        else {
            msg = "Only Admin Is Authorized";
             res.redirect('/notauthorized');
        }
    
    }
    //  function resetsapass(req, res) {
    //     let mail = req.email;
    //     let pass = req.pass
    //     let passnew = req.passnew
    
    
    //     let status= await eMail(mail,pass);
    //     if(status){
    //         model.findOneAndUpdate({ 'email': mail }, { $set: { 'password': passnew } },function (err,data) {
    //             if (err) {
    //                 console.log('got an error');
    //             }
    //             else {
    //                     msg="Password Changed And Mail Send"
    //                     res.render('index.html',{msg});
    //             }
    //         });
    //     }
    //     else{
            
    //          res.redirect('/');
    //          alert("Internal Error")
    //     }
    // }
    function resetsapass(req, res) {
        let id = req.body.id;
        console.log(id);
        let pass = req.body.password;
        console.log(pass);
        model.findOne({'_id':id},function(err,result){
            if(err){
                console.log(err)
            }
            else if(result == null){
                console.log("OOOOOOOOOOOOO")
            }
            else{
                result.password=pass;
                result.save((err)=>{
                    if(err){
                        console.log(err)
                    }
                    else{
                        msg="Subadmin Password Changed"
                        res.render('index.html',{msg})
                    }
                })
            }
        })
        
 
       
            
    }
    function resetpass(req, res) {
        let mail = req.body.email;
        console.log(mail,"RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
        model.findOne({'email':mail},(err,data)=>{
            if(err){
                 res.redirect('/');
                 alert(err)
            }
            else if(data == null){
                console.log(data);
                 res.redirect('/');
                 alert("Please Register Your Account")
            }
            else{
                console.log(data);
                let id=data.id;
                let method="resetpass"
                generateToken(id,method,function(err,token){
                    if(err){
                        console.log(err)
                    }
                    else
                    {
                        console.log(token,"TTTTTTTTTTTTTTTTTTt");
                        eMail2(mail,token,function(err,result){
                             if(err){
                                     console.log(err,"EEEEEEEEEEEEEEEE")
                             }
                             else 
                             {
                                 /////////////////////////////////ssssssssssssssssssssssssssssss
                                 data.passwordreset=token;
                                 data.save((err)=>{
                                     if(err){
                                         console.log(err)
                                     }
                                     else{
                                        alert("Password Reset Link Has Been Send TO your email");
                                        res.redirect('/');
                                     }
                                 })
                                
                            }
                        });
                    }
                });
            }
        })
    }
    function decryppass(req, res, next) {
        var pass = req.pass;
        bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
            if (err) {
                console.log(err)
            }
    
            else {
                bcrypt.hash(pass, salt, function (err, hash) {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        let passnew = hash;
                        console.log(passnew);
                        req.passnew = passnew;
                        req.pass = pass;
                        next();
                    }
                });
            }
        });
    }
function forgotsave(req,res){           //forgot password
    let email = req.body.email;
    console.log("@@@@@@@@@@@@@@"+email);
    let newpass = req.newpass;
    console.log("##########"+newpass);
    let pass= req.pass;
    console.log(pass);
    model.findOneAndUpdate({'email':email }, { $set: { 'password': newpass} },(err)=>{
        if(err){
            console.log(err);
        }else{
            eMail2(email,pass);
            res.render('login.html');
        }
    })
}







function forgot(req, res, next) {            //forgot password
    let password = generator.generate({
        length: 10
    })
    console.log(password);
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
       


        bcrypt.hash(password, salt, function(err, hash) {
            if (err) return next(err);
            console.log('>>>>>>>>>>>>>>>>>>>>>'+hash);
            newpass = hash;
            req.newpass =newpass;
            console.log(newpass);
            req.pass = password;
            next()
        })
    })
}
function changepassword(req,res)          //subadmin change password
{
    let id=req.params.id;
    model.findOne({'_id':id},function (err,data) {
        if(err){
                res.json("Error ")
        }
        else{
            console.log(data)
            let email=data.email;
            let name=data.name;
            res.render('change.html',{id,email,name});
        }  
    })
    // let id = req.params.id;
    // console.log("*******"+id);
    // model.findOne({'_id':id},(err,data)=>{
    //     if(err){
    //         console.log(err)
    //     }
    //     else{
            
    //         let oldpassword=data.oldpassword;
    //         let id=data.id;
    //         let role=data.role;
    //         let newpassword=data.newpassword;
    //         let confirmpassword=data.confirmpassword;
            
            
            
    //         res.render('change.html',{oldpassword,id,newpassword,confirmpassword});
    //     }
    // })
}

function changelinkpass(req,res){
    let id=req.id;
    let link=req.params.id;
    console.log("????????????????????????",link);
    model.findOne({'_id':id},function (err,data) {
        if(err){
                res.json("Error ")
        }
        else{
            console.log(data)
            let email=data.email;
            let name=data.name;
            res.render('linkpass.html',{id,email,name,link});
        }  
    })
}
function respass(req,res){
    
        let token=req.body.link;
        let id=req.body.id;
        let pass=req.body.password;
        model.findOne({'_id':id,'passwordreset':token}).exec((err,data)=>{
            if(err){
                console.log(err)
            }
            else if(data == null){
                 res.redirect('/');
                 alert("Link Expired")
            }
            else{
               data.passwordreset=undefined;
               data.password=pass;
               data.save(function(err){
                   if(err){
                       console.log(err);
                   }
                   else{
                        res.redirect('/');
                        alert("Password Changed")
                   }
               })
            }
        })
    
    
    }
function passwordsave(req,res)             //admin change password
{
    let id=req.id;
    console.log(id)
    let pass=req.body.pass;
    let npass=req.body.newpass;
    console.log('==================',id);
    console.log(id,"!!!!!!!!!!",pass,"!!!!!!!!!!!!!!",npass);
    model.findById({'_id':id},function(err,data){
        if(err){
            console.log(err);

        }
        else{
            data.comparePassword(pass,function(err,isMatch){
                if(err){
                     res.json({"err":err});
                }
                if(isMatch){
                   data.password=npass;
                   data.save(function(err){
                       if(err){
                           console.log(err)
                       }
                       else{
                           msg="Password Changed";
                          // eMail(email,npass);
                            res.render('index.html',{msg});
                       }
                   })
                }
                if(!isMatch){
                     res.json("not matched");
                }
            })
        }
    })
    
}


function checkreset(req,res,next){
    
        if(req.body.email){
            let email=req.body.email
        model.findOne({'email':email},function(err,data){
            if(err){
                res.json("error")
            }
            else if(data == null ){
                 res.redirect('/');
                 alert("Email Not Registered")
            }
            else{
                let role=data.role;
                if(role == 'subadmin'){
                    
                    res.json("Request Admin To Change Password")
                }
                else{
                    
                    req.email=email;
                    
                    next();
                }
            }
            
        })
        }
    
        if(req.body.id){
             let id=req.body.id;
            let pass=req.body.password;
            console.log("hellllloooooooooooo")
            model.findById({'_id':id},function(err,data){
                if(err){
                    console.log(err)
                }
                else{
                    console.log(data);
                    let email=data.email;
                    req.pass=pass;
                    req.email=email;
                    next();
                    
                }
            })
        }
    }
    