const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const Data=require('./models/dat');
const methodOverride=require('method-override');



mongoose.connect('mongodb://localhost:27017/reception-db')
.then(()=>{
    console.log("DB CONNECTED")
})
.catch((er)=>{
    console.log(err)
})
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))


app.get('/home',async (req,res)=>{
    const data=await Data.find({});
    res.render('home',{data});
})
app.get('/home/enter',(req,res)=>{
    res.render('enter');
})
app.post('/home',async(req,res)=>{
    const {name,email,phone,cinh,cinm}=req.body;
    sendemail(email,cinh,cinm);
    await Data.create({name,email,phone,cinh,cinm});
    res.redirect('/home');
})
app.get('/home/:id',async(req,res)=>{
    const {id}=req.params;
    const d=await Data.findById(id);
    res.render('exit',{d});
})
app.put('/home/:id',async(req,res)=>{
    const {id}=req.params;
    const {couth,coutm}=req.body;
    const oh=couth;
    const om=coutm;
    const d=await Data.findById(id)
    sendexmail(d.email,oh,om)
    await Data.findByIdAndUpdate(id,{$set:{status:"Checked Out",couth:oh,coutm,om}});
    res.redirect('/home');
})
app.delete('/home/:id',async (req,res)=>{
    const {id}=req.params;
    await Data.findByIdAndDelete(id);
    res.redirect('/home');
})


function sendemail(email,cinh,cinm){
    const sgMail=require('@sendinblue/mail');
   const  sendinblue=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;
  sgMail.setApiKey(sendinblue);
  let m=cinm.toString();
  let h=cinh.toString();;
  if(cinm<=9){
      m='0'+cinm.toString();
  }
  if(cinh<=9){
      h='0'+cinh.toString();
  }
  const msg={
      to: email,
      from: "sanyamail.71q6l@simplelogin.co",
      subject:"Entering building",
      text:`Hi you entered the building at ${h}:${m}`
  };
  sgMail.send(msg);
}


function sendexmail(email,couth,coutm){
    const sgMail=require('@sendinblue/mail');
   const  sendinblue=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;
  sgMail.setApiKey(sendinblue);
  let m=coutm.toString();
  let h=couth.toString();
  if(coutm<=9){
      m='0'+coutm.toString();
  }
  if(couth<=9){
      h='0'+couth.toString()
  }
  const msg={
      to: email,
      from: "sanyamail.71q6l@simplelogin.co",
      subject:"Checking out",
      text:`Hi you checked out at ${h}:${m}`
  };
  sgMail.send(msg);
}

app.listen(process.env.PORT || 3000,()=>{
    console.log('server running  at http://localhost:3000/');
});
